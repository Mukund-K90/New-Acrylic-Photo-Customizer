import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/CollagePhoto.css";
import { FaDownload, FaImage, FaTrash } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'
import { VscDebugRestart, VscTextSize } from 'react-icons/vsc'
import { HiPencilSquare } from "react-icons/hi2";
import { FaShareAlt } from "react-icons/fa";
import { useCartUtils } from "../../utils/CartUtils";
import { MdAddShoppingCart } from "react-icons/md";
import { handleShare } from "../../utils/ShareService";
import { useHandleAddToCart } from "../../utils/AddToCart";

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
    const { handleAddToCart } = useHandleAddToCart(); // Use the hook

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
    // const handleAddToCart = () => {
    //     const customizationDetails = window.getImageDetails();
    //     console.log(customizationDetails);

    //     addToCartWithImage("acol-collage-frame", `Customized Collage Acrylic (${customizationDetails.size ? customizationDetails.size : ''})`, 699, customizationDetails);
    // };
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
                    <button className="acol-upload-btn acol-share" id="acol-shareBtn" onClick={handleShare}><FaShareAlt /></button>
                    <button
                        className="acol-upload-btn acol-add-to-cart"
                        id="cartBtn"
                        onClick={() => handleAddToCart({
                            container: "acol-collage-frame",
                            title: "Customized Collage Acrylic",
                            price: 799
                        })}
                    >
                        <MdAddShoppingCart />
                    </button>
                </div>
            </div >
        </div >
    );
};

export default CollageAcrylicPhoto;
