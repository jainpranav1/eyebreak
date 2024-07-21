import { GoogleGenerativeAI } from "./generative_ai.js";

const WORK_TIME_SEC = 20; // 20 * 60;
const BREAK_TIME_SEC = 20; // 20

const API_KEY = "";

const gen_ai = new GoogleGenerativeAI(API_KEY);

const model = gen_ai.getGenerativeModel({
  model: "gemini-1.5-flash",
  generation_config: { response_mime_type: "application/json" },
});

let gemini_responses = [];

async function add_gemini_response() {
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
  Do not create any JSON schemas identical to those in the following list: ${gemini_responses}.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const json_str = response.text();
  const json_obj = JSON.parse(json_str);

  gemini_responses.push(json_obj);
}

chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.local.set({
    is_on: false,
    tab_id: null,
    alarm_suffix: Date.now(),
  });
});

chrome.runtime.onStartup.addListener(async () => {
  await chrome.storage.local.set({
    is_on: false,
    tab_id: null,
    alarm_suffix: Date.now(),
  });
});

chrome.action.onClicked.addListener(async () => {
  const result = await chrome.storage.local.get(["is_on", "alarm_suffix"]);

  if (result.is_on) {
    await chrome.storage.local.set({ is_on: false, tab_id: null });
    await chrome.action.setIcon({ path: "images/red_eyeball.png" });
    await chrome.alarms.clearAll();
  } else {
    await chrome.storage.local.set({ is_on: true });
    await chrome.action.setIcon({ path: "images/green_eyeball.png" });
    await chrome.alarms.create("work alarm" + result.alarm_suffix, {
      delayInMinutes: WORK_TIME_SEC / 60,
    });

    await add_gemini_response();
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  const result = await chrome.storage.local.get(["tab_id", "alarm_suffix"]);

  if (alarm.name == "work alarm" + result.alarm_suffix) {
    await chrome.alarms.clear("work alarm" + result.alarm_suffix);

    const tab = await chrome.tabs.create({ url: "index.html" });
    await chrome.storage.local.set({ tab_id: tab.id });

    await chrome.alarms.create("break alarm" + result.alarm_suffix, {
      delayInMinutes: BREAK_TIME_SEC / 60,
    });
  } else if (alarm.name == "break alarm" + result.alarm_suffix) {
    await chrome.alarms.clear("break alarm" + result.alarm_suffix);

    if (result.tab_id != null) {
      await chrome.tabs.remove(result.tab_id);
    }
    await chrome.storage.local.set({ tab_id: null });
    await chrome.alarms.create("work alarm" + result.alarm_suffix, {
      delayInMinutes: WORK_TIME_SEC / 60,
    });

    await add_gemini_response();
  } else {
    await chrome.alarms.clear(alarm.name);
  }
});

chrome.runtime.onMessage.addListener((message, _sender, send_response) => {
  if (message == "send json") {
    send_response(gemini_responses.at(-1));
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const result = await chrome.storage.local.get(["tab_id"]);

  if (tabId == result.tab_id) {
    await chrome.storage.local.set({ tab_id: null });
  }
});
