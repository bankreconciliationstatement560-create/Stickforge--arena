import { useEffect, useState } from 'react'

interface Unit {
  id: number
  x: number
  hp: number
  side: 'player' | 'enemy'
}

export default function Game() {
  const [energy, setEnergy] = useState(0)
  const [units, setUnits] = useState<Unit[]>([])

  // energy regen
  useEffect(() => {
    const t = setInterval(() => {
      setEnergy(e => Math.min(100, e + 1))
    }, 200)
    return () => clearInterval(t)
  }, [])

  // game loop
  useEffect(() => {
    const loop = setInterval(() => {
      setUnits(prev =>
        prev
          .map(u => ({
            ...u,
            x: u.x + (u.side === 'player' ? 1 : -1),
          }))
          .filter(u => u.hp > 0)
      )

      // random enemy spawn
      if (Math.random() > 0.98) {
        setUnits(prev => [
          ...prev,
          {
            id: Date.now(),
            x: 560,
            hp: 30,
            side: 'enemy',
          },
        ])
      }
    }, 30)

    return () => clearInterval(loop)
  }, [])

  // collision + fight
  useEffect(() => {
    setUnits(prev =>
      prev.map(u => {
        const enemy = prev.find(
          e =>
            e.side !== u.side &&
            Math.abs(e.x - u.x) < 10
        )
        if (enemy) {
          return { ...u, hp: u.hp - 0.5 }
        }
        return u
      })
    )
  }, [units])

  const summon = () => {
    if (energy < 20) return
    setEnergy(e => e - 20)
    setUnits(prev => [
      ...prev,
      {
        id: Date.now(),
        x: 40,
        hp: 40,
        side: 'player',
      },
    ])
  }

  return (
    <div className="game">
      <h1>🗡️ Stickforge Arena</h1>

      <div className="hud">
        <span>Dark Energy: {energy}</span>
        <button onClick={summon}>Summon Shade</button>
      </div>

      <div className="arena">
        {/* bases */}
        <div className="base player">FORGE</div>
        <div className="base enemy">VOID</div>

        {/* units */}
        {units.map(u => (
          <div
            key={u.id}
            className={`unit ${u.side}`}
            style={{ left: u.x }}
          >
            <div className="hp" style={{ width: u.hp + '%' }} />
          </div>
        ))}
      </div>
    </div>
  )
          }
