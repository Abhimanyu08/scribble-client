import { PaintProvider } from "./context/PaintContext";
import { AlertProvider } from "./context/AlertContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Arena from "./pages/Arena";
import Room from "./pages/Room";
import Join from "./pages/Join";

function App() {
  return (
    <PaintProvider>
      <AlertProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/room/:room_id/arena" element={<Arena />} />
            <Route path="/join/:room_id" element={<Join />} />
            <Route path="/room/:room_id" element={<Room />} />
          </Routes>
        </Router>
      </AlertProvider>
    </PaintProvider>
  );
}

export default App;
