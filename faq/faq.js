// FAQ Page JavaScript - Nexus Investment FX

document.addEventListener("DOMContentLoaded", function () {
  // Initialize FAQ functionality
  initFAQToggles();
  initCategoryFilter();
  initSearch();
  initScrollToTop();
});

/**
 * FAQ Toggle Functionality
 * Handles opening and closing of FAQ items
 */
function initFAQToggles() {
  const faqQuestions = document.querySelectorAll(".faq-question");

  faqQuestions.forEach((question) => {
    question.addEventListener("click", function () {
      const faqItem = this.closest(".faq-item");
      const isActive = faqItem.classList.contains("active");

      // Close all other FAQ items
      document.querySelectorAll(".faq-item.active").forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove("active");
          const btn = item.querySelector(".faq-question");
          btn.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current item
      if (isActive) {
        faqItem.classList.remove("active");
        this.setAttribute("aria-expanded", "false");
      } else {
        faqItem.classList.add("active");
        this.setAttribute("aria-expanded", "true");

        // Smooth scroll to item if it's below viewport
        setTimeout(() => {
          const rect = faqItem.getBoundingClientRect();
          const offset = 100; // Account for sticky nav

          if (rect.top < offset) {
            window.scrollTo({
              top: window.pageYOffset + rect.top - offset,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    });

    // Keyboard accessibility
    question.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        this.click();
      }
    });
  });
}

/**
 * Category Filter Functionality
 * Filters FAQ items by category
 */
function initCategoryFilter() {
  const categoryBtns = document.querySelectorAll(".category-btn");
  const faqCategories = document.querySelectorAll(".faq-category");

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const targetCategory = this.getAttribute("data-category");

      // Update active button
      categoryBtns.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");

      // Filter categories
      if (targetCategory === "all") {
        // Show all categories
        faqCategories.forEach((cat) => {
          cat.classList.remove("hidden");
          cat.style.display = "block";
        });
      } else {
        // Show only selected category
        faqCategories.forEach((cat) => {
          const categoryName = cat.getAttribute("data-category");

          if (categoryName === targetCategory) {
            cat.classList.remove("hidden");
            cat.style.display = "block";
          } else {
            cat.classList.add("hidden");
            cat.style.display = "none";
          }
        });
      }

      // Scroll to FAQ content
      const faqContent = document.querySelector(".faq-content-section");
      if (faqContent) {
        const offset = 120; // Account for sticky nav
        const targetPosition = faqContent.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }

      // Close all open FAQ items when switching categories
      document.querySelectorAll(".faq-item.active").forEach((item) => {
        item.classList.remove("active");
        const btn = item.querySelector(".faq-question");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  });
}

/**
 * Search Functionality
 * Searches through FAQ questions and answers
 */
function initSearch() {
  const searchInput = document.getElementById("faqSearch");

  if (!searchInput) return;

  let searchTimeout;

  searchInput.addEventListener("input", function () {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
      const searchTerm = this.value.toLowerCase().trim();

      // Reset category filter to "All" when searching
      if (searchTerm.length > 0) {
        const allBtn = document.querySelector(
          '.category-btn[data-category="all"]'
        );
        if (allBtn) {
          allBtn.click();
        }
      }

      performSearch(searchTerm);
    }, 300); // Debounce search
  });

  // Clear search on Escape key
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      this.value = "";
      performSearch("");
      this.blur();
    }
  });
}

/**
 * Perform search and highlight results
 */
function performSearch(searchTerm) {
  const faqItems = document.querySelectorAll(".faq-item");
  const faqCategories = document.querySelectorAll(".faq-category");
  let visibleCount = 0;

  if (searchTerm === "") {
    // Show all items
    faqItems.forEach((item) => {
      item.style.display = "block";
      removeHighlights(item);
    });

    faqCategories.forEach((cat) => {
      cat.style.display = "block";
    });

    hideNoResults();
    return;
  }

  // Search through items
  faqItems.forEach((item) => {
    const question = item
      .querySelector(".faq-question span")
      .textContent.toLowerCase();
    const answer = item.querySelector(".faq-answer").textContent.toLowerCase();

    removeHighlights(item);

    if (question.includes(searchTerm) || answer.includes(searchTerm)) {
      item.style.display = "block";
      highlightSearchTerm(item, searchTerm);
      visibleCount++;

      // Auto-expand if search term is in answer
      if (answer.includes(searchTerm) && !question.includes(searchTerm)) {
        item.classList.add("active");
        item
          .querySelector(".faq-question")
          .setAttribute("aria-expanded", "true");
      }
    } else {
      item.style.display = "none";
    }
  });

  // Show/hide categories based on visible items
  faqCategories.forEach((cat) => {
    const visibleItems = cat.querySelectorAll(
      '.faq-item[style*="display: block"]'
    );
    if (visibleItems.length > 0) {
      cat.style.display = "block";
    } else {
      cat.style.display = "none";
    }
  });

  // Show no results message if needed
  if (visibleCount === 0) {
    showNoResults(searchTerm);
  } else {
    hideNoResults();
  }
}

/**
 * Highlight search term in FAQ items
 */
function highlightSearchTerm(item, searchTerm) {
  const questionSpan = item.querySelector(".faq-question span");
  const answerDiv = item.querySelector(".faq-answer");

  // Highlight in question
  const questionText = questionSpan.textContent;
  const questionHTML = highlightText(questionText, searchTerm);
  questionSpan.innerHTML = questionHTML;

  // Highlight in answer (preserve structure)
  const answerParagraphs = answerDiv.querySelectorAll("p, li");
  answerParagraphs.forEach((p) => {
    const text = p.textContent;
    const highlightedHTML = highlightText(text, searchTerm);
    p.innerHTML = highlightedHTML;
  });
}

/**
 * Highlight text helper function
 */
function highlightText(text, searchTerm) {
  const regex = new RegExp(`(${escapeRegex(searchTerm)})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * Escape special characters in regex
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Remove highlights from FAQ items
 */
function removeHighlights(item) {
  const highlights = item.querySelectorAll(".highlight");
  highlights.forEach((highlight) => {
    const text = highlight.textContent;
    highlight.replaceWith(text);
  });
}

/**
 * Show no results message
 */
function showNoResults(searchTerm) {
  let noResultsDiv = document.querySelector(".no-results");

  if (!noResultsDiv) {
    noResultsDiv = document.createElement("div");
    noResultsDiv.className = "no-results";
    noResultsDiv.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
      </svg>
      <h3>No results found</h3>
      <p>We couldn't find any FAQs matching "<strong id="searchTermDisplay"></strong>"</p>
      <p>Try different keywords or <a href="contact.html">contact our support team</a> for help.</p>
    `;

    const faqContent = document.querySelector(".faq-content-container");
    faqContent.insertBefore(noResultsDiv, faqContent.firstChild);
  }

  document.getElementById("searchTermDisplay").textContent = searchTerm;
  noResultsDiv.classList.add("show");
}

/**
 * Hide no results message
 */
function hideNoResults() {
  const noResultsDiv = document.querySelector(".no-results");
  if (noResultsDiv) {
    noResultsDiv.classList.remove("show");
  }
}

/**
 * Scroll to top functionality
 * Smooth scroll to top when user scrolls down
 */
function initScrollToTop() {
  // Create scroll to top button
  const scrollBtn = document.createElement("button");
  scrollBtn.className = "scroll-to-top";
  scrollBtn.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 14l5-5 5 5z"/>
    </svg>
  `;
  scrollBtn.setAttribute("aria-label", "Scroll to top");
  document.body.appendChild(scrollBtn);

  // Add styles
  const style = document.createElement("style");
  style.textContent = `
    .scroll-to-top {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #05305c 0%, #0a4a8a 100%);
      color: #ffffff;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      box-shadow: 0 4px 15px rgba(5, 48, 92, 0.3);
    }

    .scroll-to-top.show {
      opacity: 1;
      visibility: visible;
    }

    .scroll-to-top:hover {
      transform: translateY(-5px);
      box-shadow: 0 6px 20px rgba(5, 48, 92, 0.4);
    }

    .scroll-to-top svg {
      width: 24px;
      height: 24px;
      fill: currentColor;
    }

    @media (max-width: 768px) {
      .scroll-to-top {
        width: 45px;
        height: 45px;
        bottom: 20px;
        right: 20px;
      }

      .scroll-to-top svg {
        width: 20px;
        height: 20px;
      }
    }
  `;
  document.head.appendChild(style);

  // Show/hide button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add("show");
    } else {
      scrollBtn.classList.remove("show");
    }
  });

  // Scroll to top on click
  scrollBtn.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

/**
 * Deep linking support
 * Allow direct links to specific FAQ items
 */
window.addEventListener("load", function () {
  const hash = window.location.hash;

  if (hash) {
    const targetId = hash.substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      const faqItem = targetElement.closest(".faq-item");

      if (faqItem) {
        // Activate the FAQ item
        faqItem.classList.add("active");
        const btn = faqItem.querySelector(".faq-question");
        btn.setAttribute("aria-expanded", "true");

        // Find and activate the correct category
        const category = faqItem.closest(".faq-category");
        if (category) {
          const categoryName = category.getAttribute("data-category");
          const categoryBtn = document.querySelector(
            `.category-btn[data-category="${categoryName}"]`
          );

          if (categoryBtn) {
            categoryBtn.click();
          }
        }

        // Scroll to the item
        setTimeout(() => {
          const offset = 120;
          const targetPosition = faqItem.offsetTop - offset;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }, 300);
      }
    }
  }
});

/**
 * Analytics tracking (optional)
 * Track which FAQs users are viewing
 */
function trackFAQView(questionText) {
  // Implement your analytics tracking here
  // Example: Google Analytics, Mixpanel, etc.
  console.log("FAQ viewed:", questionText);

  // Example Google Analytics tracking:
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', 'faq_view', {
  //     'event_category': 'FAQ',
  //     'event_label': questionText
  //   });
  // }
}

// Add tracking to FAQ clicks
document.addEventListener("click", function (e) {
  if (e.target.closest(".faq-question")) {
    const questionText = e.target
      .closest(".faq-question")
      .querySelector("span").textContent;
    trackFAQView(questionText);
  }
});

console.log("FAQ page initialized successfully");
