import useFruit from "../hooks/useFruit";
import useSnake from "../hooks/useSnake";
import useCanvas from "../hooks/useCanvas";

export default function GameCanvas() {
  const [canvasRef, ctx] = useCanvas()
  const [snake, setSnake] = useSnake(ctx)
  useFruit(ctx, snake, setSnake)

  return (
    <canvas
      ref={canvasRef}
      width="800"
      height="600"
      style={{ border: '1px solid black' }}
    />
  )
}
