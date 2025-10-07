const rootSelector = ".participants";
const AUTOPLAY_MS = 4000;
const DESKTOP_Q = "(min-width: 1150.98px)"; 

class Participants {
  selectors = {
    button: "[data-js-participants-button]",
    content: "[data-js-participants-content]",
    numbers: "[data-js-participants-numbers]",
  };

  stateClasses = { isActive: "is-active" };

  constructor(rootElement) {
    this.root = rootElement;

    this.btns = this.root.querySelectorAll(this.selectors.button);
    this.items = Array.from(this.root.querySelectorAll(this.selectors.content));
    this.numbers = this.root.querySelector(this.selectors.numbers);
    this.currentEl = this.numbers?.querySelector(".pagination__current");
    this.totalEl = this.numbers?.querySelector(".pagination__total");

    this.mql = window.matchMedia(DESKTOP_Q);
    this.onResize = this.onResize.bind(this);

    this.page = 0;
    this.itemsPerView = this.calcItemsPerView();
    this.totalPages = this.calcTotalPages();

    this.render();
    this.bind();
    this.startAutoplay();
  }

  calcItemsPerView() {
    return this.mql.matches ? 3 : 1;
  }

  calcTotalPages() {
    return Math.max(1, Math.ceil(this.items.length / this.itemsPerView));
  }

  render() {
    const start = this.page * this.itemsPerView;
    const end = start + this.itemsPerView;

    this.items.forEach((li, i) => {
      const visible = i >= start && i < end;
      li.classList.toggle(this.stateClasses.isActive, visible);
      li.hidden = !visible;
      li.setAttribute("aria-hidden", String(!visible));
    });


    if (this.currentEl) this.currentEl.textContent = String(this.page + 1);
    if (this.totalEl) this.totalEl.textContent = String(this.totalPages);

    const [prevBtn, nextBtn] = this.btns;
    if (prevBtn) prevBtn.classList.add(this.stateClasses.isActive);
    if (nextBtn) nextBtn.classList.add(this.stateClasses.isActive);
  }

  goTo(nextPage) {
    this.page = ((nextPage % this.totalPages) + this.totalPages) % this.totalPages;
    this.render();
  }

  move(step) {
    this.goTo(this.page + step);
  }

  startAutoplay() {
    this.stopAutoplay();
    this.timer = setInterval(() => this.move(1), AUTOPLAY_MS);
  }
  stopAutoplay() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }
  restartAutoplay() {
    this.startAutoplay();
  }
  bind() {
    const [prevBtn, nextBtn] = this.btns;

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        this.move(-1);
        this.restartAutoplay();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        this.move(1);
        this.restartAutoplay();
      });
    }

    this.root.addEventListener("mouseenter", () => this.stopAutoplay());
    this.root.addEventListener("mouseleave", () => this.startAutoplay());
    this.root.addEventListener("focusin", () => this.stopAutoplay());
    this.root.addEventListener("focusout", () => this.startAutoplay());

    this.root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.move(1);
        this.restartAutoplay();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.move(-1);
        this.restartAutoplay();
      }
    });

   
    this.mql.addEventListener?.("change", this.onResize);
    window.addEventListener("resize", this.onResize);


    document.addEventListener("visibilitychange", () => {
      if (document.hidden) this.stopAutoplay();
      else this.startAutoplay();
    });
  }

  onResize = () => {
    const prevPerView = this.itemsPerView;
    this.itemsPerView = this.calcItemsPerView();

    if (prevPerView !== this.itemsPerView) {
      const firstVisibleIndex = this.page * prevPerView;
      this.totalPages = this.calcTotalPages();
      this.page = Math.floor(firstVisibleIndex / this.itemsPerView);
      if (this.page >= this.totalPages) this.page = this.totalPages - 1;
      this.render();
    }
  };
}

class ParticipantsCollection {
  constructor() {
    document.querySelectorAll(rootSelector).forEach((el) => new Participants(el));
  }
}

export default ParticipantsCollection;
