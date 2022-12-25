// global variables
const time_el = document.querySelector('.time');
const on_btn = document.getElementById('on');
const off_btn = document.getElementById('off');
let work_seconds = null;
let break_seconds = null;
let work_interval = null;
let break_interval = null;

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
    time_el.innerHTML = format_time(work_seconds);

    work_interval = setInterval(() => {

        if (work_seconds == 0) {
            clearInterval(work_interval);
            break_timer();
            return;
        }

        work_seconds--;
        time_el.innerHTML = format_time(work_seconds);
    }, 1000);
}

function break_timer() {
    break_seconds = 20;
    time_el.innerHTML = format_time(break_seconds);

    break_interval = setInterval(() => {

        if (break_seconds == 0) {
            clearInterval(break_interval);
            work_timer();
            return;
        }

        break_seconds--;
        time_el.innerHTML = format_time(break_seconds);
    }, 1000);
}

function on() {
    work_timer();
}

function off() {
    clearInterval(work_interval);
    clearInterval(break_interval);
    time_el.innerHTML = '20:00';
}

on_btn.addEventListener("click", on);
off_btn.addEventListener("click", off);