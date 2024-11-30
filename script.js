const cells = document.querySelectorAll('.cell')
const titleHeader = document.querySelector('#titleHeader')
const xPlayerDisplay = document.querySelector('#xPlayerDisplay')
const oPlayerDisplay = document.querySelector('#oPlayerDisplay')
const restartBtn = document.querySelector('#restartBtn')

// Initialize variables for the game
let player = 'X'
let isPauseGame = false
let isGameStart = false
let gameMode = 'computer'
let scores = {
    X: 0,
    O: 0
}

// Array of win conditions
const inputCells = ['', '', '',
                    '', '', '',
                    '', '', '']

// Array of win conditions
const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
]

// Tambahkan variabel baru
let difficulty = 'easy'
const STORAGE_KEY = 'tictactoe_scores'

// Load scores from localStorage
function loadScores() {
    const savedScores = localStorage.getItem(STORAGE_KEY)
    if (savedScores) {
        scores = JSON.parse(savedScores)
        updateScoreDisplay()
    }
}

// Save scores to localStorage
function saveScores() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores))
}

// Update score display
function updateScoreDisplay() {
    document.getElementById('xScore').textContent = scores.X
    document.getElementById('oScore').textContent = scores.O
}

// Add click event listeners to each cell
cells.forEach((cell, index) => {
    cell.addEventListener('click', () => tapCell(cell, index))
})

function tapCell(cell, index) {
    // Pastikan cell kosong dan game tidak pause
    if (cell.textContent === '' && !isPauseGame && 
        (gameMode === 'player' || player === 'X')) {
        
        isGameStart = true
        updateCell(cell, index)
        
        if (!checkWinner()) {
            changePlayer()
            
            // Jika mode computer dan giliran O, jalankan computer move
            if (gameMode === 'computer' && player === 'O') {
                computerMove()
            }
        }
    }
}

function updateCell(cell, index) {
    cell.textContent = player
    inputCells[index] = player
    cell.style.color = (player == 'X') ? '#1892EA' : '#A737FF'
    
    // Add animation
    cell.classList.add('cell-animated')
    setTimeout(() => cell.classList.remove('cell-animated'), 500)
}

function changePlayer() {
    player = (player == 'X') ? 'O' : 'X'
}

function computerMove() {
    isPauseGame = true
    
    setTimeout(() => {
        let moveIndex
        
        switch(difficulty) {
            case 'hard':
                moveIndex = getBestMove()
                break
            case 'medium':
                moveIndex = Math.random() > 0.5 ? getBestMove() : getRandomMove()
                break
            default: // easy
                moveIndex = getRandomMove()
                break
        }
        
        // Pastikan moveIndex valid
        if (moveIndex !== undefined && moveIndex !== null) {
            updateCell(cells[moveIndex], moveIndex)
            
            if (!checkWinner()) {
                changePlayer()
            }
        }
        
        isPauseGame = false
    }, 500)
}

function getRandomMove() {
    const availableMoves = []
    for (let i = 0; i < inputCells.length; i++) {
        if (inputCells[i] === '') {
            availableMoves.push(i)
        }
    }
    
    if (availableMoves.length === 0) return null
    return availableMoves[Math.floor(Math.random() * availableMoves.length)]
}

function checkWinner() {
    for (const [a, b, c] of winConditions) {
        if (inputCells[a] && 
            inputCells[a] === inputCells[b] && 
            inputCells[a] === inputCells[c]) {
            declareWinner([a, b, c])
            return true
        }
    }
    
    // Check for draw
    if (inputCells.every(cell => cell !== '')) {
        declareDraw()
        return true
    }
    
    return false
}

function declareWinner(winningIndices) {
    titleHeader.textContent = `${player} Win`
    isPauseGame = true
    
    scores[player]++
    saveScores() // Save to localStorage
    updateScoreDisplay()
    
    winningIndices.forEach((index) => {
        cells[index].classList.add('winner-cell')
    })
    
    restartBtn.style.visibility = 'visible'
}

function declareDraw() {
    titleHeader.textContent = 'Draw!'
    isPauseGame = true
    restartBtn.style.visibility = 'visible'
}

function choosePlayer(selectedPlayer) {
    // Ensure the game hasn't started
    if (!isGameStart) {
        // Override the selected player value
        player = selectedPlayer
        if (player == 'X') {
            // Hightlight X display
            xPlayerDisplay.classList.add('player-active')
            oPlayerDisplay.classList.remove('player-active')
        } else {
            // Hightlight O display
            xPlayerDisplay.classList.remove('player-active')
            oPlayerDisplay.classList.add('player-active')
        }
    }
}

function setGameMode(mode) {
    if (isGameStart) {
        alert('Silakan tekan tombol Restart terlebih dahulu sebelum mengganti mode permainan!')
        return
    }
    
    gameMode = mode
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active')
    })
    event.target.classList.add('active')
    
    // Toggle difficulty selector visibility
    const modeSelector = document.querySelector('.mode-selector')
    if (mode === 'computer') {
        modeSelector.classList.add('computer-mode')
    } else {
        modeSelector.classList.remove('computer-mode')
    }
    
    resetGame()
}

function setDifficulty(diff) {
    if (isGameStart) {
        alert('Silakan tekan tombol Restart terlebih dahulu sebelum mengganti tingkat kesulitan!')
        return
    }
    
    difficulty = diff
    document.querySelectorAll('.diff-btn').forEach(btn => {
        btn.classList.remove('active')
    })
    event.target.classList.add('active')
}

function resetGame() {
    restartBtn.style.visibility = 'hidden'
    inputCells.fill('')
    cells.forEach(cell => {
        cell.textContent = ''
        cell.style.background = ''
        cell.classList.remove('winner-cell')
    })
    isPauseGame = false
    isGameStart = false
    titleHeader.textContent = 'Choose'
    player = 'X'
    
    // Reset tampilan player aktif
    xPlayerDisplay.classList.add('player-active')
    oPlayerDisplay.classList.remove('player-active')
}

restartBtn.addEventListener('click', resetGame)

// Tambahkan fungsi untuk mengecek game over
function checkGameOver() {
    // Check for winner
    for (const [a, b, c] of winConditions) {
        if (inputCells[a] && inputCells[a] === inputCells[b] && inputCells[a] === inputCells[c]) {
            return inputCells[a]
        }
    }
    
    // Check for draw
    if (inputCells.every(cell => cell !== '')) {
        return 'draw'
    }
    
    return null
}

// Implementasi minimax algorithm untuk tingkat kesulitan hard
function getBestMove() {
    let bestScore = -Infinity
    let bestMove
    
    for(let i = 0; i < inputCells.length; i++) {
        if(inputCells[i] === '') {
            inputCells[i] = 'O'
            let score = minimax(inputCells, 0, false)
            inputCells[i] = ''
            if(score > bestScore) {
                bestScore = score
                bestMove = i
            }
        }
    }
    return bestMove
}

function minimax(board, depth, isMaximizing) {
    let result = checkGameOver()
    if(result !== null) {
        return result === 'O' ? 1 : result === 'X' ? -1 : 0
    }
    
    if(isMaximizing) {
        let bestScore = -Infinity
        for(let i = 0; i < board.length; i++) {
            if(board[i] === '') {
                board[i] = 'O'
                let score = minimax(board, depth + 1, false)
                board[i] = ''
                bestScore = Math.max(score, bestScore)
            }
        }
        return bestScore
    } else {
        let bestScore = Infinity
        for(let i = 0; i < board.length; i++) {
            if(board[i] === '') {
                board[i] = 'X'
                let score = minimax(board, depth + 1, true)
                board[i] = ''
                bestScore = Math.min(score, bestScore)
            }
        }
        return bestScore
    }
}

// Load scores when page loads
document.addEventListener('DOMContentLoaded', loadScores)

