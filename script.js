// Detect if user is not watching video with WebGazer.js

window.saveDataAcrossSessions = true;
const delay = 5000;
const left = window.innerWidth / 4;
const right = window.innerWidth - window.innerWidth / 4;
let start = Number.POSITIVE_INFINITY;
let direction = null;

webgazer.setGazeListener((data, timestamp) => {
    if (data == null) return;
    if (data.x < left && direction !== 'LEFT') {
        start = timestamp;
        direction = 'LEFT';
    } else if (data.x > right && direction !== 'RIGHT') {
        start = timestamp;
        direction = 'RIGHT';
    } else if (data.x >= left && data.x <= right) {
        start = Number.POSITIVE_INFINITY;
        direction = null;
    };

    if (start + delay < timestamp) {
        btn.className = "play";
        video.pause();
        alert("Video paused due to eye tracker.");
    };
}).begin();

var video = document.querySelector('.mainVideo');
var bar = document.querySelector('.bar');
var btn = document.getElementById('play-pause');

// Tracks progress

var count = 1;
var completion = 0;
document.getElementById("title").innerHTML = count + "/3 Videos Completed (" + completion + "%)";
var focused = true;

// Play/Pause Button

function togglePlayPause() {
    if (video.paused) {
        btn.className = "pause";
        video.play();
    } else {
        btn.className = "play";
        video.pause();
    }
};

btn.onclick = function() {
    togglePlayPause();
};

// Update progress bar

video.addEventListener("timeupdate", function() {
    var progress = video.currentTime / video.duration;
    bar.style.width = progress * 100 + "%";
});

// Goes through list of videos

function run(){
    count++;
    if (count == 4) {
        btn.className = "play";
        btn.disabled = true;
        btn.style.cursor = "not-allowed";
        webgazer.end();
        return alert("You have completed all the videos.");
    }
    var nextVideo = "videos/video" + count + ".mp4";
    video.src = nextVideo;
    completion = Math.round((count * 100 ) / 3);
    document.getElementById("title").innerHTML = count + "/3 Videos Completed (" + completion + "%)";
    video.play();
};

// Pauses video if user goes onto a new tab

document.addEventListener("visibilitychange", function () {
    focused = !focused;
    if (!focused) {
        alert("To keep videos playing you must stay on this tab.");
        btn.className = "play";
        var pause = "videos/video" + count + ".mp4";
        video.src = pause;
        video.pause();
    }
});