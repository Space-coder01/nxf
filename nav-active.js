// NAVIGATION ACTIVE STATE
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-links li");
  const currentPage =
    window.location.pathname.split("/").pop() || "index.html";

  navItems.forEach(li => {
    const link = li.querySelector("a");
    if (!link) return;

    const href = link.getAttribute("href");

    if (href === currentPage) {
      li.classList.add("active");
    }
  });
});
