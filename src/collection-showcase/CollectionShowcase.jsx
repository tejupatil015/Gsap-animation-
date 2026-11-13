
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./CollectionShowcase.css";

gsap.registerPlugin(ScrollTrigger);

const collections = [
  {
    name: "Image Reveals",
    image:
      "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1800&q=90",
    units: "42",
  },
  {
    name: "Scroll Animations",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1800&q=90",
    units: "80",
  },
  {
    name: "Text Animations",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1800&q=90",
    units: "64",
  },
  
  {
    name: "Parallax Effects",
    image:
      "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1800&q=90",
    units: "28",
  },
  {
    name: "Interactive Effects",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1800&q=90",
    units: "12",
  },
];

function CollectionShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const curtainRef = useRef(null);
  const titleRef = useRef(null);
  const leftContentRef = useRef(null);
  const bottomRef = useRef(null);

  const hasEnteredRef = useRef(false);
  const isChangingRef = useRef(false);

  // SECTION ENTRANCE ANIMATION
  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftItems = leftContentRef.current.children;

      // Initial hidden states
      gsap.set(imageRef.current, {
        autoAlpha: 1,
        clipPath: "inset(0 0 100% 0)",
        scale: 1.12,
        transformOrigin: "center center",
      });

      gsap.set(curtainRef.current, {
        autoAlpha: 1,
      });

      gsap.set(leftItems, {
        autoAlpha: 0,
        y: 45,
      });

      gsap.set(titleRef.current, {
        autoAlpha: 0,
        y: 100,
        clipPath: "inset(100% 0 0 0)",
      });

      gsap.set(bottomRef.current, {
        autoAlpha: 0,
        y: 30,
      });

      // Scroll-triggered timeline
      const tl = gsap.timeline({
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

      // STEP 1 — IMAGE REVEAL
      tl.to(imageRef.current, {
        clipPath: "inset(0 0 0% 0)",
        scale: 1,
        duration: 1.5,
        ease: "power4.inOut",
      });

      // STEP 2 — CURTAIN FADE
      tl.to(
        curtainRef.current,
        {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.out",
        },
        "-=0.7"
      );

      // STEP 3 — LEFT PANEL CONTENT
      tl.to(
        leftItems,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        },
        "-=0.45"
      );

      // STEP 4 — MAIN TITLE
      tl.to(
        titleRef.current,
        {
          autoAlpha: 1,
          y: 0,
          clipPath: "inset(0 0 0 0)",
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.2"
      );

      // STEP 5 — BOTTOM INFORMATION
      tl.to(
        bottomRef.current,
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.3"
      );
    }, sectionRef);

    return () => {
      hasEnteredRef.current = false;
      isChangingRef.current = false;
      ctx.revert();
    };
  }, []);

  // CHANGE ANIMATION CATEGORY IMAGE
  const changeCollection = (index) => {
    if (!hasEnteredRef.current) return;
    if (isChangingRef.current) return;
    if (index < 0 || index >= collections.length) return;
    if (index === activeIndex) return;

    const image = imageRef.current;

    if (!image) return;

    isChangingRef.current = true;

    const nextImage = collections[index].image;
    const preloadImage = new Image();

    preloadImage.onload = () => {
      gsap.to(image, {
        autoAlpha: 0,
        scale: 1.04,
        duration: 0.4,
        ease: "power2.in",

        onComplete: () => {
          image.src = nextImage;
          setActiveIndex(index);

          gsap.fromTo(
            image,
            {
              autoAlpha: 0,
              scale: 1.07,
              clipPath: "inset(0 0 100% 0)",
            },
            {
              autoAlpha: 1,
              scale: 1,
              clipPath: "inset(0 0 0 0)",
              duration: 1.1,
              ease: "power4.out",
              onComplete: () => {
                isChangingRef.current = false;
              },
            }
          );
        },
      });
    };

    preloadImage.onerror = () => {
      isChangingRef.current = false;
    };

    preloadImage.src = nextImage;
  };

  const activeCollection = collections[activeIndex];

  return (
    <section
      className="collection-showcase"
      ref={sectionRef}
    >
      {/* LEFT PANEL */}
      <div className="collection-left">
        <div
          className="collection-left-content"
          ref={leftContentRef}
        >
          <span className="collection-eyebrow">
            EXPLORE GSAP
          </span>

          <h2 className="collection-studio">
            Motion
          </h2>

          <div className="collection-list">
            {collections.slice(1).map((item, index) => (
              <button
                key={item.name}
                className={`collection-option ${
                  activeIndex === index + 1 ? "selected" : ""
                }`}
                onClick={() => changeCollection(index + 1)}
              >
                {item.name}
              </button>
            ))}
          </div>

          <button
            className="collection-view-all"
            onClick={() => changeCollection(0)}
          >
            VIEW ALL EFFECTS
          </button>

          <div className="collection-bottom-info">
            <div className="collection-units">
              <span className="units-number">
                {activeCollection.units}
              </span>

              <span className="units-label">
                animations
                <br />
                featured
              </span>
            </div>

            <button
              className="collection-request"
              onClick={() => {
                document
                  .getElementById("inquire")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              EXPLORE MORE
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE PANEL */}
      <div className="collection-right">
        <div className="collection-image-wrapper">
          <img
            ref={imageRef}
            className="collection-main-image"
            src={collections[0].image}
            alt="GSAP scroll animation showcase"
          />

          <div
            className="collection-dark-curtain"
            ref={curtainRef}
          />

          <div className="collection-image-shade" />
        </div>

        {/* NAVIGATION ARROWS */}
        <button
          className="collection-arrow collection-arrow-left"
          aria-label="Previous animation"
          onClick={() =>
            changeCollection(
              (activeIndex - 1 + collections.length) %
                collections.length
            )
          }
        >
          <ChevronLeft size={20} />
        </button>

        <button
          className="collection-arrow collection-arrow-right"
          aria-label="Next animation"
          onClick={() =>
            changeCollection(
              (activeIndex + 1) % collections.length
            )
          }
        >
          <ChevronRight size={20} />
        </button>

        {/* MAIN TITLE */}
        <div className="collection-image-title">
          <span className="collection-image-caption">
            THE ART OF WEB MOTION
          </span>

          <h1 ref={titleRef}>
            ANIMATION STYLES
          </h1>
        </div>

        {/* IMAGE COUNTER */}
        <div className="collection-image-counter">
          <span>0{activeIndex + 1}</span>
          <span className="counter-divider" />
          <span>0{collections.length}</span>
        </div>

        {/* SIDE LABEL */}
        <div className="collection-side-label">
          GSAP <span>Creative Motion</span>
        </div>

        {/* BOTTOM TEXT */}
        <div
          className="collection-image-bottom"
          ref={bottomRef}
        >
          <span>POWERED BY GSAP</span>
          <span>SCROLL — EXPLORE — INTERACT</span>
        </div>
      </div>
    </section>
  );
}

export default CollectionShowcase;
