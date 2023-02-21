let WORK_TIME_SEC = 20 * 60;
let BREAK_TIME_SEC = 20;
let VIDEO_URL = "https://youtu.be/MKC9LvRivTM?t=7";

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({
        'is_on': false, "tab_id": null, "alarm_suffix": Date.now()
    });
});


chrome.runtime.onStartup.addListener(
    () => {
        chrome.storage.local.set({ 'is_on': false, "tab_id": null, "alarm_suffix": Date.now() });
    }
)

chrome.action.onClicked.addListener(
    () => {

        chrome.storage.local.get(['is_on', "alarm_suffix"], result => {

            if (result.is_on) {

                chrome.storage.local.set({ 'is_on': false, "tab_id": null });
                chrome.action.setIcon({ path: "images/red_eyeball.png" })
                chrome.alarms.clearAll()
            }
            else {

                chrome.storage.local.set({ 'is_on': true });
                chrome.action.setIcon({ path: "images/green_eyeball.png" })
                chrome.alarms.create("work alarm" + result.alarm_suffix, {
                    delayInMinutes: WORK_TIME_SEC * 1 / 60
                })
            }
        })
    }
)

chrome.alarms.onAlarm.addListener(

    (alarm) => {

        chrome.storage.local.get(['tab_id', "alarm_suffix"], result => {


            if (alarm.name == "work alarm" + result.alarm_suffix) {

                chrome.alarms.clear("work alarm" + result.alarm_suffix);

                chrome.tabs.create({ 'url': VIDEO_URL }, tab => {

                    chrome.storage.local.set({ 'tab_id': tab.id });
                    chrome.alarms.create("break alarm" + result.alarm_suffix, {
                        delayInMinutes: BREAK_TIME_SEC * 1 / 60
                    })
                })
            }

            else if (alarm.name == "break alarm" + result.alarm_suffix) {

                chrome.alarms.clear("break alarm" + result.alarm_suffix);
                chrome.tabs.remove(result.tab_id);
                chrome.storage.local.set({ 'tab_id': null });
                chrome.alarms.create("work alarm" + result.alarm_suffix, {
                    delayInMinutes: WORK_TIME_SEC * 1 / 60
                })

            }
            else {
                chrome.alarms.clear(alarm.name)
            }
        })
    }
)
