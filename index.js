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

// ROI CALCULATOR SCRIPT
const investmentInput = document.getElementById("investmentAmount");
const calculateBtn = document.getElementById("calculateBtn");
const roiResults = document.getElementById("roiResults");

// Investment plans data: [dailyReturn%, duration]
const investmentPlans = {
  ultraDeluxe: { dailyReturn: 0.35, duration: 5, min: 3500, max: 9999 },
  premium: { dailyReturn: 0.45, duration: 7, min: 10000, max: 19999 },
  gold: { dailyReturn: 0.5, duration: 14, min: 20000, max: 49999 },
  ultimate: { dailyReturn: 0.75, duration: 21, min: 50000, max: 74999 },
  platinum: { dailyReturn: 0.85, duration: 30, min: 75000, max: 99999 },
  vip: { dailyReturn: 0.9, duration: 60, min: 100000, max: 999999 },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function validateAmount(amount) {
  // Validate input
  const numAmount = parseFloat(amount);
  const validationMessage = document.getElementById("validationMessage");

  // Hide all cards first
  const allCards = document.querySelectorAll(".roi-card");
  allCards.forEach((card) => {
    card.classList.remove("active");
  });

  // Check for empty input
  if (!amount || amount.trim() === "") {
    validationMessage.classList.remove("show", "error", "warning", "success");
    return false;
  }

  // Check if amount is below minimum
  if (numAmount < 3500) {
    validationMessage.textContent = `⚠️ Minimum investment amount is $3,500. Please enter at least $3,500.`;
    validationMessage.classList.remove("success", "warning");
    validationMessage.classList.add("show", "error");
    return false;
  }

  // Check if amount is above maximum
  if (numAmount > 999999) {
    validationMessage.textContent = `⚠️ Maximum investment amount is $999,999. Please enter an amount not exceeding $999,999.`;
    validationMessage.classList.remove("success", "warning");
    validationMessage.classList.add("show", "error");
    return false;
  }

  return true;
}

function displayResults(amount) {
  // Display results after validation passes
  const numAmount = parseFloat(amount);
  const validationMessage = document.getElementById("validationMessage");

  // Show success message
  validationMessage.textContent = `✓ Valid investment amount. Select your preferred plan.`;
  validationMessage.classList.remove("error", "warning");
  validationMessage.classList.add("show", "success");

  // Find and show matching plan(s)
  Object.keys(investmentPlans).forEach((plan) => {
    const planData = investmentPlans[plan];

    // Check if amount falls within this plan's range
    if (numAmount >= planData.min && numAmount <= planData.max) {
      // Show the matching card
      const card = document.querySelector(`[data-plan="${plan}"]`);
      if (card) {
        card.classList.add("active");
      }

      // Calculate daily profit
      const dailyProfit = numAmount * planData.dailyReturn;

      // Calculate total profit over duration
      const totalProfit = dailyProfit * planData.duration;

      // Update DOM elements
      document.getElementById(`${plan}Daily`).textContent =
        formatCurrency(dailyProfit);
      document.getElementById(`${plan}Total`).textContent =
        formatCurrency(totalProfit);
    }
  });
}

// Button click event listener
if (calculateBtn) {
  calculateBtn.addEventListener("click", () => {
    const amount = investmentInput.value;

    // Validate input first
    const isValid = validateAmount(amount);

    // If invalid, don't show loading state
    if (!isValid) {
      return;
    }

    // Start loading state
    calculateBtn.disabled = true;
    calculateBtn.classList.add("loading");
    calculateBtn.innerHTML = '<span class="spinner"></span> Calculating';

    // After 5 seconds, display results and reset button
    setTimeout(() => {
      displayResults(amount);
      calculateBtn.disabled = false;
      calculateBtn.classList.remove("loading");
      calculateBtn.textContent = "Calculate Returns";
    }, 5000);
  });
}

// Allow Enter key to trigger calculation
if (investmentInput) {
  investmentInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const amount = investmentInput.value;

      // Validate input first
      const isValid = validateAmount(amount);

      // If invalid, don't show loading state
      if (!isValid) {
        return;
      }

      // Start loading state
      calculateBtn.disabled = true;
      calculateBtn.classList.add("loading");
      calculateBtn.innerHTML = '<span class="spinner"></span> Calculating';

      // After 5 seconds, display results and reset button
      setTimeout(() => {
        displayResults(amount);
        calculateBtn.disabled = false;
        calculateBtn.classList.remove("loading");
        calculateBtn.textContent = "Calculate Returns";
      }, 5000);
    }
  });
}

const tickerTrack = document.getElementById("tickerTrack");

// Fixed top coins (stable & predictable)
const coins = [
  "bitcoin",
  "ethereum",
  "tether",
  "binancecoin",
  "ripple",
  "usd-coin",
  "solana",
  "tron",
  "litecoin",
  "dogecoin",
  "staked-ether",
];

async function loadTopCoins() {
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coins.join(
        ","
      )}&order=market_cap_desc&sparkline=false&price_change_percentage=24h`
    );

    const data = await response.json();

    let html = "";

    data.forEach((coin) => {
      const isUp = coin.price_change_percentage_24h >= 0;
      const cls = isUp ? "price-up" : "price-down";
      const arrow = isUp ? "▲" : "▼";

      html += `
        <div class="ticker-item">
          <img src="${coin.image}" alt="${coin.name} Logo" />
          <span class="coin-name">${coin.name}</span>
          <span class="coin-price ${cls}">
            $${coin.current_price.toLocaleString()} ${arrow}
            ${coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </div>
      `;
    });

    // Duplicate items for continuous seamless scrolling
    tickerTrack.innerHTML = html + html;
  } catch (err) {
    tickerTrack.innerHTML = "Error loading prices.";
    console.error("Ticker error:", err);
  }
}

// Initial load
loadTopCoins();

// Refresh every 30 seconds
setInterval(loadTopCoins, 30000);

// MESSAGE ROTATION SCRIPT - SLIDE IN AND OUT ANIMATIONS
const slides = document.querySelectorAll(".message-slide");
let currentIndex = 0;
const displayTime = 8000; // 8 seconds display time
const animationDuration = 800; // Animation duration in milliseconds

function showSlide(index) {
  // Remove all animation classes and reset
  slides.forEach((slide) => {
    slide.classList.remove("active");
    slide.classList.remove(
      "slide-in-left",
      "slide-out-left",
      "slide-in-right",
      "slide-out-right"
    );
  });

  const activeSlide = slides[index];
  activeSlide.classList.add("active");

  // First slide slides in from left, second from right
  if (index === 0) {
    activeSlide.classList.add("slide-in-left");
  } else {
    activeSlide.classList.add("slide-in-right");
  }

  // After display time, slide out
  setTimeout(() => {
    // Remove slide-in class before adding slide-out
    if (index === 0) {
      activeSlide.classList.remove("slide-in-left");
      activeSlide.classList.add("slide-out-left");
    } else {
      activeSlide.classList.remove("slide-in-right");
      activeSlide.classList.add("slide-out-right");
    }

    // After slide out animation completes, show next slide
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % slides.length;
      showSlide(currentIndex);
    }, animationDuration);
  }, displayTime);
}

// Start the slide rotation
showSlide(currentIndex);

// TESTIMONIALS CAROUSEL SCRIPT
const testimonialItems = document.querySelectorAll(".testimonial-item");
const testimonialsContainer = document.querySelector(".testimonials-container");
let currentTestimonialIndex = 0;
let testimonialInterval;
const TESTIMONIAL_DISPLAY_TIME = 10000; // 10 seconds

function showTestimonial(index) {
  // Remove active class from all testimonials
  testimonialItems.forEach((item) => item.classList.remove("active"));

  // Add active class to current testimonial
  const currentTestimonial = testimonialItems[index];
  currentTestimonial.classList.add("active");

  // Update dot indicators if they exist
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot) => dot.classList.remove("active"));
  if (dots[index]) {
    dots[index].classList.add("active");
  }
}

function nextTestimonial() {
  currentTestimonialIndex =
    (currentTestimonialIndex + 1) % testimonialItems.length;
  showTestimonial(currentTestimonialIndex);
}

function startTestimonialAutoPlay() {
  testimonialInterval = setInterval(nextTestimonial, TESTIMONIAL_DISPLAY_TIME);
}

function stopTestimonialAutoPlay() {
  clearInterval(testimonialInterval);
}

// Initialize testimonials
if (testimonialItems.length > 0) {
  showTestimonial(0);
  startTestimonialAutoPlay();

  // Pause on hover over testimonial
  testimonialsContainer.addEventListener("mouseenter", () => {
    stopTestimonialAutoPlay();
  });

  // Resume on mouse leave
  testimonialsContainer.addEventListener("mouseleave", () => {
    startTestimonialAutoPlay();
  });

  // Click dot indicator to show specific testimonial
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentTestimonialIndex = index;
      showTestimonial(index);
      stopTestimonialAutoPlay();
      startTestimonialAutoPlay();
    });
  });
}

// NAVIGATION ACTIVE STATE
document.addEventListener("DOMContentLoaded", () => {
  const navItems = document.querySelectorAll(".nav-links li");
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  navItems.forEach((li) => {
    const link = li.querySelector("a");
    if (!link) return;

    const href = link.getAttribute("href");

    if (href === currentPage) {
      li.classList.add("active");
    }
  });
});
