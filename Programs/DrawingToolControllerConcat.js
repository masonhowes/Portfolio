document.addEventListener('DOMContentLoaded', () => {
    const toggleColorPicker = document.getElementById('toggleColorPicker');
    const colorPickerMenu = document.getElementById('colorPickerMenu');
    const closeColorPickerMenu = document.getElementById('closeColorPickerMenu');
    const toggleSizePicker = document.getElementById('toggleSizePicker');
    const sizePickerMenu = document.getElementById('sizePickerMenu');
    const closeSizePickerMenu = document.getElementById('closeSizePickerMenu');
    const currentColorDisplay = document.getElementById('currentColor');
    const currentSizeDisplay = document.getElementById('currentSize');
    const hueSlider = document.getElementById('hueSlider');
    const brightnessSlider = document.getElementById('brightnessSlider');
    const saturationSlider = document.getElementById('saturationSlider');
    const colorPickerContainer = document.querySelector('.color-picker-container');
    
    let currentColor = colorDisplay.style.backgroundColor;
    let currentSize = 4;

    // Functions to update the current color and size displays
    function updateCurrentColorDisplay(color) {
        currentColorDisplay.style.backgroundColor = color;
    }

    function updateCurrentSizeDisplay(size) {
        currentSizeDisplay.querySelector('circle').setAttribute('r', size / 2);
    }

    // Add event listeners for toggling and closing menus
    toggleColorPicker.addEventListener('click', () => {
        colorPickerMenu.style.display = colorPickerMenu.style.display === 'block' ? 'none' : 'block';
        sizePickerMenu.style.display = 'none'; // Close size menu if open
    });

    toggleSizePicker.addEventListener('click', () => {
        sizePickerMenu.style.display = sizePickerMenu.style.display === 'block' ? 'none' : 'block';
        colorPickerMenu.style.display = 'none'; // Close color menu if open
    });

    closeColorPickerMenu.addEventListener('click', () => {
        colorPickerMenu.style.display = 'none';
    });

    closeSizePickerMenu.addEventListener('click', () => {
        sizePickerMenu.style.display = 'none';
    });

    // Close menus when clicking outside of them
    document.addEventListener('click', (event) => {
        if (!colorPickerMenu.contains(event.target) && !toggleColorPicker.contains(event.target)) {
            colorPickerMenu.style.display = 'none';
        }
        if (!sizePickerMenu.contains(event.target) && !toggleSizePicker.contains(event.target)) {
            sizePickerMenu.style.display = 'none';
        }
    });

    // Prevent menu close when clicking inside the menus
    colorPickerMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    sizePickerMenu.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Initial setup to display the selected color and size
    updateCurrentColorDisplay(currentColor);
    updateCurrentSizeDisplay(currentSize);


    window.addEventListener('resize', () => {
        if (window.innerWidth > 600) {
            colorPickerMenu.style.display = 'none';
            sizePickerMenu.style.display = 'none';
        }
    });

    // Function to draw color sliders
    function drawColorSliders() {
        const ctxHue = hueSlider.getContext('2d');
        const ctxBrightness = brightnessSlider.getContext('2d');
        const ctxSaturation = saturationSlider.getContext('2d');
        
        const hueGradient = ctxHue.createLinearGradient(0, 0, hueSlider.width, 0);
        hueGradient.addColorStop(0, 'red');
        hueGradient.addColorStop(1 / 6, 'yellow');
        hueGradient.addColorStop(2 / 6, 'lime');
        hueGradient.addColorStop(3 / 6, 'cyan');
        hueGradient.addColorStop(4 / 6, 'blue');
        hueGradient.addColorStop(5 / 6, 'magenta');
        hueGradient.addColorStop(1, 'red');
        ctxHue.fillStyle = hueGradient;
        ctxHue.fillRect(0, 0, hueSlider.width, hueSlider.height);

        const brightnessGradient = ctxBrightness.createLinearGradient(0, 0, brightnessSlider.width, 0);
        brightnessGradient.addColorStop(0, 'black');
        brightnessGradient.addColorStop(1, 'white');
        ctxBrightness.fillStyle = brightnessGradient;
        ctxBrightness.fillRect(0, 0, brightnessSlider.width, brightnessSlider.height);

        const saturationGradient = ctxSaturation.createLinearGradient(0, 0, saturationSlider.width, 0);
        saturationGradient.addColorStop(0, '#fff');
        saturationGradient.addColorStop(1, currentColor);
        ctxSaturation.fillStyle = saturationGradient;
        ctxSaturation.fillRect(0, 0, saturationSlider.width, saturationSlider.height);
    }

    // Initial draw for the sliders
    drawColorSliders();
});