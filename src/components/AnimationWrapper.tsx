"use client";

import { useEffect } from "react";
import {
  animateCardsOnScroll,
  animateImageZoom,
  animateButtonClick,
  animateNumberCounters,
  fadeInOnScroll,
  staggerInAnimation,
} from "@/lib/gsap-animations";

export function AnimationWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    animateCardsOnScroll(".card");
    animateCardsOnScroll(".item-card");
    animateCardsOnScroll(".category-card");
    animateCardsOnScroll(".step-card");
    animateCardsOnScroll(".scroll-reveal");

    animateImageZoom(".hero-photo");
    animateImageZoom(".gallery-main");

    fadeInOnScroll(".panel");
    fadeInOnScroll(".search-panel");
    animateNumberCounters(".count-up");
    animateButtonClick(".button, .button-secondary, .button-ghost");

    const heroElements = document.querySelectorAll(
      ".home-hero-copy > *:not(.home-search):not(.home-quick-links)"
    );
    if (heroElements.length > 0) {
      staggerInAnimation(".home-hero-copy > *:not(.home-search)", 0.15);
    }
  }, []);

  return <>{children}</>;
}
