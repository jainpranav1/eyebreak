let WORK_TIME_SEC = 20; // 20 * 60;
let BREAK_TIME_SEC = 20;
let VIDEO_URL = "https://youtu.be/MKC9LvRivTM?t=7";

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
  let result = await chrome.storage.local.get(["is_on", "alarm_suffix"]);

  if (result.is_on) {
    await chrome.storage.local.set({ is_on: false, tab_id: null });
    await chrome.action.setIcon({ path: "images/red_eyeball.png" });
    await chrome.alarms.clearAll();
  } else {
    await chrome.storage.local.set({ is_on: true });
    await chrome.action.setIcon({ path: "images/green_eyeball.png" });
    await chrome.alarms.create("work alarm" + result.alarm_suffix, {
      delayInMinutes: (WORK_TIME_SEC * 1) / 60,
    });
  }
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  let result = await chrome.storage.local.get(["tab_id", "alarm_suffix"]);

  if (alarm.name == "work alarm" + result.alarm_suffix) {
    await chrome.alarms.clear("work alarm" + result.alarm_suffix);

    let tab = await chrome.tabs.create({ url: VIDEO_URL });
    await chrome.storage.local.set({ tab_id: tab.id });

    await chrome.alarms.create("break alarm" + result.alarm_suffix, {
      delayInMinutes: (BREAK_TIME_SEC * 1) / 60,
    });
  } else if (alarm.name == "break alarm" + result.alarm_suffix) {
    await chrome.alarms.clear("break alarm" + result.alarm_suffix);

    if (result.tab_id != null) {
      await chrome.tabs.remove(result.tab_id);
    }
    await chrome.storage.local.set({ tab_id: null });
    await chrome.alarms.create("work alarm" + result.alarm_suffix, {
      delayInMinutes: (WORK_TIME_SEC * 1) / 60,
    });
  } else {
    await chrome.alarms.clear(alarm.name);
  }
});

chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
  let result = await chrome.storage.local.get(["tab_id"]);

  if (tabId == result.tab_id) {
    await chrome.storage.local.set({ tab_id: null });
  }
});
