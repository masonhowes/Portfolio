document.addEventListener('DOMContentLoaded', (event) => {
    const recordButton = document.getElementById('recordButton');
    const stopButton = document.getElementById('stopButton');
    const transcriptDiv = document.getElementById('transcript');

    let recognition;
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        alert('Your browser does not support speech recognition.');
    }

    recognition.continuous = true;
    recognition.interimResults = true;

    recordButton.addEventListener('click', () => {
        recognition.start();
        recordButton.disabled = true;
        stopButton.disabled = false;
        transcriptDiv.innerHTML = '';
    });

    stopButton.addEventListener('click', () => {
        recognition.stop();
        recordButton.disabled = false;
        stopButton.disabled = true;
    });

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }
        transcriptDiv.innerHTML = `<b>Final Transcript:</b> ${finalTranscript}<br><b>Interim Transcript:</b> ${interimTranscript}`;
    };

    recognition.onerror = (event) => {
        console.error(event.error);
    };
});