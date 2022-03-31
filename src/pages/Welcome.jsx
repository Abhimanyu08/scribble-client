import React, { useContext, useEffect, useState } from "react";
import PaintContext from "../context/PaintContext";
import AlertContext from "../context/AlertContext";
// import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from "react-router-dom";
import uid from "../utils/uid";
const SURL = process.env.REACT_APP_SERVER_URL;

function Welcome() {
  const [user, setUser] = useState("");
  const [roomId] = useState(uid());
  const [display, setDisplay] = useState(false);
  const { owner, dispatch, socket } = useContext(PaintContext);
  const { alert, writeAlert } = useContext(AlertContext);
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
  }, [dispatch, roomId]);

  const createRoom = async () => {
    console.log(SURL);
    console.log("creating room");
    await fetch(`${SURL}/room/${roomId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user,
        owner,
      }),
    })
      .then((resp) => console.log(resp))
      .catch((e) => console.error(e));
  };

  const onCreateRoom = async () => {
    if (!user) {
      writeAlert({ type: "error", message: "Please enter a username" });
    } else {
      await createRoom();
      dispatch({
        type: "SET_USER",
        payload: user,
      });
      setDisplay(true);
    }
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(`http://192.168.1.7:3000/${roomId}`);
    writeAlert({ type: "warning", message: "Link copied" });
  };

  const onGotoRoom = () => {
    socket.emit("addParticipant", roomId, user);
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center gap-2">
      <div className="input-group input-group-sm justify-center">
        <label htmlFor="username" className="bg-black text-white px-2">
          Username:{" "}
        </label>
        <input
          type="text"
          id="username"
          className="input input-sm input-bordered"
          value={user}
          onChange={(e) => {
            setUser(e.target.value);
          }}
        />
      </div>
      {display ? (
        <></>
      ) : (
        <div className="btn btn-xs w-fit custom" onClick={onCreateRoom}>
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
        <span className="input-group input-group-sm justify-center">
          <label className="bg-black text-white px-2">Room Link:</label>
          <span className="input input-sm input-bordered bg-white">
            {`http://192.168.1.7:3000/${roomId}`}
          </span>
          <span className="btn btn-sm custom" onClick={onCopy}>
            Copy
          </span>
        </span>
      ) : (
        <></>
      )}
      {display ? (
        <div className="btn btn-xs w-fit custom" onClick={onGotoRoom}>
          Go To Room
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Welcome;
