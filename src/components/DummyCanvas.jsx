import React, {
  useEffect,
  useRef,
  useState,
  useContext,
  useLayoutEffect,
} from "react";
import PaintContext from "../context/PaintContext";
import extractColors from "../utils/extractColors";
import CustomEvent from "../utils/CustomEvent";

const cursor_style = {
  pen: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:20px;'><text y='50%'>✍️</text></svg>\") 0 20, pointer",
  eraser:
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:20px;'><text y='50%'>🧼</text></svg>\") 15 17, pointer",
  fill: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:20px;'><text y='50%'>🪣</text></svg>\") 0 20, pointer",
};

function DummyCanvas() {
  const drawingArea = useRef();
  const [coords, setCoords] = useState(Object.create(null));
  const [context, setContext] = useState(null);
  const [cwidth, setCwidth] = useState(0);
  const [cheight, setCheight] = useState(0);
  const [prevPoint, setPrevPoint] = useState(null);
  const { user, color, tool, size, socket, currentDrawer, roomId, owner } =
    useContext(PaintContext);

  useEffect(() => {
    setCoords(drawingArea.current.getBoundingClientRect());
    setCwidth(drawingArea.current.width);
    setCheight(drawingArea.current.height);
    setContext(drawingArea.current.getContext("2d"));

    window.onresize = () => {
      setCoords(drawingArea.current.getBoundingClientRect());
    };
  }, [socket, owner, roomId, user]);

  useEffect(() => {
    console.log("layout effect called");
    drawingArea.current.onmousedown = onMouseDown;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, color, context, coords, size]);

  useEffect(() => {
    setContext((prev) => {
      prev.fillStyle = "white";
      prev.fillRect(0, 0, prev.canvas.width, prev.canvas.height);
      return prev;
    });
  }, []);

  const calculatePos = (e) => {
    let x, y;
    if (user !== currentDrawer) {
      x = e.clientX;
      y = e.clientY;
    } else {
      let { left, top, width, height } = coords;
      x = (e.clientX - left) * (cwidth / width);
      y = (e.clientY - top) * (cheight / height);
    }
    return { x, y };
  };

  const sendEvent = (e, x, y) => {
    socket.emit("event", roomId, new CustomEvent(e, x, y));
  };

  const onMouseDown = (e) => {
    if (user !== currentDrawer && e.isTrusted === true) return;

    let { x, y } = calculatePos(e);

    if (tool === "fill") {
      let imageData = context.getImageData(0, 0, cwidth, cheight).data;
      let { r, g, b } = extractColors(color);
      let pixels = [{ x: Math.floor(x), y: Math.floor(y) }];

      let ogPixelIndex = pixels[0].y * cwidth + pixels[0].x;

      let colorArray = [
        ...imageData.slice(ogPixelIndex * 4, ogPixelIndex * 4 + 4),
      ];
      console.log(colorArray);

      let i = ogPixelIndex * 4;
      imageData[i] = r;
      imageData[i + 1] = g;
      imageData[i + 2] = b;
      imageData[i + 3] = 255;

      let around = [
        { dx: 0, dy: -1 },
        { dx: 0, dy: 1 },
        { dx: 1, dy: 0 },
        { dx: -1, dy: 0 },
      ];
      while (pixels.length > 0) {
        let pixel = pixels[0];
        pixels = pixels.slice(1);
        for (let { dx, dy } of around) {
          let newPixel = { x: pixel.x + dx, y: pixel.y + dy };
          if (
            newPixel.x >= 0 &&
            newPixel.x < cwidth &&
            newPixel.y >= 0 &&
            newPixel.y < cheight
          ) {
            let newIndex = newPixel.y * cwidth + newPixel.x;
            let flag = true;
            for (let k of [0, 1, 2, 3]) {
              if (imageData[newIndex * 4 + k] !== colorArray[k]) {
                flag = false;
                break;
              }
            }
            if (flag) {
              let i = newIndex * 4;
              imageData[i] = r;
              imageData[i + 1] = g;
              imageData[i + 2] = b;
              imageData[i + 3] = 255;

              pixels.push(newPixel);
            }
          }
        }
      }
      let newImageData = new ImageData(imageData, cwidth);
      context.putImageData(newImageData, 0, 0);
    } else {
      if (tool === "eraser") {
        // context.clearRect(x - size, y - size, 2 * size, 2 * size);
        context.strokeStyle = "white";
        context.lineWidth = parseInt(size) * 2;
        context.lineCap = "round";
        context.moveTo(x, y);
        context.beginPath();
      } else {
        context.strokeStyle = color;
        context.lineWidth = parseInt(size);
        context.lineCap = "round";
        context.moveTo(x, y);
        context.beginPath();
      }
      drawingArea.current.addEventListener("mousemove", onMouseMove);
    }
  };

  const onMouseMove = (e) => {
    if (user !== currentDrawer && e.isTrusted === true) return;

    if (e.buttons === 0) {
      drawingArea.current.removeEventListener("mousemove", onMouseMove);
      context.closePath();
      return;
    }
    let { x, y } = calculatePos(e);
    if (tool === "pen") {
      //   context.beginPath();
      context.lineTo(x, y);
      context.stroke();
    } else if (tool === "eraser") {
      context.lineTo(x, y);
      context.stroke();
    }
  };

  return (
    <canvas
      ref={drawingArea}
      className="border-4 w-full h-3/4 border-black bg-white"
      style={{ cursor: cursor_style[tool] }}
      width={`${window.screen.width * window.devicePixelRatio}`}
      height={`${window.screen.height * window.devicePixelRatio}`}
    ></canvas>
  );
}

export default DummyCanvas;
