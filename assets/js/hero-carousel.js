(() => {
  "use strict";

  const carousel = document.querySelector("#heroCarousel");
  if (!carousel) return;

  const slides = [...carousel.querySelectorAll("[data-hero-slide]")];
  const dots = [...carousel.querySelectorAll("[data-hero-dot]")];
  const indexLabel = carousel.querySelector(".banner-index");
  const previousButton = carousel.querySelector("[data-hero-prev]");
  const nextButton = carousel.querySelector("[data-hero-next]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const interval = 7000;
  let currentIndex = 0;
  let timer;

  function showSlide(index, restart = true) {
    currentIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === currentIndex;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
    });

    dots.forEach((dot, dotIndex) => {
      const isActive = dotIndex === currentIndex;
      dot.classList.toggle("is-active", isActive);
      if (isActive) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });

    indexLabel.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    if (restart) startAutoPlay();
  }

  function stopAutoPlay() {
    window.clearInterval(timer);
  }

  function startAutoPlay() {
    stopAutoPlay();
    if (reducedMotion.matches || document.hidden) return;
    timer = window.setInterval(() => showSlide(currentIndex + 1, false), interval);
  }

  previousButton.addEventListener("click", () => showSlide(currentIndex - 1));
  nextButton.addEventListener("click", () => showSlide(currentIndex + 1));
  dots.forEach((dot) => {
    dot.addEventListener("click", () => showSlide(Number(dot.dataset.heroDot)));
  });

  carousel.addEventListener("mouseenter", stopAutoPlay);
  carousel.addEventListener("mouseleave", startAutoPlay);
  carousel.addEventListener("focusin", stopAutoPlay);
  carousel.addEventListener("focusout", (event) => {
    if (!carousel.contains(event.relatedTarget)) startAutoPlay();
  });
  document.addEventListener("visibilitychange", startAutoPlay);
  reducedMotion.addEventListener?.("change", startAutoPlay);

  showSlide(0);
})();
