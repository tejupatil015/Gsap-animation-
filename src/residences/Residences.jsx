
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight } from "lucide-react";
import "./Residences.css";

gsap.registerPlugin(ScrollTrigger);

const residences = [
  {
    name: "The Living Space",
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=90",
  },
  {
    name: "Modern Architecture",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=90",
  },
  {
    name: "Elegant Interiors",
    image:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1400&q=90",
  },
  {
    name: "Contemporary Design",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1400&q=90",
  },
];

function Residences() {
  const [activeIndex, setActiveIndex] = useState(0);

  const sectionRef = useRef(null);
  const backgroundRef = useRef(null);
  const mainImageRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const footerRef = useRef(null);

  const slideshowRef = useRef(null);
  const hasEnteredRef = useRef(false);
  const activeIndexRef = useRef(0);

  // ENTRANCE ANIMATION + SLIDESHOW
  useEffect(() => {
    const ctx = gsap.context(() => {
      // INITIAL HIDDEN STATES
      gsap.set(backgroundRef.current, {
        autoAlpha: 0,
        scale: 1.08,
      });

      gsap.set(mainImageRef.current, {
        clipPath: "inset(100% 0 0 0)",
        y: 55,
        autoAlpha: 0,
      });

      gsap.set(titleRef.current, {
        y: 90,
        autoAlpha: 0,
        clipPath: "inset(100% 0 0 0)",
      });

      gsap.set(descriptionRef.current, {
        y: 35,
        autoAlpha: 0,
        filter: "blur(5px)",
      });

      gsap.set(footerRef.current, {
        y: 20,
        autoAlpha: 0,
      });

      // START ONLY WHEN SECTION ENTERS VIEWPORT
      const entrance = gsap.timeline({
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

          // Start slideshow only after entrance animation
          startSlideshow();
        },
      });

      // STEP 1 — BACKGROUND
      entrance.to(backgroundRef.current, {
        autoAlpha: 1,
        scale: 1,
        duration: 1.5,
      });

      // STEP 2 — MAIN IMAGE
      entrance.to(
        mainImageRef.current,
        {
          clipPath: "inset(0% 0 0 0)",
          y: 0,
          autoAlpha: 1,
          duration: 1.5,
          ease: "power4.out",
        },
        "-=0.8"
      );

      // STEP 3 — HEADING
      entrance.to(
        titleRef.current,
        {
          y: 0,
          autoAlpha: 1,
          clipPath: "inset(0% 0 0 0)",
          duration: 1.2,
          ease: "power4.out",
        },
        "-=0.35"
      );

      // STEP 4 — DESCRIPTION
      entrance.to(
        descriptionRef.current,
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 1,
        },
        "-=0.3"
      );

      // STEP 5 — FOOTER
      entrance.to(
        footerRef.current,
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
        },
        "-=0.25"
      );
    }, sectionRef);

    // SLIDESHOW FUNCTION
    function startSlideshow() {
      if (slideshowRef.current || !hasEnteredRef.current) {
        return;
      }

      slideshowRef.current = gsap.timeline({
        repeat: -1,
        delay: 3,
      });

      residences.forEach((_, index) => {
        slideshowRef.current.call(() => {
          changeSlide(index);
        });

        slideshowRef.current.to({}, {
          duration: 3.5,
        });
      });
    }

    // IMAGE CHANGE ANIMATION
    function changeSlide(index) {
      if (!mainImageRef.current) return;

      if (index === activeIndexRef.current) return;

      const image = mainImageRef.current;
      const nextImage = residences[index].image;
      const preload = new Image();

      preload.onload = () => {
        if (!mainImageRef.current || !hasEnteredRef.current) {
          return;
        }

        gsap.to(image, {
          autoAlpha: 0,
          scale: 1.04,
          duration: 0.4,
          ease: "power2.in",

          onComplete: () => {
            image.src = nextImage;
            activeIndexRef.current = index;
            setActiveIndex(index);

            gsap.fromTo(
              image,
              {
                autoAlpha: 0,
                scale: 1.08,
                y: 15,
              },
              {
                autoAlpha: 1,
                scale: 1,
                y: 0,
                duration: 1,
                ease: "power4.out",
              }
            );
          },
        });
      };

      preload.onerror = () => {
        // Keep the current image if the next image fails to load
      };

      preload.src = nextImage;
    }

    return () => {
      slideshowRef.current?.kill();
      slideshowRef.current = null;
      hasEnteredRef.current = false;
      ctx.revert();
    };
  }, []);

  return (
    <section
      className="residences-section"
      ref={sectionRef}
    >
      <div
        className="residences-background"
        ref={backgroundRef}
      />

      {/* MAIN CHANGING IMAGE */}
      <div className="residence-main-image">
        <img
          ref={mainImageRef}
          src={residences[activeIndex].image}
          alt={residences[activeIndex].name}
        />

        <div className="residence-image-overlay">
          <span>{residences[activeIndex].name}</span>
          <span>0{activeIndex + 1} / 04</span>
        </div>
      </div>

      {/* HEADING */}
      <div className="residences-title-wrap">
        <span className="residences-eyebrow">
          A PLACE TO BELONG
        </span>

        <h1
          className="residences-title"
          ref={titleRef}
        >
          RESIDENCES<span>.</span>
        </h1>
      </div>

      {/* DESCRIPTION */}
      <div
        className="residences-description"
        ref={descriptionRef}
      >
        <span className="description-line" />

        <div>
          <span className="description-label">
            THOUGHTFULLY DESIGNED
          </span>

          <p>
            Designed with contemporary living in mind, each
            residence balances functionality, comfort, and
            aesthetics. Open-plan layouts, excellent natural
            light, refined materials, and carefully considered
            details create spaces that feel both welcoming
            and enduring.
          </p>

          <a href="#inquire" className="residence-discover">
            DISCOVER THE COLLECTION
            <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="residences-bottom"
        ref={footerRef}
      >
        <span>01 — 04 / PRIVATE COLLECTION</span>
        <span>DESIGNED FOR LIVING</span>
        <span>SCROLL TO EXPLORE ↓</span>
      </div>
    </section>
  );
}

export default Residences;
