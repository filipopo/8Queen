import { useState } from 'preact/hooks'
import { Modal } from './components/modal.tsx'

import { Board, DrawingBoard, QueenSolver } from './components/queen.tsx'
import './app.css'

function App() {
  const [boardSize, setBoardSize] = useState(8)
  const colors = [
    'aliceBlue',
    'Red',
    'Orange',
    'Yellow',
    'Green',
    'Cyan',
    'Blue',
    'Purple',
    'Pink',
    'LightGray',
    'DimGray'
  ]

  const [open, setOpen] = useState(false)
  const [selectedColor, setSelectedColor] = useState(colors[1])
  const [regions, setRegions] = useState<{[k: string]: string}>({})

  function handleMouse(e: MouseEvent, cords: number[]) {
    if (e.buttons !== 1)
      return

    const temp = structuredClone(regions)

    if (selectedColor === 'aliceBlue')
      delete temp[cords.join(' ')]
    else
      temp[cords.join(' ')] = selectedColor

    setRegions(temp)
  }

  const board = new Board(boardSize, regions)
  return (
    <>
      Board size<br/>
      <input
        type="text"
        value={boardSize}
        onChange={e => {
          const el = Number((e.target as HTMLInputElement).value)
          if (!Number.isNaN(el))
            setBoardSize(el)
        }}
      /><br/>
      <br/>

      <button type="button" onClick={() => setOpen(true)}>Choose color</button>
      <Modal open={open} setOpen={setOpen}>
        {colors.map(e => (
          <>
            <button type="button" onClick={() => {
              setSelectedColor(e)
              setOpen(false)
            }}>{e === 'aliceBlue' ? 'Eraser' : e}</button>
            <br/>
          </>
        ))}
      </Modal>

      <br/>
      <button type="button" onClick={() => setRegions({})}>Clear all</button><br/>

      <br/>
      <DrawingBoard board={board} callback={handleMouse} />
      <QueenSolver board={board} />
    </>
  )
}

export default App