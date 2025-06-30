document.addEventListener('DOMContentLoaded', () => {
    const words = [
        'ISHIKAWA', 'PROBLEMAS', 'CAUSA', 'RAIZ', 'EQUIPO', 'DIAGRAMA', 'METODO', 
        'ANALISIS', 'CALIDAD', 'PROCESO', 'SOLUCIONES', 'EFECTIVO', 'SINTOMA', 
        'MEDICION', 'MATERIALES', 'PASOS'
    ];
    const gridSize = 15;
    let grid = [];
    let foundWords = [];
    
    // Elementos del DOM
    const gridContainer = document.getElementById('grid-container');
    const wordListElement = document.getElementById('word-list');
    const teamDisplay = document.getElementById('team-display');
    const timerDisplay = document.getElementById('timer-display');
    const winModal = document.getElementById('win-modal');
    
    // Lógica de selección
    let isSelecting = false;
    let selection = [];

    // Lógica del temporizador
    let timerInterval;
    let seconds = 0;

    function init() {
        assignTeam();
        startTimer();
        createGridData();
        placeWords();
        fillEmptyCells();
        renderGrid();
        renderWordList();
        addEventListeners();
    }

    function assignTeam() {
        const teams = ['Equipo 1', 'Equipo 2', 'Equipo 3', 'Equipo Rojo', 'Equipo Azul'];
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        teamDisplay.textContent = `Jugando como: ${randomTeam}`;
        document.getElementById('winning-team').textContent = randomTeam;
    }

    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            const min = Math.floor(seconds / 60).toString().padStart(2, '0');
            const sec = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `Tiempo: ${min}:${sec}`;
        }, 1000);
    }

    function createGridData() {
        grid = Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    }

    function placeWords() {
        words.forEach(word => {
            let placed = false;
            while (!placed) {
                const direction = Math.floor(Math.random() * 3); // 0: H, 1: V, 2: D
                const row = Math.floor(Math.random() * gridSize);
                const col = Math.floor(Math.random() * gridSize);

                if (canPlaceWord(word, row, col, direction)) {
                    placeWord(word, row, col, direction);
                    placed = true;
                }
            }
        });
    }

    function canPlaceWord(word, row, col, direction) {
        for (let i = 0; i < word.length; i++) {
            let r = row, c = col;
            if (direction === 0) c += i; // Horizontal
            if (direction === 1) r += i; // Vertical
            if (direction === 2) { r += i; c += i; } // Diagonal

            if (r >= gridSize || c >= gridSize || (grid[r][c] !== null && grid[r][c] !== word[i])) {
                return false;
            }
        }
        return true;
    }

    function placeWord(word, row, col, direction) {
        for (let i = 0; i < word.length; i++) {
            let r = row, c = col;
            if (direction === 0) c += i;
            if (direction === 1) r += i;
            if (direction === 2) { r += i; c += i; }
            grid[r][c] = word[i];
        }
    }

    function fillEmptyCells() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === null) {
                    grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
                }
            }
        }
    }

    function renderGrid() {
        gridContainer.innerHTML = '';
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.textContent = grid[r][c];
                cell.dataset.row = r;
                cell.dataset.col = c;
                gridContainer.appendChild(cell);
            }
        }
    }

    function renderWordList() {
        wordListElement.innerHTML = '';
        words.sort().forEach(word => {
            const li = document.createElement('li');
            li.textContent = word;
            li.id = `word-${word}`;
            wordListElement.appendChild(li);
        });
    }
    
    function addEventListeners() {
        gridContainer.addEventListener('mousedown', e => {
            if (e.target.classList.contains('grid-cell')) {
                isSelecting = true;
                selection = [e.target];
                e.target.classList.add('selecting');
            }
        });

        gridContainer.addEventListener('mouseover', e => {
            if (isSelecting && e.target.classList.contains('grid-cell')) {
                const lastCell = selection[selection.length - 1];
                if (e.target !== lastCell) {
                    selection.push(e.target);
                    e.target.classList.add('selecting');
                }
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isSelecting) {
                isSelecting = false;
                checkSelection();
                document.querySelectorAll('.selecting').forEach(cell => cell.classList.remove('selecting'));
            }
        });
    }

    function checkSelection() {
        const selectedWord = selection.map(cell => cell.textContent).join('');
        const reversedSelectedWord = selectedWord.split('').reverse().join('');

        if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
            markWordAsFound(selectedWord);
        } else if (words.includes(reversedSelectedWord) && !foundWords.includes(reversedSelectedWord)) {
            markWordAsFound(reversedSelectedWord);
        }
    }

    function markWordAsFound(word) {
        foundWords.push(word);
        selection.forEach(cell => cell.classList.add('found'));
        document.getElementById(`word-${word}`).classList.add('found');
        checkWinCondition();
    }

    function checkWinCondition() {
        if (foundWords.length === words.length) {
            clearInterval(timerInterval);
            document.getElementById('final-time').textContent = timerDisplay.textContent.replace('Tiempo: ', '');
            winModal.classList.remove('modal-hidden');
            winModal.style.display = 'flex';
        }
    }

    init();
});