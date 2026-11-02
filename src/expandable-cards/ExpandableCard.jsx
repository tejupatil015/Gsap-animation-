
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cards } from "./cardData";
import "./ExapndableCard.css";

gsap.registerPlugin(ScrollTrigger);

function ExpandableCards() {
  const [active, setActive] = useState(-1);

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const cardRefs = useRef([]);
  const textRefs = useRef([]);
  const hasEnteredRef = useRef(false);

  const navigate = useNavigate();

  // 1. CINEMATIC SCROLL REVEAL
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Keep everything hidden until this section enters viewport.
      gsap.set(headingRef.current, {
        autoAlpha: 0,
        y: 45,
        filter: "blur(8px)",
      });

      gsap.set(cardRefs.current, {
        autoAlpha: 0,
        y: 80,
        scale: 0.96,
        filter: "blur(5px)",
      });

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
          hasEnteredRef.current = true;
        },
      });

      // Heading first
      tl.to(headingRef.current, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
      });

      // Cards appear one by one
      tl.to(
        cardRefs.current,
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 1.1,
          stagger: 0.18,
          clearProps: "filter",
        },
        "-=0.35"
      );
    }, sectionRef);

    return () => {
      hasEnteredRef.current = false;
      ctx.revert();
    };
  }, []);

  // 2. HOVER EXPAND / SHRINK
  useEffect(() => {
    // Don't run hover animation before scroll reveal completes.
    if (!hasEnteredRef.current) return;

    if (active === -1) {
      gsap.to(cardRefs.current, {
        flexGrow: 1,
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: "auto",
      });

      gsap.to(textRefs.current, {
        autoAlpha: 0,
        y: 25,
        duration: 0.3,
        overwrite: "auto",
      });

      return;
    }

    gsap.to(cardRefs.current, {
      flexGrow: (index) => (index === active ? 3 : 0.8),
      duration: 0.8,
      ease: "power3.inOut",
      overwrite: "auto",
    });

    gsap.to(textRefs.current, {
      autoAlpha: 0,
      y: 25,
      duration: 0.3,
      overwrite: "auto",
    });

    if (textRefs.current[active]) {
      gsap.to(textRefs.current[active], {
        autoAlpha: 1,
        y: 0,
        duration: 0.7,
        delay: 0.25,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [active]);

  // 3. HOVER HANDLERS
  const handleMouseEnter = (index) => {
    if (!hasEnteredRef.current) return;
    setActive(index);
  };

  const handleMouseLeave = () => {
    if (!hasEnteredRef.current) return;
    setActive(-1);
  };

  return (
    <section
      className="expandable-gallery"
      ref={sectionRef}
      onMouseLeave={handleMouseLeave}
    >
      <div className="gallery-heading" ref={headingRef}>
        <span>SELECT YOUR EXPERIENCE</span>
        <h2>Explore the world.</h2>
      </div>

      <div className="expandable-gallery-row">
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(el) => (cardRefs.current[index] = el)}
            className="expandable-gallery-card"
            onMouseEnter={() => handleMouseEnter(index)}
            onFocus={() => handleMouseEnter(index)}
          >
            <div className="gallery-image">
              <img src={card.image} alt={card.title} />

              <span className="gallery-image-number">
                0{index + 1}
              </span>

              <div className="gallery-image-overlay" />
            </div>

            <div
              ref={(el) => (textRefs.current[index] = el)}
              className="gallery-card-content"
            >
              <span>{card.category}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>

              <button
                onClick={() => navigate(`/detail/${card.id}`)}
              >
                Discover more <span>↗</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ExpandableCards;
