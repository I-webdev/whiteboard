import { useEffect, useRef, useState } from "react";
import { Slider } from "antd";
// import { Slider, type SliderChangeEvent } from "primereact/slider";
import "primereact/resources/themes/lara-light-cyan/theme.css";
function App() {
  const myCanvas = useRef<HTMLCanvasElement>(null);
  const d = useRef(false);
  const [isErasing, setIsErasing] = useState(false);
  const [penSizeValue, setPenSizeValue] = useState<number >(
    5
  );
  

  useEffect(() => {
    const canvasElement = myCanvas.current;
    const ctx = canvasElement?.getContext("2d");
   if (canvasElement) canvasElement.style.touchAction = "none";
    if (!ctx || !canvasElement) return;

    let lastPos = { x: 0, y: 0 };
    let isFirstPoint = true;

    const drawPoint = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = penSizeValue;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const erase = (x: number, y: number) => {
      const previousOperation = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalCompositeOperation = previousOperation;
    };

    const handlePointerDown = (e: PointerEvent) => {
      d.current = true;
      isFirstPoint = true;

      if (isErasing) {
        erase(e.offsetX, e.offsetY);
      } else {
        drawPoint(e.offsetX, e.offsetY);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!d.current) return;

      if (isErasing) {
        erase(e.offsetX, e.offsetY);
      } else {
        if (isFirstPoint) {
          lastPos.x = e.offsetX;
          lastPos.y = e.offsetY;
          isFirstPoint = false;
          return;
        }

        drawLine(lastPos.x, lastPos.y, e.offsetX, e.offsetY);
        lastPos.x = e.offsetX;
        lastPos.y = e.offsetY;
      }
    };

    const handlePointerUp = () => {
      d.current = false;
    };

    canvasElement.addEventListener("pointerdown", handlePointerDown);
    canvasElement.addEventListener("pointermove", handlePointerMove);
    canvasElement.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvasElement.removeEventListener("pointerdown", handlePointerDown);
      canvasElement.removeEventListener("pointermove", handlePointerMove);
      canvasElement.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isErasing, penSizeValue]);

  const toggleEraseMode = () => {
    setIsErasing((prev) => !prev);
  };

  const clearCanvas = () => {
    const ctx = myCanvas.current?.getContext("2d");
    if (ctx && myCanvas.current) {
      ctx.clearRect(0, 0, myCanvas.current.width, myCanvas.current.height);
    }
  };

  return (
    <div>
      <div className=" flex gap-5   bg-red-70" style={{ marginBottom: "10px" }}>
        <button onClick={toggleEraseMode}>
          {isErasing ? "✏️ Draw Mode" : "🧹 Erase Mode"}
        </button>
        <button onClick={clearCanvas} style={{ marginLeft: "10px" }}>
          🗑️ Clear All
        </button>

        <Slider
          tooltip={{ open: false }}
          onChange={setPenSizeValue}
          value={penSizeValue}
          style={{width: '10rem'}}
        />
        {/* <Slider
            value={penSizeValue}
            onChange={(e: SliderChangeEvent) => setPenSizeValue(e.value)}
            className=""
          /> */}
      </div>
      <canvas
        ref={myCanvas}
        width={innerWidth * 3}
        height={innerHeight * 2}
        style={{ border: "1px solid black", cursor: "crosshair" }}
      />
    </div>
  );
}

export default App;
