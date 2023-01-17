let work_seconds = null;
let break_seconds = null;
let work_interval = null;
let break_interval = null;
let main_port = null;

function format_time(seconds) {

    let secs = seconds % 60;
    let mins = Math.floor(seconds / 60);

    if (secs < 10) {
        secs = `0${secs}`;
    }

    if (mins < 10) {
        mins = `0${mins}`;
    }

    return `${mins}:${secs}`;
}

function work_timer() {
    work_seconds = 20 * 60;

    if (main_port) {
        main_port.postMessage({ time: format_time(work_seconds) })
    }

    work_interval = setInterval(() => {

        if (work_seconds == 1) {
            work_seconds = null;
            clearInterval(work_interval);
            break_timer();
            return;
        }

        work_seconds--;

        if (main_port) {
            main_port.postMessage({ time: format_time(work_seconds) })
        }

    }, 1000);
}

function break_timer() {
    break_seconds = 20;

    if (main_port) {
        main_port.postMessage({ time: format_time(break_seconds) })
    }

    break_interval = setInterval(() => {

        if (break_seconds == 1) {
            break_seconds = null;
            clearInterval(break_interval);
            work_timer();
            return;
        }

        break_seconds--;

        if (main_port) {
            main_port.postMessage({ time: format_time(break_seconds) })
        }

    }, 1000);
}

chrome.runtime.onConnect.addListener(port => {
    main_port = port;

    if (work_seconds) {
        port.postMessage({ time: format_time(work_seconds) })
    }
    if (break_seconds) {
        port.postMessage({ time: format_time(break_seconds) })
    }

    port.onMessage.addListener(msg => {
        if (msg.button_pressed == "on" && !work_seconds && !break_seconds) {
            work_timer();
        }
        else if (msg.button_pressed == "off") {
            clearInterval(work_interval);
            clearInterval(break_interval);
            port.postMessage({ time: format_time(20 * 60) })
        }
    });
    port.onDisconnect.addListener(() => {
        main_port = null;
    });
});