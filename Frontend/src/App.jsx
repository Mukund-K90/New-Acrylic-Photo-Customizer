import Home from "./components/Home";
import Acrylic from "./components/AcrylicPhoto";
import ClearAcrylic from "./components/ClearAcrylicPhoto";
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import MainHome from "./components/Fridge Magnet/MainHome";
import CustomizePage from "./components/Fridge Magnet/CustomizePage";
import ClockCustomizer from "./components/AcrylicWallClock";
import AcrylicCollageHome from "./components/CollagePhoto/CollageHome";
import CollageAcrylicPhoto from "./components/CollagePhoto/CollageAcrylicPhoto";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./components/CartContext";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const token = localStorage.getItem("token");
  console.log(JSON.stringify(localStorage.getItem("user")));
  

  if (token && isLoginPage) {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <CartProvider>
        {!isLoginPage && <Navbar />}
        <div style={!isLoginPage ? { marginTop: "6%" } : {}}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/acrylic" element={<ProtectedRoute><Acrylic /></ProtectedRoute>} />
            <Route path="/clear-acrylic" element={<ProtectedRoute><ClearAcrylic /></ProtectedRoute>} />
            <Route path="/fridge-magnets" element={<ProtectedRoute><MainHome /></ProtectedRoute>} />
            <Route path="/customize/:type" element={<ProtectedRoute><CustomizePage /></ProtectedRoute>} />
            <Route path="/acrylic-wall-clock" element={<ProtectedRoute><ClockCustomizer /></ProtectedRoute>} />
            <Route path="/collage-acrylic-photo" element={<ProtectedRoute><AcrylicCollageHome /></ProtectedRoute>} />
            <Route path="/colllage/:type" element={<ProtectedRoute><CollageAcrylicPhoto /></ProtectedRoute>} />
          </Routes>
        </div>
      </CartProvider>
    </>
  );
}

export default App;