document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.getElementById("primary-nav");
  if (!toggleBtn || !nav) return;

  const icon = toggleBtn.querySelector("i");

  function setOpen(isOpen) {
    nav.setAttribute("data-open", isOpen ? "true" : "false");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    if (icon) {
      icon.classList.toggle("fa-bars", !isOpen);
      icon.classList.toggle("fa-xmark", isOpen);
    }
  }

  document.addEventListener("portfolio:close-navigation", () => setOpen(false));

  setOpen(false);

  toggleBtn.addEventListener("click", () => {
    const open = nav.getAttribute("data-open") === "true";
    setOpen(!open);
  });

  document.addEventListener("click", (e) => {
    const isClickInside = nav.contains(e.target) || toggleBtn.contains(e.target);
    if (!isClickInside && nav.getAttribute("data-open") === "true") {
      setOpen(false);
    }
  });
});
