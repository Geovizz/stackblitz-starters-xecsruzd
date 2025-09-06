// public/playza-sdk.js
const PlayzaSDK = {
    send: (event, data = {}) => {
      window.parent.postMessage({ source: "playza", event, data }, "*");
    },
    gameWin: () => PlayzaSDK.send("game_win"),
    gameOver: () => PlayzaSDK.send("game_over"),
    restart: () => PlayzaSDK.send("restart"),
  };
  
  window.PlayzaSDK = PlayzaSDK;
  