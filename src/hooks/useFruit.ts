import { useEffect, useState } from "react";
import { settings } from "../lib/gameState";
import { Snake } from "./useSnake";
import { CanvasLocation } from "../types/general";
import { drawSquare, getRandomBoardSquare } from "./useCanvas";

const { fruitColour  } = settings

export default function useFruit(
  ctx: CanvasRenderingContext2D | null | undefined,
  snake: Snake,
  setSnake: React.Dispatch<React.SetStateAction<Snake>>,
) {
  const [fruitLocation, setFruitLocation] = useState<CanvasLocation>({ x: 0, y: 0})
  const snakeHasHitFruit = snake.head.x === fruitLocation.x &&
    snake.head.y === fruitLocation.y

  // place fruit in a random place on the board, except for spaces occupied by the snake
  const placeFruit = () => {
    if (ctx) {
      const fullSnake = [[snake.head.x, snake.head.y], ...snake.tail]
      // Ensure that the fruit isn't placed on top of the snake
      let newLocation
      while (!newLocation || fullSnake.includes([newLocation.x, newLocation.y])) {
        newLocation = getRandomBoardSquare(ctx.canvas)
      }

      setFruitLocation(newLocation)
    }
  }

  // When fruit location changes
  useEffect(() => {
    if (ctx) drawSquare(ctx, fruitLocation.x, fruitLocation.y, fruitColour)
  }, [fruitLocation])

  // When snake starts moving (at start or after gameover)
  useEffect(() => {
    if (ctx && !snake.stoppedMoving) placeFruit()
  }, [snake.stoppedMoving])

  // When snake hits fruit
  useEffect(() => {
    if (ctx && snakeHasHitFruit) {
      setSnake({
        ...snake,
        maxTailLength: snake.maxTailLength + 1,
        redrawSpeed: snake.redrawSpeed / 1.2,
      })
      placeFruit()
    }
  }, [ctx, snakeHasHitFruit])
}
