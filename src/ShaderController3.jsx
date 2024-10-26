import { Canvas } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";
import RoundButton from "./components/RoundButton";

import * as THREE from "three";
const ShaderController2 = () => {
  const [isIncreasing, setIsIncreasing] = useState(true); // Track if we are increasing or decreasing
  const [isSpeedIncreasing, setIsSpeedIncreasing] = useState(true); // Track if we are increasing or decreasing
  const [step, setStep] = useState(0); // Starting from step 0

  const handleNoiseOption = (num) => {
    console.log(num);
    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ noiseOption: num }));
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleStepToggle = () => {
    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ step: !initialValues.step }));
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleInvertToggle = () => {
    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ invert: !initialValues.invert }));
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  //   const ws = new WebSocket("http://localhost:8080");
  const ws = new WebSocket("wss://simple-websocket-test.onrender.com");
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
    console.log("changefreq");
    const newFrequency = isIncreasing
      ? initialValues.frequency + 1
      : initialValues.frequency - 1;

    if (newFrequency > 5) {
      setIsIncreasing(false); // Start subtracting
    } else if (newFrequency < 2) {
      setIsIncreasing(true); // Start adding
    }

    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ frequency: newFrequency }));
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const changeSpeed = () => {
    console.log("changefreq");
    const newSpeed = isSpeedIncreasing
      ? initialValues.speed + 4
      : initialValues.speed - 4;

    if (newSpeed > 16) {
      setIsSpeedIncreasing(false); // Start subtracting
    } else if (newSpeed < 2) {
      setIsSpeedIncreasing(true); // Start adding
    }
    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ speed: newSpeed }));
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleColorChange1 = (event) => {
    console.log(event.target.value);
    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ color1: new THREE.Color(event.target.value) })
        );
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleColorChange2 = (event) => {
    console.log(event.target.value);
    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({ color2: new THREE.Color(event.target.value) })
        );
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const reset = () => {
    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            minStep: 0.1,
            maxStep: 0.6,
            frequency: 1.0,
            color1: 143613,
            color2: 14350592,
            speed: 1,
            invert: 0.0,
            step: 0.0,
            noiseOption: 0.0,
          })
        );
      } else {
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  const [value, setValue] = useState(50);

  const handleChange = (e) => {
    setValue(e.target.value);
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
            width: "100px",
            height: "100px",
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
          onClick={() => {
            changeSpeed();
          }}
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            border: "none",
            backgroundColor: "#007BFF",
            color: "white",
            cursor: "pointer",
          }}
        >
          {initialValues.speed}
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
        <input
          type="color"
          value={initialValues.color1}
          onChange={handleColorChange1}
          style={{
            opacity: 0, // Hide the default input element
            position: "absolute",
            width: "100px", // Ensure the input is the same size as the custom circle
            height: "100px",
            cursor: "pointer", // Ensure it's clickable
          }}
        />
        {/* Custom color display */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%", // Make it circular
            backgroundColor: `rgb(${(initialValues.color1 >> 16) & 0xff}, ${
              (initialValues.color1 >> 8) & 0xff
            }, ${initialValues.color1 & 0xff})`, // Fill with selected color
            border: "2px solid transparent", // Optional: transparent border for smoothness
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", // Optional: add a subtle shadow
            cursor: "pointer", // Pointer cursor for better UX
          }}
        />
      </div>

      <div
        style={{
          backgroundColor: "#f0f0f0",
          padding: "10px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
        }}
      >
        <div
          onClick={handleStepToggle}
          style={{
            width: "150px",
            height: "50px",
            borderRadius: "50px", // Capsule shape
            backgroundColor: initialValues.step ? "#4CAF50" : "#ccc",
            display: "flex",
            alignItems: "center",
            padding: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              transition: "transform 0.3s ease",
              transform: initialValues.step
                ? "translateX(100px)"
                : "translateX(0)",
            }}
          />
        </div>
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
            width: "100px",
            height: "100px",
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
    <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={handleChange}
        style={{
          writingMode: "bt-lr", // Rotate to make it vertical
          WebkitAppearance: "slider-vertical", // Style for webkit browsers
          width: "8px",
          height: "300px",
          backgroundColor: "#ddd",
          outline: "none",
        }}
      />
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
        <input
          type="color"
          value={initialValues.color2}
          onChange={handleColorChange2}
          style={{
            opacity: 0, // Hide the default input element
            position: "absolute",
            width: "100px", // Ensure the input is the same size as the custom circle
            height: "100px",
            cursor: "pointer", // Ensure it's clickable
          }}
        />
        {/* Custom color display */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%", // Make it circular
            backgroundColor: `rgb(${(initialValues.color2 >> 16) & 0xff}, ${
              (initialValues.color2 >> 8) & 0xff
            }, ${initialValues.color2 & 0xff})`, // Fill with selected color
            border: "2px solid transparent", // Optional: transparent border for smoothness
            boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)", // Optional: add a subtle shadow
            cursor: "pointer", // Pointer cursor for better UX
          }}
        />
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
        <div
          onClick={handleInvertToggle}
          style={{
            width: "150px",
            height: "50px",
            borderRadius: "50px", // Capsule shape
            backgroundColor: initialValues.invert ? "#4CAF50" : "#ccc",
            display: "flex",
            alignItems: "center",
            padding: "5px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          <div
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: "#fff",
              transition: "transform 0.3s ease",
              transform: initialValues.invert
                ? "translateX(100px)"
                : "translateX(0)",
            }}
          />
        </div>
      </div>

      {/* Third Row - First column spans 3 columns */}
      <div
        style={{
          position: "relative",
          backgroundColor: "#f0f0f0",
          padding: "20px 50px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          borderRadius: "8px",
          gridColumn: "span 3",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: "80%",
            margin: "auto",
            height: "4px",
            backgroundColor: "#ccc",
            zIndex: 0, // Place it behind the stepper circles
          }}
        />
        <div
          style={{
            position: "absolute",
            width: "80%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {[0, 1, 2].map((num) => (
            <div
              key={num}
              onClick={() => handleNoiseOption(num)}
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "50%",
                backgroundColor:
                  num === initialValues.noiseOption ? "#4CAF50" : "#ccc",
                color: "#fff",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
            >
              {num}
            </div>
          ))}
        </div>
        {/* <p>Current Step: {step}</p> */}
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
          fontSize: "large",
          cursor: "pointer",
        }}
        onClick={reset}
      >
        Reset
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