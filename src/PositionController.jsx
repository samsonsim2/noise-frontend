import React from 'react'

const PositionController = () => {
  // const ws = new WebSocket("http://localhost:8080");
  // const [yRotation, setYRotation] = useState(0)
  // const [zRotation, setZRotation] = useState(0)
  const ws = new WebSocket("wss://simple-websocket-test.onrender.com")
  let yRotation = 0 
  let zRotation = 0 
  function handleY(type) {

    if(type=="increment"){
      yRotation = (yRotation + 20) %360
      ws.send(JSON.stringify({yRotation: yRotation}));
  
      
    }

    
    if(type=="decrement"){
      yRotation = (yRotation -20) %360
      ws.send(JSON.stringify({yRotation: yRotation}));
    }
 
  }

  function handleZ(type) {

    if(type=="increment"){
      zRotation = (zRotation + 20) %360
      ws.send(JSON.stringify({zRotation: zRotation}));
  
      
    }

    
    if(type=="decrement"){
      zRotation = (zRotation -20) %360
      ws.send(JSON.stringify({zRotation: zRotation}));
    }
 
  }


 

  return (
    <div

      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <button    onClick={()=>handleY("decrement")}
       
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        Top
      </button>

      <button
 onClick={()=>handleY("increment")}
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        Bottom
      </button>

      <button
       onClick={()=>handleZ("decrement")}

        style={{
          position: 'absolute',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        Left
      </button>

      <button
           onClick={()=>handleZ("increment")}
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      >
        Right
      </button>
    </div>
  )
}

export default PositionController
