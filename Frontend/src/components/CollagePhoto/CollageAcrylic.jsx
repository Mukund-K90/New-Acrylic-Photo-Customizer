import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../../assets/css/CollagePhoto.css";

const collageLayouts = {
    "2-pic": [
        { id: 1, type: "small-img" },
        { id: 2, type: "small-img" }
    ],
    "5-pic": [
        { id: 1, type: "big-img" },
        { id: 2, type: "small-img" },
        { id: 3, type: "small-img" },
        { id: 4, type: "small-img" },
        { id: 5, type: "small-img" }
    ],
    "8-pic": [
        { id: 1, type: "small-img" },
        { id: 2, type: "small-img" },
        { id: 3, type: "small-img" },
        { id: 4, type: "small-img" },
        { id: 5, type: "small-img" },
        { id: 6, type: "small-img" },
        { id: 7, type: "small-img" },
        { id: 8, type: "small-img" }
    ]
};

const CollageAcrylicPhoto = () => {
    const { type } = useParams(); 
    console.log(type);
    const [selectedLayout, setSelectedLayout] = useState(collageLayouts[type] || collageLayouts["2-pic"]);

    useEffect(() => {
        setSelectedLayout(collageLayouts[type] || collageLayouts["2-pic"]);
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

    return (
        <div className="content">
            <h2>{type ? type.replace("-", " ") : "3-pic"} Collage</h2>
            <div className="collage-frame">
                {selectedLayout.map((slot) => (
                    <div key={slot.id} className={slot.type} data-slot={slot.id}>
                        <img className="previewImage" id={`previewImage${slot.id}`} src="" alt="Click to upload" style={{ display: "none" }} />
                        <input type="file" id={`fileInput${slot.id}`} accept="image/*" style={{ display: "none" }} />
                        <p className="placeholderText"><i className="fa-solid fa-upload"></i> Upload</p>
                    </div>
                ))}
            </div>

            <div className="row">
                <select id="fontStyleSelect" style={{ width: "100%", marginBottom: "10px" }} onChange={() => window.changeFontFamily()}>
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
                <input type="color" id="textColor" defaultValue="#000000" onInput={() => window.updatePreview()} />
                <div className="row">
                    <button id="iminus">-</button> AAA
                    <button id="iplus">+</button>
                    <p id="reset" title="Reset the collage">&#8635;</p>
                </div>
            </div>

            <div className="textModal">
                <input type="text" id="textInput" placeholder="Enter text" onInput={() => window.updatePreview()} />
                <a id="closeText"><i className="fa-solid fa-xmark"></i></a>
                <button id="addTextBtn">Add New Text Field</button>
            </div>

            <div className="row">
                <h3>Size (Inch)</h3>
                <button className="size-btn active" data-ratio="12/9">12x9</button>
                <button className="size-btn" data-ratio="11/11">16x12</button>
                <button className="size-btn" data-ratio="11/11">21x15</button>
                <button className="size-btn" data-ratio="11/11">35x23</button>
                <button className="size-btn" data-ratio="11/11">48x36</button>
            </div>

            <div className="row">
                <h3>Thickness (mm)</h3>
                <button className="thickness-btn active">5 MM</button>
                <button className="thickness-btn">5 MM</button>
                <button className="thickness-btn">8 MM (Premium)</button>
            </div>

            <button className="upload-btn download" id="downloadBtn"><i className="fa-solid fa-download"></i></button>
            <button className="upload-btn share" id="shareBtn"><i className="fa-solid fa-share-nodes"></i></button>
        </div>
    );
};

export default CollageAcrylicPhoto;
