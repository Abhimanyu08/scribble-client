import React from "react";
import spinner from "./assets/spinner.gif";

function Spinner() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <img alt="Loading..." src={spinner} className="w-42 h-42" />
    </div>
  );
}

export default Spinner;
