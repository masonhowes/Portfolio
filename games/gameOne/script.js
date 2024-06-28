// Creation of the gameboard
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('arrayContainer');
    const themeContainer = document.getElementById('theme');
    const currentGuess = document.getElementById('currentGuess');
    const inputGuess = document.getElementById('inputGuess');
    const clearGuess = document.getElementById('clearGuess');
    const guessList = document.getElementById('guessList');
    let selectedBoxes = [];
    let guess = '';
    let guesses = [];
    let originalPositions = {};
    let numCorrect = 0;
    let total;
    let themeText;

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
            themeText = lines[1].trim();
            const words = lines[2].trim().split(' ');
            total = parseInt(lines[3].trim(), 10);

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
                originalPositions[box.textContent] = originalPositions[box.textContent] || [];
                originalPositions[box.textContent].push(index);
            });

            // Set the theme text
            themeContainer.textContent = `Theme: ${themeText}`;

            inputGuess.addEventListener('click', function() {
                checkGuess(words, total);
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

    function checkGuess(words, total) {
        if (guess.length === 0) return;

        if (words.includes(guess)) {
            selectedBoxes.forEach(index => {
                const box = container.children[index];
                box.classList.remove('selected');
                box.textContent = '';
                box.style.pointerEvents = 'none';
            });

            numCorrect++;
            if (numCorrect === total) {
                winCondition();
            }
        }

        addGuess(guess, selectedBoxes, total);
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

    function addGuess(guess, positions, total) {
        const guessElement = document.createElement('div');
        guessElement.classList.add('guessItem');
        guessElement.textContent = guess;
        guessElement.addEventListener('click', function() {
            removeStoredGuess(guess, positions, guessElement, total);
        });
        guessList.appendChild(guessElement);

        guesses.push({ guess, positions });
    }

    function removeStoredGuess(guess, positions, element, total) {
        positions.forEach(index => {
            const box = container.children[index];
            box.textContent = guess.charAt(positions.indexOf(index));
            box.style.pointerEvents = 'auto';
        });

        guessList.removeChild(element);
        guesses = guesses.filter(g => g.guess !== guess);

        if (guesses.includes(guess)) {
            numCorrect--;
        }

        if (themeContainer.textContent === 'You Win!') {
            themeContainer.textContent = `Theme: ${themeText}`;
        }
    }

    function winCondition() {
        themeContainer.textContent = 'You Win!';
    }
});
