"use client";

import { useLayoutEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";

const services = [
  {
    title: "Caixilharia",
    description: "Precisão que define o espaço.",
    image: "/caixilharia.jpg",
  },
  {
    title: "Fachadas",
    description: "Arquitetura à escala do edifício.",
    image: "/fachada.jpg",
  },
  {
    title: "Vidro",
    description: "Mais luz. Mais espaço.",
    image: "/vidros.jpg",
  },
  {
    title: "Estores",
    description: "Conforto, controlo e privacidade.",
    image: "/estoures.jpg",
  },
];

/*
|--------------------------------------------------------------------------
| STORY TIMELINE
|--------------------------------------------------------------------------
|
| 0.00 ─ 0.35  → Hero
| 0.35 ─ 0.48  → Hero desaparece
| 0.48 ─ 0.62  → Janela abre
| 0.62 ─ 0.70  → Cards entram
| 0.70 ─ 1.00  → Carousel horizontal
|
*/

const HERO_END = 0.48;

const CAROUSEL_ENTER = 0.62;
const CAROUSEL_FADE_END = 0.70;

const CAROUSEL_MOVE_START = 0.70;
const CAROUSEL_START_X = 22;
const CAROUSEL_END_X = -72;

const MOBILE_VIDEO_BREAKPOINT = 768;
const DESKTOP_VIDEO_SRC = "/assets/hero.mp4";
const MOBILE_VIDEO_SRC = "/assets/hero-mobile.mp4";

function remap(
    value: number,
    start: number,
    end: number,
) {
  if (value <= start) return 0;
  if (value >= end) return 1;

  return (value - start) / (end - start);
}

function clamp(value: number, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

function smoothstep(value: number) {
  const x = clamp(value);
  return x * x * (3 - 2 * x);
}

function subscribeToReducedMotion(callback: () => void) {
  const query = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
  );

  query.addEventListener("change", callback);

  return () => query.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(
      "(prefers-reduced-motion: reduce)",
  ).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

function useReducedMotion() {
  return useSyncExternalStore(
      subscribeToReducedMotion,
      getReducedMotionSnapshot,
      getReducedMotionServerSnapshot,
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoReadyRef = useRef(false);
  const targetTimeRef = useRef(0);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const video = videoRef.current;

    if (video) {
      const isMobileViewport = window.matchMedia(
          `(max-width: ${MOBILE_VIDEO_BREAKPOINT}px)`,
      ).matches;

      video.src = isMobileViewport ? MOBILE_VIDEO_SRC : DESKTOP_VIDEO_SRC;
    }

    let cancelled = false;

    let ctx:
        | {
      revert: () => void;
    }
        | undefined;

    let cleanupVideo: (() => void) | undefined;

    (async () => {
      const [
        { default: gsap },
        { ScrollTrigger },
      ] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled || !rootRef.current) return;

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (!video) return;

        const SEEK_EPSILON = 0.05;

        let pendingFrame: number | null = null;

        const logVideoEvent = (label: string) => {
          if (process.env.NODE_ENV === "production") return;

          console.log(`[Hero video] ${label}`, {
            src: video.currentSrc,
            readyState: video.readyState,
            networkState: video.networkState,
            duration: video.duration,
          });
        };

        const applyVideoTime = () => {
          pendingFrame = null;

          if (!videoReadyRef.current) return;

          const target = targetTimeRef.current;

          if (Math.abs(video.currentTime - target) > SEEK_EPSILON) {
            video.currentTime = target;
          }
        };

        const scheduleVideoUpdate = () => {
          if (pendingFrame !== null) return;

          pendingFrame = requestAnimationFrame(applyVideoTime);
        };

        const updateVideo = (progress: number) => {
          if (!videoReadyRef.current) return;
          if (!Number.isFinite(video.duration) || video.duration <= 0) return;

          targetTimeRef.current = progress * video.duration;
          scheduleVideoUpdate();
        };

        const markVideoReady = () => {
          if (videoReadyRef.current) return;
          if (!Number.isFinite(video.duration) || video.duration <= 0) return;

          videoReadyRef.current = true;
          updateVideo(progressRef.current);
        };

        const handleLoadedMetadata = () => {
          logVideoEvent("loadedmetadata");
          markVideoReady();
        };

        const handleLoadedData = () => {
          logVideoEvent("loadeddata");
          markVideoReady();
        };

        const handleCanPlay = () => {
          logVideoEvent("canplay");
          markVideoReady();
        };

        const handleVideoError = () => {
          if (process.env.NODE_ENV === "production") return;

          console.error("[Hero video] erro ao carregar vídeo:", video.error);
        };

        video.addEventListener("loadedmetadata", handleLoadedMetadata);
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("canplay", handleCanPlay);
        video.addEventListener("error", handleVideoError);

        if (
            video.readyState >= 1 &&
            Number.isFinite(video.duration) &&
            video.duration > 0
        ) {
          markVideoReady();
        }

        cleanupVideo = () => {
          video.removeEventListener("loadedmetadata", handleLoadedMetadata);
          video.removeEventListener("loadeddata", handleLoadedData);
          video.removeEventListener("canplay", handleCanPlay);
          video.removeEventListener("error", handleVideoError);

          if (pendingFrame !== null) {
            cancelAnimationFrame(pendingFrame);
            pendingFrame = null;
          }
        };

        const hero = document.querySelector(
            "#lumitiria-hero-copy",
        );

        const carousel = document.querySelector(
            "#lumitiria-carousel",
        );

        const carouselTrack = document.querySelector(
            "#lumitiria-carousel-track",
        );

        const carouselLabel = document.querySelector(
            "#lumitiria-carousel-label",
        );

        const cards = gsap.utils.toArray<HTMLElement>(
            ".lumitiria-service-card",
        );

        gsap.set(hero, {
          opacity: 1,
          y: 0,
          scale: 1,
          visibility: "visible",
        });

        gsap.set(carousel, {
          opacity: 0,
          y: 80,
          visibility: "hidden",
        });

        gsap.set(carouselLabel, {
          opacity: 0,
        });

        gsap.set(cards, {
          opacity: 0,
          y: 40,
          scale: 0.96,
        });

        gsap.set(carouselTrack, {
          xPercent: CAROUSEL_START_X,
        });

        const setHeroOpacity = gsap.quickSetter(hero, "opacity");
        const setHeroY = gsap.quickSetter(hero, "y", "px");
        const setHeroScale = gsap.quickSetter(hero, "scale");
        const setHeroVisibility = gsap.quickSetter(hero, "visibility");

        const setCarouselOpacity = gsap.quickSetter(carousel, "opacity");
        const setCarouselY = gsap.quickSetter(carousel, "y", "px");
        const setCarouselVisibility = gsap.quickSetter(carousel, "visibility");

        const setCarouselLabelOpacity = gsap.quickSetter(
            carouselLabel,
            "opacity",
        );

        const setCarouselTrackX = gsap.quickSetter(carouselTrack, "xPercent");

        const cardSetters = cards.map((card) => ({
          opacity: gsap.quickSetter(card, "opacity"),
          y: gsap.quickSetter(card, "y", "px"),
          scale: gsap.quickSetter(card, "scale"),
        }));

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,

          onUpdate: (self) => {
            const p = self.progress;

            progressRef.current = p;

            updateVideo(p);

            if (p < 0.35) {
              setHeroOpacity(1);
              setHeroY(0);
              setHeroScale(1);
              setHeroVisibility("visible");
            }

            if (
                p >= 0.35 &&
                p < HERO_END
            ) {
              const t = smoothstep(
                  remap(
                      p,
                      0.35,
                      HERO_END,
                  ),
              );

              setHeroOpacity(1 - t);
              setHeroY(-80 * t);
              setHeroScale(1 - 0.08 * t);
              setHeroVisibility("visible");
            }

            if (p >= HERO_END) {
              setHeroOpacity(0);
              setHeroY(-80);
              setHeroScale(0.92);
              setHeroVisibility("hidden");
            }

            if (p < CAROUSEL_ENTER) {
              setCarouselOpacity(0);
              setCarouselY(80);
              setCarouselVisibility("hidden");

              setCarouselLabelOpacity(0);

              cardSetters.forEach((setter) => {
                setter.opacity(0);
                setter.y(40);
                setter.scale(0.96);
              });
            }

            if (
                p >= CAROUSEL_ENTER &&
                p < CAROUSEL_FADE_END
            ) {
              const t = smoothstep(
                  remap(
                      p,
                      CAROUSEL_ENTER,
                      CAROUSEL_FADE_END,
                  ),
              );

              setCarouselOpacity(t);
              setCarouselY(80 - 80 * t);
              setCarouselVisibility("visible");

              setCarouselLabelOpacity(t);

              cardSetters.forEach((setter, index) => {
                const delay =
                    index * 0.08;

                const cardT = clamp(
                    (t - delay) /
                    Math.max(0.01, 1 - delay),
                );

                const eased =
                    smoothstep(cardT);

                setter.opacity(eased);
                setter.y(40 - 40 * eased);
                setter.scale(0.96 + 0.04 * eased);
              });
            }

            if (p >= CAROUSEL_FADE_END) {
              setCarouselOpacity(1);
              setCarouselY(0);
              setCarouselVisibility("visible");

              setCarouselLabelOpacity(1);

              cardSetters.forEach((setter) => {
                setter.opacity(1);
                setter.y(0);
                setter.scale(1);
              });
            }

            if (
                p >= CAROUSEL_MOVE_START
            ) {
              const t = smoothstep(
                  remap(
                      p,
                      CAROUSEL_MOVE_START,
                      1,
                  ),
              );

              setCarouselTrackX(
                  CAROUSEL_START_X +
                  (CAROUSEL_END_X - CAROUSEL_START_X) * t,
              );
            } else {
              setCarouselTrackX(CAROUSEL_START_X);
            }
          },
        });
      }, rootRef);
    })();

    return () => {
      cancelled = true;
      cleanupVideo?.();
      ctx?.revert();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
        <section className="relative bg-black">
          <div className="flex min-h-screen items-center px-6">
            <div className="max-w-4xl text-white">
              <p className="mb-5 font-mono text-xs tracking-[0.35em] text-white/70 sm:text-sm">
                DESDE 1974
              </p>

              <h1 className="font-[family-name:var(--font-fraunces)] text-5xl font-medium uppercase leading-[0.9] md:text-2xl">
                A arquitetura
                <br />
                começa nos
                <br />
                <span className="text-white/60">
                detalhes.
              </span>
              </h1>
            </div>
          </div>
        </section>
    );
  }

  return (
      <section
          ref={rootRef}
          id="lumitiria-hero"
          className="relative h-[500vh] bg-black"
      >
        <div className="sticky top-0 h-[100svh] overflow-hidden">

          <video
              ref={videoRef}
              poster="/assets/hero-poster.jpg"
              muted
              playsInline
              preload="metadata"
              disablePictureInPicture
              disableRemotePlayback
              aria-hidden="true"
              className="absolute inset-0 z-0 h-full w-full object-cover"
          />

          <div className="pointer-events-none absolute inset-0 z-[5] bg-black/25" />

          <div
              id="lumitiria-hero-copy"
              className="
            pointer-events-none
            absolute
            inset-0
            z-20
            flex
            items-center
          "
          >
            <div className="mx-auto w-full max-w-7xl px-6 md:px-12">
              <div className="max-w-5xl text-white">

                <p className="mb-6 font-mono text-xs tracking-[0.35em] text-white/70 sm:text-sm">
                  DESDE 1974
                </p>

                <h1
                    className="
                  font-[family-name:var(--font-fraunces)]
                  text-4xl
                  font-medium
                  uppercase
                  leading-[0.9]
                  tracking-[-0.03em]
                  md:text-5xl
                  lg:text-6xl
                "
                >
                  A arquitetura
                  <br />
                  começa nos
                  <br />
                  <span className="text-white/60">
                  detalhes.
                </span>
                </h1>

                <p className="mt-8 max-w-xl text-base leading-relaxed text-white/80 md:text-lg">
                  Soluções de caixilharia, vidro e
                  fachadas desenvolvidas para transformar
                  espaços e elevar cada projeto.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                      href="#orcamento"
                      className="
                    pointer-events-auto
                    rounded-full
                    bg-white
                    px-7
                    py-3.5
                    text-sm
                    font-semibold
                    text-black
                  "
                  >
                    Pedir orçamento
                  </a>

                  <a
                      href="#projetos"
                      className="
                    pointer-events-auto
                    rounded-full
                    border
                    border-white/30
                    px-7
                    py-3.5
                    text-sm
                    text-white
                  "
                  >
                    Ver projetos
                  </a>
                </div>

              </div>
            </div>
          </div>

          <div
              id="lumitiria-carousel"
              className="
            absolute
            inset-0
            z-30
            flex
            items-center
            overflow-hidden
          "
          >
            <div className="w-full">

              <div
                  id="lumitiria-carousel-label"
                  className="mx-auto mb-6 w-full max-w-7xl px-6 md:px-12"
              >
                <p className="font-mono text-xs tracking-[0.3em] text-white/60">
                  SOLUÇÕES
                </p>

                <h2 className="mt-3 max-w-xl font-[family-name:var(--font-fraunces)] text-3xl font-medium tracking-tight text-white md:text-5xl">
                  Engenharia que ganha forma.
                </h2>
              </div>

              <div className="overflow-visible">
                <div
                    id="lumitiria-carousel-track"
                    className="
                  flex
                  w-max
                  gap-5
                  pl-6
                  pr-6
                  md:gap-6
                  md:pl-[calc((100vw-1280px)/2)]
                "
                >
                  {services.map(
                      (service) => (
                          <article
                              key={service.title}
                              className="
                        lumitiria-service-card
                        relative
                        h-[280px]
                        w-[78vw]
                        max-w-[430px]
                        shrink-0
                        overflow-hidden
                        rounded-2xl
                        md:h-[340px]
                        md:w-[38vw]
                      "
                          >
                            <Image
                                src={service.image}
                                alt={service.title}
                                fill
                                sizes="
                          (max-width: 768px) 78vw,
                          38vw
                        "
                                className="object-cover"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                            <div className="absolute bottom-0 left-0 p-6 md:p-7">

                              <p className="mb-2 font-mono text-xs tracking-[0.25em] text-white/60">
                                SOLUÇÃO
                              </p>

                              <h3 className="font-[family-name:var(--font-fraunces)] text-2xl font-medium text-white md:text-3xl">
                                {service.title}
                              </h3>

                              <p className="mt-2 text-sm text-white/70">
                                {service.description}
                              </p>

                            </div>
                          </article>
                      ),
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>
  );
}