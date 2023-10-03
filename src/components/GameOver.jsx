import React from 'react';
import './GameOver.css';

const GameOver = ({retry, score}) => {
  return (
    <div>
        <h1>Game over!</h1>
        <h2>Sua pontuação: <span>{score}</span></h2>
        <button onClick={retry}>Tente novamente</button>
    </div>
  )
}

export default GameOver