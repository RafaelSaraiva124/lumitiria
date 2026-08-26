"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
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

const FRAME_COUNT = 199;
const FRAME_WIDTH = 1536;
const FRAME_HEIGHT = 1024;
const FRAME_PRIORITY_COUNT = 30;
const FRAME_PATH = "/hero-frames";

function getFrameUrl(index: number) {
  return `${FRAME_PATH}/${String(index).padStart(3, "0")}.webp`;
}

type DrawParams = {
  cssWidth: number;
  cssHeight: number;
  sx: number;
  sy: number;
  sWidth: number;
  sHeight: number;
};

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
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(HTMLImageElement | null)[]>([]);
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(-1);

  const [loadedCount, setLoadedCount] = useState(0);
  const [framesReady, setFramesReady] = useState(false);

  const reducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    framesRef.current = new Array(FRAME_COUNT).fill(null);
    targetFrameRef.current = 0;
    currentFrameRef.current = -1;

    setLoadedCount(0);
    setFramesReady(false);

    let cancelled = false;
    let ctx2d: CanvasRenderingContext2D | null = null;
    let drawParams: DrawParams | null = null;
    let canvasRevealed = false;
    let pendingDrawFrame: number | null = null;
    let pendingResizeFrame: number | null = null;

    const loadingFrames = new Set<number>();

    const logFrameEvent = (label: string, detail?: unknown) => {
      if (process.env.NODE_ENV === "production") return;

      console.log(`[Hero frames] ${label}`, detail ?? "");
    };

    const computeDrawParams = () => {
      const cssWidth = container.clientWidth;
      const cssHeight = container.clientHeight;

      if (cssWidth <= 0 || cssHeight <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);

      if (!ctx2d) {
        ctx2d = canvas.getContext("2d");
      }

      ctx2d?.setTransform(dpr, 0, 0, dpr, 0, 0);

      const imageAspect = FRAME_WIDTH / FRAME_HEIGHT;
      const containerAspect = cssWidth / cssHeight;

      let sx: number;
      let sy: number;
      let sWidth: number;
      let sHeight: number;

      if (imageAspect > containerAspect) {
        sHeight = FRAME_HEIGHT;
        sWidth = FRAME_HEIGHT * containerAspect;
        sx = (FRAME_WIDTH - sWidth) / 2;
        sy = 0;
      } else {
        sWidth = FRAME_WIDTH;
        sHeight = FRAME_WIDTH / containerAspect;
        sx = 0;
        sy = (FRAME_HEIGHT - sHeight) / 2;
      }

      drawParams = { cssWidth, cssHeight, sx, sy, sWidth, sHeight };
    };

    const drawFrame = (index: number) => {
      const img = framesRef.current[index];

      if (!ctx2d || !drawParams || !img) return;

      ctx2d.clearRect(0, 0, drawParams.cssWidth, drawParams.cssHeight);
      ctx2d.drawImage(
          img,
          drawParams.sx,
          drawParams.sy,
          drawParams.sWidth,
          drawParams.sHeight,
          0,
          0,
          drawParams.cssWidth,
          drawParams.cssHeight,
      );

      currentFrameRef.current = index;

      if (!canvasRevealed) {
        canvasRevealed = true;
        canvas.style.opacity = "1";
      }
    };

    const redrawCurrent = () => {
      drawFrame(targetFrameRef.current);
    };

    const scheduleDraw = () => {
      if (pendingDrawFrame !== null) return;

      pendingDrawFrame = requestAnimationFrame(() => {
        pendingDrawFrame = null;

        const target = targetFrameRef.current;

        if (target === currentFrameRef.current) return;

        drawFrame(target);
      });
    };

    const loadFrame = (
        index: number,
        priority: "high" | "low",
    ): Promise<void> => {
      if (framesRef.current[index]) return Promise.resolve();
      if (loadingFrames.has(index)) return Promise.resolve();

      loadingFrames.add(index);

      return new Promise((resolve) => {
        const img = new window.Image();

        img.decoding = "async";
        img.fetchPriority = priority;

        img.onload = () => {
          framesRef.current[index] = img;
          loadingFrames.delete(index);

          if (index === targetFrameRef.current) {
            redrawCurrent();
          }

          resolve();
        };

        img.onerror = () => {
          loadingFrames.delete(index);
          logFrameEvent("erro ao carregar frame", index);
          resolve();
        };

        img.src = getFrameUrl(index);
      });
    };

    const updateTargetFrame = (progress: number) => {
      const frame = Math.round(clamp(progress) * (FRAME_COUNT - 1));

      if (frame === targetFrameRef.current) return;

      targetFrameRef.current = frame;

      if (!framesRef.current[frame]) {
        loadFrame(frame, "high");
      }

      scheduleDraw();
    };

    const scheduleResize = () => {
      if (pendingResizeFrame !== null) return;

      pendingResizeFrame = requestAnimationFrame(() => {
        pendingResizeFrame = null;
        computeDrawParams();
        redrawCurrent();
      });
    };

    const preloadFrames = async () => {
      await loadFrame(0, "high");
      if (cancelled) return;

      redrawCurrent();

      const priorityEnd = Math.min(FRAME_PRIORITY_COUNT, FRAME_COUNT);
      const allLoads: Promise<void>[] = [];

      for (let i = 1; i < FRAME_COUNT; i++) {
        const priority = i < priorityEnd ? "high" : "low";

        allLoads.push(
            loadFrame(i, priority).then(() => {
              if (cancelled) return;
              setLoadedCount((count) => count + 1);
            }),
        );
      }

      if (!cancelled) setLoadedCount((count) => count + 1);

      await Promise.all(allLoads);
      if (cancelled) return;

      setFramesReady(true);
      logFrameEvent("todos os frames carregados");
    };

    computeDrawParams();
    preloadFrames();

    window.addEventListener("resize", scheduleResize);
    window.addEventListener("orientationchange", scheduleResize);

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

            updateTargetFrame(p);

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

      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("orientationchange", scheduleResize);

      if (pendingDrawFrame !== null) {
        cancelAnimationFrame(pendingDrawFrame);
      }

      if (pendingResizeFrame !== null) {
        cancelAnimationFrame(pendingResizeFrame);
      }

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
        <div
            ref={containerRef}
            className="sticky top-0 h-[100svh] overflow-hidden"
        >

          <Image
              src="/assets/hero-poster.webp"
              alt=""
              fill
              priority
              sizes="100vw"
              aria-hidden="true"
              className="absolute inset-0 z-0 object-cover"
          />

          <canvas
              ref={canvasRef}
              aria-hidden="true"
              className="absolute inset-0 z-[1] h-full w-full object-cover opacity-0 transition-opacity duration-500 ease-out"
          />

          <div className="pointer-events-none absolute inset-0 z-[5] bg-black/25" />

          <div
              aria-hidden="true"
              className={`
              pointer-events-none
              absolute
              inset-0
              z-50
              flex
              flex-col
              items-center
              justify-center
              gap-4
              bg-black
              transition-opacity
              duration-700
              ease-out
              ${framesReady ? "opacity-0" : "opacity-100"}
            `}
          >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />

            <p className="font-mono text-xs tracking-[0.3em] text-white/60">
              {Math.round((loadedCount / FRAME_COUNT) * 100)}%
            </p>
          </div>

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
