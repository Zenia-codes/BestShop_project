const menuLinks = document.querySelectorAll(".navigation_menu a");
const menu = document.querySelector(".navigation_menu");
const button = document.querySelector(".menu_button");

function closeMenu() {
  menu.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");
  button.setAttribute("aria-label", "Open menu");
}

function openMenu() {
  menu.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");
  button.setAttribute("aria-label", "Close menu");
}

menuLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

button.addEventListener("click", () => {
  const isOpen = button.getAttribute("aria-expanded") === "true";
  isOpen ? closeMenu() : openMenu();
});

// zavření menu odkudkoli na stránce
document.addEventListener("click", (e) => {
  if (!menu.contains(e.target) && !button.contains(e.target)) {
    closeMenu();
  }
});
