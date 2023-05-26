import { useEffect, useState } from "react";
import { Snake, drawSquare } from "../components/GameCanvas";
import { settings } from "./gameState";

const { fruitColour, gridSquareSize } = settings

interface CanvasLocation {
  x: number,
  y: number,
}

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
  snake: Snake
) {
  const [fruitLocation, setFruitLocation]
    = useState<CanvasLocation>({ x: 0, y: 0})
  
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
      drawRandomFruit()
    }
  }, [ctx, snakeHasHitFruit])
}

// TODO need a good way to pass game state around - 
// could use useContext and have a big state object
