import React, { useContext } from "react";
import { FaPencilAlt, FaEraser } from "react-icons/fa";
import { BsPaintBucket } from "react-icons/bs";
import PaintContext from "../context/PaintContext";

function ToolSelect() {
  const { tool, dispatch, socket, roomId, user, currentDrawer } =
    useContext(PaintContext);

  const onToolChange = (e) => {
    if (e.target.nodeName === "svg") {
      dispatch({
        type: "SET_TOOL",
        payload: e.target.parentNode.id,
      });

      if (user === currentDrawer)
        socket.emit("tool", roomId, e.target.parentNode.id);
    } else if (e.target.nodeName === "BUTTON") {
      dispatch({
        type: "SET_TOOL",
        payload: e.target.id,
      });

      if (user === currentDrawer) socket.emit("tool", roomId, e.target.id);
    } else {
      //case in which path element is clicked
      dispatch({
        type: "SET_TOOL",
        payload: e.target.parentNode.parentNode.id,
      });

      if (user === currentDrawer)
        socket.emit("tool", roomId, e.target.parentNode.parentNode.id);
    }
  };

  return (
    <div className="flex gap-2 items-center">
      {/* <span className="font-bold">Tool:</span> */}
      <button
        className={`btn btn-sm ${tool === "pen" ? "btn-primary" : "tool"}`}
        id="pen"
        onClick={onToolChange}
      >
        <FaPencilAlt />
      </button>
      <button
        className={`btn btn-sm ${tool === "eraser" ? "btn-primary" : "tool"}`}
        id="eraser"
        onClick={onToolChange}
      >
        <FaEraser />
      </button>
      <button
        className={`btn btn-sm ${tool === "fill" ? "btn-primary" : "tool"}`}
        id="fill"
        onClick={onToolChange}
      >
        <BsPaintBucket />
      </button>
      {/* <div className="btn btn-sm custom">Clear</div> */}
    </div>
  );
}

export default ToolSelect;
