import React, { useContext, useEffect, useState } from "react";
import PaintContext from "../context/PaintContext";
import AlertContext from "../context/AlertContext";
// import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import uid from "../utils/uid";
const CURL = process.env.REACT_APP_CLIENT_URL;

function Welcome() {
  const [user, setUser] = useState("");
  const [joined, setJoined] = useState(true);
  const [roomId] = useState(uid());
  const [display, setDisplay] = useState(false);
  const { dispatch, socket } = useContext(PaintContext);
  const { alert, writeAlert } = useContext(AlertContext);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch({
      type: "SET_OWNER",
      payload: true,
    });

    dispatch({
      type: "SET_ROOM",
      payload: roomId,
    });

    if (socket) {
      socket.on("roomCreated", () => {
        setCreatingRoom(false);
        setDisplay(true);
      });
      socket.on("joined", () => {
        setJoined(true);
        navigate(`/room/${roomId}`);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, roomId, socket]);

  const onCreateRoom = async () => {
    if (!user) {
      writeAlert({ type: "error", message: "Please enter a username" });
    } else {
      setCreatingRoom(true);
      socket.emit("createRoom", roomId);
    }
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(`${CURL}/join/${roomId}`);
    writeAlert({ type: "warning", message: "Link copied" });
  };

  const onGotoRoom = () => {
    setJoined(false);
    dispatch({
      type: "SET_USER",
      payload: user,
    });
    socket.emit("addParticipant", roomId, user);
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
      {display ? (
        <></>
      ) : (
        <div
          className={`btn btn-sm w-fit bg-amber-300 text-black font-bold custom ${
            creatingRoom ? "loading" : ""
          }`}
          onClick={onCreateRoom}
        >
          Create Room
        </div>
      )}
      {alert ? (
        <div className={`alert alert-${alert.type} w-fit p-2 text-xs`}>
          {alert.message}
        </div>
      ) : (
        <></>
      )}
      {display ? (
        <span className="flex items-center">
          <label className="bg-amber-300 text-black border-2 border-black rounded-md font-bold h-8 text-center px-2 rounded-r-none">
            Room Link:
          </label>
          <span className="font-semibold text-black bg-amber-100 border-2 border-black h-8 px-2">
            {`${CURL}/join/${roomId}`}
          </span>
          <span className="btn btn-sm custom rounded-l-none" onClick={onCopy}>
            Copy
          </span>
        </span>
      ) : (
        <></>
      )}
      {display ? (
        <div
          className={`btn btn-sm w-fit custom ${joined ? "" : "loading"}`}
          onClick={onGotoRoom}
        >
          Go To Room
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Welcome;
