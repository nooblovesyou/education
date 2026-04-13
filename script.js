// ============================================================
// Brightpath Learning — hidden games menu
// ============================================================
// The site looks educational, but there's a secret menu.
// How to open it:
//   1) Click the period after "All rights reserved" 3 times
//      (triple-click within 1.2 seconds), OR
//   2) Press the backtick key  `  anywhere on the page, OR
//   3) Type the word "play" on the keyboard.
// Press Esc to close the menu or the currently playing game.
// ============================================================

(function () {
  "use strict";

  // Game catalog — wrapper HTML files served from this repo.
  // (The inner game assets still load from bubbls/* on jsDelivr,
  // which is not blocked — only gn-math was.)
  var GAMES = {
    fnae: {
      title: "Five Nights at Epstein's",
      url: "games/fnae.html"
    },
    ebik: {
      title: "Epstein's Basics in Kidnapping",
      url: "games/ebik.html"
    }
  };

  var menu = document.getElementById("gamesMenu");
  var overlay = document.getElementById("playerOverlay");
  var frame = document.getElementById("playerFrame");
  var playerTitle = document.getElementById("playerTitle");
  var closeBtn = document.getElementById("playerClose");
  var fsBtn = document.getElementById("playerFullscreen");
  var secretDot = document.getElementById("secretDot");

  // -------- Secret unlock triggers --------

  // 1) Triple-click the period in the footer
  var clickCount = 0;
  var clickTimer = null;
  if (secretDot) {
    secretDot.addEventListener("click", function (e) {
      e.preventDefault();
      clickCount++;
      clearTimeout(clickTimer);
      if (clickCount >= 3) {
        clickCount = 0;
        openMenu();
        return;
      }
      clickTimer = setTimeout(function () { clickCount = 0; }, 1200);
    });
  }

  // 2) Backtick key + 3) typing "play"
  var buffer = "";
  document.addEventListener("keydown", function (e) {
    // Ignore keys typed inside form fields
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
      return;
    }

    if (e.key === "`") {
      e.preventDefault();
      toggleMenu();
      return;
    }

    if (e.key === "Escape") {
      if (!overlay.hidden) { closePlayer(); return; }
      if (!menu.hidden)    { closeMenu();   return; }
    }

    if (e.key && e.key.length === 1) {
      buffer = (buffer + e.key.toLowerCase()).slice(-8);
      if (buffer.indexOf("play") !== -1) {
        buffer = "";
        openMenu();
      }
    }
  });

  // -------- Menu open/close --------
  function openMenu() {
    menu.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    menu.hidden = true;
    if (overlay.hidden) document.body.style.overflow = "";
  }
  function toggleMenu() {
    if (menu.hidden) openMenu(); else closeMenu();
  }

  // Menu click handling
  menu.addEventListener("click", function (e) {
    // Close when clicking the backdrop (not inner panel)
    if (e.target === menu) { closeMenu(); return; }
    // Close button
    if (e.target.closest("[data-gm-close]")) { closeMenu(); return; }
    // Launch a game
    var card = e.target.closest("[data-launch]");
    if (card) {
      var key = card.getAttribute("data-launch");
      if (GAMES[key]) launchGame(GAMES[key]);
    }
  });

  // -------- Game player --------
  function launchGame(game) {
    playerTitle.textContent = "Now playing — " + game.title;
    frame.src = game.url;
    overlay.hidden = false;
    menu.hidden = true;
    document.body.style.overflow = "hidden";
  }

  function closePlayer() {
    overlay.hidden = true;
    frame.src = "about:blank";
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", closePlayer);

  fsBtn.addEventListener("click", function () {
    var el = overlay;
    var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
    if (req) req.call(el);
  });

  // Console hint (for the curious dev-tools user)
  try {
    console.log(
      "%cBrightpath Learning",
      "color:#1f6feb;font-weight:800;font-size:16px"
    );
    console.log("Psst — press ` or type \"play\" to open the hidden menu.");
  } catch (_) {}
})();
