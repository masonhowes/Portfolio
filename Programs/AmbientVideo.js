document.addEventListener("DOMContentLoaded", function() {
    const uploadInput = document.querySelector("#uploadInput");
    const uploadThumbContainer = document.querySelector(".uploadThumb");
    const mainVideo = document.querySelector(".videoPlayer");
    const backgroundVideo = document.querySelector(".videoBackground");

    function updateThumbnails() {
        const thumbnails = document.querySelectorAll(".thumbVideo");

        thumbnails.forEach(video => {
            video.addEventListener('click', function() {
                thumbnails.forEach(v => v.classList.remove('active'));
                video.classList.add('active');
                mainVideo.src = video.src;
                backgroundVideo.src = video.src;
                mainVideo.play();
                backgroundVideo.play();
            });
        });
    }

    function syncBackgroundVideo() {
        backgroundVideo.currentTime = mainVideo.currentTime;
        backgroundVideo.play();
    }

    // Sync bg vid w main video
    mainVideo.addEventListener('play', syncBackgroundVideo);
    mainVideo.addEventListener('pause', () => backgroundVideo.pause());
    mainVideo.addEventListener('seeked', syncBackgroundVideo);
    mainVideo.addEventListener('ratechange', () => backgroundVideo.playbackRate = mainVideo.playbackRate);
    mainVideo.addEventListener('timeupdate', syncBackgroundVideo);


    // Update thumb
    updateThumbnails();

    uploadInput.addEventListener('change', function(event) {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            const videoURL = URL.createObjectURL(file);

            // Create a new thumbnail
            const newThumb = document.createElement("video");
            newThumb.classList.add("thumbVideo");
            newThumb.src = videoURL;
            newThumb.muted = true;

            // Set the main video player to play the uploaded video and mark it as active
            mainVideo.src = videoURL;
            backgroundVideo.src = videoURL;
            mainVideo.play();
            backgroundVideo.play();

            const thumbnails = document.querySelectorAll(".thumbVideo");
            thumbnails.forEach(v => v.classList.remove('active'));
            newThumb.classList.add('active');

            // Add event listener to the new thumbnail
            newThumb.addEventListener('click', function() {
                const thumbnails = document.querySelectorAll(".thumbVideo");
                thumbnails.forEach(v => v.classList.remove('active'));
                newThumb.classList.add('active');
                mainVideo.src = videoURL;
                backgroundVideo.src = videoURL;
                mainVideo.play();
                backgroundVideo.play();
            });

            uploadThumbContainer.appendChild(newThumb);
            updateThumbnails();
        }
    });
});
