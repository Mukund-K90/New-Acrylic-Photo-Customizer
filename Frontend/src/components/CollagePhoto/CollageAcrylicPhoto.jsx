import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/CollagePhoto.css";
import { FaDownload, FaImage, FaTrash } from 'react-icons/fa6'
import { VscDebugRestart, VscTextSize } from 'react-icons/vsc'
import { HiPencilSquare } from "react-icons/hi2";
import { FaShareAlt } from "react-icons/fa";
import { MdAddShoppingCart } from "react-icons/md";
import { handleShare } from "../../utils/ShareService";
import { toast } from "sonner";
import axios from "axios";
import useCartStore from "../../manage/CartStore";
import { ImSpinner2 } from "react-icons/im";

const collageLayouts = {

    "2-pics": {
        style: { gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr", border: "1px solid #000" },
        images: [
            { id: 1, type: "acol-small-img" },
            { id: 2, type: "acol-small-img" },
        ],
    },
    "5-pics": {
        style: { gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "1fr 1fr", border: "1px solid #000" },
        images: [
            { id: 1, type: "acol-big-img" },
            { id: 2, type: "acol-small-img" },
            { id: 3, type: "acol-small-img" },
            { id: 4, type: "acol-small-img" },
            { id: 5, type: "acol-small-img" },
        ],
    },
    "8-pics": {
        style: { gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "1fr 1fr", border: "1px solid #000" },
        images: [
            { id: 1, type: "acol-small-img" },
            { id: 2, type: "acol-small-img" },
            { id: 3, type: "acol-small-img" },
            { id: 4, type: "acol-small-img" },
            { id: 5, type: "acol-small-img" },
            { id: 6, type: "acol-small-img" },
            { id: 7, type: "acol-small-img" },
            { id: 8, type: "acol-small-img" },
        ],
    },
};

const CollageAcrylicPhoto = () => {
    const [loading, setLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);

    const { addCart } = useCartStore();

    const { type } = useParams();
    console.log(type);
    const layout = collageLayouts[type];

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

        // Load main.js after html2canvas is loaded
        scriptHtml2Canvas.onload = () => {
            const scriptMain = document.createElement("script");
            scriptMain.src = "/js/CollagePhoto.js";
            scriptMain.defer = true;
            scriptMain.type = "module";
            document.body.appendChild(scriptMain);

            return () => {
                document.body.removeChild(scriptMain);
                document.body.removeChild(scriptHtml2Canvas);
            };
        };
    }, [type]);
    if (!layout) return <h2>Invalid collage type</h2>;

    const handleAddToCart = async () => {
        setCartLoading(true);
        try {
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
        <div className="acol-content">
            <h2>{type ? type.replace("-", " ") : "2-pic"} Collage</h2>
            <div className="acol-main-content">
                <div className="acol-collage-frame" style={layout.style}>
                    {layout.images.map((img) => (
                        <div className={img.type} data-slot={img.id} key={img.id} style={{ border: "1px solid #000" }}>
                            <img className="acol-previewImage" id={`acol-previewImage${img.id}`} alt="Click to upload" style={{ display: "none" }} />
                            <input type="file" id={`acol-fileInput${img.id}`} accept="image/*" style={{ display: "none" }} />
                            <p className="acol-placeholderText">
                                <FaImage />
                                Upload
                            </p>
                        </div>
                    ))}
                </div>

                <div>
                    <div className="acol-row">
                        <select id="acol-fontStyleSelect" style={{ width: "100%", marginBottom: "10px" }} onChange={() => window.changeFontFamily()}>
                            <option value="Arial" style={{ fontFamily: "Arial" }}>Arial</option>
                            <option value="Times New Roman" style={{ fontFamily: "Times New Roman" }}>Times New Roman</option>
                            <option value="Courier New" style={{ fontFamily: "Courier New" }}>Courier New</option>
                            <option value="Verdana" style={{ fontFamily: "Verdana" }}>Verdana</option>
                            <option value="cursive" style={{ fontFamily: "cursive" }}>Cursive</option>
                            <option value="fantasy" style={{ fontFamily: "fantasy" }}>Fantasy</option>
                            <option value="monospace" style={{ fontFamily: "monospace" }}>Monospace</option>
                            <option value="Lucida Console" style={{ fontFamily: "Lucida Console" }}>Lucida Console</option>
                            <option value="Lucida Sans Unicode" style={{ fontFamily: "Lucida Sans Unicode" }}>Lucida Sans Unicode</option>
                            <option value="Impact" style={{ fontFamily: "Impact" }}>Impact</option>
                            <option value="Georgia" style={{ fontFamily: "Georgia" }}>Georgia</option>
                        </select>
                        <input type="color" id="acol-textColor" defaultValue="#000000" onInput={() => window.updatePreview()} />
                        <div className="acol-row">
                            <button id="acol-iminus">-</button> <VscTextSize style={{ fontSize: '2rem' }} />
                            <button id="acol-iplus">+</button>
                            <p id="acol-reset" title="Reset the collage"><VscDebugRestart /></p>
                            <button id="acol-addTextBtn">
                                <HiPencilSquare />
                            </button>

                        </div>
                    </div>

                    <div className="acol-textModal">
                        <input type="text" id="acol-textInput" placeholder="Enter text" onInput={() => window.updatePreview()} />
                        <a id="acol-deleteTextBtn">
                            <FaTrash />
                        </a>
                    </div>


                    <div className="acol-row">
                        <h3>Size (Inch):</h3>
                        {[
                            "12x9",
                            "21x15",
                            "35x23",
                            "48x36"
                        ].map((s, index) => (
                            <button key={index} className={`acol-size-btn ${index === 0 ? 'acol-active' : ''}`} data-ratio={s}>{s}</button>
                        ))}
                    </div>

                    <div className="acol-row">
                        <h3>Thickness (mm)</h3>
                        <button className="acol-thickness-btn acol-active" data-thickness="5 MM">5 MM</button>
                        <button className="acol-thickness-btn" data-thickness="8 MM">8 MM (Premium)</button>
                    </div>
                    {/* <button className="acol-upload-btn acol-download" id="acol-downloadBtn"><FaDownload /></button> */}
                    <button className="acol-upload-btn acol-share" id="acol-shareBtn" onClick={handleShare} disabled={loading}>
                        {loading ? <ImSpinner2 className="spin" /> : <FaShareAlt />}
                    </button>
                    <button
                        className="acol-upload-btn acol-add-to-cart"
                        id="cartBtn"
                        onClick={() => handleAddToCart({
                            container: "acol-collage-frame",
                            title: "Customized Collage Acrylic",
                            price: 799
                        })}
                        disabled={cartLoading}
                    >
                        {cartLoading ? <ImSpinner2 className="spin" /> : <MdAddShoppingCart />}
                    </button>
                </div>
            </div >
        </div >
    );
};

export default CollageAcrylicPhoto;
