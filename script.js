document.addEventListener('DOMContentLoaded', () => {
    
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    const twoPlayerButton = document.getElementById('two-player');
    const aiPlayerButton = document.getElementById('ai-player');

    
    let gameActive = true;
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let againstAI = false;

    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    
    const winningMessage = () => `Player ${currentPlayer} has won!`;
    const drawMessage = () => 'Game ended in a draw!';
    const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

    
    statusDisplay.innerHTML = currentPlayerTurn();

    
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        
        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();

        
        if (againstAI && gameActive && currentPlayer === 'O') {
            setTimeout(() => {
                makeAIMove();
            }, 500);
        }
    }

    
    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.innerHTML = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }

    
    function handleResultValidation() {
        let roundWon = false;
        let winningCombination = [];

        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const position1 = gameState[a];
            const position2 = gameState[b];
            const position3 = gameState[c];

            if (position1 === '' || position2 === '' || position3 === '') {
                continue;
            }

            if (position1 === position2 && position2 === position3) {
                roundWon = true;
                winningCombination = [a, b, c];
                break;
            }
        }

        
        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            gameActive = false;
            highlightWinningCells(winningCombination);
            return;
        }

        
        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.innerHTML = drawMessage();
            gameActive = false;
            return;
        }

        
        handlePlayerChange();
    }

    
    function highlightWinningCells(combination) {
        combination.forEach(index => {
            cells[index].classList.add('winning-cell');
        });
    }

    
    function handlePlayerChange() {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.innerHTML = currentPlayerTurn();
    }

    
    function makeAIMove() {
        
        const emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);

        if (emptyCells.length === 0 || !gameActive) return;

        
        let bestMove = findBestMove();
        
        
        const cellToPlay = cells[bestMove];
        handleCellPlayed(cellToPlay, bestMove);
        handleResultValidation();
    }

    
    function findBestMove() {
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            // Check if AI can win
            if (gameState[a] === 'O' && gameState[b] === 'O' && gameState[c] === '') return c;
            if (gameState[a] === 'O' && gameState[c] === 'O' && gameState[b] === '') return b;
            if (gameState[b] === 'O' && gameState[c] === 'O' && gameState[a] === '') return a;
        }

        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            
            if (gameState[a] === 'X' && gameState[b] === 'X' && gameState[c] === '') return c;
            if (gameState[a] === 'X' && gameState[c] === 'X' && gameState[b] === '') return b;
            if (gameState[b] === 'X' && gameState[c] === 'X' && gameState[a] === '') return a;
        }

        
        if (gameState[4] === '') return 4;

        
        const corners = [0, 2, 6, 8].filter(idx => gameState[idx] === '');
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }

        
        const edges = [1, 3, 5, 7].filter(idx => gameState[idx] === '');
        if (edges.length > 0) {
            return edges[Math.floor(Math.random() * edges.length)];
        }

        
        const emptyCells = gameState.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    
    function handleReset() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.innerHTML = currentPlayerTurn();
        
        cells.forEach(cell => {
            cell.innerHTML = '';
            cell.classList.remove('x');
            cell.classList.remove('o');
            cell.classList.remove('winning-cell');
        });
    }

    
    function handleGameModeChange(mode) {
        againstAI = mode === 'ai';
        twoPlayerButton.classList.toggle('active', !againstAI);
        aiPlayerButton.classList.toggle('active', againstAI);
        handleReset();
    }

    
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', handleReset);
    twoPlayerButton.addEventListener('click', () => handleGameModeChange('two-player'));
    aiPlayerButton.addEventListener('click', () => handleGameModeChange('ai'));
});