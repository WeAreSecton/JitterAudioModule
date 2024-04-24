//
// JitterAudioModule
// https://github.com/WeAreSecton/JitterAudioModule
//

// ! WARNING !
// ! This script is experimental and very unstable. There are many issues with it, but it's
// ! made for partial audio support until Jitter officially rolls out support for audio files.
// ! If you are a developer, please take some time to fix a few bugs and PR them to the repository.

let audioContext;
let audioBuffer;
let isPlaying = false;
let isAudioPlaying = false;

function initAudio(audioFile) {
    audioContext = new AudioContext();
    return fetch(audioFile)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(decodedBuffer => {
            audioBuffer = decodedBuffer;
        })
}

function playAudio(timestamp, duration) {
    if (!audioBuffer) {
        return;
    }
    const [secondsStr, millisecondsStr] = timestamp.split('.');
    const seconds = parseInt(secondsStr, 10);
    const milliseconds = parseInt(millisecondsStr, 10);
    const startTime = seconds + (milliseconds / 1000);
    const durationMilliseconds = parseFloat(duration.replace('s', '')) * 1000 || Infinity;
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    if (isAudioPlaying) {
        audioContext.suspend();
        isAudioPlaying = false;
    } else {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start(0, startTime);
        isAudioPlaying = true;
        source.onended = () => {
            isAudioPlaying = false;
        };
        source.onerror = (error) => {
            console.error('Error during audio playback:', error);
            isAudioPlaying = false;
        };
        setTimeout(() => {
            source.stop();
        }, durationMilliseconds - timestamp);
    }
}

const audioModule = document.createElement('button');
audioModule.setAttribute('class', 'topbar-module--topBarBtn--AvMta');
audioModule.setAttribute('id', 'audioModule');
audioModule.setAttribute('title', 'Add audio');
audioModule.innerHTML = '<svg class="icon-module--root--14-W4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="font-size: 24px;"><path fill="white" d="M10.75 19q.95 0 1.6-.65t.65-1.6V13h3v-2h-4v3.875q-.275-.2-.587-.288t-.663-.087q-.95 0-1.6.65t-.65 1.6t.65 1.6t1.6.65M4 22V2h10l6 6v14zm9-13h5l-5-5z"/></svg>';
const toolbar = document.getElementById('toolbar');
toolbar.appendChild(audioModule);
const optionsContainer = document.querySelectorAll('.inspector-module--container--zbszZ')[0];
const audioOptions = document.createElement('div');
audioOptions.setAttribute('class', 'inspector-module--container--zbszZ');
audioOptions.setAttribute('id', 'audioOptions');
optionsContainer.parentNode.insertBefore(audioOptions, optionsContainer.nextSibling);
audioOptions.innerHTML = `
    <div class="inspector-module--row--rGECI inspector-module--titleRow--+Z8y5">
        <div class="inspector-module--title--b+2K3">Audio</div>
    </div>
    <div class="inspector-module--row--rGECI">
        <label class="inspector-module--label--stJHT">Start from</label>
        <div class="input-module--inputField--JSU-D">
            <div class="input-module--inputWrapper--uSwBO">
                <div class="input-module--popoverAnchor--gtBbS">
                    <div style="position: relative;">
                        <input type="text" autocomplete="off" spellcheck="false" class="input-module--input--d8fPc" name="start-time" aria-label="start-time" data-allow-playback="true" value="0s">
                    </div>
                </div>
            </div>
        </div>
    </div>
`;

audioModule.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const style = document.createElement('style');
            style.innerHTML = `
                #audioModule {
                    background-color: #29a9ff;
                }
                #audioModule:hover {
                    background-color: #50b8ff;
                }
            `;
            document.head.appendChild(style);
            initAudio(URL.createObjectURL(file))
                .then(() => {
                    console.log('Audio initialized');
                })
                .catch(error => {
                    console.error('Error initializing audio:', error);
                });
        }
    });
    input.click();
});

const playButton = document.querySelector('.timeline-module--playBtn--rTsrZ');
playButton.addEventListener('click', () => {
    const currentTimeElement = document.querySelector('.timeline-module--cursorTime--jqrD3');
    const currentTime = currentTimeElement.textContent;
    const durationInput = document.querySelector('input[name="duration"]');
    const duration = durationInput ? durationInput.value : null;
    playAudio(currentTime, duration);
    if (isPlaying) {
        isPlaying = false;
    } else {
        isPlaying = true;
    }
});