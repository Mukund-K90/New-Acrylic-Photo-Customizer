import Home from "./components/Home";
import Acrylic from "./components/AcrylicPhoto";
import ClearAcrylic from "./components/ClearAcrylicPhoto";
import { Routes, Route } from 'react-router-dom'
import MainHome from "./components/Fridge Maganet/MainHome";
import CustomizePage from "./components/Fridge Maganet/CustomizePage";
import ClockCustomizer from "./components/AcrylicWallClock";
import AcrylicCollageHome from "./components/CollagePhoto/CollageHome";
import CollageAcrylicPhoto from "./components/CollagePhoto/CollageAcrylicPhoto";
import Navbar from "./components/Navbar/Appbar";
import { CartProvider } from "./components/CartContext";

function App() {
  return (
    <>
      <CartProvider>
        <Navbar />
        <div style={{ marginTop: "6%" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/acrylic" element={<Acrylic />} />
            <Route path="/clear-acrylic" element={<ClearAcrylic />} />
            <Route path="/fridge-magnets" element={<MainHome />} />
            <Route path="/customize/:type" element={<CustomizePage />} />
            <Route path="/acrylic-wall-clock" element={<ClockCustomizer />} />
            <Route path="/collage-acrylic-photo" element={<AcrylicCollageHome />} />
            <Route path="/colllage/:type" element={<CollageAcrylicPhoto />} />
          </Routes>
        </div>
      </CartProvider>
    </>
  );
}

export default App;