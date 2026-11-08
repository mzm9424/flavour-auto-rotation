(() => {
  "use strict";

  // Replace or edit these entries to add your own flavours.
  // The image URLs below are taken from the flavour slider source you provided.
  const flavours = [
    {
      name: "Kiwi",
      image: "https://lightslategray-goshawk-148039.hostingersite.com/wp-content/uploads/2026/07/bolw-4-1.png",
      background: "radial-gradient(circle at 50% 43%, #315c30 0%, #18321e 50%, #17110f 100%)",
      description: "A bright, fresh and fruity favourite, made for a deliciously memorable treat."
    },
    {
      name: "Blackberry",
      image: "https://lightslategray-goshawk-148039.hostingersite.com/wp-content/uploads/2026/07/Bolw-2-1.png",
      background: "radial-gradient(circle at 50% 43%, #51206d 0%, #291338 52%, #17110f 100%)",
      description: "Deep, rich and beautifully juicy, with a golden lattice crust and a delicate sweet crunch."
    },
    {
      name: "Banana",
      image: "https://lightslategray-goshawk-148039.hostingersite.com/wp-content/uploads/2026/07/Bolw-3-1.png",
      background: "radial-gradient(circle at 50% 43%, #8a5b0b 0%, #49300e 52%, #17110f 100%)",
      description: "A smooth, golden and comforting flavour with a naturally sweet finish."
    },
    {
      name: "Strawberry",
      image: "https://lightslategray-goshawk-148039.hostingersite.com/wp-content/uploads/2026/07/Bolw-1-1.png",
      background: "radial-gradient(circle at 50% 43%, #8b2440 0%, #481326 52%, #17110f 100%)",
      description: "A buttery golden crust filled with vibrant, juicy strawberries for a sweet, fruity delight."
    }
  ];

  const ROTATION_DELAY = 4000;
  const TRANSITION_TIME = 520;

  const carousel = document.getElementById("carousel");
  const ring = document.getElementById("flavour-ring");
  const pieImage = document.getElementById("pie-image");
  const title = document.getElementById("flavour-title");
  const description = document.getElementById("flavour-description");
  const kicker = document.getElementById("slide-kicker");
  const currentCount = document.getElementById("current-count");
  const totalCount = document.getElementById("total-count");
  const prevButton = document.getElementById("prev-btn");
  const nextButton = document.getElementById("next-btn");
  const pauseButton = document.getElementById("pause-btn");
  const pauseLabel = document.getElementById("pause-label");
  const slideCopy = document.querySelector(".slide-copy");

  if (!carousel || !ring || !pieImage || flavours.length === 0) return;

  let currentIndex = 0;
  let rotationTimer = null;
  let isPaused = false;
  let isHovering = false;
  let isFocused = false;
  let isTouching = false;
  let isTransitioning = false;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const pad = number => String(number).padStart(2, "0");

  function buildRing() {
    ring.innerHTML = "";

    flavours.forEach((flavour, index) => {
      const button = document.createElement("button");
      const angle = (360 / flavours.length) * index - 90;

      button.type = "button";
      button.className = "flavour-choice";
      button.textContent = flavour.name;
      button.dataset.index = index;
      button.style.setProperty("--angle", `${angle}deg`);
      button.setAttribute("aria-label", `Show ${flavour.name} flavour`);
      button.addEventListener("click", () => {
        if (index !== currentIndex) showFlavour(index, true);
      });

      ring.appendChild(button);
    });

    totalCount.textContent = pad(flavours.length);
  }

  function updateRing() {
    ring.querySelectorAll(".flavour-choice").forEach((button, index) => {
      const active = index === currentIndex;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function showFlavour(index, userInitiated = false) {
    if (isTransitioning || index === currentIndex) {
      if (userInitiated) resetRotation();
      return;
    }

    isTransitioning = true;
    currentIndex = (index + flavours.length) % flavours.length;
    const flavour = flavours[currentIndex];

    pieImage.classList.add("is-changing");
    slideCopy.classList.add("is-changing");

    window.setTimeout(() => {
      pieImage.onload = () => {
        pieImage.classList.remove("is-changing");
      };
      pieImage.onerror = () => {
        pieImage.classList.remove("is-changing");
        pieImage.alt = `${flavour.name} image could not be loaded. Check the image URL in script.js.`;
      };

      pieImage.src = flavour.image;
      pieImage.alt = `${flavour.name} pie`;
      title.textContent = flavour.name;
      description.textContent = flavour.description;
      kicker.textContent = "OUR SIGNATURE FLAVOUR";
      carousel.style.setProperty("--active-bg", flavour.background);
      currentCount.textContent = pad(currentIndex + 1);
      updateRing();
      slideCopy.classList.remove("is-changing");

      window.setTimeout(() => {
        isTransitioning = false;
        if (userInitiated) resetRotation();
      }, TRANSITION_TIME);
    }, 220);
  }

  function shouldRotate() {
    return !isPaused && !isHovering && !isFocused && !isTouching &&
      !document.hidden && !prefersReducedMotion.matches;
  }

  function stopRotation() {
    if (rotationTimer !== null) {
      window.clearTimeout(rotationTimer);
      rotationTimer = null;
    }
  }

  function scheduleRotation() {
    stopRotation();
    if (!shouldRotate()) return;

    rotationTimer = window.setTimeout(() => {
      if (!isTransitioning && shouldRotate()) {
        showFlavour((currentIndex + 1) % flavours.length);
      }
      scheduleRotation();
    }, ROTATION_DELAY);
  }

  function resetRotation() {
    stopRotation();
    scheduleRotation();
  }

  prevButton.addEventListener("click", () => {
    showFlavour((currentIndex - 1 + flavours.length) % flavours.length, true);
  });

  nextButton.addEventListener("click", () => {
    showFlavour((currentIndex + 1) % flavours.length, true);
  });

  pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseButton.setAttribute("aria-pressed", String(isPaused));
    pauseLabel.textContent = isPaused ? "Resume rotation" : "Pause rotation";
    pauseButton.querySelector(".pause-icon").textContent = isPaused ? "▶" : "Ⅱ";
    resetRotation();
  });

  carousel.addEventListener("mouseenter", () => {
    isHovering = true;
    stopRotation();
  });
  carousel.addEventListener("mouseleave", () => {
    isHovering = false;
    resetRotation();
  });

  carousel.addEventListener("focusin", () => {
    isFocused = true;
    stopRotation();
  });
  carousel.addEventListener("focusout", event => {
    if (!carousel.contains(event.relatedTarget)) {
      isFocused = false;
      resetRotation();
    }
  });

  carousel.addEventListener("touchstart", () => {
    isTouching = true;
    stopRotation();
  }, { passive: true });

  carousel.addEventListener("touchend", () => {
    isTouching = false;
    resetRotation();
  }, { passive: true });

  carousel.addEventListener("touchcancel", () => {
    isTouching = false;
    resetRotation();
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopRotation();
    else resetRotation();
  });

  prefersReducedMotion.addEventListener?.("change", resetRotation);

  // Preload images to reduce the delay between flavour changes.
  flavours.forEach(flavour => {
    const image = new Image();
    image.src = flavour.image;
  });

  buildRing();
  updateRing();
  carousel.style.setProperty("--active-bg", flavours[0].background);
  currentCount.textContent = "01";
  scheduleRotation();
})();
