import { linkHistories } from "./link-history";

class ShortenLink {
  #shortenInput = document.querySelector(".shorten__input");
  #shortenSubmit = document.querySelector(
    ".shorten__submit"
  );
  #shortenInputWarning = document.querySelector(
    ".shorted__input-warning"
  );
  #loadIcon = document.querySelector(".loading-link");

  constructor() {
    this.#shortenSubmit.addEventListener(
      "click",
      this.#submitLink.bind(this)
    );
  }

  async #submitLink(e) {
    // Stops the form from submitting
    e.preventDefault();

    // Retrieves the typed in link.
    // TEMPORARY
    const requestedLink = this.#shortenInput.value;

    // Display error if empty
    if (requestedLink.length === 0) {
      this.#displayError("Please add a link");
      return;
    }

    // Load & Icons and fetch the link from API
    this.#switchToLoadIcon();
    const returnedLink = await this.getShortenedLink(
      requestedLink
    );
    this.#switchToSubmitButton();

    // Invalid Link
    if (!returnedLink) {
      this.#displayError(
        "Invalid link, Please try a different link"
      );
      return;
    }

    // Reset input
    this.#shortenInput.value = "";

    linkHistories.addLink(requestedLink, returnedLink);
  }

  async getShortenedLink(requestedLink) {
    try {
      const shortenedLinkJson = await fetch(
        `https://api.shrtco.de/v2/shorten?url=${requestedLink}`
      );
      const { result: shortenedLink } =
        await shortenedLinkJson.json();

      return shortenedLink.full_short_link;
    } catch (error) {
      return false;
    }
  }

  #switchToLoadIcon() {
    this.#loadIcon.style.display = "grid";
    this.#shortenSubmit.style.display = "none";
  }

  #switchToSubmitButton() {
    this.#loadIcon.style.display = "none";
    this.#shortenSubmit.style.display = "initial";
  }

  #displayError(errorMsg) {
    this.#shortenInputWarning.textContent = errorMsg;
    this.#shortenInputWarning.style.display = "flex";
    this.#shortenInput.style.outline = "2px solid red";
    this.#shortenInput.focus();

    setTimeout(() => {
      this.#shortenInputWarning.style.display = "none";
      this.#shortenInput.style.outline = "none";
    }, 2000);
  }
}

const shorten = new ShortenLink();
