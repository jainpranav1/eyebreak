(async () => {
  const response = await chrome.runtime.sendMessage((message = "send json"));
  const text = `
    Please look away from your screen.
    Your hindi word is ${response.hindi_word}.
    ${response.hindi_word} means ${response.english_word}.
    A hindi sentence using ${response.hindi_word} is ${response.hindi_sentence}.
    The sentence means ${response.english_sentence}.
  `;
  await chrome.tts.speak(text, { lang: "hi", rate: 0.9 });
})();
