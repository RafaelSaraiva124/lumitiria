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

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;

    let cancelled = false;

    let ctx:
        | {
      revert: () => void;
    }
        | undefined;

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
        const video = videoRef.current;

        if (!video) return;


        video.play()?.then(
            () => video.pause(),
            () => {},
        );

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

        ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,

          onUpdate: (self) => {
            const p = self.progress;

            progressRef.current = p;

            if (
                video.readyState >= 2 &&
                Number.isFinite(video.duration)
            ) {
              video.currentTime =
                  p * video.duration;
            }

            if (p < 0.35) {
              gsap.set(hero, {
                opacity: 1,
                y: 0,
                scale: 1,
                visibility: "visible",
              });
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

              gsap.set(hero, {
                opacity: 1 - t,
                y: -80 * t,
                scale: 1 - 0.08 * t,
                visibility: "visible",
              });
            }

            if (p >= HERO_END) {
              gsap.set(hero, {
                opacity: 0,
                y: -80,
                scale: 0.92,
                visibility: "hidden",
              });
            }

            if (p < CAROUSEL_ENTER) {
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

              gsap.set(carousel, {
                opacity: t,
                y: 80 - 80 * t,
                visibility: "visible",
              });

              gsap.set(carouselLabel, {
                opacity: t,
              });

              cards.forEach((card, index) => {
                const delay =
                    index * 0.08;

                const cardT = clamp(
                    (t - delay) /
                    Math.max(0.01, 1 - delay),
                );

                const eased =
                    smoothstep(cardT);

                gsap.set(card, {
                  opacity: eased,
                  y: 40 - 40 * eased,
                  scale:
                      0.96 +
                      0.04 * eased,
                });
              });
            }

            if (p >= CAROUSEL_FADE_END) {
              gsap.set(carousel, {
                opacity: 1,
                y: 0,
                visibility: "visible",
              });

              gsap.set(carouselLabel, {
                opacity: 1,
              });

              gsap.set(cards, {
                opacity: 1,
                y: 0,
                scale: 1,
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

              gsap.set(
                  carouselTrack,
                  {
                    xPercent:
                        CAROUSEL_START_X +
                        (CAROUSEL_END_X - CAROUSEL_START_X) * t,
                  },
              );
            } else {
              gsap.set(
                  carouselTrack,
                  {
                    xPercent: CAROUSEL_START_X,
                  },
              );
            }
          },
        });
      }, rootRef);
    })();

    return () => {
      cancelled = true;
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
              src="/assets/hero.mp4"
              poster="/assets/hero-poster.jpg"
              muted
              playsInline
              preload="auto"
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