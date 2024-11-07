import React, { useEffect, useState } from 'react'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
const PositionController = () => {
  // const ws = new WebSocket("http://localhost:8080");
  // const [yRotation, setYRotation] = useState(0)
  // const [zRotation, setZRotation] = useState(0)
  const ws = new WebSocket("wss://simple-websocket-test.onrender.com")


  const [initialValues, setInitialValues] = useState({
    yRotation: 0.0,
    zRotation: 0.0,
    scale: 1.0,
  });
  function handleY(type) {

    if (type == "increment") {

      try {
        // Check if the WebSocket connection is open
        if (ws.readyState === WebSocket.OPEN) {
          let yRotation = (initialValues.yRotation + 20) % 360
          ws.send(JSON.stringify({ yRotation: yRotation }));
        } else {
          window.location.reload();
          console.log("WebSocket is not open. Current state:", ws.readyState);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }



    }


    if (type == "decrement") {
      try {
        // Check if the WebSocket connection is open
        if (ws.readyState === WebSocket.OPEN) {
          let yRotation = (initialValues.yRotation - 20) % 360
          ws.send(JSON.stringify({ yRotation: yRotation }));
        } else {
          window.location.reload();
          console.log("WebSocket is not open. Current state:", ws.readyState);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }

    }

  }

  function handleZ(type) {

    if (type == "increment") {

      try {
        // Check if the WebSocket connection is open
        if (ws.readyState === WebSocket.OPEN) {
          let zRotation = (initialValues.zRotation + 20) % 360
          ws.send(JSON.stringify({ zRotation: zRotation }));
        } else {
          window.location.reload();
          console.log("WebSocket is not open. Current state:", ws.readyState);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }




    }


    if (type == "decrement") {
      try {
        // Check if the WebSocket connection is open
        if (ws.readyState === WebSocket.OPEN) {
          let zRotation = (initialValues.zRotation - 20) % 360
          ws.send(JSON.stringify({ zRotation: zRotation }));
        } else {
          window.location.reload();
          console.log("WebSocket is not open. Current state:", ws.readyState);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }

  }

  function reset() {

    try {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {

        ws.send(JSON.stringify({ yRotation: 0, zRotation: 0, scale: 1.0 }));
      } else {
        window.location.reload();
        console.log("WebSocket is not open. Current state:", ws.readyState);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
    window.location.reload();
  }

  function handleScale(type) {

    if (type == "increment" && initialValues.scale < 2) {

      try {
        // Check if the WebSocket connection is open
        if (ws.readyState === WebSocket.OPEN) {
          let scale = initialValues.scale + 0.2
          ws.send(JSON.stringify({ scale: scale }));
        } else {
          window.location.reload();
          console.log("WebSocket is not open. Current state:", ws.readyState);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }




    }


    if (type == "decrement" && initialValues.scale > 1) {
      try {
        // Check if the WebSocket connection is open
        if (ws.readyState === WebSocket.OPEN) {
          let scale = initialValues.scale - 0.2
          ws.send(JSON.stringify({ scale: scale }));
        } else {
          window.location.reload();
          console.log("WebSocket is not open. Current state:", ws.readyState);
        }
      } catch (error) {
        console.error("Error sending message:", error);
      }


    }

  }


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
    <div style={{ position: 'relative', height: '100vh', width: '100vw', backgroundColor: "#f0f0f0", }}>
      {/* Positioning buttons at the corners */}
      <button
        style={{
          width: '100px',
          height: '100px',
          padding: '10px',
          border: 'none',

          borderRadius: '100%',
          backgroundColor: 'white',
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        onClick={() => handleY("decrement")}

      >
        <KeyboardArrowUpIcon />
      </button>

      <button
        style={{
          width: '100px',
          height: '100px',
          padding: '10px',
          border: 'none',

          borderRadius: '100%',
          backgroundColor: 'white',
          position: 'absolute',
          top: '50%',
          right: '20px',
          transform: 'translateY(-50%)',
        }}
        onClick={() => handleZ("increment")}

      >
        <KeyboardArrowRightIcon />
      </button>

      <button
        style={{
          width: '100px',
          height: '100px',
          padding: '10px',
          border: 'none',

          borderRadius: '100%',
          backgroundColor: 'white',
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
        onClick={() => handleY("increment")}

      >
        <KeyboardArrowDownIcon />
      </button>

      <button
        style={{
          width: '100px',
          height: '100px',
          padding: '10px',
          border: 'none',

          borderRadius: '100%',
          backgroundColor: 'white',
          position: 'absolute',
          top: '50%',
          left: '20px',
          transform: 'translateY(-50%)',
        }}
        onClick={() => handleZ("decrement")}

      >
        <KeyboardArrowLeftIcon />
      </button>

      {/* Center buttons */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          gap: '10px',
        }}
      >
        <button onClick={() => { handleScale("increment") }} style={{ fontSize: "30px", padding: "20px", width: "150px", height: "150px", borderRadius: "8px" }}>+</button>
        <button onClick={() => { reset() }} style={{ fontSize: "30px", padding: "20px", width: "150px", height: "150px", borderRadius: "8px" }}>Reset</button>
        <button onClick={() => { handleScale("decrement") }} style={{ fontSize: "30px", padding: "20px", width: "150px", height: "150px", borderRadius: "8px" }}>-</button>
      </div>
    </div>
  );
}

export default PositionController
