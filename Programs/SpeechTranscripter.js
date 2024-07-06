document.addEventListener("DOMContentLoaded", function() {
    const recordWidget = document.getElementById("recordWidget");
    const stopWidget = document.getElementById("stopWidget");
    const transcriptContainer = document.querySelector(".transcriptContainer");
    const transcriptWidget = document.querySelector(".transcript");
    const transcriptText = document.getElementById("transcriptText");
    const clearTranscript = document.getElementById("clearTranscript");

    let recognition;
    let userScrolled = false;

    // Check if the browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        transcriptText.innerText = "If you are seeing this message, you need to enable\nWeb Speech API, which is being used to replace Vosk\nto effectively port the program to this portfolio site.\n\nIf you are using Firefox:\n\nType 'about:config' in the address bar and press Enter\nSearch for 'media.webspeech.recognition.enable'\nDouble-click the flag to set it to 'True'\nRefresh this page\n\nIf you instead would prefer to use a different browser,\nthe following support Web Speech API inherently:\n\nGoogle Chrome, Safari, Opera, Microsoft Edge, Samsung Internet,\nQQ browser, Baidu Browser, UC Browser (Android).";
        recordWidget.disabled = true;
        stopWidget.disabled = true;
        return;
    }

    recognition.continuous = true; // Keep recognition continuous
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    let isRecording = false;
    let finalTranscript = '';

    recordWidget.addEventListener("click", function() {
        if (!isRecording) {
            recognition.start();
            isRecording = true;
            transcriptText.innerHTML += "<p class='info'>Recording started:</p>";
            recordWidget.innerHTML = "Recording...";
            scrollToBottom(); // Scroll to the bottom when recording starts
        }
    });

    stopWidget.addEventListener("click", function() {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
            transcriptText.innerHTML += "<p class='info'>Recording stopped.</p>";
            recordWidget.innerHTML = "Record Audio";
            scrollToBottom(); // Scroll to the bottom when recording stops
        }
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
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript + ' ';
            } else {
                interimTranscript += event.results[i][0].transcript + ' ';
            }
        }

        // Process the final transcript with punctuation
        finalTranscript = processWithPunctuation(finalTranscript.trim());

        // Append only if the final transcript is not empty and different from the last one
        if (finalTranscript) {
            const paragraph = document.createElement('p');
            paragraph.innerText = finalTranscript;
            transcriptText.appendChild(paragraph);
            finalTranscript = ''; // Reset final transcript after appending
            if (!userScrolled) {
                scrollToBottom(); // Scroll to the bottom after adding new text
            }
        }
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error detected: " + event.error);
    };

    // Basic punctuation insertion logic
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

    // Detect when the user manually scrolls
    transcriptWidget.addEventListener('scroll', function() {
        if (transcriptWidget.scrollTop + transcriptWidget.clientHeight < transcriptWidget.scrollHeight) {
            userScrolled = true;
        } else {
            userScrolled = false;
        }
    });

    // Automatically start recognition when the page loads (optional)
    // recognition.start();
});
