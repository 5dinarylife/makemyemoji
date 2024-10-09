chrome.commands.onCommand.addListener((command) => {
    if (command === "open-emoji-selector") {
        chrome.action.openPopup();
    }
});
