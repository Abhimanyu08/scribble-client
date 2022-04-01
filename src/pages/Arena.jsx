import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import ToolSelect from "../components/ToolSelect";
import PaintSelect from "../components/PaintSelect";
import SizeSelect from "../components/SizeSelect";
import Canvas from "../components/Canvas";
import { useNavigate, useParams } from "react-router-dom";
import PaintContext from "../context/PaintContext";
import { FaCrown } from "react-icons/fa";

function Arena() {
  const {
    user,
    socket,
    currentDrawer,
    dispatch,
    active,
    rounds,
    time,
    owner,
    roomId,
  } = useContext(PaintContext);
  const [messages, setMessages] = useState([]);
  const [guess, setGuess] = useState("");
  const [selected, setSelected] = useState(false);
  const [word, setWord] = useState("");
  const [words, setWords] = useState([]);
  const [timer, setTimer] = useState(time);
  const [blank, setBlank] = useState("");
  const [chars, setChars] = useState(0);
  const [revealed, setRevealed] = useState(0);
  const [lastreveal, setLastReveal] = useState(0);
  const [timeout, setTimeoutFunc] = useState(null);
  const [score, setScore] = useState({});
  const [leaderboard, setLeaderBoard] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [round, setRound] = useState(0);
  const [guessed, setGuessed] = useState(0);
  const [declareWinner, setDeclarWinner] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const cleanUpFunc = (currentDrawer, words, currentRound) => {
    //this function takes the new gameInfo and cleans up the state for a new round
    if (currentRound === rounds + 1) {
      setDeclarWinner(true);
      return;
    }
    dispatch({
      type: "SET_DRAWER",
      payload: currentDrawer,
    });
    if (currentRound === 1) setLeaderBoard({});
    setShowScore(false);
    setSelected(false);
    // setInfo(info);
    setTimer(time);
    setLastReveal(time);
    setScore({});
    setMessages([]);
    setWord("");
    setGuess("");
    setBlank("");
    setRevealed(0);
    setChars(0);
    setGuessed(0);
    setRound(currentRound);
    setDeclarWinner(false);
    if (user === currentDrawer) setWords(words);
  };

  const sortByScore = (players, scores) => {
    if (!scores) return players;
    let temp;
    for (let [idx, player] of players.slice(1).entries()) {
      for (let i = idx; i >= 0; i--) {
        if (scores[players[i]] < scores[player]) {
          temp = players[i];
          players[i] = player;
          players[i + 1] = temp;
        }
      }
    }
    return players;
  };

  useLayoutEffect(() => {
    if (owner) socket.emit("nextChance", roomId, true);

    socket.on("gameInfo", cleanUpFunc);

    socket.on("message", (author, message) => {
      setMessages((prevState) => [...prevState, { author, message }]);
    });

    socket.on("blank", (words) => setBlank(words));

    socket.on("word", (selectedWord) => {
      setWord(selectedWord);
      setChars(selectedWord.replace(" ", "").length);
      setSelected(true);
      wordToBlanks(selectedWord);
      socket.emit("clear", roomId);
      setTimeoutFunc(setInterval(() => setTimer((prev) => prev - 1), 1000));
    });
    socket.on("notification", (message, winner, score) => {
      setScore((prev) => {
        return { ...prev, [winner]: score };
      });
      setLeaderBoard((prev) => {
        return { ...prev, [winner]: (prev[winner] || 0) + score };
      });
      setGuessed((prev) => prev + 1);
      setMessages((prev) => [...prev, { author: "", message }]);
    });

    socket.on("roundFinished", (drawerScore, cd) => {
      setLeaderBoard((prev) => {
        return {
          ...prev,
          [cd]: (prev[cd] || 0) + drawerScore,
        };
      });

      setScore((prev) => {
        return { ...prev, [cd]: drawerScore };
      });

      setShowScore(true);

      if (owner) {
        setTimeout(() => {
          socket.emit("nextChance", roomId, false);
        }, 3000);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (user === currentDrawer) {
      if (lastreveal - timer === time / 5) {
        revealSlowly();
        socket.emit("blank", roomId, blank);
      }
    }
    if (timer === 0 || (guessed === active.length - 1 && timer !== time)) {
      clearInterval(timeout);
      if (owner) socket.emit("timeout", roomId, guessed, active.length - 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, guessed]);

  const wordToBlanks = (word) => {
    let str = "";
    Array.from(word).forEach((letter) => {
      if (letter === " ") {
        str += "  ";
      } else {
        str += "_ ";
      }
    });
    setBlank(str);
  };

  const revealSlowly = () => {
    let wArray = Array.from(word);
    let ridx = Math.floor(Math.random() * wArray.length);

    let newBlank = "";
    Array.from(blank).forEach((item, idx) => {
      if (idx / 2 === ridx) {
        newBlank += word[ridx];
      } else {
        newBlank += item;
      }
    });

    if (revealed < chars / 2) {
      setBlank(newBlank);
      setRevealed((prev) => prev + 1);
      setLastReveal(timer);
    }
  };

  const checkGuess = (guess) => {
    if (user === currentDrawer) return false;
    let answer = word.replace(" ", "").toLowerCase();
    return answer === guess.replace(" ", "").toLowerCase();
  };

  const onGuessSumbit = (e) => {
    if (e.key === "Enter") {
      if (checkGuess(guess)) {
        socket.emit("guessed", params.room_id, user, timer, time);
        setGuess("");
        return;
      }

      socket.emit("message", params.room_id, user, guess);
      setGuess("");
      return;
    }
    return;
  };

  const onWordSelect = (e) => {
    socket.emit("wordChoice", params.room_id, e.target.innerText);
    // setSelected(true);
  };

  const onClear = () => {
    socket.emit("clear", roomId);
  };

  const onNewGame = () => {
    if (owner) navigate(`/room/${roomId}`);
  };

  return (
    <div className="flex flex-col h-screen mx-2 xl:mx-40 gap-1">
      <div className="flex w-full justify-between mt-2 border-2 rounded-md px-2 border-black bg-amber-300">
        <div className="font-bold">
          <span>{timer ? timer : ""}</span>
        </div>
        <p className="font-bold">
          Round {round} of {rounds}
        </p>
        <div className="text-black text-lg font-bold flex gap-3">
          {user === currentDrawer
            ? word
            : blank.split("  ").map((b) => <span>{b}</span>)}
        </div>
      </div>
      <div className="flex items-start gap-2 grow">
        {/* ------------------------------Leaderboard section----------------------------- */}
        <div className="flex flex-col basis-1/12 border-4 items-center border-black rounded-md bg-stone-400">
          <p className="text-black bg-amber-300 w-full text-center border-b-2 border-black font-bold px-1">
            Leaderboard
          </p>
          {sortByScore(active, leaderboard).map((member, idx) => (
            <p key={idx} className="font-semibold">
              {`${idx + 1}. ${member}`} - {leaderboard[member] || 0}
            </p>
          ))}
        </div>

        {/* ---------------------------------Drawing Area------------------------------------ */}
        <div className="flex flex-col items-center gap-2 basis-8/12 h-full relative">
          <Canvas />
          {!selected ? (
            <div className="flex flex-row items-center gap-2 justify-center h-3/4 w-full absolute top-0 left-0 bg-black">
              {user === currentDrawer ? (
                words?.map((word, idx) => (
                  <div
                    key={idx}
                    className="btn btn-xs lg:btn-md game"
                    onClick={onWordSelect}
                  >
                    {word}
                  </div>
                ))
              ) : (
                <p className="text-white font-bold text-2xl">{`${currentDrawer} is choosing a word`}</p>
              )}
            </div>
          ) : (
            <></>
          )}

          {showScore ? (
            <div className="flex flex-col gap-2 absolute left-0 top-0 h-3/4 w-full justify-center items-center bg-black opacity-80">
              {sortByScore(active, score).map((member, idx) => (
                <p key={idx} className="font-semibold text-green-500">
                  {`${idx + 1}. ${member}`}: +{score[member] || 0}
                </p>
              ))}
            </div>
          ) : (
            <></>
          )}

          {declareWinner ? (
            <div className="flex flex-col gap-2 absolute left-0 top-0 h-3/4 w-full justify-center items-center bg-black self-center">
              <p className="text-5xl text-amber-400">Final Scores</p>
              <div className="flex flex-col gap-2 items-start">
                {sortByScore(active, leaderboard).map((member, idx) => (
                  <p
                    key={idx}
                    className="flex items-center gap-2 font-semibold text-2xl text-rose-700 justify-start w-max"
                  >
                    {idx + 1}. {member}- {leaderboard[member] || 0}
                    {idx === 0 ? <FaCrown className="text-amber-400" /> : ""}
                  </p>
                ))}
              </div>
              {owner ? (
                <div className="btn btn-sm mt-4 game" onClick={onNewGame}>
                  New Game
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}

          {user === currentDrawer ? (
            <div className="flex items-center gap-2 w-fit">
              <ToolSelect />
              <SizeSelect />
              <PaintSelect />
              <div
                className="btn btn-sm game border-2 border-black"
                onClick={onClear}
              >
                Clear
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>

        {/* -----------------------------------Messages section------------------------------------------- */}
        <div className="flex flex-col justify-between border-4 basis-3/12 h-3/4 border-black rounded-md bg-stone-300">
          <div className="flex flex-col overflow-y-auto">
            {messages.map((info, idx) => {
              return (
                <p
                  key={idx}
                  className={`${
                    info.author === ""
                      ? "text-green-600 font-semibold text-md"
                      : "text-black font-normal text-md"
                  } px-1`}
                >
                  {info.author ? `${info.author}: ` : ""} {info.message}
                </p>
              );
            })}
          </div>
          <input
            type="text"
            className="input input-bordered input-sm rounded-none border-black border-t-2 border-b-0 border-l-0 border-r-0"
            placeholder="Type your guess here"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyPress={onGuessSumbit}
          />
        </div>
      </div>
    </div>
  );
}

export default Arena;
