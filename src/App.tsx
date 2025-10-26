import { useEffect, useRef, useState } from "react";
import { Slider } from "antd";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import deleteIcon from "./assets/svg/DeleteIcon.svg";
import { Erase } from "./components/icons/Erase";
import { ScrollIcon } from "./components/icons/ScrollIcon";
import { WriteIcon } from "./components/icons/WriteIcon";
import eraseIconScreen from "./assets/PNG/eraser.png";
import penIcon from "./assets/PNG/pen.png";
function App() {
  const myCanvas = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const [isErasing, setIsErasing] = useState(false);
  const [isWriting, setIsWriting] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isclearAll, setIsclearAll] = useState<boolean>(false);
  const [penSizeValue, setPenSizeValue] = useState<number>(5);
  console.log(eraseIconScreen, "penIcon");
  console.log(penIcon, "penIcon");

  useEffect(() => {
    const canvasElement = myCanvas.current;
    const ctx = canvasElement?.getContext("2d");
    if (!ctx || !canvasElement) return;
    const saveDrawing = () => {
      try {
        const dataURL = canvasElement.toDataURL("image/png");
        localStorage.setItem("canvas-drawing", dataURL);
      } catch (error) {
        console.error("Failed to save drawing:", error);
      }
    };
    if (isclearAll) saveDrawing();
    const loadDrawing = () => {
      try {
        const savedDrawing = localStorage.getItem("canvas-drawing");
        if (savedDrawing) {
          const img = new Image();
          img.onload = () => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = savedDrawing;
        }
      } catch (error) {
        console.log("No saved drawing found");
      }
    };

    loadDrawing();
    canvasElement.style.touchAction = isScrolling ? "auto" : "none";
    let lastPos = { x: 0, y: 0 };
    let isFirstPoint = true;

    const drawPoint = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 0, 0, 2 * Math.PI);

      ctx.fill();
    };

    const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = penSizeValue / 2;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const erase = (x: number, y: number) => {
      const previousOperation = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, 2 * Math.PI);
      ctx.fill();
      ctx.globalCompositeOperation = previousOperation;
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (isScrolling && canvasElement) {
        return;
      }
      drawing.current = true;
      isFirstPoint = true;

      if (isErasing) {
        erase(e.offsetX, e.offsetY);
      } else if (isWriting) {
        drawPoint(e.offsetX, e.offsetY);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (isScrolling && canvasElement) {
        return;
      }

      if (!drawing.current) return;

      if (isErasing) {
        erase(e.offsetX, e.offsetY);
      } else if (isWriting) {
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
      drawing.current = false;
      saveDrawing();
    };

    canvasElement.addEventListener("pointerdown", handlePointerDown);
    canvasElement.addEventListener("pointermove", handlePointerMove);
    canvasElement.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvasElement.removeEventListener("pointerdown", handlePointerDown);
      canvasElement.removeEventListener("pointermove", handlePointerMove);
      canvasElement.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isErasing, isWriting, penSizeValue, isScrolling, isclearAll]);

  const eraseMode = () => {
    setIsErasing(true);
    setIsWriting(false);
    setIsScrolling(false);
  };
  const writeMode = () => {
    setIsWriting(true);
    setIsScrolling(false);
    setIsErasing(false);
  };

  const clearCanvas = () => {
    const ctx = myCanvas.current?.getContext("2d");
    if (ctx && myCanvas.current) {
      const previousOperation = ctx.globalCompositeOperation;
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillRect(0, 0, myCanvas.current.width, myCanvas.current.height);
      ctx.globalCompositeOperation = previousOperation;
      setIsclearAll(true);
      setIsWriting(true);
      setIsScrolling(false);
    }
  };
  let cursorStyle = "pointer"; // default

  if (isErasing) {
    cursorStyle = `url('${eraseIconScreen}') 15 15, auto`;
  } else if (isWriting) {
    cursorStyle = `url('${penIcon}') 3 21, auto`;
  }

  return (
    <div className="relative overflow-auto">
      <div className="fixed top-0 left-0 right-0 bg-[#1a1a2e] mb-2.5 flex gap-4  sm:gap-10 h-14 sm:pl-3 items-center max-sm:justify-evenly">
        <button
          onClick={writeMode}
          className="border border-[#2d3748] p-1 rounded-sm"
        >
          <WriteIcon
            width="w-7"
            height="h-7"
            color={isWriting ? `#6366f1` : "#e2e8f0"}
          />
        </button>
        <button
          onClick={eraseMode}
          className="border  border-[#2d3748] p-1 rounded-sm"
        >
          <Erase
            width="w-7"
            height="h-7"
            color={isErasing ? `#6366f1` : "#e2e8f0"}
          />
        </button>
        <button
          onClick={() => {
            setIsScrolling(true);
            setIsErasing(false);
            setIsWriting(false);
          }}
          className="border border-[#2d3748] p-1 rounded-sm sm:hidden"
        >
          <ScrollIcon
            width="h-7"
            height="h-7"
            color={isScrolling ? `#6366f1` : "#e2e8f0"}
          />
        </button>
        <button
          onClick={clearCanvas}
          className=" border border-[#2d3748] flex gap-1 items-center  p-1 rounded-sm text-sm text-nowrap"
        >
          <img src={deleteIcon} alt="" className="h-7 w-7" />
        </button>

        <Slider
          min={5}
          tooltip={{ open: false }}
          onChange={setPenSizeValue}
          value={penSizeValue}
          className="sm:w-80 w-32"
        />
      </div>
      <canvas
        ref={myCanvas}
        width={innerWidth * 3}
        height={innerHeight * 2}
        style={{
          border: "1px solid black",

          cursor: cursorStyle,
        }}
        className="overflow-scroll"
      />
    </div>
  );
}

export default App;
