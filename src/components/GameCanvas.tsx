import { useRef, useState } from "react";
import useDirectionKeyPress from "../hooks/useDirectionKeyPress";
import { useInterval } from "usehooks-ts";
import { settings } from "../lib/gameState";
import useFruit from "../lib/fruit";

export enum SnakeDirection {
  Left  = 'left',
  Right = 'right',
  Up    = 'up',
  Down  = 'down',
}

const { gridSquareSize, snakeColour, fruitColour, gameOverColour, snakeSpeed} = settings

export interface Snake {
  head: { x: number, y: number },
  tail: number[][],
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
  
  useFruit(ctx, snake)

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

export function drawSquare(
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

  snake.tail.push([head.x, head.y])
  if (tail.length > maxTailLength) {
    // Take the last square from the tail to remove it
    const [toRemoveX, toRemoveY] = tail.shift() || []

    ctx.clearRect(
      toRemoveX * gridSquareSize,
      toRemoveY * gridSquareSize,
      gridSquareSize,
      gridSquareSize,
    )
  }
}

function handleReachBoundary(ctx: CanvasRenderingContext2D, { head }: Snake) {
  const { canvas } = ctx
  const reachedLeftEdge   = head.x < 0
  const reachedTopEdge    = head.y < 0
  const reachedRightEdge  = (head.x * gridSquareSize) > (canvas.width - 1)
  const reachedBottomEdge = (head.y * gridSquareSize) > (canvas.height - 1)

  if (reachedLeftEdge) {
    head.x = canvas.width / gridSquareSize
  } else if (reachedTopEdge) {
    head.y = canvas.height / gridSquareSize
  } else if (reachedRightEdge) {
    head.x = 0
  } else if (reachedBottomEdge) {
    head.y = 0
  }
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

  handleReachBoundary(ctx, snake)
  drawSnake(ctx, newSnake)
  return newSnake
}
