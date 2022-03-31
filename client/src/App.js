import { PaintProvider } from "./context/PaintContext";
import { AlertProvider } from "./context/AlertContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Arena from "./pages/Arena";
import Room from "./pages/Room";
import Join from "./pages/Join";
import DrawingBoard from "./pages/DrawingBoard";

function App() {
  return (
    <PaintProvider>
      <AlertProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/arena" element={<Arena />} />
            <Route path="/drawingboard" element={<DrawingBoard />} />
            <Route path="/room/:room_id/arena" element={<Arena />} />
            <Route path="/:room_id" element={<Join />} />
            <Route path="/room/:room_id" element={<Room />} />
          </Routes>
        </Router>
      </AlertProvider>
    </PaintProvider>
  );
}

export default App;
