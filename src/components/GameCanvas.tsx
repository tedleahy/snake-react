import { useEffect, useRef, useState } from "react";

enum SnakeDirection {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down'
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
  direction: SnakeDirection,
  maxTailLength: number,
}

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvas = canvasRef?.current
  const ctx = canvas?.getContext('2d')
  const [snake, setSnake] = useState({
    head: { x: 5, y: 5 },
    tail: [],
    direction: SnakeDirection.Right,
    maxTailLength: 3
  })

  useEffect(() => {
    if (ctx) {
      drawSnake(ctx, snake)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      width="500"
      height="400"
      style={{ border: '1px solid black' }}
    />
  )
}

function drawSquare(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  colour: string,
) {
  ctx.fillStyle = colour
  ctx.fillRect(x * gridSquareSize, y * gridSquareSize, gridSquareSize, gridSquareSize)
}

function drawSnake(ctx: CanvasRenderingContext2D, snake: Snake) {
  const { head, tail, maxTailLength } = snake

  drawSquare(ctx, head.x, head.y, snakeColour)
}
