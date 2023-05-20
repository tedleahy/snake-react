import { useRef } from "react";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvas = canvasRef?.current
  const ctx = canvas?.getContext('2d')

  return (
    <canvas ref={canvasRef} />
  )
}
