// script.js

document.addEventListener("DOMContentLoaded", function() {
    const recordWidget = document.getElementById("recordWidget");
    const stopWidget = document.getElementById("stopWidget");
    const transcriptText = document.getElementById("transcriptText");
    const clearTranscript = document.getElementById("clearTranscript");

    let recognition;

    // Check if the browser supports the Web Speech API
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        transcriptText.innerText = "Your browser does not support the Web Speech API. Please use a supported browser like Google Chrome.";
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
        }
    });

    stopWidget.addEventListener("click", function() {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
            transcriptText.innerHTML += "<p class='info'>Recording stopped.</p>";
            recordWidget.innerHTML = "Record Audio";
        }
    });

    clearTranscript.addEventListener("click", function() {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
        }

        transcriptText.innerHTML = "<p class='info'>Transcribed audio will appear here</p>";
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
        if (finalTranscript && finalTranscript !== transcriptText.lastElementChild.innerText.trim()) {
            transcriptText.innerHTML += `<p>${finalTranscript}</p>`;
            finalTranscript = ''; // Reset final transcript after appending
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

    // Automatically start recognition when the page loads (optional)
    // recognition.start();
});
