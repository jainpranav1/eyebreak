chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  await chrome.tts.speak(message, { lang: "hi", rate: 0.9 });
});
