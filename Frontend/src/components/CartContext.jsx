import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart || savedCart === "undefined") {
        return [];
    }
    try {
        return JSON.parse(savedCart);
    } catch (error) {
        console.error("Error parsing cart from local storage:", error);
        return []; 
    }
});


  const API_URL = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  // Fetch cart data from API
  const fetchCart = async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCart(response.data.cartItems);
        localStorage.setItem("cart", JSON.stringify(response.data.cartItems));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // // Add item to cart
  const addToCart = async (newItem) => {
      try {
          const formData = new FormData();
          formData.append("image", newItem.image);
          formData.append("details", JSON.stringify(newItem.imageDetails));
          formData.append("subject", `Acrylic Photo Order - ${new Date().toISOString()}`);

          const response = await axios.post(`${API_URL}/cart/add`, formData, {
              headers: {
                  "Content-Type": "multipart/form-data",
                  Authorization: `Bearer ${token}`,
              },
          });

          // setCart((prevCart) => {
          //     const updatedCart = [...prevCart, response.data.cartItem];
          //     localStorage.setItem("cart", JSON.stringify(updatedCart));
          //     return updatedCart;
          // });

          toast.success("Item added to cart!");
      } catch (error) {
          console.error("Error adding to cart:", error);
          toast.error("Failed to add item to cart.");
      }
  };

  // Increase quantity
  const increaseQuantity = async (id) => {
    console.log("sasasa", id);

    try {
      const response = await axios.put(`${API_URL}/cart/increase/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        // setCart(response.data.cartItems);
        // localStorage.setItem("cart", JSON.stringify(response.data.cartItems));
      }
    } catch (error) {
      console.error("Error increasing quantity:", error);
    }
  };

  // Decrease quantity
  const decreaseQuantity = async (id) => {
    try {
      const response = await axios.put(`${API_URL}/cart/decrease/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setCart(response.data.cartItems);
        localStorage.setItem("cart", JSON.stringify(response.data.cartItems));
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error);
    }
  };

  // Remove item from cart
  const removeItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/cart/remove/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item._id !== id);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      });

      toast.success("Item removed from cart!");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item.");
    }
  };

  // Clear the entire cart
  const clearCart = async () => {
    try {
      await axios.delete(`${API_URL}/cart/clear/${localStorage.getItem("userId")}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCart([]);
      localStorage.removeItem("cart");
      toast.success("Cart cleared!");
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, increaseQuantity, decreaseQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
