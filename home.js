document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("container");
  const fallingTexts = []; // Array to store the falling text elements
  const minDistance = 60; // Minimum distance between falling text elements
  const maxBounces = 3; // Maximum number of allowed bounces for each text element
  const textPadding = 10; // Padding around each text element
  const fonts = [
    "Fanky Bubble Graffiti Line", "Howdy Handsome", "Old London", "Shavina Elegance", "Squealer",
    "UAV OSD Mono", "Varsity", "Elegant", "Monea Alegante", "Neue Haas Unica"
  ];

  // Array of different text lines
  const textLines = [
    "Bachelor of Design",
    "Software Developer",
    "Fullstack",
    "Industrial Design",
    "Digital Fabrication",
    "CSS",
    "React",
    "HTML",
    "Javascript",
    "Illustrate",
    "Design",
    "Create",
    "Sales",
    "Partnership Management",
    "Admin",
    "Event Assistant",
    "Photoshop",
    "Illustrator",
    "Indesign",
    "Procreate",
  ];

  const tapAndGap = document.createElement("div");
  tapAndGap.innerText = "Tap me";
  tapAndGap.className = "tap-gap";
  tapAndGap.style.position = "absolute";
  tapAndGap.style.top = "50%";
  tapAndGap.style.left = "50%";
  tapAndGap.style.transform = "translate(-50%, -50%)";
  tapAndGap.style.fontSize = "60px";
  tapAndGap.style.fontFamily = getRandomFont();
  container.appendChild(tapAndGap);

  // Interval for changing font family of tapAndGap
  setInterval(() => {
    tapAndGap.style.fontFamily = getRandomFont();
  }, 500);

  // Pulse effect on tapAndGap
  setInterval(() => {
    tapAndGap.classList.toggle("pulse");
  }, 1000);

  let inactivityTimer;
  
  // Function to reset the timer and make tapAndGap reappear
  function resetInactivityTimer() {
    clearTimeout(inactivityTimer); // Clear previous timer

    // Set the inactivity timer for 45 seconds
    inactivityTimer = setTimeout(() => {
      tapAndGap.style.display = "block"; // Show the tapAndGap text
      tapAndGap.style.transition = "opacity 1s";
      tapAndGap.style.opacity = "1";
    }, 25000); // 25 seconds without a tap
  }

  // Start the inactivity timer as soon as the page loads
  resetInactivityTimer();

  // When the container is clicked, hide the tapAndGap text and trigger falling text
  container.addEventListener("click", (event) => {
    tapAndGap.style.display = "none"; // Hide the "Tap and Gap" text

    const posX = event.clientX;
    const posY = event.clientY;

    const text = document.createElement("div");
    text.className = "falling-text";
    text.innerText = getRandomTextLine();
    text.style.fontFamily = getRandomFont();
    container.appendChild(text);

    let dx = (Math.random() - 0.5) * 20;
    let dy = 0;
    let gravity = 0.5;
    let friction = 0.8;
    let bounces = 0;
    let rotation = 0;
    let fontFinalized = false;

    const fallingText = {
      element: text,
      posX: posX + dx,
      posY: posY,
      dx: dx,
      dy: dy,
      bounces: bounces,
      rotation: rotation,
      fontFinalized: fontFinalized,
    };

    fallingTexts.push(fallingText);

    setInterval(() => {
      if (!fallingText.fontFinalized) {
        fallingText.element.style.transition = "font-family 1000ms ease";  // Slow transition to 1 second
        fallingText.element.style.fontFamily = getRandomFont();
      }
    }, 2000);  // Font changes every 2 seconds (2000ms)

    const fallInterval = setInterval(() => {
      let allTextsDoneBouncing = true;

      for (const fallingText of fallingTexts) {
        if (fallingText.bounces <= maxBounces) {
          allTextsDoneBouncing = false;
          fallingText.dy += gravity;
          fallingText.posX += fallingText.dx;
          fallingText.posY += fallingText.dy;
          fallingText.rotation += fallingText.dx * 0.5;

          if (!fallingText.fontFinalized) {
            fallingText.element.style.fontFamily = getRandomFont();
          }

          fallingText.element.style.transform = `translate(${fallingText.posX}px, ${fallingText.posY}px) rotate(${fallingText.rotation}deg)`;

          const containerRect = container.getBoundingClientRect();
          
          // Check collision with other falling texts
          for (const otherText of fallingTexts) {
            if (otherText !== fallingText) {
              const distance = Math.sqrt(
                Math.pow(fallingText.posX - otherText.posX, 2) +
                Math.pow(fallingText.posY - otherText.posY, 2)
              );

              if (distance < minDistance) {
                // Collision detected, reverse velocity and stack on top
                fallingText.dy *= -friction;
                fallingText.posY = otherText.posY - fallingText.element.offsetHeight - textPadding;
                fallingText.bounces++;
              }
            }
          }

          // If the text hits the container's edge, reverse its direction (bounce off container)
          const containerRight = container.getBoundingClientRect().right;
          const containerBottom = container.getBoundingClientRect().bottom;

          if (
            fallingText.posX - textPadding <= 0 ||
            fallingText.posX +
              fallingText.element.offsetWidth +
              textPadding >=
              containerRight
          ) {
            fallingText.dx *= -friction;
            fallingText.posX = Math.max(
              textPadding,
              Math.min(
                fallingText.posX,
                containerRight - fallingText.element.offsetWidth - textPadding
              )
            );
            fallingText.bounces++;
          }

          if (
            fallingText.posY - textPadding <= 0 ||
            fallingText.posY +
              fallingText.element.offsetHeight +
              textPadding >=
              containerBottom
          ) {
            fallingText.dy *= -friction;
            fallingText.posY = Math.max(
              textPadding,
              Math.min(
                fallingText.posY,
                containerBottom -
                  fallingText.element.offsetHeight -
                  textPadding
              )
            );
            fallingText.bounces++;
          }
        }
      }

      if (allTextsDoneBouncing) {
        clearInterval(fallInterval);
      }
    }, 16);

    setTimeout(() => {
      text.style.transition = "opacity 1s";
      text.style.opacity = "0";
      setTimeout(() => text.remove(), 1000);
    }, 20000);

    // Reset the inactivity timer on tap
    resetInactivityTimer();
  });

  function getRandomTextLine() {
    return textLines[Math.floor(Math.random() * textLines.length)];
  }

  function getRandomFont() {
    return fonts[Math.floor(Math.random() * fonts.length)];
  }
});
