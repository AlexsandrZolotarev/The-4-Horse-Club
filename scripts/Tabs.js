const rootSelector = "[data-js-tabs]";

class Tabs {
  selectors = {
    root: rootSelector,
    button: "[data-js-tabs-button]",
    content: "[data-js-tabs-content]",
    dots: "[data-js-tabs-dots]",
  };

  stateClasses = {
    isActive: "is-active",
  };

  stateAttributes = {
    ariaSelected: "aria-selected",
    tabIndex: "tabindex",
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.buttonElements = this.rootElement.querySelectorAll(
      this.selectors.button
    );
    this.contentElements = Array.from(
      this.rootElement.querySelectorAll(this.selectors.content)
    );
    this.dotsContainer = this.rootElement.querySelector(this.selectors.dots);
    this.dotElements = this.dotsContainer
      ? Array.from(this.dotsContainer.children)
      : [];
    this.limitTabsIndex = this.dotElements.length - 1;

    const initialDotIndex =
      this.dotElements.findIndex((d) =>
        d.classList.contains(this.stateClasses.isActive)
      ) ?? 0;

    this.state = {
      activeTabIndex: initialDotIndex >= 0 ? initialDotIndex : 0,
    };

    this.setActiveDot(this.state.activeTabIndex, { syncOnly: true });
    this.bindEvents();
  }

  getActiveDotIndex() {
    const index = this.dotElements.findIndex((d) =>
      d.classList.contains(this.stateClasses.isActive)
    );
    return index === -1 ? 0 : index;
  }

  setActiveDot(index, opts = { syncOnly: false }) {
    const next = Math.min(Math.max(index, 0), this.limitTabsIndex);

    this.dotElements.forEach((dot, i) => {
      dot.classList.toggle(this.stateClasses.isActive, i === next);
      dot.setAttribute(this.stateAttributes.ariaSelected, String(i === next));
      dot.setAttribute(this.stateAttributes.tabIndex, i === next ? "0" : "-1");
    });

    this.contentElements.forEach((panel, i) => {
      panel.classList.toggle(this.stateClasses.isActive, i === next);
    });

    const [prevBtn, nextBtn] = this.buttonElements;
    if (prevBtn) {
      prevBtn.disabled = next === 0;
      prevBtn.classList.toggle(this.stateClasses.isActive, next > 0);
    }
    if (nextBtn) {
      nextBtn.disabled = next === this.limitTabsIndex;
      nextBtn.classList.toggle(
        this.stateClasses.isActive,
        next < this.limitTabsIndex
      );
    }

    this.state.activeTabIndex = next;

    if (!opts.syncOnly) {
      this.dotElements[next]?.focus?.();
    }
  }

  move(step) {
    const current = this.getActiveDotIndex();
    this.setActiveDot(current + step);
  }

  bindEvents() {
    const [prevBtn, nextBtn] = this.buttonElements;
    if (prevBtn) prevBtn.addEventListener("click", () => this.move(-1));
    if (nextBtn) nextBtn.addEventListener("click", () => this.move(1));

    if (this.dotsContainer) {
      this.dotsContainer.addEventListener("click", (e) => {
        const btn = e.target.closest(".dot");
        if (!btn) return;
        const index = this.dotElements.indexOf(btn);
        if (index >= 0) this.setActiveDot(index);
      });

      this.dotsContainer.addEventListener("keydown", (e) => {
        const key = e.key;
        if (key === "ArrowRight") {
          e.preventDefault();
          this.move(1);
        } else if (key === "ArrowLeft") {
          e.preventDefault();
          this.move(-1);
        } else if (key === "Home") {
          e.preventDefault();
          this.setActiveDot(0);
        } else if (key === "End") {
          e.preventDefault();
          this.setActiveDot(this.limitTabsIndex);
        }
      });
    }

    this.rootElement.addEventListener("keydown", (e) => {
      if (e.target.closest(".dot")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        this.move(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        this.move(-1);
      }
    });
  }
}

class TabsColletion {
  constructor() {
    this.init();
  }
  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element);
    });
  }
}

export default TabsColletion;
