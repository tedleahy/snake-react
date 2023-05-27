import { useEffect, useState } from "react";
import { drawSquare, getRandomBoardSquare } from "./useCanvas";
import { useInterval } from "usehooks-ts";
import { settings } from "../lib/gameState";
import useDirectionKeyPress from "./useDirectionKeyPress";
import { CanvasLocation } from "../types/general";
import { clearBoard, drawGameOver } from "./useCanvas";

const {
  snakeColour,
  defaultSnakeLength,
  defaultSnakeRedrawSpeed,
  gridSquareSize
} = settings

export enum SnakeDirection {
  Left  = 'left',
  Right = 'right',
  Up    = 'up',
  Down  = 'down',
}

export interface Snake {
  head: CanvasLocation,
  tail: number[][],
  maxTailLength: number,
  stoppedMoving: boolean,
  redrawSpeed: number,
  direction: SnakeDirection | null,
}

export default function useSnake(
  ctx: CanvasRenderingContext2D | null | undefined
): [Snake, React.Dispatch<React.SetStateAction<Snake>>] {
  const initialSnake = {
    head: ctx ? getRandomBoardSquare(ctx?.canvas) : { x: 0, y: 0 },
    tail: [],
    maxTailLength: defaultSnakeLength,
    stoppedMoving: true,
    redrawSpeed: defaultSnakeRedrawSpeed,
    direction: null,
  }
  const [snake, setSnake] = useState<Snake>({ ...initialSnake })

  function drawSnake(): void {
    if (!ctx || snake.stoppedMoving) return
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

  function moveSnake(): void {
    const newSnake = { ...snake }

    switch(snake.direction) {
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

    setSnake(newSnake)
    handleReachedBoundary()
    handleHitTail()
    drawSnake()
  }

  function handleReachedBoundary(): void {
    if (!ctx) return
    const { canvas } = ctx
    const { head } = snake
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

  function handleHitTail(): void {
    if (!ctx) return

    const { head, tail } = snake

    let hasHitTail = false
    for (const [tailSegmentX, tailSegmentY] of tail) {
      if (head.x === tailSegmentX && head.y === tailSegmentY) {
        hasHitTail = true
      }
    }

    if (hasHitTail) {
      drawGameOver(ctx)
      setSnake({ ...initialSnake })
    }
  }

  useDirectionKeyPress((newDirection) => {
    const newSnake = { ...snake }

    if (!isGoingBackwards(snake.direction, newDirection)) {
      newSnake.direction = newDirection
    }

    if (ctx && snake.stoppedMoving) {
      newSnake.stoppedMoving = false
      clearBoard(ctx)
    }

    setSnake(newSnake)
  })

  useEffect(() => drawSnake(), [snake.head])

  useInterval(() => {
    if (ctx && !snake.stoppedMoving) {
      moveSnake()
    }
  }, snake.redrawSpeed)

  return [snake, setSnake]
}

/*
If the snake goes back on itself, it hits its tail, triggering a game over.
We need to detect when this is happening so that we can prevent it
*/
function isGoingBackwards(currentDirection: SnakeDirection | null, newDirection: SnakeDirection): boolean {
  if (!currentDirection) return false

  const oppositeDirections = [
    [SnakeDirection.Left, SnakeDirection.Right],
    [SnakeDirection.Up, SnakeDirection.Down],
  ]

  let isGoingBackwards = false
  for (const directionPair of oppositeDirections) {
    if (directionPair.includes(currentDirection) && directionPair.includes(newDirection)) {
      isGoingBackwards = true
    }
    if (isGoingBackwards) break
  }

  return isGoingBackwards
}
