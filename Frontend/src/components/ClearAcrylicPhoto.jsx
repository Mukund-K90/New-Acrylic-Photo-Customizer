import { useEffect, useState } from "react";
import "../assets/css/ClearAcrylic.css";
import { FaImages, FaShareAlt } from "react-icons/fa";
import { FaUpload } from "react-icons/fa6";
import { HiPencilSquare } from "react-icons/hi2";
import { MdAddShoppingCart } from "react-icons/md";
import { handleShare } from "../utils/ShareService";
import useCartStore from "../manage/CartStore";
import { toast } from "sonner";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";

const ClearAcrylic = () => {
    const [cartLoading, setCartLoading] = useState(false);
    const [loading, setLoading] = useState(false);

    const { addCart } = useCartStore();

    useEffect(() => {
        const newPage = JSON.parse(sessionStorage.getItem("newPage") || "false");

        if (newPage) {
            sessionStorage.setItem("newPage", JSON.stringify(false));
            window.location.reload();
        }
        // Load html2canvas first
        const scriptHtml2Canvas = document.createElement("script");
        scriptHtml2Canvas.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        scriptHtml2Canvas.defer = true;
        document.body.appendChild(scriptHtml2Canvas);

        // Load main.js after html2canvas is loaded
        scriptHtml2Canvas.onload = () => {
            const scriptMain = document.createElement("script");
            scriptMain.src = "/js/ClearAcrylic.js";
            scriptMain.defer = true;
            document.body.appendChild(scriptMain);

            return () => {
                document.body.removeChild(scriptMain);
                document.body.removeChild(scriptHtml2Canvas);
            };
        };
    }, []);

    const handleAddToCart = async () => {
        setCartLoading(true);

        try {
            const formData = await window.shareImage();
            console.log("FormData:", [...formData.entries()]);

            const token = localStorage.getItem("token");
            if (!token) {
                console.error("User is not authenticated");
                toast.error("User is not authenticated.");
                setCartLoading(false);
                return;
            }

            const headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            };

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/cart/add`,
                formData,
                { headers }
            );

            if (response.data?.success) {
                const newCartItem = response.data.data;

                addCart({
                    id: newCartItem._id,
                    name: newCartItem.name,
                });

                toast.success(`${newCartItem.name} added to cart!`);
            } else {
                toast.error("Failed to add product to cart!");
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);
            toast.error("Failed to add product. Please try again.");
        } finally {
            setCartLoading(false);
        }
    };

    const handleShare = async () => {
        setLoading(true);
        const promise = new Promise(async (resolve, reject) => {
            try {
                const formData = await window.shareImage();
                console.log("FormData:", [...formData.entries()]);

                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("User is not authenticated");
                    reject("User is not authenticated.");
                    return;
                }

                const headers = {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`,
                };

                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/send-email`,
                    formData,
                    { headers }
                );

                if (response.data?.success) {
                    resolve("Product share successfully!");
                    setLoading(false);
                } else {
                    reject("Failed to share product.");
                }
            } catch (error) {
                console.error("Error sharing product:", error);
                reject("Failed to share product. Please try again.");
            }
        });

        toast.promise(promise, {
            loading: "Sharing product...",
            success: (message) => message,
            error: (errMsg) => errMsg,
        });

    };
    return (
        <div className="acp-container">
            <div className="acp-preview-container">
                <div className="acp-size-indicator acp-width-indicator" id="width">
                    Width 12 inch (30.48 cm)
                </div>
                <div className="acp-size-indicator acp-height-indicator" id="height">
                    Height 9 inch (22.86 cm)
                </div>
                <div className="acp-image-container" id="imageContainer">
                    <img
                        className="acp-preview-image"
                        id="previewImage"
                        src="\assets\images\demo image.png"
                        alt="Preview Image"
                    />
                </div>
            </div>

            {/* Border Colors */}
            <div className="acp-border-colors">
                {["#000000", "#f0f0f0", "#FFEB3B", "#E21E23"].map((color, index) => (
                    <button key={index} className={`acp-color-btn ${index == 0 ? 'acp-active' : ''}`} style={{ border: `2px solid ${color}` }}>
                        <FaImages />
                    </button>
                ))}
            </div>

            {/* Controls */}
            <div className="acp-controls">
                <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} />
                <button className="acp-upload-btn acp-upload" onClick={() => document.getElementById("fileInput").click()}>
                    <FaUpload />
                </button>
                <input type="range" id="zoomRange" min="0.5" max="3" step="0.1" defaultValue="1" style={{ width: "200px" }} onClick={handleShare} />
                <button className="acp-upload-btn acp-share" id="shareBtn" onClick={handleShare} disabled={loading}>
                    {loading ? <ImSpinner2 className="spin" /> : <FaShareAlt />}
                </button>
                <button
                    className="acp-upload-btn acp-add-to-cart"
                    id="cartBtn"
                    onClick={() => handleAddToCart({
                        container: "acp-image-container",
                        title: "Customized Acrylic Clear Photo",
                        price: 899
                    })}
                    disabled={cartLoading}
                >
                    {cartLoading ? <ImSpinner2 className="spin" /> : <MdAddShoppingCart />}
                </button>
                <p>Size:</p>

                {[
                    { label: "Default", ratio: "default/default" },
                    { label: "12x9", ratio: "12/9" },
                    { label: "11x11", ratio: "11/11" },
                    { label: "16x12", ratio: "16/12" },
                    { label: "16x16", ratio: "16/16" },
                    { label: "21x15", ratio: "21/15" },
                    { label: "35x23", ratio: "35/23" },
                    { label: "48x36", ratio: "48/36" },
                ].map((size, index) => (
                    <button key={index} className={`acp-size-btn ${index === 0 ? 'acp-active' : ''}`} data-ratio={size.ratio}>
                        {size.label}
                    </button>
                ))}
                <button className="acp-upload-btn" id="addTextBtn">
                    <HiPencilSquare />
                </button>
            </div>

            {/* Text Modal */}
            <div id="textModal" style={{
                display: "none",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0, 0, 0, 0.5)"
            }}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px"
                }}>
                    <h3>Customize Text</h3>
                    <label htmlFor="modalTextInput">Enter Text:</label>
                    <input type="text" id="modalTextInput" placeholder="Enter text" style={{ width: "100%", marginBottom: "10px" }} onInput={() => window.updatePreview()} />

                    <label htmlFor="textColor">Text Color:</label>
                    <input type="color" id="textColor" defaultValue="#000000" style={{ width: "100%", marginBottom: "10px" }} />

                    <label htmlFor="fontStyleSelect">Select Font Style:</label>
                    <select id="fontStyleSelect" style={{ width: "100%", marginBottom: "10px" }}>
                        {[
                            "Arial", "Times New Roman", "Courier New", "Verdana", "cursive",
                            "fantasy", "monospace", "Lucida Console", "Lucida Sans Unicode",
                            "Impact", "Georgia"
                        ].map((font, index) => (
                            <option key={index} value={font} style={{ fontFamily: font }}>{font}</option>
                        ))}
                    </select>

                    <button id="addTextModalBtn">Add Text</button>
                    <button onClick={() => document.getElementById("textModal").style.display = "none"}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ClearAcrylic;