document.addEventListener("DOMContentLoaded", function() {
    const recordWidget = document.getElementById("recordWidget");
    const downloadTranscript = document.getElementById("downloadTranscript");
    const transcriptWidget = document.querySelector(".transcript");
    const transcriptText = document.getElementById("transcriptText");
    const clearTranscript = document.getElementById("clearTranscript");

    const helpButton = document.getElementById('help');
    const helpModal = document.getElementById('helpModal');
    const okButton = document.getElementById('okButton');
    const modalContent = document.querySelector('.modalContent');

    let recognition;

    // Check if the browser supports the Web Speech API
    function checkWebSpeechAPI() {
        if ('webkitSpeechRecognition' in window) {
            recognition = new webkitSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            recognition = new SpeechRecognition();
        } else {
            return false;
        }
        return true;
    }

    if (!checkWebSpeechAPI()) {
        transcriptText.innerText = `If you are seeing this message, you need to enable Web Speech API, 
        which is being used to replace Vosk to effectively port the program to this portfolio site.

        If you are using Firefox:

        Type 'about:config' in the address bar and press Enter
        Search for 'media.webspeech.recognition.enable'
        Double-click the flag to set it to 'True'
        Refresh this page

        If you instead would prefer to use a different browser, the following support Web Speech API inherently:

        Google Chrome, Safari, Opera, Microsoft Edge, Samsung Internet,
        QQ browser, Baidu Browser, UC Browser (Android).`;
        recordWidget.disabled = true;
        return;
    }

    recognition.continuous = true; // Keep recognition continuous
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let isRecording = false;
    let finalTranscript = '';
    let interimParagraph = document.createElement('p');

    recordWidget.addEventListener("click", function() {
        if (!isRecording) {
            recognition.start();
            transcriptText.innerHTML += "<p class='info'>Recording Started</p>";
            recordWidget.innerHTML = "Stop Recording";
            recordWidget.classList.add("recording");
            scrollToBottom(); // Scroll to the bottom when recording starts
        } else {
            recognition.stop();
            transcriptText.innerHTML += "<p class='info'>Recording Stopped</p>";
            recordWidget.innerHTML = "Record Audio";
            recordWidget.classList.remove("recording");
            scrollToBottom(); // Scroll to the bottom when recording stops
        }

        isRecording = !isRecording;
    });

    downloadTranscript.addEventListener("click", function() {
        const text = transcriptText.innerText;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transcript.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });

    clearTranscript.addEventListener("click", function() {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
        }

        recordWidget.innerHTML = "Record Audio";
        transcriptText.innerText = "Transcribed audio will appear here";
        scrollToBottom(); // Scroll to the bottom when the transcript is cleared
    });

    recognition.onresult = function(event) {
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (!event.results[i].isFinal) {
                interimTranscript += event.results[i][0].transcript + ' ';
            } else {
                finalTranscript += event.results[i][0].transcript + ' ';
            }
        }

        // Display interim results in real-time
        interimParagraph.classList.add('interim');
        interimParagraph.innerText = interimTranscript;

        // Append interim paragraph if it's not already present
        if (!document.querySelector('.interim')) {
            transcriptText.appendChild(interimParagraph);
        }

        // Update the interim paragraph if it's already present
        else {
            document.querySelector('.interim').innerText = interimTranscript;
        }

        // Display final transcript
        if (finalTranscript) {
            finalTranscript = processWithPunctuation(finalTranscript.trim());
            const finalParagraph = document.createElement('p');
            finalParagraph.innerText = finalTranscript;
            transcriptText.appendChild(finalParagraph);
            finalTranscript = ''; // Reset final transcript after appending

            // Remove interim paragraph after appending final transcript
            if (interimParagraph) {
                interimParagraph.remove();
                interimParagraph = document.createElement('p');
                interimParagraph.classList.add('interim');
            }
        }

        if (!isUserAtBottom()) {
            scrollToBottom(); // Scroll to the bottom after adding new text if the user is at the bottom
        }
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error detected: " + event.error);
        transcriptText.innerHTML += `<p class='info'>Error: ${event.error}</p>`;
    };

    recognition.onend = function() {
        if (isRecording) {
            recognition.start(); // Restart recognition if it ends unexpectedly
        }
    };

    // Basic punctuation insertion logic (For some reason only edge listens to this)
    function processWithPunctuation(text) {
        // Replace pauses (commas) and stops (periods)
        text = text.replace(/\b(comma|pause)\b/gi, ',');
        text = text.replace(/\b(period|stop)\b/gi, '.');

        // Capitalize the first letter of each sentence
        text = text.replace(/(?:^|\.\s*)([a-z])/g, function(match, p1) {
            return match.toUpperCase();
        });

        return text;
    }

    // Scroll to the bottom of the transcript container
    function scrollToBottom() {
        transcriptWidget.scrollTop = transcriptWidget.scrollHeight;
    }

    // Check if the user is at the bottom of the transcript container
    function isUserAtBottom() {
        return transcriptWidget.scrollHeight - transcriptWidget.scrollTop <= transcriptWidget.clientHeight + 20;
    }

    // Detect when the user manually scrolls
    transcriptWidget.addEventListener('scroll', function() {
        userScrolled = !isUserAtBottom();
    });

    // Request microphone permission for Safari
    async function requestMicrophoneAccess() {
        try {
            await navigator.mediaDevices.getUserMedia({ audio: true });
            console.log("Microphone access granted.");
        } catch (error) {
            console.error("Microphone access denied.", error);
            transcriptText.innerHTML += `<p class='info'>Microphone access denied. Please allow microphone access and try again.</p>`;
            recordWidget.disabled = true;
        }
    }

    // Automatically start recognition when the page loads (optional)
    // recognition.start();

    // Request microphone access on page load
    requestMicrophoneAccess();

    helpButton.addEventListener('click', function() {
        helpModal.style.display = 'flex';
    });

    okButton.addEventListener('click', function() {
        modalContent.style.animationName = 'slideOut';
        modalContent.style.animationDuration = '0.2s';
        setTimeout(() => {
            helpModal.style.display = 'none';
            modalContent.style.animationName = 'slideIn';
        }, 200);
    });
});
