import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const animateHeroIn = (selector: string) => {
  const elements = document.querySelectorAll(selector);
  gsap.from(elements, {
    duration: 0.8,
    opacity: 0,
    y: 30,
    stagger: 0.1,
    ease: "power3.out",
  });
};

export const animateCardsOnScroll = (selector: string) => {
  const cards = document.querySelectorAll(selector);
  cards.forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 80%",
        once: true,
      },
      duration: 0.6,
      opacity: 0,
      y: 20,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(card, { clearProps: "transform" });
      },
    });
  });
};

export const animateCountUp = (selector: string, end: number, duration = 2) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    const obj = { val: 0 };
    gsap.to(obj, {
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      val: end,
      duration: duration,
      ease: "power1.inOut",
      onUpdate: () => {
        (element as HTMLElement).textContent = Math.round(obj.val).toString();
      },
    });
  });
};

export const animateImageZoom = (selector: string) => {
  const images = document.querySelectorAll(selector);
  images.forEach((img) => {
    gsap.from(img, {
      scrollTrigger: {
        trigger: img,
        start: "top center",
        toggleActions: "play none none reverse",
      },
      duration: 1,
      scale: 0.95,
      opacity: 0,
      ease: "power2.out",
      onComplete: () => {
        gsap.set(img, { clearProps: "transform" });
      },
    });
  });
};

export const hoverScaleAnimation = (selector: string, scale = 1.05) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    (element as HTMLElement).addEventListener("mouseenter", () => {
      gsap.to(element, {
        duration: 0.3,
        scale: scale,
        ease: "power2.out",
      });
    });

    (element as HTMLElement).addEventListener("mouseleave", () => {
      gsap.to(element, {
        duration: 0.3,
        scale: 1,
        ease: "power2.out",
      });
    });
  });
};

export const animateButtonClick = (selector: string) => {
  const buttons = document.querySelectorAll(selector);
  buttons.forEach((btn) => {
    (btn as HTMLElement).addEventListener("click", function (e) {
      const rect = this.getBoundingClientRect();
      const x = (e as MouseEvent).clientX - rect.left;
      const y = (e as MouseEvent).clientY - rect.top;

      const ripple = document.createElement("span");
      ripple.style.position = "absolute";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.style.width = "0";
      ripple.style.height = "0";
      ripple.style.borderRadius = "50%";
      ripple.style.background = "rgba(255, 255, 255, 0.6)";
      ripple.style.transform = "translate(-50%, -50%)";
      ripple.style.pointerEvents = "none";

      (this as HTMLElement).style.position = "relative";
      (this as HTMLElement).style.overflow = "hidden";
      (this as HTMLElement).appendChild(ripple);

      gsap.to(ripple, {
        duration: 0.6,
        width: 400,
        height: 400,
        opacity: 0,
        ease: "power2.out",
        onComplete: () => ripple.remove(),
      });
    });
  });
};

export const parallaxEffect = (selector: string, speed = 0.5) => {
  const elements = document.querySelectorAll(selector);
  gsap.to(elements, {
    y: window.innerHeight * speed,
    scrollTrigger: {
      trigger: elements[0],
      start: "top top",
      end: "bottom center",
      scrub: 1,
    },
  });
};

export const staggerInAnimation = (selector: string, delayBetween = 0.1) => {
  const elements = document.querySelectorAll(selector);
  gsap.from(elements, {
    duration: 0.6,
    opacity: 0,
    y: 20,
    stagger: delayBetween,
    ease: "back.out(1.7)",
  });
};

export const pulseAnimation = (selector: string) => {
  gsap.to(selector, {
    duration: 2,
    scale: 1.05,
    opacity: 0.8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
};

export const fadeInOnScroll = (selector: string) => {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        once: true,
      },
      duration: 0.8,
      opacity: 0,
      ease: "power2.out",
    });
  });
};

export const animateNumberCounters = (selector = ".count-up") => {
  const counters = document.querySelectorAll<HTMLElement>(selector);

  counters.forEach((counter) => {
    const end = Number(counter.dataset.count);
    if (!Number.isFinite(end)) return;

    const decimals = Number(counter.dataset.decimals || 0);
    const prefix = counter.dataset.prefix || "";
    const suffix = counter.dataset.suffix || "";
    const formatValue = (value: number) =>
      `${prefix}${value.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    const state = { value: 0 };
    gsap.to(state, {
      scrollTrigger: {
        trigger: counter,
        start: "top 85%",
        once: true,
      },
      value: end,
      duration: 1.4,
      ease: "power2.out",
      onStart: () => {
        counter.textContent = formatValue(0);
      },
      onUpdate: () => {
        counter.textContent = formatValue(state.value);
      },
      onComplete: () => {
        counter.textContent = formatValue(end);
      },
    });
  });
};
