document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('arrayContainer');
    const themeContainer = document.getElementById('theme');
    const currentGuess = document.getElementById('currentGuess');
    const inputGuess = document.getElementById('inputGuess');
    const clearGuess = document.getElementById('clearGuess');
    const guessList = document.getElementById('guessList');

    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const dropdownContent = document.getElementById('dropdownContent');

    const helpButton = document.getElementById('help');
    const helpModal = document.getElementById('helpModal');
    const okButton = document.getElementById('okButton');
    const modalContent = document.querySelector('.modalContent');

    let selectedBoxes = [];
    let guess = '';
    let guesses = [];
    let originalPositions = {};
    let numCorrect = 0;
    let total;
    let themeText;

    function createGrid(size) {
        container.innerHTML = ''; // Clear previous grid
        container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
        container.style.gridTemplateRows = `repeat(${size}, 1fr)`;
        for (let i = 0; i < size * size; i++) {
            const charElement = document.createElement('div');
            charElement.classList.add('letterBox');
            charElement.addEventListener('click', function() {
                handleLetterBoxClick(charElement, i);
            });
            container.appendChild(charElement);
        }
    }

    // Fetch and display initial theme
    fetchTheme('animals.txt');

    // Show dropdown content on hamburger menu click
    hamburgerMenu.addEventListener('click', function() {
        dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
    });

    // Update theme on option click
    document.querySelectorAll('.themeOption').forEach(option => {
        option.addEventListener('click', function() {
            const themeFile = option.getAttribute('data-theme');
            fetchTheme(themeFile);
            dropdownContent.style.display = 'none';
        });
    });

    function fetchTheme(themeFile) {
        fetch(themeFile)
            .then(response => response.text())
            .then(text => {
                const lines = text.split('\n');
                if (lines.length < 5) {
                    throw new Error('Incorrect number of lines: Requires 5');
                }

                const characters = lines[0].trim().split('');
                themeText = lines[1].trim();
                const words = lines[2].trim().split(' ');
                total = parseInt(lines[3].trim(), 10);
                const difficulty = lines[4].trim();

                const gridSize = Math.sqrt(characters.length);
                if (!Number.isInteger(gridSize)) {
                    throw new Error('The number of characters must form a perfect square');
                }

                // Clear current gameboard and guesses
                container.innerHTML = '';
                guessList.innerHTML = '';
                selectedBoxes = [];
                guess = '';
                guesses = [];
                numCorrect = 0;
                currentGuess.textContent = '';

                createGrid(gridSize);

                // Sets color of difficulty meter
                difficultyColor(difficulty);

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
    }

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

        selectedBoxes.forEach(index => {
            const box = container.children[index];
            box.classList.remove('selected');
            box.textContent = '';
            box.style.pointerEvents = 'none';
        });

        if (words.includes(guess)) {
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
            unWinCondition();
        }
    }

    function winCondition() {
        themeContainer.textContent = 'You Win!';
    }

    function unWinCondition() {
        themeContainer.textContent = `Theme: ${themeText}`;
    }

    function difficultyColor(difficulty) {
        let rating = document.getElementById('difficulty'); // Select element by ID
        let ratingText = document.getElementById('rating');

        rating.style.backgroundColor = 'rgb(0, 0, 0)';
        ratingText.textContent = difficulty;

        if (difficulty === 'BEGINNER') {
            rating.style.backgroundColor = 'rgb(22, 150, 150)';
        } else if (difficulty === 'EASY') {
            rating.style.backgroundColor = 'rgb(22, 150, 50)';
        } else if (difficulty === 'MEDIUM') {
            rating.style.backgroundColor = 'rgb(172, 129, 11)';
        } else if (difficulty === 'HARD') {
            rating.style.backgroundColor = 'rgb(172, 11, 11)';
        } else if (difficulty === 'EXPERT') {
            rating.style.backgroundColor = 'rgb(98, 5, 110)';
        }
    }

    helpButton.addEventListener('click', function() {
        helpModal.style.display = 'flex';
    });

    okButton.addEventListener('click', function() {
        modalContent.style.animationName = 'slideOut';
        modalContent.style.animationDuration = '0.2s';
        setTimeout(() => {
            helpModal.style.display = 'none';
            modalContent.style.animationName = 'slideIn';
        }, 200);
    });
});
