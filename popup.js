let time_el = document.querySelector('.time');
let on_btn = document.getElementById('on');
let off_btn = document.getElementById('off');
let port = chrome.runtime.connect({ name: "popup-background communication" });

port.onMessage.addListener(msg => {
    if (msg.time) {
        time_el.innerHTML = msg.time;
    }
});

on_btn.addEventListener("click", () => {
    port.postMessage({ button_pressed: "on" });
});

off_btn.addEventListener("click", () => {
    port.postMessage({ button_pressed: "off" });
});