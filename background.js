chrome.commands.onCommand.addListener(function (command) {
  if (command === "open-emoji-window") {
    chrome.action.openPopup(); // 단축키로 이모지 팝업 열기
  }
});
