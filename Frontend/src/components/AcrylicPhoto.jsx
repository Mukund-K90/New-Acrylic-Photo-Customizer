import { useEffect, useState } from "react";
import "../assets/css/AcrylicPhoto.css";
import { FaImage, FaShareAlt } from "react-icons/fa";
import { FaDownload, FaUpload } from "react-icons/fa6";
import { HiPencilSquare } from "react-icons/hi2";
import { MdAddShoppingCart } from "react-icons/md";
import { toast } from "sonner";
import axios from "axios";
import useCartStore from "../manage/CartStore";
import { ImSpinner2 } from "react-icons/im";

const AcrylicPhoto = () => {
  const [loading, setLoading] = useState(false);

  const { addCart } = useCartStore(); // Use the hook

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
      scriptMain.src = "/js/AcrylicPhoto.js";
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
          resolve({ name: newCartItem.name });
        } else {
          reject("Failed to add product to cart!");
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        reject("Failed to add product. Please try again.");
      }
    });

    toast.promise(promise, {
      loading: "Adding product to cart...",
      success: (data) => `${data.name} added to cart!`,
      error: (errMsg) => errMsg,
    });
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
    <div className="ap-container">
      <div className="ap-border-colors">
        {[
          "none",
          "#000000",
          "#E21E23",
          "#FF5722",
          "#FFEB3B",
          "#AE4A84",
          "#058E3F",
          "#D72483",
          "#EC7D10",
          "#896A67",
        ].map((style, index) => (
          <button
            key={index}
            className="ap-color-btn"
            style={{ border: `5px groove ${style}` }}
          >
            <FaImage />
          </button>
        ))}
      </div>

      <div className="ap-preview-container">
        <div className="ap-size-indicator ap-width-indicator" id="width">
          Width 12 inch (30.48 cm)
        </div>
        <div className="ap-size-indicator ap-height-indicator" id="height">
          Height 9 inch (22.86 cm)
        </div>
        <div className="ap-image-container" id="imageContainer">
          <img
            className="ap-preview-image"
            id="previewImage"
            src="https://images.unsplash.com/photo-1733287733098-11492d9920f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Preview"
          />
        </div>

        <div className="ap-shape-options">
          {[
            "square",
            "potrait",
            "rect",
            "circle",
            "oval",
            "custom",
            "custom2",
            "custom3",
            "custom4",
          ].map((shape) => (
            <button
              key={shape}
              className={`ap-shape-btn ap-${shape}`}
              data-shape={shape}
            ></button>
          ))}
        </div>
      </div>

      <div className="ap-controls">
        <input type="file" id="fileInput" accept="image/*" hidden />
        <button
          className="ap-upload-btn ap-upload"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <FaUpload />
        </button>
        <input
          type="range"
          id="zoomRange"
          min="0.5"
          max="3"
          step="0.1"
          defaultValue="1"
          style={{ width: "200px" }}
        />
        {/* <button className="ap-upload-btn ap-download" id="downloadBtn">
          <FaDownload />
        </button> */}
        <button className="ap-upload-btn ap-share" id="shareBtn" onClick={handleShare} disabled={loading}>
          {loading ? <ImSpinner2 className="spin" /> : <FaShareAlt />}
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
          "default",
          "12x9",
          "11x11",
          "16x12",
          "16x16",
          "21x15",
          "35x23",
          "48x36",
        ].map((ratio, index) => (
          <button
            key={index}
            className={`ap-size-btn ${index === 0 ? "ap-active" : ""}`}
            data-ratio={ratio}
          >
            {ratio}
          </button>
        ))}

        <button className="ap-upload-btn" id="removeBgBtn">
          Change Background
        </button>
        <button className="ap-upload-btn" id="addTextBtn">
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
          <div
            id="bgGallery"
            style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}
          ></div>
          <button
            onClick={() =>
              (document.getElementById("bgModal").style.display = "none")
            }
          >
            Close
          </button>
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
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label htmlFor="textColor">Text Color:</label>
          <input
            type="color"
            id="textColor"
            defaultValue="#000000"
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <label htmlFor="fontStyleSelect">Font Style:</label>
          <select
            id="fontStyleSelect"
            style={{ width: "100%", marginBottom: "10px" }}
          >
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
          <button
            onClick={() =>
              (document.getElementById("textModal").style.display = "none")
            }
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AcrylicPhoto;
