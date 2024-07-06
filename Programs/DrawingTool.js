// Defines from html id rips
const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');
const undoButton = document.getElementById('undoButton');
const redoButton = document.getElementById('redoButton');
const eraseButton = document.getElementById('eraseButton');
const clearCanvasButton = document.getElementById('clearCanvasButton');
const colorDisplay = document.getElementById('colorDisplay');
const currentColor = document.getElementById('currentColor');
const hueSlider = document.getElementById('hueSlider');
const brightnessSlider = document.getElementById('brightnessSlider');
const saturationSlider = document.getElementById('saturationSlider');
const hueSliderSmall = document.getElementById('hueSliderSmall');
const brightnessSliderSmall = document.getElementById('brightnessSliderSmall');
const saturationSliderSmall = document.getElementById('saturationSliderSmall');
const sizeButtons = document.querySelectorAll('.sizeButton');

// Builds drawing canvas and alows for scalability
let originalWidth = 500;
let originalHeight = 500;
canvas.width = originalWidth;
canvas.height = originalHeight;

// Builds functional dimensions of slider
hueSlider.width = 200;
hueSlider.height = 30;
brightnessSlider.width = 200;
brightnessSlider.height = 30;
saturationSlider.width = 200;
saturationSlider.height = 30;

hueSliderSmall.width = 200;
hueSliderSmall.height = 30;
brightnessSliderSmall.width = 200;
brightnessSliderSmall.height = 30;
saturationSliderSmall.width = 200;
saturationSliderSmall.height = 30;

// Initializes state of different drawing functions
let isDrawing = false;
let isPointerDown = false;
let drawColor = '#000000';
let lineWidth = 4;
let isErasing = false;
let history = [];
let redoStack = [];
let hue = 0; // Initial hue value
let brightness = 50; // Initial brightness value
let saturation = 100; // Initial saturation value

// Initialize canvas with white background
context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);
saveHistory();

// Create custom cursor element
const cursorCircle = document.createElement('div');
cursorCircle.classList.add('cursor-circle');
document.body.appendChild(cursorCircle);

// Calls functions during different actions
canvas.addEventListener('pointerdown', startDrawing);
canvas.addEventListener('pointerup', stopDrawing);
canvas.addEventListener('pointermove', draw);
canvas.addEventListener('pointermove', updateCursor);

document.addEventListener('pointerup', () => {
    isPointerDown = false;
    cursorCircle.style.display = 'block';
});

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);
eraseButton.addEventListener('click', toggleErase);
clearCanvasButton.addEventListener('click', clearCanvas);

sizeButtons.forEach(div => {
    div.addEventListener('click', (e) => {
        lineWidth = parseInt(div.getAttribute('data-size'));
        updateCursor();
    });
});

canvas.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Draw sliders
function drawSliders() {
    drawHueSlider();
    drawSaturationSlider();
    drawBrightnessSlider();

    drawSmallHueSlider();
    drawSmallSaturationSlider();
    drawSmallBrightnessSlider();

    updateCurrentColor();
}

// Builds hue slider
function drawHueSlider() {
    const ctx = hueSlider.getContext('2d');
    const width = hueSlider.width;
    const height = hueSlider.height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    for (let i = 0; i <= 360; i += 1) {
        gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawSliderIndicator(ctx, hue / 360, width, height);
}

function drawSmallHueSlider() {
    const ctx = hueSliderSmall.getContext('2d');
    const width = hueSliderSmall.width;
    const height = hueSliderSmall.height;

    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    for (let i = 0; i <= 360; i += 1) {
        gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawSliderIndicator(ctx, hue / 360, width, height);
}

// Builds brightness slider
function drawBrightnessSlider() {
    const ctx = brightnessSlider.getContext('2d');
    const width = brightnessSlider.width;
    const height = brightnessSlider.height;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    // Calculate the current color in HSL format
    const currentColor = `hsl(${hue}, ${saturation}%, 50%)`;

    // Define gradient stops dynamically based on brightness
    gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, 0%)`); // Black
    gradient.addColorStop(0.5, currentColor); // Current color
    gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, 100%)`); // White

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawSliderIndicator(ctx, brightness / 100, width, height);
}

function drawSmallBrightnessSlider() {
    const ctx = brightnessSliderSmall.getContext('2d');
    const width = brightnessSliderSmall.width;
    const height = brightnessSliderSmall.height;
    const gradient = ctx.createLinearGradient(0, 0, width, 0);

    // Calculate the current color in HSL format
    const currentColor = `hsl(${hue}, ${saturation}%, 50%)`;

    // Define gradient stops dynamically based on brightness
    gradient.addColorStop(0, `hsl(${hue}, ${saturation}%, 0%)`); // Black
    gradient.addColorStop(0.5, currentColor); // Current color
    gradient.addColorStop(1, `hsl(${hue}, ${saturation}%, 100%)`); // White

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawSliderIndicator(ctx, brightness / 100, width, height);
}

// Builds saturation slider
function drawSaturationSlider() {
    const ctx = saturationSlider.getContext('2d');
    const width = saturationSlider.width;
    const height = saturationSlider.height;

    const gradient= ctx.createLinearGradient(0, 0, width, 0);

    gradient.addColorStop(0, `hsl(${hue}, 0%, ${brightness}%)`);
    gradient.addColorStop(1, `hsl(${hue}, 100%, ${brightness}%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawSliderIndicator(ctx, saturation / 100, width, height);
}

function drawSmallSaturationSlider() {
    const ctx = saturationSliderSmall.getContext('2d');
    const width = saturationSliderSmall.width;
    const height = saturationSliderSmall.height;

    const gradient= ctx.createLinearGradient(0, 0, width, 0);

    gradient.addColorStop(0, `hsl(${hue}, 0%, ${brightness}%)`);
    gradient.addColorStop(1, `hsl(${hue}, 100%, ${brightness}%)`);

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    drawSliderIndicator(ctx, saturation / 100, width, height);
}

// Builds slider indicator (the rectangle)
function drawSliderIndicator(ctx, position, width, height) {
    const indicatorWidth = 5;
    const indicatorHeight = height;
    const x = position * (width - indicatorWidth);
    const y = 0;

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, indicatorWidth, indicatorHeight);

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 1, y + 1, indicatorWidth - 2, indicatorHeight - 2);
}

// Determines what color the user wants to use
function updateCurrentColor() {
    const color = `hsl(${hue}, ${saturation}%, ${brightness}%)`;
    drawColor = color; // Update the drawing color
    colorDisplay.style.backgroundColor = color;
    currentColor.style.backgroundColor = color;
    sizeColor.style.fill = color;
    sizeColor.setAttribute('fill', color);
    updateSvgColor(color); // Update the SVG colors
}

// Obtains color based on position
function getSliderValue(slider, event) {
    const rect = slider.getBoundingClientRect();
    const x = event.clientX - rect.left;
    return (x / rect.width);
}

function updateColorFromSlider(slider, event) {
    const value = getSliderValue(slider, event);
    if (slider === hueSlider || slider === hueSliderSmall) {
        hue = value * 360;
    } else if (slider === brightnessSlider || slider === brightnessSliderSmall) {
        brightness = value * 100;
    } else if (slider === saturationSlider || slider === saturationSliderSmall) {
        saturation = value * 100;
    }
    drawSliders();
    updateCurrentColor();
    
}

// Allows for sliding action on sliders
hueSlider.addEventListener('pointerdown', (e) => updateColorFromSlider(hueSlider, e));
hueSlider.addEventListener('pointermove', (e) => {
    if (e.buttons === 1) updateColorFromSlider(hueSlider, e);
});
hueSlider.addEventListener('pointerup', (e) => {
    updateColorFromSlider(hueSlider, e);
    updateCurrentColor(); // Update color on pointer up
});

hueSliderSmall.addEventListener('pointerdown', (e) => updateColorFromSlider(hueSliderSmall, e));
hueSliderSmall.addEventListener('pointermove', (e) => {
    if (e.buttons === 1) updateColorFromSlider(hueSliderSmall, e);
});
hueSliderSmall.addEventListener('pointerup', (e) => {
    updateColorFromSlider(hueSliderSmall, e);
    updateCurrentColor(); // Update color on pointer up
});

// Allows for sliding action on sliders
brightnessSlider.addEventListener('pointerdown', (e) => updateColorFromSlider(brightnessSlider, e));
brightnessSlider.addEventListener('pointermove', (e) => {
    if (e.buttons === 1) updateColorFromSlider(brightnessSlider, e);
});
brightnessSlider.addEventListener('pointerup', (e) => {
    updateColorFromSlider(brightnessSlider, e);
    updateCurrentColor(); // Update color on pointer up
});

brightnessSliderSmall.addEventListener('pointerdown', (e) => updateColorFromSlider(brightnessSliderSmall, e));
brightnessSliderSmall.addEventListener('pointermove', (e) => {
    if (e.buttons === 1) updateColorFromSlider(brightnessSliderSmall, e);
});
brightnessSliderSmall.addEventListener('pointerup', (e) => {
    updateColorFromSlider(brightnessSliderSmall, e);
    updateCurrentColor(); // Update color on pointer up
});

// Allows for sliding action on sliders
saturationSlider.addEventListener('pointerdown', (e) => updateColorFromSlider(saturationSlider, e));
saturationSlider.addEventListener('pointermove', (e) => {
    if (e.buttons === 1) updateColorFromSlider(saturationSlider, e);
});
saturationSlider.addEventListener('pointerup', (e) => {
    updateColorFromSlider(saturationSlider, e);
    updateCurrentColor(); // Update color on pointer up
});

saturationSliderSmall.addEventListener('pointerdown', (e) => updateColorFromSlider(saturationSliderSmall, e));
saturationSliderSmall.addEventListener('pointermove', (e) => {
    if (e.buttons === 1) updateColorFromSlider(saturationSliderSmall, e);
});
saturationSliderSmall.addEventListener('pointerup', (e) => {
    updateColorFromSlider(saturationSliderSmall, e);
    updateCurrentColor(); // Update color on pointer up
});

// Builds sliders
drawSliders();

// Intializes drawing action
function startDrawing(event) {
    isDrawing = true;
    isPointerDown = true;
    context.beginPath();
    draw(event);
}

// Functionality of cease of drawing
function stopDrawing() {
    if (isDrawing) {
        isDrawing = false;
        isPointerDown = false;
        context.beginPath();
        saveHistory();
        redoStack = []; // Clear the redo stack whenever a new action is taken
    }
}

// Actually draws
function draw(event) {
    if (!isDrawing || !isPointerDown) return;

    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) * (originalWidth / rect.width);
    const y = (event.clientY - rect.top) * (originalHeight / rect.height);

    context.lineWidth = lineWidth;
    context.lineCap = 'round';
    context.strokeStyle = isErasing ? 'white' : drawColor;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);

    if (!isErasing) {
        cursorCircle.style.display = 'none';
    }
}

window.addEventListener('resize', resizeCanvas);

// Remembers what was done on a given brushstroke
function saveHistory() {
    if (history.length >= 10) {
        history.shift();
    }
    history.push(context.getImageData(0, 0, canvas.width, canvas.height));
}

// Throws it back
function undo() {
    if (history.length > 1) {
        redoStack.push(history.pop());
        context.putImageData(history[history.length - 1], 0, 0);
    }
}

// Throws it forward
function redo() {
    if (redoStack.length > 0) {
        history.push(redoStack.pop());
        context.putImageData(history[history.length - 1], 0, 0);
    }
}

// Enters erasing mode
function toggleErase() {
    isErasing = !isErasing;
    eraseButton.innerHTML = isErasing ? '<img src="draw.svg" alt="Erase">' : '<img src="erase.svg" alt="Erase">';
    updateCursor();
}

// Changes the circle pos to be in correct spot
function updateCursor(event) {
    if (event) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left - lineWidth / 2;
        const y = event.clientY - rect.top - lineWidth / 2;

        cursorCircle.style.left = `${x + rect.left}px`;
        cursorCircle.style.top = `${y + rect.top}px`;
    }

    cursorCircle.style.width = `${lineWidth}px`;
    cursorCircle.style.height = `${lineWidth}px`;
    cursorCircle.style.borderColor = isErasing ? 'red' : drawColor;

    if (!isDrawing) {
        cursorCircle.style.display = 'block';
    }
}

// Click action
canvas.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'pen' || e.pointerType === 'mouse' || e.pointerType === 'touch') {
        isPointerDown = true;
        startDrawing(e);
    }
});

// Release action
canvas.addEventListener('pointerup', (e) => {
    if (e.pointerType === 'pen' || e.pointerType === 'mouse' || e.pointerType === 'touch') {
        isPointerDown = false;
        stopDrawing();
    }
});

// Deploys functions
canvas.addEventListener('touchstart', preventDefault);
canvas.addEventListener('touchmove', preventDefault);
canvas.addEventListener('touchend', preventDefault);

function preventDefault(event) {
    event.preventDefault();
}

// Kills humanity
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    saveHistory();
}

resizeCanvas();
drawSliders();
updateCurrentColor();