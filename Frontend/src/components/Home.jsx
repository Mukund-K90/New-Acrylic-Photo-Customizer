import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const [hoveredIndex, setHoveredIndex] = useState(null);

  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  };

  const cardContainerStyle = {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: "1200px",
  };

  const cardStyle = (isHovered) => ({
    width: "280px",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: isHovered
      ? "0px 10px 20px rgba(0, 0, 0, 0.2)"
      : "0px 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
    transform: isHovered ? "translateY(-10px)" : "translateY(0)",
  });

  const titleStyle = {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#333",
  };

  const descriptionStyle = {
    fontSize: "14px",
    color: "#666",
    marginBottom: "15px",
  };

  const buttonStyle = (isHovered) => ({
    padding: "12px 20px",
    fontSize: "16px",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    backgroundColor: isHovered ? "#0056b3" : "#007bff",
    color: "#fff",
    fontWeight: "bold",
    display: "inline-block",
    textTransform: "uppercase",
    transform: isHovered ? "scale(1.05)" : "scale(1)",
  });

  const imageStyle = {
    width: "250px",
    height: "250px",
    objectFit: "cover",
    borderRadius: "10px",

  }
  const handleClick = (path) => {
    navigate(path);
  };

  const cards = [
    {
      title: "Acrylic Products",
      description: "Explore our premium quality acrylic products.",
      path: "/acrylic",
      image: "https://s.omgs.in/wp-content/uploads/2023/05/OMGS-wall-acryllic-min.jpg"
    },
    {
      title: "Clear Acrylic",
      description: "Get the best transparent acrylic products.",
      path: "/clear-acrylic",
      image: "	https://omgs.in/wp-content/uploads/2022/12/transparent-framed-premium-acrylic-photo00001.jpg"
    },
    {
      title: "Fridge Magnets",
      description: "Customize fridge magnets with unique designs.",
      path: "/fridge-magnets",
      image: "https://s.omgs.in/wp-content/uploads/2023/10/3-800x800.jpg"
    },
  ];

  return (
    <div style={containerStyle}>
      <div style={cardContainerStyle}>
        {cards.map((card, index) => (
          <div
            key={index}
            style={cardStyle(hoveredIndex === index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img src={card.image} alt="" style={imageStyle} />
            <div style={titleStyle}>{card.title}</div>
            <div style={descriptionStyle}>{card.description}</div>
            <button
              style={buttonStyle(hoveredIndex === index)}
              onClick={() => handleClick(card.path)}
            >
              Shop Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
