let WORK_TIME_SEC = 20 * 60;
let BREAK_TIME_SEC = 20;
let VIDEO_URL = "https://youtu.be/MKC9LvRivTM?t=7";
let tab_id = null;
let is_on = false;

chrome.action.onClicked.addListener(
    () => {

        if (is_on) {

            is_on = false;
            chrome.action.setIcon(
                { path: "images/red_eyeball.png" })

            chrome.alarms.clearAll()
        }
        else {

            is_on = true;
            chrome.action.setIcon(
                { path: "images/green_eyeball.png" })


            chrome.alarms.create("work alarm", {
                delayInMinutes: WORK_TIME_SEC * 1 / 60
            })
        }
    }
)

chrome.alarms.onAlarm.addListener(

    (alarm) => {

        if (alarm.name == "work alarm") {
            chrome.alarms.clear("work alarm");

            chrome.tabs.create({ 'url': VIDEO_URL }, tab => {
                tab_id = tab.id;

                chrome.alarms.create("break alarm", {
                    delayInMinutes: BREAK_TIME_SEC * 1 / 60
                })
            })
        }

        else if (alarm.name == "break alarm") {
            chrome.alarms.clear("break alarm");

            chrome.tabs.remove(tab_id);
            tab_id = null;

            chrome.alarms.create("work alarm", {
                delayInMinutes: WORK_TIME_SEC * 1 / 60
            })
        }
    }
)