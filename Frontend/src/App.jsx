import Home from "./components/Home";
import Acrylic from "./components/AcrylicPhoto";
import ClearAcrylic from "./components/ClearAcrylicPhoto";
import { Routes, Route } from 'react-router-dom'
import MainHome from "./components/Fridge Maganet/MainHome";
import CustomizePage from "./components/Fridge Maganet/CustomizePage";
import ClockCustomizer from "./components/AcrylicWallClock";
import CollagePhoto from "./components/CollagePhoto";
import AcrylicCollageHome from "./components/CollageHome";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/acrylic" element={<Acrylic />} />
        <Route path="/clear-acrylic" element={<ClearAcrylic />} />
        <Route path="/fridge-magnets" element={<MainHome />} />
        <Route path="/customize/:type" element={<CustomizePage />} />
        <Route path="/acrylic-wall-clock" element={<ClockCustomizer />} />
        <Route path="/collage-acrylic-photo" element={<AcrylicCollageHome />} />
      </Routes>
    </>
  );
}

export default App;
