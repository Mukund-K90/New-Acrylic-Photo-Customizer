import html2canvas from "html2canvas";
import { useContext } from "react";
import { CartContext } from "../components/CartContext";

export const useCartUtils = () => {
  const { addToCart } = useContext(CartContext);

  const addToCartWithImage = async (imageContainerId, name, price) => {
    const imageContainer = document.getElementById(imageContainerId) || document.querySelector(`.${imageContainerId}`);

    if (!imageContainer) {
      console.error(`Element with ID "${imageContainerId}" not found!`);
      return;
    }

    try {
      const canvas = await html2canvas(imageContainer, { useCORS: true });
      const imageUrl = canvas.toDataURL("image/jpeg", 0.8);

      const newItem = {
        id: Date.now(),
        image: imageUrl,
        name: name || "Customized Product",
        price: price || 20.99,
        quantity: 1,
      };

      addToCart(newItem);
    } catch (error) {
      console.error("Error capturing image:", error);
    }
  };

  return { addToCartWithImage };
};
