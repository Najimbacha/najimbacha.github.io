const menu = document.querySelector("#menu");
const mobileNav = document.querySelector("#mobile-nav");
function closeMenu() {
  mobileNav.hidden = true;
  menu.setAttribute("aria-expanded", "false");
  menu.querySelector("span").textContent = "+";
}
menu.addEventListener("click", () => {
  const open = menu.getAttribute("aria-expanded") !== "true";
  mobileNav.hidden = !open;
  menu.setAttribute("aria-expanded", String(open));
  menu.querySelector("span").textContent = open ? "−" : "+";
});
mobileNav.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;
  closeMenu();
  const destination = document.querySelector(link.hash);
  destination.setAttribute("tabindex", "-1");
  destination.focus({ preventScroll: true });
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !mobileNav.hidden) {
    closeMenu();
    menu.focus();
  }
});
matchMedia("(min-width: 768px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
document.querySelector("#year").textContent = new Date().getFullYear();
// Sample data powers this interactive concept, not a live recognition service.
const meals = [
  {
    name: "Avocado grain bowl",
    calories: 420,
    protein: 14,
    carbs: 52,
    fat: 18,
  },
  {
    name: "Grilled chicken bowl",
    calories: 510,
    protein: 38,
    carbs: 49,
    fat: 18,
  },
  { name: "Garden salad", calories: 280, protein: 8, carbs: 26, fat: 16 },
];
let mealIndex = 0;
document.querySelector("#meal-next").addEventListener("click", () => {
  const meal = meals[++mealIndex % meals.length];
  document.dispatchEvent(
    new CustomEvent("mealpreviewchange", { detail: mealIndex % meals.length }),
  );
  for (const key of ["name", "calories", "protein", "carbs", "fat"]) {
    document.querySelector(`#meal-${key}`).textContent =
      meal[key] + (["protein", "carbs", "fat"].includes(key) ? " g" : "");
  }
  if (!preference.matches) {
    document.querySelector(".scan-line").animate(
      [
        { transform: "translateY(-55px)", opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: "translateY(55px)", opacity: 0 },
      ],
      { duration: 650, easing: "cubic-bezier(.22,1,.36,1)" },
    );
    document.querySelector(".meal-result").animate(
      [
        { opacity: 0.3, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 300, easing: "ease-out" },
    );
  }
});
const preference = matchMedia("(prefers-reduced-motion: reduce)");
if ("IntersectionObserver" in window && !preference.matches) {
  document.documentElement.classList.add("js-motion");
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
  preference.addEventListener("change", (event) => {
    if (event.matches) {
      document.documentElement.classList.remove("js-motion");
      observer.disconnect();
    }
  });
}

// A single scheduled update for the reading indicator; native scrolling stays intact.
let progressFrame = 0;
function updateProgress() {
  progressFrame = 0;
  const distance = document.documentElement.scrollHeight - innerHeight;
  document.documentElement.style.setProperty(
    "--read",
    distance > 0 ? Math.min(scrollY / distance, 1) : 0,
  );
}
function scheduleProgress() {
  if (!progressFrame) progressFrame = requestAnimationFrame(updateProgress);
}
addEventListener("scroll", scheduleProgress, { passive: true });
addEventListener("resize", scheduleProgress);
updateProgress();
