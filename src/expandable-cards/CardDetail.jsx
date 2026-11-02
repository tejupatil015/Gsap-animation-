
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cards } from "./cardData";
import "./ExapndableCard.css";

function CardDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const pageRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);

  const card = cards.find((item) => item.id === id);

  useEffect(() => {
    if (!card || !imageRef.current || !contentRef.current) return;

    const ctx = gsap.context(() => {
      const contentItems = contentRef.current.children;

      // INITIAL STATES
      gsap.set(imageRef.current, {
        autoAlpha: 0,
        scale: 1.1,
        clipPath: "inset(0 0 100% 0)",
      });

      gsap.set(contentItems, {
        autoAlpha: 0,
        y: 40,
        filter: "blur(6px)",
      });

      // PAGE ENTRANCE TIMELINE
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      // STEP 1 — IMAGE REVEAL
      tl.to(imageRef.current, {
        autoAlpha: 1,
        scale: 1,
        clipPath: "inset(0 0 0 0)",
        duration: 1.3,
        ease: "power4.out",
      });

      // STEP 2 — CONTENT REVEAL
      tl.to(
        contentItems,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          stagger: 0.16,
          ease: "power3.out",
        },
        "-=0.45"
      );
    }, pageRef);

    return () => ctx.revert();
  }, [card]);

  if (!card) {
    return <h2>Page Not Found</h2>;
  }

  return (
    <section className="card-detail-page" ref={pageRef}>
      <button onClick={() => navigate("/")}>
        ← Back to Gallery
      </button>

      <img
        ref={imageRef}
        src={card.image}
        alt={card.title}
      />

      <div ref={contentRef}>
        <span>{card.category}</span>
        <h1>{card.title}</h1>
        <p>{card.description}</p>
      </div>
    </section>
  );
}

export default CardDetail;
