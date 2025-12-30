// Counter animation for statistics cards
document.addEventListener("DOMContentLoaded", function () {
  // Get all statistics cards
  const statisticsCards = document.querySelectorAll(".statistics-card");

  // Configuration
  const animationDuration = 1000; // 1 seconds in milliseconds
  const frameRate = 60; // frames per second

  // Define the statistics data
  const statisticsData = [
    { value: 24, suffix: "M+", prefix: "$" },
    { value: 4000, suffix: "+", prefix: "" },
    { value: 98.5, suffix: "+", prefix: "" },
    { value: 100, suffix: "+", prefix: "" },
  ];

  // Function to animate a counter
  function animateCounter(element, targetValue, prefix = "", suffix = "") {
    let currentValue = 0;
    const increment = targetValue / (animationDuration / (1000 / frameRate));
    let lastUpdateTime = Date.now();

    function update() {
      const currentTime = Date.now();
      const elapsed = currentTime - lastUpdateTime;

      if (elapsed >= 1000 / frameRate) {
        currentValue += increment;

        if (currentValue >= targetValue) {
          currentValue = targetValue;
          // Format the final value
          if (Number.isInteger(targetValue)) {
            element.textContent =
              prefix + currentValue.toLocaleString() + suffix;
          } else {
            element.textContent = prefix + currentValue.toFixed(1) + suffix;
          }
          return; // Stop animation
        } else {
          // Format intermediate value
          if (Number.isInteger(targetValue)) {
            element.textContent =
              prefix + Math.floor(currentValue).toLocaleString() + suffix;
          } else {
            element.textContent = prefix + currentValue.toFixed(1) + suffix;
          }
        }
        lastUpdateTime = currentTime;
      }

      requestAnimationFrame(update);
    }

    update();
  }

  // Intersection Observer to trigger animation when element comes into view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          const cardIndex = Array.from(statisticsCards).indexOf(entry.target);
          const data = statisticsData[cardIndex];

          const firstParagraph = entry.target.querySelector("p:first-of-type");

          if (firstParagraph && data) {
            animateCounter(
              firstParagraph,
              data.value,
              data.prefix,
              data.suffix
            );

            // Mark as animated to prevent re-animation
            entry.target.dataset.animated = "true";
          }

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5, // Trigger when 50% of the element is visible
    }
  );

  // Observe all statistics cards
  statisticsCards.forEach((card) => {
    observer.observe(card);
  });
});
