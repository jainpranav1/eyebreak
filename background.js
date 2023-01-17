let WORK_TIME_SEC = 20 * 60;
let BREAK_TIME_SEC = 20;
let VIDEO_URL = "https://youtu.be/MKC9LvRivTM?t=7";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 'is_on': false, "tab_id": null });
});

chrome.action.onClicked.addListener(
    () => {

        chrome.storage.local.get(['is_on'], result => {

            if (result.is_on) {

                chrome.storage.local.set({ 'is_on': false });

                chrome.action.setIcon(
                    { path: "images/red_eyeball.png" })

                chrome.alarms.clearAll()
            }
            else {

                chrome.storage.local.set({ 'is_on': true });

                chrome.action.setIcon(
                    { path: "images/green_eyeball.png" })


                chrome.alarms.create("work alarm", {
                    delayInMinutes: WORK_TIME_SEC * 1 / 60
                })
            }
        })
    }
)

chrome.alarms.onAlarm.addListener(

    (alarm) => {

        if (alarm.name == "work alarm") {
            chrome.alarms.clear("work alarm");

            chrome.tabs.create({ 'url': VIDEO_URL }, tab => {

                chrome.storage.local.set({ 'tab_id': tab.id });

                chrome.alarms.create("break alarm", {
                    delayInMinutes: BREAK_TIME_SEC * 1 / 60
                })
            })
        }

        else if (alarm.name == "break alarm") {
            chrome.alarms.clear("break alarm");

            chrome.storage.local.get(['tab_id'], result => {

                chrome.tabs.remove(result.tab_id);
                chrome.storage.local.set({ 'tab_id': null });

                chrome.alarms.create("work alarm", {
                    delayInMinutes: WORK_TIME_SEC * 1 / 60
                })
            })
        }
    }
)