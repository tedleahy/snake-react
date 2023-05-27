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

  const drawNewFruit = () => {
    if (ctx) {
      const fullSnake = [[snake.head.x, snake.head.y], ...snake.tail]

      // If the fruit is going to be drawn on top of the snake,
      // get a random location again until it's not
      let newLocation
      while (!newLocation || fullSnake.includes([newLocation.x, newLocation.y])) {
        newLocation = getRandomBoardSquare(ctx.canvas)
      }
      setFruitLocation(newLocation)

      drawSquare(ctx, newLocation.x, newLocation.y, fruitColour)
    }
  }

  // When snake starts moving
  useEffect(() => {
    if (ctx && !snake.stoppedMoving) drawNewFruit()
  }, [snake.stoppedMoving])

  // When snake hits fruit
  useEffect(() => {
    if (ctx && snakeHasHitFruit) {
      setSnake({ ...snake, maxTailLength: snake.maxTailLength + 1 })
      drawNewFruit()
    }
  }, [ctx, snakeHasHitFruit])
}
