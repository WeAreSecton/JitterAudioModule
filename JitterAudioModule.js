const toolbar = document.getElementById('toolbar');
const playButton = document.querySelector('.timeline-module--playBtn--rTsrZ');
const currentTime = document.querySelector('.timeline-module--cursorTime--jqrD3');
const audioModule = document.createElement('button');
const style = document.createElement('style');
const audioElement = document.createElement('audio');
document.body.appendChild(audioElement);
audioModule.setAttribute('class', 'topbar-module--topBarBtn--AvMta');
audioModule.setAttribute('id', 'audioModule');
audioModule.innerHTML = '<svg class="icon-module--root--14-W4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="font-size: 24px;"><path fill="white" d="M10.75 19q.95 0 1.6-.65t.65-1.6V13h3v-2h-4v3.875q-.275-.2-.587-.288t-.663-.087q-.95 0-1.6.65t-.65 1.6t.65 1.6t1.6.65M4 22V2h10l6 6v14zm9-13h5l-5-5z"/></svg>';
audioModule.setAttribute('title', 'Add audio');
toolbar.appendChild(audioModule);

document.getElementById('audioModule').addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            style.innerHTML = `
            #audioModule {
                background-color: #29a9ff;
            }
            #audioModule:hover {
                background-color: #50b8ff;
            }
            `;
            document.head.appendChild(style);
            const previousAudio = document.querySelector('audio');
            if (previousAudio) {
                previousAudio.remove();
            }
            const audioElement = document.createElement('audio');
            audioElement.src = URL.createObjectURL(file);
            document.body.appendChild(audioElement);
        }
    });
    input.click();
});

document.addEventListener('click', function (event) {
    if (event.target === playButton) {
        let previousTime = parseFloat(currentTime.textContent);
        let isPlaying = true;

        // Function to toggle play/pause
        function togglePlayPause() {
            if (isPlaying) {
                // Pause audio
                isPlaying = false;
                audioElement.pause();
            } else {
                // Play audio
                isPlaying = true;
                audioElement.play();
            }
        }

        // Interval to check if time is moving forward or backward
        setInterval(function () {
            const currentTime = parseFloat(currentTime.textContent);
            if (currentTime < previousTime) {
                // Time is moving backward or paused
                togglePlayPause();
            }
            previousTime = currentTime;
        }, 100);
    }
});

playButton.addEventListener('click', () => {
    if (audioElement.paused) {
        // If audio is paused, play it
        audioElement.play().catch(error => {
            // Handle any errors that occur during playback
            console.error('Error playing audio:', error);
        });
    } else {
        // If audio is playing, pause it
        audioElement.pause();
    }
});