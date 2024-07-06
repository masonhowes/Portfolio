const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');

const originalWidth = 500;
const originalHeight = 500;

function resizeCanvas() {
    let newWidth = originalWidth;
    let newHeight = originalHeight;

    if (window.innerWidth < 550) {
        // Calculate the new width while keeping the aspect ratio
        newWidth = window.innerWidth - 50; // Leave 25px margin on each side
        newHeight = (originalHeight * newWidth) / originalWidth;

        // Check if the new height exceeds the maximum allowed height
        if (newHeight > originalHeight) {
            // If it exceeds, scale down the height and adjust the width accordingly
            newHeight = originalHeight;
            newWidth = (originalWidth * newHeight) / originalHeight;
        }
    }

    // Get the current content of the canvas
    const imageData = context.getImageData(0, 0, originalWidth, originalHeight);

    // Adjust the canvas size
    canvas.width = newWidth;
    canvas.height = newHeight;

    // Scale the canvas content
    const scalingFactor = newWidth / originalWidth;
    const scaledImageData = scaleImageData(imageData, scalingFactor);
    context.putImageData(scaledImageData, 0, 0);
}

function scaleImageData(imageData, scale) {
    const scaled = context.createImageData(imageData.width * scale, imageData.height * scale);
    for (let row = 0; row < imageData.height; row++) {
        for (let col = 0; col < imageData.width; col++) {
            const sourcePixel = (row * imageData.width + col) * 4;
            const scaledRow = Math.floor(row * scale);
            const scaledCol = Math.floor(col * scale);
            const destPixel = (scaledRow * scaled.width + scaledCol) * 4;
            scaled.data[destPixel] = imageData.data[sourcePixel];
            scaled.data[destPixel + 1] = imageData.data[sourcePixel + 1];
            scaled.data[destPixel + 2] = imageData.data[sourcePixel + 2];
            scaled.data[destPixel + 3] = imageData.data[sourcePixel + 3];
        }
    }
    return scaled;
}

// Initial resize to ensure correct size on load
resizeCanvas();

// Resize canvas dynamically on window resize
window.addEventListener('resize', resizeCanvas);