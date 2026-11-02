
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./CinematicHero.css";

gsap.registerPlugin(ScrollTrigger);

function CinematicHero() {
  const sectionRef = useRef(null);
  const imageRefs = useRef([]);
  const headingRef = useRef(null);
  const descriptionRef = useRef(null);
  const sideLabelRef = useRef(null);
  const footerRef = useRef(null);

  const moveFns = useRef([]);
  const animationCompleteRef = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const images = imageRefs.current;

      // INITIAL HIDDEN STATES
      gsap.set(images, {
        autoAlpha: 0,
        scale: 1.15,
        y: 45,
        clipPath: "inset(12% 12% 12% 12% round 35px)",
        force3D: true,
      });

      gsap.set(headingRef.current, {
        autoAlpha: 0,
        y: 65,
        filter: "blur(10px)",
      });

      gsap.set(descriptionRef.current, {
        autoAlpha: 0,
        y: 40,
        filter: "blur(6px)",
      });

      gsap.set(
        [sideLabelRef.current, footerRef.current],
        {
          autoAlpha: 0,
          y: 25,
        }
      );

      // CINEMATIC SCROLL TIMELINE
      const tl = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power3.out",
        },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
          once: true,
          invalidateOnRefresh: true,
        },
        onComplete: () => {
          animationCompleteRef.current = true;
        },
      });

      // STEP 1 — BUILDING IMAGE
      tl.to(images[0], {
        autoAlpha: 1,
        scale: 1,
        y: 0,
        clipPath: "inset(0% 0% 0% 0% round 35px)",
        duration: 1.3,
      });

      // STEP 2 — PORTRAIT IMAGE
      tl.to(
        images[1],
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0% round 35px)",
          duration: 1.3,
        },
        "-=0.65"
      );

      // STEP 3 — INTERIOR IMAGE
      tl.to(
        images[2],
        {
          autoAlpha: 1,
          scale: 1,
          y: 0,
          clipPath: "inset(0% 0% 0% 0% round 35px)",
          duration: 1.3,
        },
        "-=0.65"
      );

      // STEP 4 — MAIN HEADING
      tl.to(
        headingRef.current,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.1,
        },
        "-=0.35"
      );

      // STEP 5 — DESCRIPTION
      tl.to(
        descriptionRef.current,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.9,
        },
        "-=0.35"
      );

      // STEP 6 — SIDE LABEL AND FOOTER
      tl.to(
        [sideLabelRef.current, footerRef.current],
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
        },
        "-=0.25"
      );

      // MOUSE PARALLAX HELPERS
      moveFns.current = images.map((image) => ({
        x: gsap.quickTo(image, "x", {
          duration: 0.65,
          ease: "power3.out",
        }),
        y: gsap.quickTo(image, "y", {
          duration: 0.65,
          ease: "power3.out",
        }),
      }));
    }, sectionRef);

    return () => {
      animationCompleteRef.current = false;
      moveFns.current = [];
      ctx.revert();
    };
  }, []);

  const handleMouseMove = (event) => {
    const section = sectionRef.current;

    if (
      !section ||
      !animationCompleteRef.current ||
      moveFns.current.length === 0
    ) {
      return;
    }

    const rect = section.getBoundingClientRect();

    const mouseX =
      (event.clientX - rect.left) / rect.width - 0.5;

    const mouseY =
      (event.clientY - rect.top) / rect.height - 0.5;

    const movement = [
      { x: -35, y: -22 },
      { x: 45, y: 28 },
      { x: -22, y: 38 },
    ];

    moveFns.current.forEach((move, index) => {
      move.x(mouseX * movement[index].x);
      move.y(mouseY * movement[index].y);
    });
  };

  const handleMouseLeave = () => {
    moveFns.current.forEach((move) => {
      move.x(0);
      move.y(0);
    });
  };

  return (
    <section
      className="cinematic-hero"
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h1 className="cinematic-heading" ref={headingRef}>
        YOUR <span>SPACE</span>
      </h1>

      <div className="cinematic-images">
        <div
          className="cinematic-image image-building"
          ref={(el) => (imageRefs.current[0] = el)}
        >
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=85"
            alt="Modern luxury building"
          />
        </div>

        <div
          className="cinematic-image image-portrait"
          ref={(el) => (imageRefs.current[1] = el)}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=1000&q=85"
            alt="Portrait in natural light"
          />
        </div>

        <div
          className="cinematic-image image-interior"
          ref={(el) => (imageRefs.current[2] = el)}
        >
          <img
            src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=85"
            alt="Elegant modern interior"
          />
        </div>
      </div>

      <div
        className="cinematic-description"
        ref={descriptionRef}
      >
        <p>
          A place where architecture meets emotion,
          and every detail creates a better way of living.
        </p>

        <span>DISCOVER A NEW PERSPECTIVE ↗</span>
      </div>

      <div
        className="cinematic-side-label"
        ref={sideLabelRef}
      >
        <span>A.</span>
        <span>LIVE BEAUTIFULLY</span>
      </div>

      <div
        className="cinematic-footer"
        ref={footerRef}
      >
        <span>DESIGNED FOR LIVING</span>
        <span>MOVE YOUR MOUSE TO EXPLORE ↗</span>
      </div>
    </section>
  );
}

export default CinematicHero;
