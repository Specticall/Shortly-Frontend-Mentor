class Histories {
  #linkHistories = [];
  #containerHistories = document.querySelector(
    ".shorten__histories"
  );
  constructor() {
    this.#containerHistories.addEventListener(
      "click",
      this.#copyLink.bind(this)
    );
  }

  // Public API
  addLink(requestedLink, shortenedLink) {
    const newLink = new LinkHistory(
      requestedLink,
      shortenedLink
    );

    this.#linkHistories.push(newLink);
    this.#renderLink(newLink);
  }

  #renderLink({ requestedLink, shortenedLink, id }) {
    const html = `
    <div class="shorten__animate">
      <article class="shorten__history">
        <div class="shorten__history--left">
          <h3 class="text-medium text-black">
            ${requestedLink}
          </h3>
        </div>
        <div class="shorten__history--right">
          <div>
            <a href="${shortenedLink}" 
            target="_blank" 
            class="text-medium text-cyan shorten__link" 
            >
              ${shortenedLink}
            </a>
          </div>
          <button
            class="shorten__copy button button-small rounded-light button-cyan text-bold text-small"
          data-id=${id}>
            Copy
          </button>
        </div>
      </article>
    </div>
    `;

    // Check viewport size before animating
    this.#animateEntrance(html, this.#viewportSize);
  }

  async #animateEntrance(html, viewport) {
    const dummy = document.createElement("div");
    dummy.classList.add("slidedown-container");

    // 1.Insert dummy (for slide, position static)
    this.#containerHistories.insertAdjacentElement(
      "afterbegin",
      dummy
    );

    // 2. [await] Animate Dummy slide
    await new Promise((resolve) => {
      dummy.addEventListener("animationend", () => {
        dummy.style.height =
          viewport === "desktop" ? "5.2rem" : "10.2rem";
        resolve();
      });
    });

    // 3. Insert Actual Element (position absolute)
    this.#containerHistories.insertAdjacentHTML(
      "afterbegin",
      html
    );

    // 4. [await] Animate actual ELement
    const historyElement = document.querySelector(
      ".shorten__animate"
    );
    const historyElementChild = historyElement.children[0];
    const childElementWidth =
      dummy.getBoundingClientRect().width;

    await new Promise((resolve) => {
      // 4.1 find actual element width (in px)
      // We use the dummy element because the actual element width is at 0 (at this point of the code)
      // 4.2 set element width in rem
      historyElementChild.style.width = `${
        childElementWidth / 16
      }rem`;

      // 4.3 set container width to 100%
      historyElement.style.width = "100%";

      // 4.4
      // (Slide left animation is set to 0.5s (at the time of writing this))
      setTimeout((e) => {
        historyElementChild.style.width = "100%";
        resolve();
      }, 500);
    });

    // 5. element to position relative
    historyElement.style.position = "relative";

    // 6. remove dummy
    dummy.remove();
  }

  #copyLink(e) {
    const clicked = e.target.closest(".shorten__copy");
    if (
      !clicked ||
      !clicked.classList.contains("shorten__copy")
    )
      return;

    // Finds link
    const linkObject = this.#linkHistories.find(
      (history) => history.id === clicked.dataset.id
    );
    // Adds shortened link to clipboard
    navigator.clipboard.writeText(linkObject.shortenedLink);

    // Display the button flicker animation
    this.#copyLinkButtonFlicker(clicked);
  }

  #copyLinkButtonFlicker(clicked) {
    clicked.classList.add("button-copied-state");
    clicked.textContent = "Copied!";

    setTimeout(() => {
      clicked.classList.remove("button-copied-state");
      clicked.textContent = "Copy";
    }, 2000);
  }

  // Return the current viewport size;
  get #viewportSize() {
    return window.innerWidth > 780 ? "desktop" : "mobile";
  }
}

class LinkHistory {
  constructor(requestedLink, shortenedLink) {
    this.requestedLink = requestedLink;
    this.shortenedLink = shortenedLink;
    this.setId();
  }

  setId() {
    this.id = new Date().getTime().toString().slice(-8);
  }
}

export const linkHistories = new Histories();
