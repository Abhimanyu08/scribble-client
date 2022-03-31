import { useContext } from "react";
import PaintContext from "../context/PaintContext";

function PaintSelect() {
  const { color, dispatch, socket, roomId } = useContext(PaintContext);

  const onColorChange = (e) => {
    dispatch({
      type: "SET_COLOR",
      payload: e.target.value,
    });

    socket.emit("color", roomId, e.target.value);
  };

  return (
    <div className="">
      <label htmlFor="color">
        <input
          type="color"
          name=""
          id="color"
          onChange={onColorChange}
          value={color}
        />
      </label>
    </div>
  );
}

export default PaintSelect;
