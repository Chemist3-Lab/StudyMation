
https://github.com/user-attachments/assets/cf3c46f6-9bea-45ca-8dc0-53a3ae2e310a
<!-- Title + One line description -->
# StudyMation   
### Frame-by-frame study suited for 2D/3D Animators, storyboarders, and choreographers

---

<!-- Introduction Paragraph -->
## Description
StudyMation is a browser extension and precision playback overlay for YouTube designed to enhance the video analysis experience when studying choreography, action scenes, and animation references.

---

<!-- Features created for users -->
## Features
- **Dynamic Timeline Scrubber:** Automatically bounds to the active Start-End loop points.
- **Precision Frame Skipping:** Skip forward or backward by ±1 frame or jump by ±5 frames
- **Relative and Absolute Frame Counter:** Displays live frame numbers currently played, or counts relative cycle progress according to the active loops.
- **Start-End Range Looper:** Continuously loops a selected segment until it is cleared.
- **Horizontal Video Flip:** Flips the video on the X-axis with the use of `Mirror` to evaluate composition balance and silhouttes.
- **Rule of Thirds Grid Overlay:** Injects a 3x3 compositional grid for analyzing framing and staging.
- **Variable Playback Speeds:** Switch between `0.25x`, `0.5x`, `1.0x` with smooth active transitions. 

---

<!-- Recommendations -->
## Recommendations
- **Ad Awareness:** Currently, the HUD does not automatically hide during the pre-roll ads. It is recommended to use an ad-blocker or wait until the video starts to avoid tracking ad timestamps.
- **Draggable Positioning (Planned):** Allow repositioning of the HUD anywhere on the video player.
- **Collapsible to Mini-Mode (Planned):** Provides a compact toggle to minimize the HUD into a slim frame counter for a clearer view.

---

<!-- Programming Languages used -->
## Tech Stack
- **JavaScript** — Pure Vanilla DOM manipulation and Media APIs
- **CSS** — Design for the HUD
- **Manifest V3** — Modern Chrome Extension Standard

---

<!-- Directory -->
## Project Structure
```
StudyMation/
├── fonts/                                      
    └── Ubuntu-Medium.ttf                       # Bundled local font
├── style/
    └── style.css                               # Custom CSS Styling
├── content.js                                  # Core StudyMation engine & event listeners
├── manifest.json                               # Manifest V3 extension configuration
└── README.md                                   # This file (Documentation)
```

---

<!-- Shortcut changes -->
## Keyboard Shortcut changes
### Extension Shortcuts Added
| Key | Action |
| :--- | :--- |
| **`[`** | Set Loop Start (In) |
| **`]`** | Set Loop End (Out) |
| **`Escape`** | Clears Active Loop |
| **`M` / `m`** | Toggle Mirror (Flip X) |
| **`G` / `g`** | Toggle Grid Overlay |
| **`-`** | Decrease Playback Speed |
| **`=`** | Increase Playback Speed |
| **`,` / `.`** | Skip -1 / +1 Frame |
| **`<` / `>`** | Jump -5 / +5 Frames |

### Native YouTube Keys Overriden
* **`M`** — Replaced native mute with **Toggle Mirror**
* **`<` / `>`** — Replaced Native speed menu with **±5 Frame Jumps**
* **`,` / `.`** — Replaced native 1-frame seek with **Custom Frame Skipping** 

---

<!-- Installation via Local Setup -->
## Local Installation & Setup
You can install and use this extension locally on any chromium-based browser (Google Chrome, Brave, Microsoft Edge, Opera, Vivaldi):
1. **Clone the repository:**
``` bash
git clone https://github.com/MGAceret/Animator-Playback.git
```
2. Open extensions page:
Open your browser and navigate to:
- Chrome / Brave / Opera: ```chrome://extensions/``` 
- Edge: ```edge://extensions/```

3. Enable the **Developer mode** (toggle in the top-right corner).

4. Click the **Load Unpacked** (top-left corner). 
5. Select the cloned ```StudyMation``` folder (containing ```manifest.json```).
6. **Start studying!**
Navigate to any video on YouTube—the StudyMation HUD will automatically appear over the player!

---

<!-- Demonstration video or gif -->
## Demonstration
Uploading Demo.mp4…
