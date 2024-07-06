document.getElementById('undoButton').addEventListener('click', function() {
    // Toggle 'flashing' class to change background color
    this.classList.toggle('flashing');

    // Remove 'flashing' class after a short delay
    setTimeout(() => {
        this.classList.toggle('flashing');
    }, 200); // Adjust the time to control how long the flash lasts
});