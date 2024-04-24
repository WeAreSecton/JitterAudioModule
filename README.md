<p align="center">
    <img src="https://fluxum.eu.org/assets/jitter/banner.png" width="100%">
</p>

> [!WARNING]  
> This script is experimental and **very** unstable at the moment.
>

## Usage

1. Open any **Jitter** file.
2. Switch to the *Animation* tab. (doesn't work on *Design*)
3. Open *DevTools* using **Ctrl + Shift + I** or **F12** and switch to the *Console* tab.
3. Enter the following command and press **Enter** to inject the script:
    ```js
    fetch('https://raw.githubusercontent.com/WeAreSecton/JitterAudioModule/main/JitterAudioModule.js').then(response => response.text()).then(script => eval(script));
    ```

## License
Distributed under the MIT license. See ``LICENSE`` for more information.