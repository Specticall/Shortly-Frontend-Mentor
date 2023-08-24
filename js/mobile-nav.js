class MobileMenuToggle {
  #navWrapper = document.querySelector(
    ".nav__mobile-wrapper"
  );
  #mobileIsOpen = false;

  constructor() {
    // Attach event listener to icon
    window.addEventListener("click", (e) => {
      // Uses propagation
      const clicked = e.target;

      this.autoCloseMenu(clicked);
      this.toggleMenu(clicked);
    });
  }

  // Open/Close by clicking the icon
  toggleMenu(clicked) {
    if (clicked.classList.contains("nav__toggle-mobile")) {
      this.#navWrapper.classList.toggle("mobile-open");
      this.#mobileIsOpen = !this.#mobileIsOpen;
    }
  }

  // Close the menu when clicking outside the modal.
  autoCloseMenu(clicked) {
    if (
      !clicked.closest(".nav__mobile-container") &&
      !clicked.classList.contains("nav__toggle-mobile") &&
      this.#mobileIsOpen
    ) {
      this.#navWrapper.classList.remove("mobile-open");
      this.#mobileIsOpen = !this.#mobileIsOpen;
    }
  }
}

const mobileToggle = new MobileMenuToggle();
