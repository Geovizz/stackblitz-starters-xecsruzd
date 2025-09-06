const PlayzaSDK = {
  send: (event, data = {}) => {
    // отправляем наружу
    window.parent.postMessage({ source: "playza", event, data }, "*");
    // и внутрь самой игры, если нужно
    window.postMessage({ source: "playza", event, data }, "*");
  },
  gameWin: () => PlayzaSDK.send("game_win"),
  gameOver: () => PlayzaSDK.send("game_over"),
  restart: () => PlayzaSDK.send("restart"),
};

window.PlayzaSDK = PlayzaSDK;
