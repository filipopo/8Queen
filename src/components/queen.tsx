import './queen.css'

interface BoardProps {
  size: number
  regions: {[k: string]: string}
}

interface tableProps {
  d?: Set<string>
  handleMouse?: (e: MouseEvent, cords: number[]) => void
}

class Board implements BoardProps {
  public constructor(
    public size: number,
    public regions: {[k: string]: string}
  ) {}

  public table({d, handleMouse}: tableProps) {
    return (
      <table>
        {Array.from({ length: this.size }, (_, i) => (
          <tr>
            {Array.from({ length: this.size }, (_, j) => {
              function safeHandleMouse(e: MouseEvent) {
                if (handleMouse) handleMouse(e, [i, j])
              }

              const cords = `${i} ${j}`
              return (
                <td
                  style={`background-color: ${this.regions[cords] || 'aliceBlue'}`}
                  onMouseDown={safeHandleMouse}
                  onMouseOver={safeHandleMouse}
                >{d && d.has(cords) ? 'X' : ''}</td>
              )
            })}
          </tr>
        ))}
      </table>
    )
  }
}

interface DrawingBoardProps {
  board: Board
  callback: (e: MouseEvent, cords: number[]) => void
}

function DrawingBoard({board, callback}: DrawingBoardProps) {
  return board.table({handleMouse: callback})
}

function intersects(queens: Set<string>, boardSize: number) {
  for (const q of queens) {
    const [r, c] = q.split(' ').map(e => Number(e))

    for (let i = 1; i < boardSize; i++) {
      if (queens.has(`${r - i} ${c - i}`)) return true
      if (queens.has(`${r - i} ${c}`)) return true
      if (queens.has(`${r - i} ${c + i}`)) return true
      if (queens.has(`${r} ${c + i}`)) return true
      if (queens.has(`${r + i} ${c + i}`)) return true
      if (queens.has(`${r + i} ${c}`)) return true
      if (queens.has(`${r + i} ${c - i}`)) return true
      if (queens.has(`${r} ${c - i}`)) return true
    }
  }

  return false
}

function incrementCounter(counter: {[k: string]: number[]}): boolean {
  let carry = 1
  for (const el in counter) {
    if (carry === 0) break
    const [index, length] = counter[el]
    counter[el][0] = (index + carry) % length
    carry = (index + carry) >= length ? 1 : 0
  }

  return carry === 0
}

function QueenSolver({board}: {board: Board}) {
  const regions: {[k: string]: string[]} = {}
  for (const arr of Object.entries(board.regions))
    regions[arr[1]] = [...(regions[arr[1]] || []), arr[0]]

  const counter: {[k: string]: number[]}  = {}
  for (const color in regions)
    counter[color] = [0, regions[color].length]

  let queens
  do {
    queens = new Set<string>()
    for (const color in regions)
      queens.add(regions[color][counter[color][0]]) 
  } while(incrementCounter(counter) && intersects(queens, board.size))

  if (intersects(queens, board.size))
    return board.table({})
  return board.table({d: queens})
}

export { Board, DrawingBoard, QueenSolver }
