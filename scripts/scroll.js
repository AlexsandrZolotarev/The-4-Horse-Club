class Scroll {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      const buttons = document.querySelectorAll("[data-scroll]");
      buttons.forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const targetSelector = btn.dataset.scroll;
          const target = document.querySelector(targetSelector);
          if (!target) return;
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      });
    });
  }
}
class ScrollCollection {
  constructor() {
    new Scroll();
  }
}

export default ScrollCollection;
