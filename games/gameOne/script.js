// Creation of the gameboard
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('arrayContainer');
    const themeContainer = document.getElementById('theme');
    const currentGuess = document.getElementById('currentGuess');
    const inputGuess = document.getElementById('inputGuess');
    const clearGuess = document.getElementById('clearGuess');
    let selectedBoxes = [];
    let guess = '';

    // Initialize the grid with empty divs
    for (let i = 0; i < 36; i++) {
        const charElement = document.createElement('div');
        charElement.classList.add('letterBox');
        charElement.addEventListener('click', function() {
            handleLetterBoxClick(charElement, i);
        });
        container.appendChild(charElement);
    }

    fetch('wordList.txt')
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n');
            if (lines.length < 4) {
                throw new Error('Incorrect number of lines: Requires 4');
            }

            const characters = lines[0].trim().split('');
            const theme = lines[1].trim();
            const words = lines[2].trim().split(' ');

            if (characters.length !== 36) {
                throw new Error('The first line of the text file must contain exactly 36 characters');
            }

            // Shuffle the characters
            for (let i = characters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [characters[i], characters[j]] = [characters[j], characters[i]];
            }

            // Select all the divs and update their content with shuffled characters
            const letterBoxes = document.querySelectorAll('.letterBox');
            letterBoxes.forEach((box, index) => {
                box.textContent = characters[index];
            });

            // Set the theme text
            themeContainer.textContent = `Today's Theme: ${theme}`;

            inputGuess.addEventListener('click', function() {
                checkGuess(words);
            });

            clearGuess.addEventListener('click', function() {
                removeGuess();
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function handleLetterBoxClick(box, index) {
        if (selectedBoxes.includes(index)) {
            selectedBoxes = selectedBoxes.filter(i => i !== index);
            box.classList.remove('selected');
            guess = guess.slice(0, -1);
        } else {
            selectedBoxes.push(index);
            box.classList.add('selected');
            guess += box.textContent;
        }
        currentGuess.textContent = guess;
    }

    function checkGuess(words) {
        if (words.includes(guess)) {
            selectedBoxes.forEach(index => {
                const box = container.children[index];
                box.classList.remove('selected');
                box.textContent = '';
                box.style.pointerEvents = 'none';
            });
        } else {
            selectedBoxes.forEach(index => {
                const box = container.children[index];
                box.classList.remove('selected');
            });
        }
        selectedBoxes = [];
        guess = '';
        currentGuess.textContent = '';
    }

    function removeGuess() {
        selectedBoxes.forEach(index => {
            const box = container.children[index];
            box.classList.remove('selected');
        });

        selectedBoxes = [];
        guess = '';
        currentGuess.textContent = '';
    }
});
