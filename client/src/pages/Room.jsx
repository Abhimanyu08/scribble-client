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

  // const fetchInfo = async () => {

  //     try {

  //         const {active, gameStarted} = await fetch(`http://192.168.1.7:5000/room/${params.room_id}`, {
  //             method: "GET"
  //         }).then(res => res.json());

  //         setMembers(active);

  //         if (gameStarted) {
  //             navigate(`/room/${params.room_id}/arena`);
  //         }

  //     } catch (e) {
  //         console.error(e);
  //     }

  // }

  const onStartGame = () => {
    socket.emit("info", params.room_id, { rounds, time });
    // navigate(`/room/${params.room_id}/arena`);
  };

  return (
    <div className="flex flex-col h-screen items-center justify-center gap-2">
      {owner ? (
        <>
          <div className="form-control gap-1">
            <div className="input-group input-group-sm">
              <label htmlFor="rounds" className="bg-black text-white px-2">
                Rounds:{" "}
              </label>
              <input
                type="number"
                name=""
                id="rounds"
                className="input input-bordered input-sm"
                onChange={(e) => setRounds(parseInt(e.target.value))}
                value={rounds}
              />
            </div>
            <select
              className="select select-sm select-bordered"
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
          <div className="btn btn-sm custom" onClick={onStartGame}>
            Start Game
          </div>
        </>
      ) : (
        <></>
      )}
      <ul>
        {members.length > 0 ? (
          members.map((member, idx) => <li key={idx}>{member}</li>)
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
