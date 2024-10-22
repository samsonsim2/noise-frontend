import { Canvas } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react'
import { useFrame } from "@react-three/fiber";
import { gsap } from "gsap";

const RoundButton = () => {
    const ws = new WebSocket("http://localhost:8080");
    const freqMesh = useRef(null);
    const [isIncreasing, setIsIncreasing] = useState(true); // Track if we are increasing or decreasing
  
    const rotateMesh = (amt) => {
      // Use GSAP to animate the rotation of the mesh
  
      console.log(freqMesh.current.rotation.z);
      gsap.to(freqMesh.current.rotation, {
        z: freqMesh.current.rotation.z + amt, // Rotate by 90 degrees on the z-axis
        duration: 0.2, // Duration of the animation
        ease: "power2.inOut",
      });
      
    };
  
    const changeFrequency = () => {
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
          
        } else {
          console.log("WebSocket is not open. Current state:", ws.readyState);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };
  
     
  
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
  
    
  return (
    <Canvas>
    <mesh
      ref={freqMesh}
      scale={4}
      rotation={[0, 0, (initialValues.frequency / 5) * (2 * Math.PI)]}
      onClick={() => {
        changeFrequency();
      }}
    >
      <planeGeometry />
    </mesh>
  </Canvas>
  )
}

export default RoundButton
