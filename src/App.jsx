import { useState, useCallback, useEffect } from 'react'
import './App.css'

const SEQUENCE = [6, 11, 20, 8, 14, 10, 20]

function playNiceAlarm() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()

  // Classic alarm clock: alternating two-tone rings
  const rings = [0, 0.22, 0.44, 0.66]
  rings.forEach((startOffset, i) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(i % 2 === 0 ? 800 : 640, ctx.currentTime + startOffset)

    gain.gain.setValueAtTime(0, ctx.currentTime + startOffset)
    gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + startOffset + 0.01)
    gain.gain.setValueAtTime(0.35, ctx.currentTime + startOffset + 0.16)
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + startOffset + 0.2)

    osc.start(ctx.currentTime + startOffset)
    osc.stop(ctx.currentTime + startOffset + 0.22)
  })
}

function playMeanAlarm() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)()

  // Distortion curve for a harsh, clipped buzzer
  const curve = new Float32Array(256)
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1
    curve[i] = Math.sign(x) * (1 - Math.exp(-Math.abs(x) * 12))
  }
  const distortion = ctx.createWaveShaper()
  distortion.curve = curve
  distortion.connect(ctx.destination)

  const gain = ctx.createGain()
  gain.connect(distortion)

  ;[120, 127].forEach(freq => {
    const osc = ctx.createOscillator()
    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)
    osc.connect(gain)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.9)
  })

  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0.6, ctx.currentTime + 0.01)
  gain.gain.setValueAtTime(0.6, ctx.currentTime + 0.75)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.9)
}

function SleepingDaddy({ jiggle }) {
  return (
    <svg
      viewBox="0 0 220 240"
      className={`daddy-svg${jiggle ? ' jiggle' : ''}`}
      aria-label="Sleeping Daddy"
    >
      {/* Bed frame */}
      <rect x="15" y="170" width="190" height="55" rx="12" fill="#7c5c2e" />
      <rect x="15" y="158" width="190" height="22" rx="8" fill="#a87c45" />
      {/* Blanket */}
      <rect x="25" y="162" width="170" height="18" rx="6" fill="#3b82f6" />
      {/* Pillow */}
      <ellipse cx="110" cy="162" rx="72" ry="18" fill="#f0e6d3" />
      {/* Head */}
      <circle cx="110" cy="118" r="52" fill="#fdbcb4" />
      {/* Ears */}
      <ellipse cx="58" cy="118" rx="10" ry="14" fill="#fdbcb4" />
      <ellipse cx="162" cy="118" rx="10" ry="14" fill="#fdbcb4" />
      <ellipse cx="58" cy="118" rx="6" ry="9" fill="#f4a0a0" />
      <ellipse cx="162" cy="118" rx="6" ry="9" fill="#f4a0a0" />
      {/* Nightcap */}
      <path d="M65 95 Q110 15 155 95 Z" fill="#1d4ed8" />
      <ellipse cx="110" cy="96" rx="50" ry="12" fill="#2563eb" />
      <circle cx="152" cy="32" r="9" fill="#ef4444" />
      {/* Closed eyes */}
      <path d="M80 116 Q92 110 104 116" stroke="#5a3825" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M116 116 Q128 110 140 116" stroke="#5a3825" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Rosy cheeks */}
      <ellipse cx="82" cy="128" rx="10" ry="7" fill="#f4a0a0" opacity="0.5" />
      <ellipse cx="138" cy="128" rx="10" ry="7" fill="#f4a0a0" opacity="0.5" />
      {/* Smile */}
      <path d="M92 134 Q110 144 128 134" stroke="#c97070" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* ZZZs */}
      <text x="158" y="85" fontSize="13" fill="#94a3b8" fontWeight="bold" fontFamily="monospace">Z</text>
      <text x="170" y="60" fontSize="17" fill="#cbd5e1" fontWeight="bold" fontFamily="monospace">Z</text>
      <text x="182" y="30" fontSize="22" fill="#e2e8f0" fontWeight="bold" fontFamily="monospace">Z</text>
    </svg>
  )
}

function AngryDaddy() {
  return (
    <svg viewBox="0 0 220 220" className="angry-daddy-svg" aria-label="Angry Daddy">
      {/* Head glow */}
      <circle cx="110" cy="110" r="96" fill="#fca5a5" opacity="0.4" />
      {/* Head */}
      <circle cx="110" cy="110" r="85" fill="#ef4444" />
      {/* Ears */}
      <ellipse cx="25" cy="110" rx="12" ry="18" fill="#ef4444" />
      <ellipse cx="195" cy="110" rx="12" ry="18" fill="#ef4444" />
      {/* Angry eyebrows */}
      <path d="M45 72 L88 90" stroke="#1f2937" strokeWidth="7" strokeLinecap="round" />
      <path d="M132 90 L175 72" stroke="#1f2937" strokeWidth="7" strokeLinecap="round" />
      {/* Eyes */}
      <ellipse cx="78" cy="105" rx="16" ry="18" fill="white" />
      <ellipse cx="142" cy="105" rx="16" ry="18" fill="white" />
      <circle cx="78" cy="108" r="9" fill="#1f2937" />
      <circle cx="142" cy="108" r="9" fill="#1f2937" />
      <circle cx="75" cy="105" r="3" fill="white" />
      <circle cx="139" cy="105" r="3" fill="white" />
      {/* Open mouth */}
      <path d="M55 148 Q110 185 165 148" fill="#7f1d1d" />
      <path d="M55 148 Q110 162 165 148" fill="#b91c1c" />
      {/* Teeth */}
      <rect x="78" y="148" width="16" height="13" rx="3" fill="white" />
      <rect x="97" y="148" width="16" height="13" rx="3" fill="white" />
      <rect x="116" y="148" width="16" height="13" rx="3" fill="white" />
      {/* Steam from head */}
      <path d="M30 45 Q24 32 30 18" stroke="#94a3b8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M50 30 Q44 16 50 2" stroke="#94a3b8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M190 45 Q196 32 190 18" stroke="#94a3b8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M170 30 Q176 16 170 2" stroke="#94a3b8" strokeWidth="3.5" fill="none" strokeLinecap="round" />
    </svg>
  )
}

function Stars() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.sin(i * 137.5) * 50 + 50,
    y: Math.sin(i * 97.3) * 50 + 50,
    r: (i % 3 === 0 ? 1.5 : 1),
    opacity: 0.4 + (i % 5) * 0.12,
  }))
  return (
    <svg className="stars-bg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {stars.map(s => (
        <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.opacity} />
      ))}
    </svg>
  )
}

export default function App() {
  const [pressCount, setPressCount] = useState(0)
  const [isWoken, setIsWoken] = useState(false)
  const [jiggle, setJiggle] = useState(false)
  const [pressing, setPressing] = useState(false)
  const [meanDaddy, setMeanDaddy] = useState(false)
  const [seqIndex, setSeqIndex] = useState(() => Math.floor(Math.random() * SEQUENCE.length))

  const handlePress = useCallback(() => {
    if (isWoken || jiggle) return

    if (pressCount + 1 >= SEQUENCE[seqIndex]) {
      setIsWoken(true)
      setSeqIndex(prev => (prev + 1) % SEQUENCE.length)
      meanDaddy ? playMeanAlarm() : playNiceAlarm()
    } else {
      setPressCount(prev => prev + 1)
      setJiggle(true)
      setTimeout(() => setJiggle(false), 350)
    }
  }, [isWoken, jiggle, pressCount, meanDaddy, seqIndex])

  const handleReset = useCallback(() => {
    setIsWoken(false)
    setPressCount(0)
  }, [])

  // Keyboard support
  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        if (isWoken) handleReset()
        else handlePress()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handlePress, handleReset, isWoken])

  return (
    <div className="game-root">
      <Stars />

      <header className="game-header">
        <h1 className="game-title">Don't Wake Daddy</h1>
        <p className="game-subtitle">Shhh... press the alarm as many times as you dare</p>
      </header>

      <main className="game-main">
        <div className="daddy-stage">
          <SleepingDaddy jiggle={jiggle} />
        </div>

        <button
          className={`alarm-btn${pressing ? ' pressed' : ''}`}
          onClick={handlePress}
          onMouseDown={() => setPressing(true)}
          onMouseUp={() => setPressing(false)}
          onMouseLeave={() => setPressing(false)}
          onTouchStart={() => setPressing(true)}
          onTouchEnd={() => { setPressing(false); handlePress() }}
          disabled={isWoken}
          aria-label="Press the alarm clock"
        >
          <span className="alarm-icon">🔔</span>
          <span className="alarm-label">Press the Alarm</span>
        </button>

        <p className="hint-text">Space / Enter works too</p>

        <button
          className={`mode-toggle ${meanDaddy ? 'mean' : 'nice'}`}
          onClick={() => setMeanDaddy(prev => !prev)}
          aria-label="Toggle daddy mode"
        >
          {meanDaddy ? '😈 Mean Daddy' : '😇 Nice Daddy'}
        </button>
      </main>

      {isWoken && (
        <div className="overlay" onClick={handleReset} role="dialog" aria-modal="true" aria-label="Daddy woke up!">
          <div className="overlay-card" onClick={e => e.stopPropagation()}>
            <AngryDaddy />
            <h2 className="busted-title">DADDY WOKE UP!</h2>
            <button className="play-again-btn" onClick={handleReset}>
              Go Back to Sleep
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
