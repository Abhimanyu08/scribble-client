import React from "react";
import DummyCanvas from "../components/DummyCanvas";
import PaintSelect from "../components/PaintSelect";
import ToolSelect from "../components/ToolSelect";
import SizeSelect from "../components/SizeSelect";
function DrawingBoard() {
  return (
    <div className="flex flex-col h-screen mx-20 items-center gap-2">
      <DummyCanvas />
      <div className="flex flex-row gap-2 items-center">
        <ToolSelect />
        {/* <div className="btn btn-sm" o>Clear</div> */}
        <SizeSelect />
        <PaintSelect />
      </div>
    </div>
  );
}

export default DrawingBoard;
