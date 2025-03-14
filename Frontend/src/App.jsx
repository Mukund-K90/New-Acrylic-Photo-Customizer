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
import Login from "./components/Login";
import Profile from "./components/Profile";
import Navbar from "./components/Navbar/Navbar";
import CartScreen from "./components/CartScreen";
import { Toaster, toast } from 'sonner'
import CheckoutScreen from "./components/CheckoutScreen";
import MyOrders from "./components/MyOrders";
import OrderDetails from "./components/OrderDetails";
import Thankyou from './components/ThanksPage';

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/";
  const token = localStorage.getItem("token");

  if (token && isLoginPage) {
    return <Navigate to="/home" />;
  }
  return (
    <>
      <Toaster richColors position="top-center" duration={1000}/>
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
          <Route path="/cart" element={<CartScreen />} />
          <Route path="/checkout" element={<CheckoutScreen />} />
          <Route path="/my-orders" element={<MyOrders />} />
          <Route path="/order/:orderId" element={<OrderDetails />} />
          <Route path="/thanks" element={<Thankyou />} />
        </Routes>
      </div>
    </>
  );
}

export default App;