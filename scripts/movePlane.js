const ROOT_SELECTOR = ".stages-transformation";

class StagesAirplane {
  selectors = {
    airplane: ".stages-transformation__airplane",
  };

  stateClasses = {
    inview: "is-inview",
    animating: "is-animating",
  };

  constructor(rootElement, opts = {}) {
    this.root = rootElement;
    this.opts = { toggle: false, threshold: 0.25, ...opts };

    this.plane = this.root.querySelector(this.selectors.airplane);
    if (!this.plane) return;

    this.onIntersect = this.onIntersect.bind(this);
    this.onTransitionEnd = this.onTransitionEnd.bind(this);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      this.root.classList.add(this.stateClasses.inview);
      return;
    }

    this.setupObserver();
  }

  setupObserver() {
    if (!("IntersectionObserver" in window)) {
      this.root.classList.add(this.stateClasses.inview);
      return;
    }

    this.io = new IntersectionObserver(this.onIntersect, {
      root: null,
      threshold: this.opts.threshold,
      rootMargin: "0px 0px -10% 0px",
    });

    this.io.observe(this.root);
  }

  onIntersect(entries) {
    entries.forEach((entry) => {
      this.plane.classList.add(this.stateClasses.animating);
      this.plane.addEventListener("transitionend", this.onTransitionEnd, {
        once: true,
      });

      if (entry.isIntersecting) {
        this.root.classList.add(this.stateClasses.inview);
        if (!this.opts.toggle) {
          this.io?.unobserve(this.root);
        }
      } else if (this.opts.toggle) {
        this.root.classList.remove(this.stateClasses.inview);
      }
    });
  }

  onTransitionEnd(e) {
    if (e.target !== this.plane) return;
    this.plane.classList.remove(this.stateClasses.animating);
  }

  destroy() {
    this.io?.disconnect();
  }
}

class StagesAirplaneCollection {
  constructor(opts = {}) {
    this.instances = [];
    document.querySelectorAll(ROOT_SELECTOR).forEach((el) => {
      const inst = new StagesAirplane(el, opts);
      this.instances.push(inst);
    });
  }
}

export default StagesAirplaneCollection;
