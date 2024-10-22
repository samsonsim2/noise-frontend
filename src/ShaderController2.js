import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import RoundButton from "./components/RoundButton";

const ShaderController2 = () => {
  const [color, setColor] = useState("#ff0000");
  const [isIncreasing, setIsIncreasing] = useState(true); // Track if we are increasing or decreasing
//   const ws = new WebSocket("http://localhost:8080");
  const ws = new WebSocket("wss://simple-websocket-test.onrender.com")
  const [initialValues, setInitialValues] = useState({
    time: 0.0,
    minStep: 0.1,
    maxStep: 0.6,
    frequency: 1.0,
    color1: 143613,
    color2: 14350592,
    speed: 1,
    invert: 0.0,
    step: 0.0,
    noiseOption: 0.0,
    yRotation: 0.0,
    zRotation: 0.0,
  });
  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    ws.addEventListener("open", () => {
      console.log("we are connected!");

      ws.onmessage = (event) => {
        console.log("a message is sent!");
        const message = JSON.parse(event.data);
        setInitialValues(message);
        console.log(message);
      };
    });
  }, []);
  const changeFrequency = () => {
    console.log("changefreq")
    const newFrequency = isIncreasing
      ? initialValues.frequency + 1
      : initialValues.frequency - 1;

    if (newFrequency >= 5) {
      setIsIncreasing(false); // Start subtracting
    } else if (newFrequency <= 0) {
      setIsIncreasing(true); // Start adding
    }



    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({frequency: newFrequency}));
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", // 4 equal columns
        height: "100vh",
        boxSizing: "border-box",

        gap: "10px", // Space between grid items
        padding: "20px",
      }}
    >
      {/* First Row - 4 squares with circular buttons */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        {/* <RoundButton/> */}
       
        <button
          onClick={() => {
            changeFrequency();
          }}
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
        {initialValues.frequency}
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <button
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          2
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <button
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          3
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <button
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          4
        </button>
      </div>

      {/* Second Row - 4 squares with circular buttons */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <button
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          5
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <button
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          6
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <button
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          7
        </button>
      </div>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <button
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          8
        </button>
      </div>

      {/* Third Row - First column spans 3 columns */}
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
          gridColumn: "span 3",
        }}
      >
        Spans 3 Columns
      </div>
      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        Second Column
      </div>
    </div>
  );

  //   return (
  //     <div style={{ position: "relative", display: "inline-block" }}>
  //       {/* Hidden native input */}
  //       <input
  //         type="color"
  //         value={color}
  //         onChange={handleColorChange}
  //         style={{
  //           opacity: 0, // Hide the default input element
  //           position: "absolute",
  //           width: "50px", // Ensure the input is the same size as the custom circle
  //           height: "50px",
  //           cursor: "pointer", // Ensure it's clickable
  //         }}
  //       />
  //       {/* Custom color display */}
  //       <div
  //         style={{
  //           width: "50px",
  //           height: "50px",
  //           borderRadius: "50%", // Make it circular
  //           backgroundColor: color, // Fill with selected color
  //           border: "2px solid transparent", // Optional: transparent border for smoothness
  //           boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", // Optional: add a subtle shadow
  //           cursor: "pointer", // Pointer cursor for better UX
  //         }}
  //       />

  //     </div>
  //   );
};

export default ShaderController2;
