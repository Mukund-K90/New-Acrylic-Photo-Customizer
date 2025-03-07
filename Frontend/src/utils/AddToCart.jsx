import { toast } from "sonner";
import { useCartUtils } from "./CartUtils";

export const useHandleAddToCart = () => {
    const { addToCartWithImage } = useCartUtils();

    const handleAddToCart = async ({ container, title, price }) => {
        try {
            const customizationDetails = await window.getImageDetails();

            addToCartWithImage(
                container,
                `${title} (${customizationDetails.size ? customizationDetails.size : ''})`,
                price,
                customizationDetails
            );

            toast.success("Product added to cart!", { duration: 2000 });
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error("Failed to add product. Please try again.", { duration: 3000 });
        }
    };

    return { handleAddToCart };
};
