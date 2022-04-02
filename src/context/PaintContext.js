import { createContext, useEffect, useReducer } from "react";
import paintReducer from "./PaintReducer";
import { io } from "socket.io-client";
const PaintContext = createContext();

export const PaintProvider = ({ children }) => {
  const initialState = {
    user: "",
    color: "#000000",
    tool: "eraser",
    size: 20,
    owner: false,
    currentDrawer: "",
    roomId: "",
    socket: null,
    active: [],
    time: 0,
    rounds: 0,
  };
  const [state, dispatch] = useReducer(paintReducer, initialState);

  useEffect(() => {
    const newSocket = io(`${process.env.REACT_APP_SERVER_URL}`, {
      transports: ["websocket"],
    });
    newSocket.on("connect", () => {
      console.log("Socket connection established from client");

      newSocket.on("color", (color) => {
        dispatch({
          type: "SET_COLOR",
          payload: color,
        });
      });

      newSocket.on("tool", (tool) => {
        dispatch({
          type: "SET_TOOL",
          payload: tool,
        });
      });
      newSocket.on("size", (size) => {
        dispatch({
          type: "SET_SIZE",
          payload: size,
        });
      });

      dispatch({
        type: "SET_SOCKET",
        payload: newSocket,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaintContext.Provider value={{ ...state, dispatch }}>
      {children}
    </PaintContext.Provider>
  );
};

export default PaintContext;
