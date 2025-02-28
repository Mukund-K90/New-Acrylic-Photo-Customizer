import React from "react";
import { Link } from "react-router-dom";
import "../../../public/css/FridgeMagnet.css";

const dictionary = {
  item1: { 
    image: "https://s.omgs.in/wp-content/uploads/2024/01/Round-Corners-shape-min-500x500.jpg", 
    description: "OMGs® Round Corners Acrylic Fridge Magnet\n₹349 – ₹449", 
    type: "round-corners" 
  },
  item2: { 
    image: "https://s.omgs.in/wp-content/uploads/2024/01/circle-shape-min-768x768.jpg", 
    description: "OMGs® Round Acrylic Fridge Magnet\n₹349 – ₹449", 
    type: "rounded" 
  },
  item3: { 
    image: "https://s.omgs.in/wp-content/uploads/2024/01/Leaf-2-shape-min-2048x2048.jpg", 
    description: "OMGs® Leaf Shape Acrylic Fridge Magnet\n₹349 – ₹449", 
    type: "leaf" 
  },
  item4: { 
    image: "https://s.omgs.in/wp-content/uploads/2024/01/square-shape-min-2048x2048.jpg", 
    description: "OMGs® Square Acrylic Fridge Magnets\n₹349 – ₹449", 
    type: "square" 
  },
};

const MainHome = () => {
  return (
    <div className="afm-container">
      {Object.keys(dictionary).map((key, index) => (
        <div className="afm-card" key={index}>
          <img src={dictionary[key].image} alt={key} />
          <div className="afm-description">{dictionary[key].description}</div>
          <Link to={`/customize/${dictionary[key].type}`} className="afm-customize-btn" onClick={localStorage.setItem("previousType",dictionary[key].type)}>
            Customize Now
          </Link>
        </div>
      ))}
    </div>
  );
};

export default MainHome;
