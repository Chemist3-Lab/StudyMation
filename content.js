function getVideo() {
    let fetchVideo = document.querySelector("video");
    console.log("Video Fetched!", fetchVideo);
    return fetchVideo;
}

let video = null;
let boundVideo = null;

let container = document.createElement("div");
container.className = "playback-hud";

let headerContainer = document.createElement('div');
headerContainer.className = "stm-header-container";

let header = document.createElement('div');
header.className = "stm-header";

// Update title on every video load
function updateTitle() {
    header.textContent = "StudyMation!" + " | Now Studying: " + document.title.replace(/^\(\d+\)\s*/, "").replace(" - YouTube", "");
}

updateTitle();

// Watch for when YouTube actually changes the <title> tag
const titleElement = document.querySelector('title');
if (titleElement) {
    new MutationObserver(() => updateTitle()).observe(titleElement, { childList: true });
}

let collapsibleBtn = document.createElement('button');
collapsibleBtn.className = "stm-collapsible-btn";
collapsibleBtn.textContent = "▲";

let timeline = document.createElement("input");
timeline.className = "stm-timeline";
timeline.type = "range";
timeline.min = 0;
timeline.value = 0;
timeline.step = 0.01;

let control1 = document.createElement("div");
control1.className ="stm-control1";
let control2 = document.createElement("div");
control2.className ="stm-control2";

let play = document.createElement("button");
play.textContent = "❚❚"
play.className = "stm-play-btn";
let frameSkip = document.createElement("div");
frameSkip.className = "stm-frame-skip"; // To be utilized with parent property (buttons)
let frameCount= document.createElement("div");
frameCount.textContent = "FRAMES: ";
frameCount.className = "stm-frame-count";
let loop = document.createElement("div");
loop.textContent = "LOOP:   "; 
loop.className = "stm-loop";// To be utilized with parent property (buttons)

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
currentFrame.className = "stm-current-frame";
let endFrame = document.createElement("span");
endFrame.className = "stm-end-frame";

// loop buttons
let loopStart = document.createElement("button");
let loopEnd = document.createElement("button");
let loopClear = document.createElement("button");
loopStart.textContent = "Start: --";
loopEnd.textContent = "End: --";
loopClear.textContent = "Clear";

let mirror = document.createElement("button");
mirror.textContent = "Mirror [M]";
mirror.className = "stm-mirror-btn";
let grid = document.createElement("button");
grid.textContent = "Grid [G]";
grid.className = "stm-grid-btn";
let speedControl = document.createElement("div");
speedControl.className = "stm-speed-control"; // To be utilized with parent property (buttons)

// speedControl buttons
let speedQuarter = document.createElement("button");
speedQuarter.textContent = "0.25x";
let speedHalf = document.createElement("button");
speedHalf.textContent = "0.5x";
let speedNormal = document.createElement("button");
speedNormal.textContent = "1.0x";

// Shortcut Hint
let shortcutHint = document.createElement("div");
shortcutHint.className = "stm-shortcut-hint";
shortcutHint.textContent = "?";
let shortcutCard = document.createElement("div");
shortcutCard.className = "stm-shortcut-card";
shortcutCard.innerHTML =
  "StudyMation Shortcuts:<br>" +
  "• Space: Play / Pause<br>" +
  "• , / . : Step -1f / +1f<br>" +
  "• < / > : Skip -5f / +5f<br>" +
  "• [ / ] : Loop In / Out<br>" +
  "• Esc : Clear Loop<br>" +
  "• M : Mirror Video<br>" +
  "• G : Toggle Grid<br>" +
  "• - / = : Speed - / +";

shortcutHint.append(shortcutCard);

headerContainer.append(header, shortcutHint, collapsibleBtn);

container.append(headerContainer, timeline, control1, control2);
control1.append(play, frameSkip, frameCount, loop);
control2.append(mirror, grid, speedControl);

frameSkip.append(minus5f, minus1f, plus1f, plus5f);
frameCount.append(currentFrame, endFrame);
loop.append(loopStart, loopEnd, loopClear);

speedControl.append(speedQuarter, speedHalf, speedNormal)





// Wiring / Functions

function attachVideoListeners() {
    if(!video || video === boundVideo) return;
    boundVideo = video;

    // Timeline Scrubber Update
    video.addEventListener("timeupdate", () => {
        if (!video || isAdPlaying()) return;
        timeline.value = video.currentTime;
        if (loopStartTime !== null && loopEndTime !== null) {
            timeline.min = loopStartTime;
            timeline.max = loopEndTime;
        } else {
            timeline.min = 0;
            timeline.max = video.duration || 100;
        }
    });

    video.addEventListener("play", () => {play.textContent = "❚❚"})
    video.addEventListener("pause", () => {play.textContent = "▶"})

    // Frame Update 
    video.addEventListener("timeupdate", () => {
        if (!video || isAdPlaying()) return;
        if (loopStartTime !== null && loopEndTime !== null) {
            currentFrame.textContent = Math.floor((video.currentTime - loopStartTime) * 24);
        } else {
            currentFrame.textContent = Math.floor(video.currentTime * 24);
        }
    });

    video.addEventListener("timeupdate", () => {
        if (!video || isAdPlaying()) return;
        if (loopStartTime !== null && loopEndTime !== null) {
            endFrame.textContent = " / " + Math.floor((loopEndTime - loopStartTime) * 24);
        } else {
            endFrame.textContent = " / " + Math.floor(video.duration * 24);
        }
    });
    // Loop Function
    video.addEventListener("timeupdate", () => {
        if (!video || isAdPlaying()) return;
        if (loopStartTime !== null && loopEndTime !== null) {
            if (video.currentTime >= loopEndTime) {
                video.currentTime = loopStartTime;
            }
        }
    });
    }



// Timeline Scrubber Drag
timeline.addEventListener("input", () => {
    if (!video || isAdPlaying()) return;
    video.currentTime = Number(timeline.value);
});

// Play
play.addEventListener("click", () => {
    if (!video || isAdPlaying()) return;
    if (video.paused) {
        video.play();
        play.textContent = "❚❚"
    } else {
        video.pause();
        play.textContent = "▶"
    }
});


// Add flash to triggered buttons
function flashButton (btn) {
    btn.classList.add("flash");
    setTimeout(() => btn.classList.remove("flash"), 500);
}

// FrameSkip
function stepFrames (frames, fps = 24) {
    if (!video || isAdPlaying()) return;
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
speedNormal.className = "stm-speed-btn-active";    // Initial Loading
function setSpeed (rate, targetSpeed) {
    if (!video || isAdPlaying()) return;
    video.playbackRate = rate;
    speedQuarter.className = "";
    speedHalf.className = "";
    speedNormal.className = "";

    targetSpeed.className = "stm-speed-btn-active";
}

speedQuarter.addEventListener("click", () => setSpeed(0.25, speedQuarter));
speedHalf.addEventListener("click", () => setSpeed(0.5, speedHalf));
speedNormal.addEventListener("click", () => setSpeed(1.0, speedNormal));

// Mirror
mirror.addEventListener("click", () => {
    if (!video || isAdPlaying()) return;
    if(video.style.transform === "scaleX(-1)") {
        video.style.transform = "none";
        mirror.className = "stm-mirror-btn";
    } else {
        video.style.transform = "scaleX(-1)";
        mirror.className = "stm-mirror-btn-active";
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

grid.addEventListener("click", () => {
    if (!video) return;
    if (gridOverlay.style.display === "none") {
        gridOverlay.style.display = "grid";
        grid.className = "stm-grid-btn-active";
    } else {
        gridOverlay.style.display = "none";
        grid.className = "stm-grid-btn";
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
    if (!video || isAdPlaying()) return;
    loopStartTime = video.currentTime;
    loopStart.textContent = "Start: " + formatTime(loopStartTime);
    loopStart.className = "stm-loop-btn-active";
    loopClear.disabled = false;
    loopEnd.disabled = false;

    if (loopStartTime !== null && loopStartTime >= loopEndTime) {
        loopEndTime = null;
        loopEnd.className = ""
    }
});

loopEnd.disabled = true; // Initial Loading
loopEnd.addEventListener("click", () => {
    if (!video || isAdPlaying()) return;
    if (loopStartTime === null || video.currentTime <= loopStartTime) return;

    loopEndTime = video.currentTime;
    loopEnd.textContent = "End: " + formatTime(loopEndTime);
    loopEnd.className = "stm-loop-btn-active";
});



// Loop Clear
function clearLoop() {
    loopStartTime = null;
    loopEndTime = null;
    loopStart.textContent = "Start: --";
    loopEnd.textContent = "End: --";
    loopStart.className = "";
    loopEnd.className = "";
    loopEnd.disabled = true;
    loopClear.disabled = true;
}

loopClear.disabled = true; // Initial Loading
loopClear.addEventListener("click", () => {
    if (!video || isAdPlaying()) return;
    if (loopStartTime !== null || loopEndTime !== null) {
        clearLoop();
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
    // Disable shorcuts if ad is playing
    if (isAdPlaying()) return;

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

const adObserver = new MutationObserver(updateAdVisibility);

function initPlayer() {
    video = getVideo();
    // Ad Detection
    const moviePlayer = document.getElementById("movie_player");
    if (!moviePlayer || !video) return;

    // Re-attach HUD and Grid if YouTube replaced #movie_player
    if (!moviePlayer.contains(container)) {
        moviePlayer.append(container)
    }
    if (!moviePlayer.contains(gridOverlay)) {
        moviePlayer.append(gridOverlay)
    }

    // Attach Video listeners & sync play/pause button
    attachVideoListeners();
    play.textContent = video.paused ? "▶" : "❚❚";
    updateTitle();

    // Observe #movie_player for ads
    adObserver.disconnect();
    adObserver.observe(moviePlayer, {
        attributes: true,
        attributeFilter: ["class"]
    });

    // Clear registered loop on new video page access
    clearLoop();

    // Initial check on load
    updateAdVisibility();
}

function isAdPlaying(adCheck) {
    adCheck = document.getElementById("movie_player");

    if (!adCheck) return false;

    return adCheck.classList.contains("ad-showing") ||
           adCheck.classList.contains("ad-interrupting");
        
}

function updateAdVisibility() {
    const adActive = isAdPlaying();

    // Toggle HUD Visibility
    container.style.opacity = adActive ? "0" : "1";
    container.style.pointerEvents = adActive ? "none" : "auto";

    // Toggle Grid overlay (If active)
    if (gridOverlay) {
        gridOverlay.style.visibility = adActive ? "hidden" : "visible";
    }
}

initPlayer();
window.addEventListener("yt-navigate-finish", initPlayer);

// Collapsible function
let isCollapsed = false;
collapsibleBtn.addEventListener("click", () => {
    if (!video || isAdPlaying()) return;
    if (isCollapsed === false) {
        collapsibleBtn.textContent = "▼";
        isCollapsed = true;
        container.classList.add("mini");
        collapsibleBtn.className = "stm-collapsible-btn-active";
    } else {
        collapsibleBtn.textContent = "▲";
        isCollapsed = false;
        container.classList.remove("mini");
        collapsibleBtn.className = "stm-collapsible-btn";
    }
});