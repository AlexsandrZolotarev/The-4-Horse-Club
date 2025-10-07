const ROOT_SELECTOR = ".event-promo__grandmaster.grandmaster";

class GrandmasterFX {
  selectors = {
    hand: ".grandmaster__hand",
    horse: ".grandmaster__bang-horse",
    vector: ".grandmaster__bang-vector",
  };

  state = {
    inview: "is-inview",
    swinging: "is-swinging",
    impact: "is-impact",
    locked: false,
  };

  constructor(root) {
    this.root = root;
    this.hand = root.querySelector(this.selectors.hand);
    this.horse = root.querySelector(this.selectors.horse);
    this.vector = root.querySelector(this.selectors.vector);

    if (!this.hand || !this.horse || !this.vector) return;

    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);
    this.onHandDone = this.onHandDone.bind(this);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      this.root.classList.add(this.state.inview, this.state.impact); // всё видно без анимаций
      return;
    }

    this.setupObserver();
  }

  setupObserver() {
    if (!("IntersectionObserver" in window)) {
      this.root.classList.add(this.state.inview);
      this.bindHover();
      return;
    }
    this.io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.root.classList.add(this.state.inview);
            this.bindHover();
          } else {
            this.root.classList.remove(this.state.inview, this.state.impact);
            this.unbindHover();
          }
        });
      },
      { threshold: 0.2 }
    );

    this.io.observe(this.root);
  }

  bindHover() {
    if (this._hoverBound) return;
    this.root.addEventListener("mouseenter", this.onEnter);
    this.root.addEventListener("mouseleave", this.onLeave);
    this._hoverBound = true;
  }

  unbindHover() {
    if (!this._hoverBound) return;
    this.root.removeEventListener("mouseenter", this.onEnter);
    this.root.removeEventListener("mouseleave", this.onLeave);
    this._hoverBound = false;
  }

  onEnter() {
    if (this.state.locked) return;
    this.state.locked = true;

    this.hand.classList.add(this.state.swinging);
    this.hand.addEventListener("animationend", this.onHandDone, { once: true });
  }

  onHandDone(e) {
    if (e.target !== this.hand) return;
    this.root.classList.add(this.state.impact);

    this.hand.classList.remove(this.state.swinging);
    window.setTimeout(() => {
      this.state.locked = false;
    }, 500);
  }

  onLeave() {
    this.root.classList.remove(this.state.impact);
  }

  destroy() {
    this.unbindHover();
    this.io?.disconnect();
  }
}

class GrandmasterFXCollection {
  constructor() {
    this.instances = [];
    document.querySelectorAll(ROOT_SELECTOR).forEach((el) => {
      const inst = new GrandmasterFX(el);
      this.instances.push(inst);
    });
  }
}

export default GrandmasterFXCollection;
