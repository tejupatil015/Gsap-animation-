
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";

import "./project1/style.css";

import ExpandableCards from "./expandable-cards/ExpandableCard.jsx";
import CinematicHero from "./cinematic-hero/CinematicHero.jsx";
import Residences from "./residences/Residences.jsx";
import CollectionShowcase from "./collection-showcase/CollectionShowcase.jsx";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const leftTextRef = useRef(null);
  const rightTextRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1400",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,

          // Refresh the pinned section before downstream triggers.
          refreshPriority: 1,
        },
      });

      // IMAGE REVEAL
      tl.fromTo(
        imageRef.current,
        {
          scale: 1.18,
          opacity: 0,
          y: 70,
          clipPath: "inset(12% 12% 12% 12%)",
        },
        {
          scale: 0.78,
          opacity: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          ease: "power3.out",
        },
        0
      );

      // LEFT TEXT
      tl.fromTo(
        leftTextRef.current,
        {
          x: -100,
          opacity: 0,
          filter: "blur(8px)",
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
        },
        0.8
      );

      // RIGHT TEXT
      tl.fromTo(
        rightTextRef.current,
        {
          x: 100,
          opacity: 0,
          filter: "blur(8px)",
        },
        {
          x: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 1.2,
          ease: "power3.out",
        },
        1.1
      );
    }, sectionRef);

    // Refresh after page assets and layout are ready.
    const refresh = () => {
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });
    };

    window.addEventListener("load", refresh);

    if (document.readyState === "complete") {
      refresh();
    }

    document.fonts?.ready?.then(refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <main>
      {/* SECTION 01 — PINNED SCROLL SCENE */}
      <section className="scroll-scene" ref={sectionRef}>
        <div className="scene-heading">
          <span>THE ART OF CREATION</span>
          <h1>
            Design in Motion<span>.</span>
          </h1>
        </div>

        <div className="scene-layout">
          <div className="scene-text left-text" ref={leftTextRef}>
            <span className="scene-number">01 / CREATE</span>

            <h2>
              Ideas become<br />
              <span>reality.</span>
            </h2>

            <p>
              Every great experience begins with an idea.
              We turn imagination into something meaningful.
            </p>

            <a href="#about">
              Explore our approach <ArrowRight size={16} />
            </a>
          </div>

          <div className="scene-image" ref={imageRef}>
            <img
              src="https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85"
              alt="Mountain landscape and peaceful lake"
            />

            <div className="scene-image-label">
              A NEW PERSPECTIVE
            </div>
          </div>

          <div className="scene-text right-text" ref={rightTextRef}>
            <span className="scene-number">02 / INSPIRE</span>

            <h2>
              Make it<br />
              <span>memorable.</span>
            </h2>

            <p>
              Beautiful visuals and thoughtful motion
              create experiences people remember.
            </p>

            <a href="#about">
              Discover more <ArrowRight size={16} />
            </a>
          </div>
        </div>

        <div className="scene-footer">
          <span>CREATIVE STUDIO — 2026</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </section>

      {/* SECTION 02 */}
      <ExpandableCards />

      {/* SECTION 03 */}
      <Residences />

      {/* SECTION 04 */}
      <CollectionShowcase />

      {/* SECTION 05 */}
      <CinematicHero />
    </main>
  );
}

export default App;
