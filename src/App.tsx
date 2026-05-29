import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";

/* ----------------------------- Image assets ----------------------------- */
const PORTAL_BG =
  "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779707217/image_1_vdzwae.png";
const CURTAIN_LEFT =
  "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706559/curtain_left_znkmva.png";
const CURTAIN_RIGHT =
  "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706564/curtain_right_paeyym.png";
const WORLD_BG =
  "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706392/image_2_gkcdlx.png";
const BOTTOM_CLOUDS =
  "https://res.cloudinary.com/dy5er7kv5/image/upload/q_auto/f_auto/v1779706555/bottom_clouds_xskut6.png";
const CARD_IMAGES = [
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_2026001469-484f-af25-59168ad9a233.png&w=1280&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_202600a101-4ded-a332-7d37707dbdd1.png&w=1280&q=85",
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_2026000dfb-4ac9-a4ef-e74f301c329c.png&w=1280&q=85",
];

interface ArcCard {
  title: string;
  desc: string;
  color: string;
}
const ARC_CARDS: ArcCard[] = [
  { title: "Hidden Realms", desc: "Luminous sanctuaries unseen by wandering eyes", color: "#f3cdd6" },
  { title: "Wild Solitudes", desc: "Dissolve into untamed horizons and deep calm", color: "#dcedc2" },
  { title: "Silent Havens", desc: "Remote escapes far beyond ordinary reach", color: "#c3e3f4" },
  { title: "Bespoke Quests", desc: "Journeys shaped around your vision and soul", color: "#f0e4c0" },
  { title: "Vivid Drifts", desc: "Surreal passages through breathtaking terrain", color: "#dcd2f2" },
  { title: "Mystic Crests", desc: "Timeless ridgelines wrapped in cloud and myth", color: "#f3cdd6" },
  { title: "Deep Currents", desc: "Glowing depths alive with uncharted wonder", color: "#c3e3f4" },
  { title: "Gilded Dusk", desc: "Amber horizons that stretch past all reason", color: "#f0e4c0" },
  { title: "Glassy Tides", desc: "Calm waters holding skies of pure stillness", color: "#dcedc2" },
];

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

const MAG = { world: 6, clouds: 9, portal: 7, curtainL: 14, curtainR: 14 };

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function StarLogo() {
  return (
    <svg width={28} height={28} viewBox="0 0 28 28" fill="none" aria-hidden>
      <path
        d="M14 2l2.09 6.42H23l-5.45 3.96 2.09 6.42L14 14.84l-5.64 4.06 2.09-6.42L4.96 8.42h6.95L14 2z"
        fill="white"
        opacity="0.9"
      />
      <circle cx="14" cy="24" r="1.5" fill="white" opacity="0.6" />
      <circle cx="6" cy="6" r="1" fill="white" opacity="0.4" />
      <circle cx="22" cy="6" r="1" fill="white" opacity="0.4" />
    </svg>
  );
}

function PlayTriangle({ size = 10 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 10 10" aria-hidden>
      <path d="M2 1.5 L8.5 5 L2 8.5 Z" fill="#3b1a0a" />
    </svg>
  );
}

function ScrollChevron() {
  return (
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: "1.5px solid rgba(255,255,255,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "bobUp 1.8s ease-in-out infinite",
      }}
    >
      <svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden>
        <path
          d="M3 5l4 4 4-4"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const navLinkStyle: CSSProperties = {
  fontFamily: "'Imprima', sans-serif",
  fontSize: 12,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "#fff",
  opacity: 0.9,
  textDecoration: "none",
  cursor: "pointer",
};

function ArcCardSlider({
  cards,
  rotationOffset,
  isMobile,
}: {
  cards: ArcCard[];
  rotationOffset: number;
  isMobile: boolean;
}) {
  const cardSpacingDeg = isMobile ? 12 : 9;
  const totalCards = cards.length;
  const centerIndex = Math.floor(totalCards / 2);
  const arcRadius = isMobile ? 700 : 1100;
  const cardW = isMobile ? 160 : 220;
  const cardH = isMobile ? 175 : 230;
  const sliderH = isMobile ? 260 : 360;
  const halfW = cardW / 2;
  const bottomBase = isMobile ? 140 : 200;

  return (
    <div style={{ position: "relative", width: "100%", height: sliderH, pointerEvents: "none" }}>
      {cards.map((card, i) => {
        const baseDeg = (i - centerIndex) * cardSpacingDeg;
        const deg = baseDeg - rotationOffset + centerIndex * cardSpacingDeg;
        const rad = (deg * Math.PI) / 180;
        const x = Math.sin(rad) * arcRadius;
        const y = arcRadius - Math.cos(rad) * arcRadius;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              bottom: -y + bottomBase,
              left: `calc(50% + ${x}px - ${halfW}px)`,
              width: cardW,
              height: cardH,
              transform: `rotate(${deg}deg)`,
              transformOrigin: `${halfW}px ${arcRadius}px`,
              background: card.color,
              borderRadius: isMobile ? 18 : 26,
              boxShadow: "0 8px 40px rgba(80,40,60,0.18)",
              padding: isMobile ? 14 : 18,
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: isMobile ? 12 : 16,
                right: isMobile ? 12 : 16,
                width: 24,
                height: 24,
                borderRadius: "50%",
                border: "1.5px solid rgba(80,50,60,0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Imprima', sans-serif",
                fontSize: 10,
                color: "rgba(80,50,60,0.6)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </div>
            <div
              style={{
                fontFamily: "'Viaoda Libre', serif",
                fontSize: isMobile ? 22 : 30,
                color: "#3a2530",
                lineHeight: 1.05,
              }}
            >
              {card.title}
            </div>
            <div
              style={{
                fontFamily: "'Imprima', sans-serif",
                fontSize: isMobile ? 12 : 15,
                color: "rgba(58,37,48,0.65)",
                marginTop: 6,
                lineHeight: 1.3,
              }}
            >
              {card.desc}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MediaCard({
  image,
  size,
  radius,
  variant,
}: {
  image: string;
  size: number;
  radius: number;
  variant: "play" | "number";
}) {
  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        borderRadius: radius,
        overflow: "hidden",
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 8px 32px rgba(0,0,0,0.45)",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "44% 0 0 0",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          maskImage: "linear-gradient(to top, #000 40%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, #000 40%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "40% 0 0 0",
          background:
            "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 50%, transparent 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {variant === "play" ? (
          <>
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlayTriangle size={11} />
            </div>
            <span style={{ fontFamily: "'Imprima', sans-serif", fontSize: 18, color: "#fff" }}>
              View Reel
            </span>
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span
              style={{ fontFamily: "'Viaoda Libre', serif", fontSize: 36, color: "#fff", lineHeight: 1 }}
            >
              32
            </span>
            <span style={{ fontFamily: "'Imprima', sans-serif", fontSize: 18, color: "#fff" }}>
              World Patrons
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const isMobile = useIsMobile();

  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [uiVisible, setUiVisible] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const rawMouse = useRef({ x: 0, y: 0 });
  const smoothMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;
      const max = el.scrollHeight - window.innerHeight;
      const p = clamp(window.scrollY / (max || 1), 0, 1);
      setScrollProgress(p);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setCurtainsOpen(true), 100);
    const t2 = setTimeout(() => setUiVisible(true), 600);
    const t3 = setTimeout(() => setEntranceDone(true), 2200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const onMove = (e: MouseEvent) => {
      rawMouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove);
    let raf = 0;
    const loop = () => {
      smoothMouse.current.x = lerp(smoothMouse.current.x, rawMouse.current.x, 0.07);
      smoothMouse.current.y = lerp(smoothMouse.current.y, rawMouse.current.y, 0.07);
      setMouse({ x: smoothMouse.current.x, y: smoothMouse.current.y });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  const ep = easeInOut(scrollProgress);
  const mx = mouse.x;
  const my = mouse.y;

  const scene1Opacity = clamp(1 - scrollProgress / 0.22, 0, 1);
  const scene2Opacity = clamp((scrollProgress - 0.68) / 0.16, 0, 1);
  const portalOpacity = 1 - clamp((scrollProgress - 0.65) / 0.2, 0, 1);
  const cloudsOpacity = lerp(0.7, 1, clamp(scrollProgress / 0.05, 0, 1));

  const totalCards = ARC_CARDS.length;
  const arcSweepDeg = (totalCards - 1) * 10;
  const rotationOffset = lerp(0, arcSweepDeg, clamp((scrollProgress - 0.7) / 0.3, 0, 1));

  const worldT = `translate(${-mx * MAG.world}px, ${-my * MAG.world}px) scale(${lerp(1, 1.18, ep)})`;
  const cloudsT = `translate(${-mx * MAG.clouds}px, ${-my * MAG.clouds * 0.4}px) scale(${lerp(1, 1.4, ep)})`;
  const portalT = `translate(${-mx * MAG.portal}px, ${-my * MAG.portal}px) scale(${lerp(1, 7.5, ep)})`;

  const curtainShift = lerp(0, 150, ep);
  const curtainScale = lerp(1, 1.3, ep);
  const curtainLBase = curtainsOpen ? -62 : 0;
  const curtainRBase = curtainsOpen ? 62 : 0;
  const curtainLT = `translate(calc(${curtainLBase - curtainShift}% + ${-mx * MAG.curtainL}px), ${-my * MAG.curtainL * 0.3}px) scale(${curtainScale})`;
  const curtainRT = `translate(calc(${curtainRBase + curtainShift}% + ${-mx * MAG.curtainR}px), ${-my * MAG.curtainR * 0.3}px) scale(${curtainScale})`;
  const curtainTransition = entranceDone ? "none" : "transform 1.8s cubic-bezier(0.16, 1, 0.3, 1)";

  const uiFadeStyle = (delay: string): CSSProperties => ({
    opacity: uiVisible ? 1 : 0,
    transform: uiVisible ? "translateY(0)" : "translateY(24px)",
    transition: "opacity 0.9s ease, transform 0.9s ease",
    transitionDelay: delay,
  });

  return (
    <div ref={containerRef} style={{ height: "480vh", position: "relative" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#0a0608",
        }}
      >
        <div style={{ position: "absolute", inset: 0, transformOrigin: "50% 50%", transform: worldT }}>
          <img src={WORLD_BG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            transformOrigin: "50% 100%",
            transform: cloudsT,
            opacity: cloudsOpacity,
          }}
        >
          <img src={BOTTOM_CLOUDS} alt="" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: isMobile ? 60 : 80,
            left: 0,
            right: 0,
            zIndex: 9,
            opacity: scene2Opacity,
          }}
        >
          <ArcCardSlider cards={ARC_CARDS} rotationOffset={rotationOffset} isMobile={isMobile} />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 15,
            transformOrigin: "52% 38%",
            transform: portalT,
            opacity: portalOpacity,
          }}
        >
          <img src={PORTAL_BG} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            zIndex: 16,
            background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 16,
            transformOrigin: "left center",
            transform: curtainLT,
            transition: curtainTransition,
          }}
        >
          <img
            src={CURTAIN_LEFT}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "right center", display: "block" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 16,
            transformOrigin: "right center",
            transform: curtainRT,
            transition: curtainTransition,
          }}
        >
          <img
            src={CURTAIN_RIGHT}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "left center", display: "block" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "42vh",
            zIndex: 45,
            background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 100%)",
            pointerEvents: "none",
          }}
        />

        <nav
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="px-5 py-[18px] xl:px-12 xl:py-[22px]"
        >
          <div className="flex xl:hidden w-full items-center justify-between">
            <a style={{ ...navLinkStyle, fontSize: 11 }}>Explore</a>
            <StarLogo />
            <a style={{ ...navLinkStyle, fontSize: 11 }}>Connect</a>
          </div>
          <div className="hidden xl:flex w-full items-center justify-between">
            <div style={{ display: "flex", gap: 36 }}>
              {["Worlds", "Atelier", "Immersions"].map((l) => (
                <a key={l} style={navLinkStyle}>{l}</a>
              ))}
            </div>
            <StarLogo />
            <div style={{ display: "flex", gap: 36 }}>
              {["Craft", "Codex", "Connect"].map((l) => (
                <a key={l} style={navLinkStyle}>{l}</a>
              ))}
            </div>
          </div>
        </nav>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            opacity: scene1Opacity,
            pointerEvents: scene1Opacity > 0.05 ? "auto" : "none",
          }}
        >
          <div
            className="md:hidden"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              padding: "80px 24px 100px",
              ...uiFadeStyle("0.3s"),
            }}
          >
            <h1 style={{ fontFamily: "'Viaoda Libre', serif", margin: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(26px, 7vw, 42px)",
                  letterSpacing: "0.1em",
                  color: "#3b1a0a",
                }}
              >
                FALL <span style={{ color: "#6b2e0e", fontSize: "0.8em" }}>&#8250;</span>{" "}
                <span style={{ fontStyle: "italic" }}>INTO</span>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(52px, 16vw, 80px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  color: "#3b1a0a",
                }}
              >
                REVERIE
              </span>
            </h1>
            <p
              style={{
                fontFamily: "'Imprima', sans-serif",
                fontSize: 15,
                lineHeight: 1.7,
                color: "#5c2d0e",
                maxWidth: 280,
                marginTop: 20,
              }}
            >
              Crafting boundless digital worlds where the edge between AI, vision, and living myth dissolves.
            </p>
            <div style={{ marginTop: 28 }}>
              <MediaCard image={CARD_IMAGES[0]} size={140} radius={22} variant="play" />
            </div>
          </div>

          <div
            className="hidden md:flex xl:hidden"
            style={{
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: 28,
              padding: "80px 32px 96px",
              ...uiFadeStyle("0.3s"),
            }}
          >
            <h1 style={{ fontFamily: "'Viaoda Libre', serif", margin: 0 }}>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(28px, 5vw, 44px)",
                  letterSpacing: "0.1em",
                  color: "#3b1a0a",
                }}
              >
                FALL <span style={{ color: "#6b2e0e", fontSize: "0.8em" }}>&#8250;</span>{" "}
                <span style={{ fontStyle: "italic" }}>INTO</span>
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(60px, 12vw, 86px)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                  color: "#3b1a0a",
                }}
              >
                REVERIE
              </span>
            </h1>
            <p
              style={{
                fontFamily: "'Imprima', sans-serif",
                fontSize: 16,
                lineHeight: 1.7,
                color: "#5c2d0e",
                maxWidth: 400,
              }}
            >
              Crafting boundless digital worlds where the edge between AI, vision, and living myth dissolves.
            </p>
            <div className="flex gap-3.5">
              <MediaCard image={CARD_IMAGES[0]} size={140} radius={22} variant="play" />
              <MediaCard image={CARD_IMAGES[1]} size={140} radius={22} variant="number" />
              <MediaCard image={CARD_IMAGES[2]} size={140} radius={22} variant="play" />
            </div>
          </div>

          <div className="hidden xl:block">
            <div
              style={{
                position: "absolute",
                top: "46%",
                left: 60,
                maxWidth: 440,
                transform: "translateY(-50%)",
                ...uiFadeStyle("0.3s"),
              }}
            >
              <h1 style={{ fontFamily: "'Viaoda Libre', serif", margin: 0 }}>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(32px, 4.5vw, 54px)",
                    lineHeight: 1.1,
                    letterSpacing: "0.04em",
                    color: "#fff",
                    textShadow: "0 2px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  FALL <span style={{ color: "rgba(255,220,180,0.7)" }}>&#8250;</span>{" "}
                  <span style={{ fontStyle: "italic" }}>INTO</span>
                </span>
                <span
                  style={{
                    display: "block",
                    fontSize: "clamp(50px, 7.5vw, 88px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.02em",
                    color: "#fff",
                    textShadow: "0 2px 24px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.9)",
                  }}
                >
                  REVERIE
                </span>
              </h1>
              <p
                style={{
                  fontFamily: "'Imprima', sans-serif",
                  fontSize: 18,
                  lineHeight: 1.7,
                  color: "rgba(255,245,235,0.88)",
                  maxWidth: 300,
                  marginTop: 24,
                  textShadow: "0 1px 12px rgba(0,0,0,0.8)",
                }}
              >
                Crafting boundless digital worlds where the edge between AI, vision, and living myth dissolves.
              </p>
            </div>

            <div
              className="flex"
              style={{
                position: "absolute",
                right: 40,
                top: "50%",
                transform: "translateY(-50%)",
                gap: 12,
                ...uiFadeStyle("0.55s"),
              }}
            >
              <MediaCard image={CARD_IMAGES[0]} size={158} radius={28} variant="play" />
              <MediaCard image={CARD_IMAGES[1]} size={158} radius={28} variant="number" />
              <MediaCard image={CARD_IMAGES[2]} size={158} radius={28} variant="play" />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 28,
              display: "flex",
              gap: 6,
              alignItems: "center",
              ...uiFadeStyle("0.8s"),
            }}
            className="left-1/2 -translate-x-1/2 xl:left-[60px] xl:translate-x-0"
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                style={{
                  width: i === 0 ? 28 : 14,
                  height: 4,
                  borderRadius: 2,
                  background: i === 0 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
                }}
              />
            ))}
          </div>

          <div
            className="hidden xl:flex"
            style={{
              position: "absolute",
              bottom: 36,
              left: "50%",
              transform: "translateX(-50%)",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              ...uiFadeStyle("0.9s"),
            }}
          >
            <span
              style={{
                fontFamily: "'Imprima', sans-serif",
                fontSize: 10,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              Descend
            </span>
            <ScrollChevron />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 46,
            opacity: scene2Opacity,
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 24px",
          }}
        >
          <h2
            className="text-[clamp(28px,8vw,44px)] xl:text-[clamp(38px,6.5vw,78px)]"
            style={{
              fontFamily: "'Viaoda Libre', serif",
              color: "#fff",
              letterSpacing: "0.03em",
              lineHeight: 1.05,
              textShadow: "0 2px 20px rgba(0,0,0,0.4)",
              marginTop: isMobile ? "8vh" : "12vh",
              marginBottom: 0,
            }}
          >
            FORGE BEYOND THE REAL
          </h2>
          <p
            className="text-sm xl:text-[20px] max-w-[260px] xl:max-w-[480px]"
            style={{
              fontFamily: "'Imprima', sans-serif",
              lineHeight: 1.6,
              letterSpacing: "-0.01em",
              color: "rgba(255,255,255,0.82)",
              marginTop: 16,
            }}
          >
            Singular voyages to astonishing destinations, shaped for those who seek beauty beyond the ordinary and the known.
          </p>
        </div>
      </div>
    </div>
  );
}