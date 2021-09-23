// useState: tic tac toe
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
import {useLocalStorageState} from '../utils'

const initialValues = [Array(9).fill(null)]

function Game() {
  const [history, setHistory] = useLocalStorageState('history', initialValues)
  const [currentStep, setCurrentStep] = useLocalStorageState('step', 0)

  const nextValue = calculateNextValue(history[currentStep])
  const winner = calculateWinner(history[currentStep])
  const status = calculateStatus(winner, history[currentStep], nextValue)

  function selectSquare(square) {
    if (winner || history[currentStep][square]) {
      return
    }
    const newHistory = history.slice(0, currentStep + 1)
    const squaresCopy = [...history[currentStep]]
    squaresCopy[square] = nextValue
    setHistory([...newHistory, [...squaresCopy]])
    setCurrentStep(newHistory.length)
  }

  function restart() {
    setHistory(initialValues)
    setCurrentStep(0)
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          selectSquare={selectSquare}
          currentSquares={history[currentStep]}
        />
        <button className="restart" onClick={restart}>
          restart
        </button>
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>
          {history.map((move, i) => {
            let btnText = i === 0 ? 'Go to game start' : `Go to move #${i}`
            const isItCurrent = i === currentStep
            btnText += isItCurrent ? '(current)' : ''
            return (
              <li key={JSON.stringify(move)}>
                <button
                  disabled={isItCurrent}
                  onClick={() => setCurrentStep(i)}
                >
                  {btnText}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}

function Board({selectSquare, currentSquares}) {
  function renderSquare(i) {
    return (
      <button className="square" onClick={() => selectSquare(i)}>
        {currentSquares[i]}
      </button>
    )
  }
  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

// eslint-disable-next-line no-unused-vars
function calculateStatus(winner, squares, nextValue) {
  return winner
    ? `Winner: ${winner}`
    : squares.every(Boolean)
    ? `Scratch: Cat's game`
    : `Next player: ${nextValue}`
}

// eslint-disable-next-line no-unused-vars
function calculateNextValue(squares) {
  return squares.filter(Boolean).length % 2 === 0 ? 'X' : 'O'
}

// eslint-disable-next-line no-unused-vars
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function App() {
  return <Game />
}

export default App
