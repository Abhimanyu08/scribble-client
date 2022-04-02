import React, { useContext, useEffect, useState } from "react";
import AlertContext from "../context/AlertContext";
import { useNavigate, useParams } from "react-router-dom";
import PaintContext from "../context/PaintContext";

function Join() {
  const { dispatch, socket } = useContext(PaintContext);
  const { alert, writeAlert } = useContext(AlertContext);
  const [user, setUser] = useState("");
  const [joined, setJoined] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (!socket) return;
    socket.on("joined", () => {
      setJoined(true);
      navigate(`/room/${params.room_id}`);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const onJoinRoom = () => {
    setJoined(false);
    if (!user) {
      writeAlert({ type: "error", message: "Please enter a username" });
      return;
    }

    dispatch({
      type: "SET_USER",
      payload: user,
    });
    dispatch({
      type: "SET_ROOM",
      payload: params.room_id,
    });

    socket.emit("addParticipant", params.room_id, user);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-2">
      <div className="flex justify-center gap-1">
        <label
          htmlFor="username"
          className=" flex items-center h-10 bg-amber-300 text-black font-bold border-2 rounded-md border-black px-2"
        >
          Username
        </label>
        <input
          type="text"
          id="username"
          className="h-10 border-black border-2 rounded-md px-4"
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />
      </div>
      {socket ? (
        <div
          className={`btn btn-sm w-fit custom ${joined ? "" : "loading"}`}
          onClick={onJoinRoom}
        >
          Join Room
        </div>
      ) : (
        <></>
      )}
      {alert ? (
        <div className={`alert alert-${alert.type} w-fit p-2 text-xs`}>
          {alert.message}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Join;
