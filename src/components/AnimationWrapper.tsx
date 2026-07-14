"use client";

import { useEffect } from "react";
import {
  animateCardsOnScroll,
  animateImageZoom,
  hoverScaleAnimation,
  fadeInOnScroll,
  staggerInAnimation,
} from "@/lib/gsap-animations";

export function AnimationWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    animateCardsOnScroll(".card");
    animateCardsOnScroll(".item-card");
    animateCardsOnScroll(".category-card");
    animateCardsOnScroll(".step-card");

    animateImageZoom(".hero-photo");
    animateImageZoom(".item-card img");
    animateImageZoom(".gallery-main");

    hoverScaleAnimation(".item-card", 1.03);
    hoverScaleAnimation(".category-card", 1.02);
    hoverScaleAnimation(".button", 1.02);

    fadeInOnScroll(".panel");
    fadeInOnScroll(".search-panel");

    const heroElements = document.querySelectorAll(
      ".home-hero-copy > *:not(.home-search):not(.home-quick-links)"
    );
    if (heroElements.length > 0) {
      staggerInAnimation(".home-hero-copy > *:not(.home-search)", 0.15);
    }
  }, []);

  return <>{children}</>;
}
