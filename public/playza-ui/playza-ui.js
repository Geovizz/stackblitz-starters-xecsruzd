(function () {
    function createOverlay(id, title, buttons) {
      const overlay = document.createElement("div");
      overlay.className = "playza-overlay";
      overlay.id = id;
  
      const win = document.createElement("div");
      win.className = "playza-window";
  
      const h1 = document.createElement("h1");
      h1.textContent = title;
      win.appendChild(h1);
  
      const btns = document.createElement("div");
      btns.className = "playza-buttons";
  
      buttons.forEach(({ text, action }) => {
        const b = document.createElement("button");
        b.textContent = text;
        b.onclick = () => {
          // закрываем текущее окно
          overlay.style.visibility = "hidden";
          // выполняем действие
          if (typeof action === "function") action();
        };
        btns.appendChild(b);
      });
  
      win.appendChild(btns);
      overlay.appendChild(win);
      document.body.appendChild(overlay);
      return overlay;
    }
  
    window.PlayzaUI = {
      overlays: {},
      show(id) {
        this.hideAll();
        const el = this.overlays[id];
        if (el) el.style.visibility = "visible";
      },
      hideAll() {
        Object.values(this.overlays).forEach(
          (el) => (el.style.visibility = "hidden")
        );
      },
      init() {
        // только кнопка Continue
        this.overlays.gameOver = createOverlay("playza-gameover", "Game Over", [
          { text: "Continue", action: () => window.PlayzaSDK?.restart() },
        ]);
  
        this.overlays.gameWin = createOverlay("playza-gamewin", "You Win! 🎉", [
          { text: "Next", action: () => window.PlayzaSDK?.restart() },
        ]);
  
        this.overlays.pause = createOverlay("playza-pause", "Paused", [
          { text: "Resume", action: () => this.hideAll() },
          { text: "Restart", action: () => window.PlayzaSDK?.restart() },
        ]);
  
        this.overlays.daily = createOverlay("playza-daily", "Daily Reward", [
          {
            text: "Claim",
            action: () => {
              alert("Reward claimed!");
            },
          },
        ]);
      },
    };
  
    // инициализация
    document.addEventListener("DOMContentLoaded", () => {
      if (window.PlayzaUI) PlayzaUI.init();
    });
  })();
  