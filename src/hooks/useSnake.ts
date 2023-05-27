import { useEffect, useRef, useState } from "react";
import { drawSquare } from "./useCanvas";
import { useInterval } from "usehooks-ts";
import { settings } from "../lib/gameState";
import useDirectionKeyPress from "./useDirectionKeyPress";
import { CanvasLocation } from "../types/general";
import { clearBoard, drawGameOver } from "./useCanvas";

const { snakeColour, defaultSnakeLength, gridSquareSize } = settings

export interface Snake {
  head: CanvasLocation,
  tail: number[][],
  maxTailLength: number,
  stoppedMoving: boolean,
}

export enum SnakeDirection {
  Left  = 'left',
  Right = 'right',
  Up    = 'up',
  Down  = 'down',
}

export default function useSnake(
  ctx: CanvasRenderingContext2D | null | undefined
): [Snake, React.Dispatch<React.SetStateAction<Snake>>] {
  const snakeDirection = useRef<SnakeDirection | null>(null)
  const [snake, setSnake] = useState<Snake>({
    head: { x: 5, y: 5 },
    tail: [],
    maxTailLength: defaultSnakeLength,
    stoppedMoving: true,
  })

  function drawSnake(): void {
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

  function moveSnake(): void {
    const newSnake = { ...snake }

    switch(snakeDirection.current) {
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
      setSnake({
        ...snake,
        stoppedMoving: true,
        tail: [],
        maxTailLength: defaultSnakeLength,
      })
      drawGameOver(ctx)
    }
  }

  useDirectionKeyPress((newDirection) => {
    snakeDirection.current = newDirection
    if (ctx && snake.stoppedMoving) {
      setSnake({ ...snake, stoppedMoving: false })
      clearBoard(ctx)
    }
  })

  useInterval(() => {
    if (ctx && !snake.stoppedMoving) {
      moveSnake()
    }
  }, 100)

  return [snake, setSnake]
}
