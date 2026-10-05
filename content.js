function getVideo() {
    let fetchVideo = document.querySelector("video");
    console.log("Video Fetched!", fetchVideo);
    return fetchVideo;
}

const video = getVideo();

let container = document.createElement("div");
container.className = "playback-hud";

let header = document.createElement('div');
header.className = "header";
header.textContent = "StudyMation!" + " | Now Studying: " + document.title.replace(" - YouTube", "");


let timeline = document.createElement("input");
timeline.className = "timeline";
timeline.type = "range";
timeline.min = 0;
timeline.value = 0;
timeline.step = 0.01;

let control1 = document.createElement("div");
control1.className ="control1";
let control2 = document.createElement("div");
control2.className ="control2";

let play = document.createElement("button");
play.textContent = "❚❚"
play.className = "play-btn";
let frameSkip = document.createElement("div");
frameSkip.className = "frame-skip"; // To be utilized with parent property (buttons)
let frameCount= document.createElement("div");
frameCount.textContent = "FRAMES: ";
frameCount.className = "frame-count";
let loop = document.createElement("div");
loop.textContent = "LOOP:   "; 
loop.className = "loop";// To be utilized with parent property (buttons)

// frameSkip buttons
let minus5f = document.createElement("button");
minus5f.textContent = "-5f";
let minus1f = document.createElement("button");
minus1f.textContent = "-1f";
let plus1f = document.createElement("button");
plus1f.textContent = "1f";
let plus5f = document.createElement("button");
plus5f.textContent = "5f";

// frameCount interface
let currentFrame = document.createElement("span");
currentFrame.className = "current-frame";
let endFrame = document.createElement("span");
endFrame.className = "end-frame";

// loop buttons
let loopStart = document.createElement("button");
let loopEnd = document.createElement("button");
let loopClear = document.createElement("button");
loopStart.textContent = "Start: --";
loopEnd.textContent = "End: --";
loopClear.textContent = "Clear";

let mirror = document.createElement("button");
mirror.textContent = "Mirror [M]";
mirror.className = "mirror-btn";
let grid = document.createElement("button");
grid.textContent = "Grid [G]";
grid.className = "grid-btn";
let speedControl = document.createElement("div");
speedControl.className = "speed-control"; // To be utilized with parent property (buttons)

// speedControl buttons
let speedQuarter = document.createElement("button");
speedQuarter.textContent = "0.25x";
let speedHalf = document.createElement("button");
speedHalf.textContent = "0.5x";
let speedNormal = document.createElement("button");
speedNormal.textContent = "1.0x";

document.getElementById("movie_player")?.append(container);

container.append(header, timeline, control1, control2);
control1.append(play, frameSkip, frameCount, loop);
control2.append(mirror, grid, speedControl);

frameSkip.append(minus5f, minus1f, plus1f, plus5f);
frameCount.append(currentFrame, endFrame);
loop.append(loopStart, loopEnd, loopClear);

speedControl.append(speedQuarter, speedHalf, speedNormal)





// Wiring / Functions

// Timeline Scrubber Update
video.addEventListener("timeupdate", () => {
    if (!video) return;
    timeline.value = video.currentTime;
    if (loopStartTime && loopEndTime) {
        timeline.min = loopStartTime;
        timeline.max = loopEndTime;
    } else {
        timeline.min = 0;
        timeline.max = video.duration || 100;
    }
});

// Timeline Scrubber Drag
timeline.addEventListener("input", () => {
    if (!video) return;
    video.currentTime = Number(timeline.value);
});

// Play
play.addEventListener("click", () => {
    if (!video) return;
    if (video.paused) {
        video.play();
        play.textContent = "❚❚"
    } else {
        video.pause();
        play.textContent = "▶"
    }
});

video.addEventListener("play", () => {play.textContent = "❚❚"})
video.addEventListener("pause", () => {play.textContent = "▶"})

// Add flash to triggered buttons
function flashButton (btn) {
    btn.classList.add("flash");
    setTimeout(() => btn.classList.remove("flash"), 500);
}

// FrameSkip
function stepFrames (frames, fps = 24) {
    if (!video) return;
    video.pause();
    video.currentTime += frames / fps;
};

minus5f.addEventListener("click", () => {
    stepFrames(-5);
    flashButton(minus5f);
});
minus1f.addEventListener("click", () => {
    stepFrames(-1);
    flashButton(minus1f);
});
plus1f.addEventListener("click", () => {
    stepFrames(1);
    flashButton(plus1f);
});
plus5f.addEventListener("click", () => {
    stepFrames(5);
    flashButton(plus5f);
});




// PlayBackSpeed
speedNormal.className = "speed-btn-active";    // Initial Loading
function setSpeed (rate, targetSpeed) {
    if (!video) return;
    video.playbackRate = rate;
    speedQuarter.className = "";
    speedHalf.className = "";
    speedNormal.className = "";

    targetSpeed.className = "speed-btn-active";
}

speedQuarter.addEventListener("click", () => setSpeed(0.25, speedQuarter));
speedHalf.addEventListener("click", () => setSpeed(0.5, speedHalf));
speedNormal.addEventListener("click", () => setSpeed(1.0, speedNormal));

// Mirror
mirror.addEventListener("click", () => {
    if (!video) return;
    if(video.style.transform === "scaleX(-1)") {
        video.style.transform = "none";
        mirror.className = "mirror-btn";
    } else {
        video.style.transform = "scaleX(-1)";
        mirror.className = "mirror-btn-active";
    }
});

// Grid Overlay
let gridOverlay = document.createElement("div");
gridOverlay.className = "animator-grid-overlay";
gridOverlay.style.display = "none"; // Hidden by default

// Grid Creation
for (let i = 0; i < 9; i++) {
    gridOverlay.append(document.createElement("div"));
}

document.getElementById("movie_player")?.append(gridOverlay);

grid.addEventListener("click", () => {
    if (!video) return;
    if (gridOverlay.style.display === "none") {
        gridOverlay.style.display = "grid";
        grid.className = "grid-btn-active";
    } else {
        gridOverlay.style.display = "none";
        grid.className = "grid-btn";
    }
});

// Frame Update 
video.addEventListener("timeupdate", () => {
    if (!video) return;
    if (loopStartTime && loopEndTime) {
        currentFrame.textContent = Math.floor((video.currentTime - loopStartTime) * 24);
    } else {
        currentFrame.textContent = Math.floor(video.currentTime * 24);
    }
});

video.addEventListener("timeupdate", () => {
    if (!video) return;
    if (loopEndTime) {
        endFrame.textContent = " / " + Math.floor((loopEndTime - loopStartTime) * 24);
    } else {
        endFrame.textContent = " / " + Math.floor(video.duration * 24);
    }
});

// Loop Start-End
let loopStartTime = null;
let loopEndTime = null;

// Time Formatting
function formatTime (totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`
}

loopStart.addEventListener("click", () => {
    if (!video) return;
    loopStartTime = video.currentTime;
    loopStart.textContent = "Start: " + formatTime(loopStartTime);
    loopStart.className = "loop-btn-active";
    loopClear.disabled = false;
    if (loopStartTime) {
        loopEnd.disabled = false;
    }
});

loopEnd.disabled = true; // Initial Loading
loopEnd.addEventListener("click", () => {
    if (!video) return;
    loopEndTime = video.currentTime;
    loopEnd.textContent = "End: " + formatTime(loopEndTime);
    loopEnd.className = "loop-btn-active";
});

// Loop Function
video.addEventListener("timeupdate", () => {
    if (!video) return;
    if (loopStartTime !== null && loopEndTime !== null) {
        if (video.currentTime >= loopEndTime) {
            video.currentTime = loopStartTime;
        }
    }
});

// Loop Clear
loopClear.disabled = true; // Initial Loading
loopClear.addEventListener("click", () => {
    if (!video) return;
    if ((loopStartTime && loopEndTime) || (loopStartTime || loopEndTime)) {
        loopStartTime = null;
        loopEndTime = null;
        loopStart.textContent = "Start: --";
        loopEnd.textContent = "End: --";
        loopStart.className = "";
        loopEnd.className = "";
        loopEnd.disabled = true;
        loopClear.disabled = true;
    }
});

/* Keyboard Shortcuts */
// Space = pause and play
// , . < > = frame skips
// [ ] = loop start & loop end
// Esc = loop clear
// m M = mirror
// g G = grid
// - = = toggle speed up/down

window.addEventListener("keydown", (e) => {
    // If the user is typing on a textfield (e.g. comment section, search bar), DO NOTHING!
    const tag = document.activeElement.tagName.toLowerCase();
    if (tag === "input" || tag === "textarea" || document.activeElement.isContentEditable) {
        return;
    }
    
    switch (e.key) {
        case "<":
            e.preventDefault();
            e.stopImmediatePropagation();
            minus5f.click();
            break;
        case ",":
            e.preventDefault();
            e.stopImmediatePropagation();
            minus1f.click();
            break;
        case ".":
            e.preventDefault();
            e.stopImmediatePropagation();
            plus1f.click();   
            break;                     
        case ">":
            e.preventDefault();
            e.stopImmediatePropagation();
            plus5f.click();
            break;
        case "[":
            loopStart.click();
            break;
        case "]":
            loopEnd.click();
            break;
        case "Escape":
            e.preventDefault();
            e.stopImmediatePropagation();
            loopClear.click();
            break;        
        case "m":
        case "M":
            e.stopImmediatePropagation();
            mirror.click();
        break;
        case "g":
        case "G":
            e.stopImmediatePropagation();
            grid.click();
            break;
        case "-":
            e.preventDefault()
            e.stopImmediatePropagation();
            if (video.playbackRate === 1.0) {
                speedHalf.click();
            } else if (video.playbackRate === 0.5) {
                speedQuarter.click();
            }
            break;
        case "=":
        case "+":
            e.preventDefault();
            e.stopImmediatePropagation();
            if (video.playbackRate === 0.25) {
                speedHalf.click();
            } else if (video.playbackRate === 0.5) {
                speedNormal.click();
            }
            break;
    }
}, true)

// Ad Detection
function isAdPlaying(adCheck, hidePlayer) {
    adCheck = document.getElementById("movie_player");

    if (!adCheck) return;

    hidePlayer = adCheck.classList.contains("ad-showing") || adCheck.classList.contains("ad-interrupting")

    if(hidePlayer) {
        container.style.opacity = "0";
        container.style.pointerEvents = "none";
    } else {
        container.style.opacity = "1";
        container.style.pointerEvents = "auto";
    }

    return hidePlayer;
}

video.addEventListener("timeupdate", () => {
    if (!video) return;
    if(isAdPlaying()) return;
});