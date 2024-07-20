import { GoogleGenerativeAI } from "./generative_ai.js";

// Fetch your API_KEY
const API_KEY = "api_key";

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generation_config: { response_mime_type: "application/json" },
});

async function run() {
  const prompt = `
    Provide a random hindi word, the hindi word's english translation,
    a 10 second hindi sentence using the hindi word, and the hindi sentence's english translation
    using the following JSON schema:

    {
        "hindi_word": str,
        "english_word: str,
        "hindi_sentence": str,
        "english_sentence": str
    }
    
    Do not include any markdown.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const json_str = response.text();

  const json_obj = JSON.parse(json_str);

  const text = `
    Please look away from your screen.
    Your hindi word is ${json_obj.hindi_word}.
    ${json_obj.hindi_word} means ${json_obj.english_word}.
    A hindi sentence using ${json_obj.hindi_word} is ${json_obj.hindi_sentence}.
    The sentence means ${json_obj.english_sentence}.
  `;

  await chrome.tts.speak(text, { lang: "hi", rate: 0.9 });
}

run();
