async function main() {
  await chrome.tts.speak(
    "Absolutely! 'Namaste' (नमस्ते) is a common greeting in Hindi. It can be used at any time of day and is a respectful way to say hello.  (pronounced nuh-muh-steh)",
    { lang: "hi" }
  );
}

main();
