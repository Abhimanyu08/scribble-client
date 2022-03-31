import React, { useContext } from "react";
import PaintContext from "../context/PaintContext";

function SizeSelect() {
  const { size, dispatch, socket, roomId } = useContext(PaintContext);

  const onSizeSet = (e) => {
    dispatch({
      type: "SET_SIZE",
      payload: e.target.value,
    });
    socket.emit("size", roomId, e.target.value);
  };

  return (
    <div className="flex flex-col justify-center">
      <input
        type="range"
        min="10"
        max="50"
        value={size}
        className="range range-sm"
        step="10"
        onChange={onSizeSet}
      />
      <div className="w-full flex justify-between text-xs px-2">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
    </div>
  );
}

export default SizeSelect;
