import React from "react";
import "../assets/css/AcrylicClock.css";
import { useEffect } from "react";
import { FaUpload } from "react-icons/fa6";
import { FaShareAlt } from "react-icons/fa";
import { HiPencilSquare } from "react-icons/hi2";
import { useCartUtils } from "../utils/CartUtils";
import { MdAddShoppingCart } from "react-icons/md";
import { handleShare } from "../utils/ShareService";
import { useHandleAddToCart } from "../utils/AddToCart";


const ClockCustomizer = () => {
    // const { handleAddToCart } = useHandleAddToCart(); // Use the hook

    useEffect(() => {
        const newPage = JSON.parse(sessionStorage.getItem("newPage") || "false");

        if (newPage) {
            sessionStorage.setItem("newPage", JSON.stringify(false));
            window.location.reload();
        }
        const scriptHtml2Canvas = document.createElement("script");
        scriptHtml2Canvas.src =
            "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
        scriptHtml2Canvas.defer = true;
        document.body.appendChild(scriptHtml2Canvas);

        scriptHtml2Canvas.onload = () => {
            const scriptMain = document.createElement("script");
            scriptMain.src = "/js/AcrylicClock.js";
            scriptMain.defer = true;
            scriptMain.type = "module";
            document.body.appendChild(scriptMain);

            return () => {
                document.body.removeChild(scriptMain);
                document.body.removeChild(scriptHtml2Canvas);
            };
        };
    }, []);
    const handleAddToCart = async () => {
        try {
            document.querySelectorAll(".clock-hand, .clock-center").forEach(el => {
                el.classList.add("hidden");
            });
            const formData = await window.shareImage();
            console.log("FormData:", [...formData.entries()]);

            const token = localStorage.getItem("token");
            if (!token) {
                console.error("User is not authenticated");
                toast.error("User is not authenticated.");
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
                const newCartItem = response.data.cartItem;

                const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
                const updatedCart = [...storedCart, newCartItem];
                localStorage.setItem("cart", JSON.stringify(updatedCart));
                toast.success("Product added to cart!", { duration: 2000 });
            } else {
                toast.error("Failed to add product to cart!", { duration: 2000 });
            }
        } catch (error) {
            console.error("Error adding product to cart:", error);

            toast.error("Failed to add product. Please try again.", { duration: 3000 });
        }
    };

    return (
        <div className="ac-container">
            <div className="preview-container">
                <div className="size-indicator width-indicator" id="width">
                    Width 12 inch (30.48 cm)
                </div>
                <div className="size-indicator height-indicator" id="height">
                    Height 9 inch (22.86 cm)
                </div>
                <div className="image-container" id="imageContainer">
                    <img
                        className="preview-image"
                        id="previewImage"
                        src="https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=1779&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Clock Background"
                    />
                    <div className="analog-clock">
                        <div className="clock-face">
                            <div className="clock-center"></div>
                            <div className="clock-hand hour-hand"></div>
                            <div className="clock-hand minute-hand"></div>
                            <div className="clock-hand second-hand"></div>
                            <div id="textContainer"></div>
                        </div>
                    </div>
                </div>

                <div className="shape-options">
                    {[
                        "square",
                        "circle",
                        "custom2",
                        "custom3",
                        "custom4",
                    ].map((shape, index) => {
                        return (
                            <button key={index} className={`shape-btn ${shape} ${index == 0 ? 'active' : ''}`} data-shape={shape}></button>
                        );
                    })}
                </div>
            </div>

            <div className="controls">
                <input type="file" id="fileInput" accept="image/*" style={{ display: "none" }} />
                <button className="upload-btn upload" onClick={() => document.getElementById("fileInput").click()}>
                    <FaUpload />
                </button>
                <input type="range" id="zoomRange" min="0.5" max="3" step="0.1" defaultValue="1" style={{ width: "200px" }} onClick={handleShare} />
                <button className="upload-btn share" id="shareBtn">
                    <FaShareAlt />
                </button>
                <button
                    className="ap-upload-btn ap-add-to-cart"
                    id="cartBtn"
                    onClick={handleAddToCart}
                >
                    <MdAddShoppingCart />
                </button>
                <p>Size:</p>
                {[
                    "11x11",
                    "16x16",
                ].map((size, index) => {
                    return (
                        <button key={index} className={`size-btn ${index == 0 ? 'active' : ''}`} data-ratio={size}>
                            {size}
                        </button>
                    )
                })}
                <button className="upload-btn" id="removeBgBtn">
                    Change Background
                </button>
                <button className="upload-btn" id="addTextBtn">
                    <HiPencilSquare />
                </button>
            </div>

            {/* Background Modal */}
            <div
                id="bgModal"
                style={{
                    display: "none",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                >
                    <h3>Select a Background</h3>
                    <div id="bgGallery" style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}></div>
                    <button onClick={() => (document.getElementById("bgModal").style.display = "none")}>Close</button>
                </div>
            </div>

            {/* Text Modal */}
            <div
                id="textModal"
                style={{
                    display: "none",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "rgba(0, 0, 0, 0.5)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        padding: "20px",
                        borderRadius: "10px",
                    }}
                >
                    <h3>Customize Text</h3>
                    <label htmlFor="modalTextInput">Enter Text:</label>
                    <input
                        type="text"
                        id="modalTextInput"
                        placeholder="Enter text"
                        onChange={(e) => window.updatePreview(e)}
                        style={{ width: "100%", marginBottom: "10px" }}
                    />

                    <label htmlFor="textColor">Text Color:</label>
                    <input type="color" id="textColor" defaultValue="#000000" style={{ width: "100%", marginBottom: "10px" }} />
                    <label htmlFor="fontStyleSelect">Select Font Style:</label>
                    <select id="fontStyleSelect" style={{ width: "100%", marginBottom: "10px" }}>
                        {[
                            "Arial",
                            "Times New Roman",
                            "Courier New",
                            "Verdana",
                            "cursive",
                            "fantasy",
                            "monospace",
                            "Lucida Console",
                            "Lucida Sans Unicode",
                            "Impact",
                            "Georgia",
                        ].map((font) => (
                            <option key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                            </option>
                        ))}
                    </select>
                    <button id="addTextModalBtn">Add Text</button>
                    <button onClick={() => (document.getElementById("textModal").style.display = "none")}>Cancel</button>
                </div>
            </div>

            <center>
                <h2>Select Clock Number Style:</h2>
            </center>
            <div className="clock-row">
                {["full", "full", "false", "roman", "roman", "limited"].map((type, index) => (
                    <div key={index} className={`style-clock small ${index == 0 ? 'active' : ''}`} onClick={(e) => window.activateClock(e.currentTarget, type)}>
                        <div className="preview-clock-face"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClockCustomizer;
