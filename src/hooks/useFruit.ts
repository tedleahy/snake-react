import { useEffect, useState } from "react";
import { drawSquare } from "../components/GameCanvas";
import { settings } from "../lib/gameState";
import { Snake } from "./useSnake";
import { CanvasLocation } from "../types/general";

const { fruitColour, gridSquareSize } = settings

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function getRandomBoardSquare(canvas: HTMLCanvasElement | undefined): CanvasLocation {
  if (!canvas) return { x: 0, y: 0}

  return {
    x: Math.floor(randomBetween(0, canvas.width) / gridSquareSize),
    y: Math.floor(randomBetween(0, canvas.height) / gridSquareSize),
  }
}

export default function useFruit(
  ctx: CanvasRenderingContext2D | null | undefined,
  snake: Snake,
  setSnake: React.Dispatch<React.SetStateAction<Snake>>,
) {
  const [fruitLocation, setFruitLocation] = useState<CanvasLocation>({ x: 0, y: 0})
  
  const snakeHasHitFruit = snake.head.x === fruitLocation.x
    && snake.head.y === fruitLocation.y

  const drawRandomFruit = () => {
    if (ctx) {
      const newLocation = getRandomBoardSquare(ctx.canvas)
      setFruitLocation(newLocation)
      drawSquare(ctx, newLocation.x, newLocation.y, fruitColour)
    }
  }

  // When canvas first loads
  useEffect(() => {
    drawRandomFruit()
  }, [ctx])

  // When snake hits fruit
  useEffect(() => {
    if (ctx && snakeHasHitFruit) {
      setSnake({ ...snake, maxTailLength: snake.maxTailLength + 1 })
      drawRandomFruit()
    }
  }, [ctx, snakeHasHitFruit])
}
