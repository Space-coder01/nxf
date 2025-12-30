// Mobile Menu Toggle Functionality
const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const navContainer = document.getElementById("navContainer");

// Function to disable body scroll
function disableScroll() {
  document.body.style.overflow = "hidden";
}

// Function to enable body scroll
function enableScroll() {
  document.body.style.overflow = "";
}

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenuToggle.classList.toggle("active");
    navContainer.classList.toggle("active");

    // Toggle scroll based on menu state
    if (navContainer.classList.contains("active")) {
      disableScroll();
    } else {
      enableScroll();
    }
  });
}

// Close mobile menu when a link is clicked
const navLinks = document.querySelectorAll(".nav-links a, .auth-links a");
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenuToggle.classList.remove("active");
    navContainer.classList.remove("active");
    enableScroll(); // Re-enable scroll when nav link is clicked
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("header")) {
    mobileMenuToggle.classList.remove("active");
    navContainer.classList.remove("active");
    enableScroll(); // Re-enable scroll when clicking outside
  }
});
