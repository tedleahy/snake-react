import { useRef, useState } from "react";
import useDirectionKeyPress from "../hooks/useDirectionKeyPress";
import { useInterval } from "usehooks-ts";

export enum SnakeDirection {
  Left  = 'left',
  Right = 'right',
  Up    = 'up',
  Down  = 'down',
}

const globalSettings = {
  gridSquareSize: 20,
  snakeColour: '#7CB9E8',
  fruitColour: '#AA0000',
  gameOverColour: '#00853E',
  snakeSpeed: 100,
}

const { gridSquareSize, snakeColour, fruitColour, gameOverColour, snakeSpeed} = globalSettings

interface Snake {
  head: { x: number, y: number },
  tail: number[],
  maxTailLength: number,
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvas = canvasRef?.current
  const ctx = canvas?.getContext('2d')
  const [snake, setSnake] = useState<Snake>({
    head: { x: 5, y: 5 },
    tail: [],
    maxTailLength: 3
  })
  const snakeDirection = useRef<SnakeDirection | null>(null)

  useDirectionKeyPress((newDirection) => {
    snakeDirection.current = newDirection
  })

  useInterval(() => {
    if (ctx) {
      const newSnake = moveSnake(ctx, snake, snakeDirection.current)
      setSnake(newSnake)
    }
  }, 100)

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="600"
      style={{ border: '1px solid black' }}
    />
  )
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colour: string,
): void {
  ctx.fillStyle = colour
  ctx.fillRect(x * gridSquareSize, y * gridSquareSize, gridSquareSize, gridSquareSize)
}

function drawSnake(ctx: CanvasRenderingContext2D, snake: Snake): void {
  if (!ctx) return
  const { head, tail, maxTailLength } = snake

  drawSquare(ctx, head.x, head.y, snakeColour)
}

function moveSnake(
  ctx: CanvasRenderingContext2D,
  snake: Snake,
  direction: SnakeDirection | null
): Snake {
  const newSnake = { ...snake }

  switch(direction) {
    case SnakeDirection.Left:
      newSnake.head.x--
      break
    case SnakeDirection.Down:
      newSnake.head.y++
      break
    case SnakeDirection.Up:
      newSnake.head.y--
      break
    case SnakeDirection.Right:
      newSnake.head.x++
      break
  }

  drawSnake(ctx, newSnake)
  return newSnake
}
