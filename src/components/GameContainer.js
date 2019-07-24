import React, { useState, useEffect } from 'react'

export default function GameContainer () {
  const [score, setScore] = useState(0)
  const [word, setWord] = useState([])
  const [typedWord, setTypedWord] = useState('')
  const [time, setTime] = useState(60)
  const [started, setStarted] = useState(false)
  const [timer, setTimer] = useState()
  const [showFinalScore, setShowFinalScore] = useState(false)
  const [resetWord, setResetWord] = useState()
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  const fetchWord = () => {
    fetch('https://random-word-api.netlify.com/.netlify/functions/word?key=foobar')
      .then(res => res.json())
      .then((data) => {
        const letters = data[0].split('')
        const wordObject = letters.map((letter) => {
          return {
            letter,
            match: false
          }
        })
        setWord(wordObject)
        setResetWord(wordObject)
        setLoading(false)
      }).catch(() => {
        setFetchError(true)
      })
  }

  const startTimer = () => {
    setStarted(true)
    setTime(60)
    setShowFinalScore(false)
    const interval = setInterval(() => {
      setTime(time => time - 1)
    }, 1000)
    setTimer(interval)
  }

  const handleChange = (value) => {
    const lowerCaseWord = value.toLowerCase()
    setTypedWord(lowerCaseWord)
    let trueCount = 0
    const newLetters = lowerCaseWord.split('')
    const updateWord = resetWord.map((l, i) => {
      if (l.letter === newLetters[i]) {
        trueCount++
        return {...l, match: true}
      } else {
        return l
      }
    })

    setWord(updateWord)

    if (trueCount === resetWord.length) {
      setScore(score + 1)
      setTypedWord('')
      fetchWord()
    }
  }

  useEffect(() => {
    fetchWord()
  }, [])

  useEffect(() => {
    if (time === 0) {
      setStarted(false)
      setShowFinalScore(true)
      setTypedWord('')
      setWord(resetWord)
      clearInterval(timer)
    }
  }, [time, timer, resetWord])

  if (fetchError) {
    return (
      <div className="card">
        <p>There was an error loading the word. Please refresh the page and
        try again.</p>
      </div>
    )
  } else if (loading) {
    return (
      <div className = "card">
        <p>Loading...</p>
      </div>
    )
  } else {
    return (
      <div className="card">
        { time !== 0
          ? <p className="timer">{ time } seconds left</p>
          : <p className="timer">Game Over</p>
        }
        { showFinalScore
          ? <p className="score" >Your final score is: {score}</p>
          : <p className="score">Score: { score }</p>
        }
        <div className="letters">
          { word.map((w, i) => {
            return <span className={`col ${w.match ? 'active' : ''}`} key={w.letter + i}>{ w.letter }</span>
          }) }
        </div>
        <input
          type="text"
          disabled={!started}
          value={typedWord}
          onChange={(event) => handleChange(event.target.value)}
        />
        <button
          className="btn btn-success"
          disabled={started}
          onClick={startTimer}
        >
          Start
        </button>
      </div>
    )
  }
}
