// Automatically update the footer copyright year.
const yearNode = document.getElementById("year");
if (yearNode) yearNode.textContent = new Date().getFullYear();

// Responsive mobile navigation.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const open = navigation.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
}

// Smooth scrolling for internal navigation links.
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", event => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;

    event.preventDefault();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });

    if (navigation && navigation.classList.contains("open")) {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation");
    }

    history.replaceState(null, "", id);
  });
});

// Reveal content when it enters the viewport.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("visible"));
}

// Highlight the navigation link for the section currently in view.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll(".nav-link").forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => sectionObserver.observe(section));
}

// Type the complete name slowly, one character at a time.
// The gradient belongs to the whole text, not to individual letters.
const animatedName = document.querySelector(".name-letter-animation");
if (animatedName) {
  const fullName = animatedName.getAttribute("aria-label") || animatedName.textContent.trim();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    animatedName.textContent = fullName;
    animatedName.classList.add("typing-done");
  } else {
    animatedName.textContent = "";
    let characterIndex = 0;
    const typingSpeed = 145; // Higher number = slower typing.

    const typeNextCharacter = () => {
      if (characterIndex < fullName.length) {
        animatedName.textContent += fullName.charAt(characterIndex);
        characterIndex += 1;
        window.setTimeout(typeNextCharacter, fullName.charAt(characterIndex - 1) === " " ? typingSpeed + 130 : typingSpeed);
      } else {
        animatedName.classList.add("typing-done");
      }
    };

    window.setTimeout(typeNextCharacter, 450);
  }
}

// Blue outlined cursor ring on devices with a fine pointer.
const customCursor = document.querySelector(".custom-cursor");
if (customCursor && window.matchMedia("(pointer: fine)").matches) {
  document.body.classList.add("has-custom-cursor");
  let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;
  window.addEventListener("mousemove", event => {
    cursorX = event.clientX;
    cursorY = event.clientY;
    customCursor.classList.add("cursor-visible");
  });
  window.addEventListener("mouseleave", () => customCursor.classList.remove("cursor-visible"));
  const moveRing = () => {
    ringX += (cursorX - ringX) * 0.2;
    ringY += (cursorY - ringY) * 0.2;
    customCursor.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(moveRing);
  };
  moveRing();
  document.querySelectorAll("a, button").forEach(item => {
    item.addEventListener("mouseenter", () => customCursor.classList.add("cursor-hover"));
    item.addEventListener("mouseleave", () => customCursor.classList.remove("cursor-hover"));
  });
}
