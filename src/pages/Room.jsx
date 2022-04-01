import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PaintContext from "../context/PaintContext";

function Room() {
  const [rounds, setRounds] = useState(5);
  const [time, setTime] = useState(60);
  const [members, setMembers] = useState([]);
  const { owner, socket, dispatch, roomId } = useContext(PaintContext);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    socket.emit("getParticipants", roomId);

    socket.on("newParticipant", (users) => {
      setMembers(users);
    });

    socket.on("gameStarted", (active, rounds, time) => {
      dispatch({
        type: "SET_ACTIVE",
        payload: active,
      });
      dispatch({
        type: "SET_TIME",
        payload: time,
      });
      dispatch({
        type: "SET_ROUNDS",
        payload: rounds,
      });
      navigate(`/room/${params.room_id}/arena`);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  const onStartGame = () => {
    socket.emit("info", params.room_id, { rounds, time });
    // navigate(`/room/${params.room_id}/arena`);
  };

  return (
    <div className="flex flex-row justify-center h-screen items-center gap-5">
      <div className="flex flex-col h-fit items-center justify-center gap-2">
        {owner ? (
          <>
            <div className="form-control gap-2">
              <div className="flex gap-1">
                <label
                  htmlFor="rounds"
                  className="flex items-center bg-amber-400 text-black px-2 font-semibold h-10 rounded-md text-center"
                >
                  Rounds
                </label>
                <input
                  type="number"
                  name=""
                  id="rounds"
                  className="h-10 rounded-md px-2 w-16 font-bold"
                  onChange={(e) => setRounds(parseInt(e.target.value))}
                  value={rounds}
                />
              </div>
              <div className="flex gap-1">
                <label
                  htmlFor="rounds"
                  className="flex items-center bg-amber-400 text-black px-2 font-semibold h-10 rounded-md text-center"
                >
                  Time Per Guess
                </label>
                <select
                  className="h-10 rounded-md font-bold px-2"
                  onChange={(e) => setTime(parseInt(e.target.value))}
                  value={time}
                >
                  {/* <option disabled value={0}>Pick Guess Time</option> */}
                  <option value={20}>20 seconds</option>
                  <option value={40}>40 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={80}>80 seconds</option>
                  <option value={100}>100 seconds</option>
                </select>
              </div>
            </div>
            <div className="btn btn-sm custom" onClick={onStartGame}>
              Start Game
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
      <ul className="flex flex-col bg-amber-300 rounded-md border-2 border-black border-b-0 w-fit items-center h-fit">
        <p className="bg-amber-600 text-black border-b-2 border-black w-full text-center font-semibold py-2 text-xl px-2">
          Active members
        </p>
        {members.length > 0 ? (
          members.map((member, idx) => (
            <li
              key={idx}
              className="font-semibold text-lg border-b-2 w-full text-center border-black"
            >
              {member}
            </li>
          ))
        ) : (
          <p>No active members</p>
        )}
      </ul>
    </div>
  );
}

// function GameForm() {
//     return (
//             <div className="form-control gap-1">
//                 <div className="input-group input-group-sm">
//                     <label htmlFor="rounds" className='bg-black text-white px-2'>Rounds: </label>
//                     <input type="number" name="" id="rounds" className='input input-bordered input-sm' onChange={(e) => setRounds(e.target.value)}/>
//                 </div>
//                 <select class="select select-sm select-bordered" onChange={e => setTime(e.target.value)}>
//                     <option disabled selected>Pick Guess Time</option>
//                     <option value={20}>20 seconds</option>
//                     <option value={40}>40 seconds</option>
//                     <option value={60}>60 seconds</option>
//                     <option value={80}>80 seconds</option>
//                     <option value={100}>100 seconds</option>
//                 </select>
//             </div>
//     )
// }

export default Room;
