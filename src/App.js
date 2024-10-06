import { Canvas, useFrame } from "@react-three/fiber";
import "./App.css";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";
import Square from "./components/Square";
import {
  OrbitControls,
  OrthographicCamera,
  PerspectiveCamera,
  Plane,
} from "@react-three/drei";
import Square2 from "./components/Square2";
import { GUI } from "dat.gui";
function App() {
  const noiseParameters = {
    minStep: 0,
    maxStep: 1.0,
    frequency: 1.0,
    color1: "#ffffff",
    color2: "#000000",
    speed:1.0,
    invert: false,
    step: false,
  };

  const noiseType = {
    perlin: false,
    voronoi: false,
    warped: false,
  };

  const [option, setOption] = useState(0.0);
  function setChecked(prop) {
    for (let param in noiseType) {
      noiseType[param] = false;
    }
    noiseType[prop] = true;

    if (prop == "perlin") {
      mesh.current.material.uniforms.noiseOption.value = 0.0;
      console.log(mesh.current.material.uniforms.noiseOption.value);
    } else if (prop == "voronoi") {
      mesh.current.material.uniforms.noiseOption.value = 1.0;
      console.log(mesh.current.material.uniforms.noiseOption.value);
    } else if (prop == "warped") {
      mesh.current.material.uniforms.noiseOption.value = 2.0;
      console.log(mesh.current.material.uniforms.noiseOption.value);
    }
  }

  let jsonData = {
    time: 0.0,
    minStep: 0.1,
    maxStep: 0.6,
    frequency: 1.0,
    color1: new THREE.Color(0xffffff),
    color2: new THREE.Color(0x000000),
    speed: 1.,
    invert: 0.0,
    step: 0.0,
    noiseOption: 0.0,
  };

  const [isConnected, setIsConnected] = useState(false); // Connection status
  

  const ws = new WebSocket("http://localhost:8080");
  
    // const ws = new WebSocket("wss://simple-websocket-test.onrender.com")

  useEffect(() => {
    // const ws = new WebSocket("wss://simple-websocket-test.onrender.com")

    const gui = new GUI({
      width: 300,
    });
    const folder = gui.addFolder("Noise Params");
    const typeFolder = gui.addFolder("Noise Type");

    const minStep = folder.add(noiseParameters, "minStep", 0, 1, 0.1);
    const maxStep = folder.add(noiseParameters, "maxStep", 0, 1, 0.1);
    const frequency = folder.add(noiseParameters, "frequency", 0, 5.0, 0.2);
    const color1 = folder.addColor(noiseParameters, "color1");
    const color2 = folder.addColor(noiseParameters, "color2");
    const speed = folder.add(noiseParameters, "speed", 0, 10.0, 1.0);
    const invert = folder.add(noiseParameters, "invert", false);

    const step = folder.add(noiseParameters, "step", false);

    var pos1 = typeFolder
      .add(noiseType, "perlin")
      .name("perlin")
      .listen()
      .onChange(function () {
        setChecked("perlin");
      });
    var neg1 = typeFolder
      .add(noiseType, "voronoi")
      .name("voronoi")
      .listen()
      .onChange(function () {
        setChecked("voronoi");
      });
    var neu1 = typeFolder
      .add(noiseType, "warped")
      .name("warped")
      .listen()
      .onChange(function () {
        setChecked("warped");
      });

    minStep.onChange((value) => {
      // mesh.current.material.uniforms.minStep.value = value;
      jsonData= {...jsonData,minStep: value}
      ws.send(JSON.stringify(jsonData));
    });

    maxStep.onChange((value) => {
      // mesh.current.material.uniforms.maxStep.value = value;
      jsonData= {...jsonData,maxStep: value}
      ws.send(JSON.stringify(jsonData));
    });

    frequency.onChange((value) => {
      jsonData= {...jsonData,frequency: value}
      ws.send(JSON.stringify(jsonData));
    });
    color1.onChange((value) => {
      // mesh.current.material.uniforms.color1.value = new THREE.Color(value);
      jsonData= {...jsonData,color1:  new THREE.Color(value)}
      ws.send(JSON.stringify(jsonData));
    });

    color2.onChange((value) => {
      // mesh.current.material.uniforms.color2.value = new THREE.Color(value);
      jsonData= {...jsonData,color2:  new THREE.Color(value)}
      ws.send(JSON.stringify(jsonData));
    });

    speed.onChange((value) => {
      jsonData= {...jsonData,speed:value}
      ws.send(JSON.stringify(jsonData));
 
    });
    invert.onChange((value) => {

      
      // mesh.current.material.uniforms.invert.value = value ? 1.0 : 0.0;
    
      jsonData= {...jsonData,invert:value ? 1.0 : 0.0}
      ws.send(JSON.stringify(jsonData));
    });

    step.onChange((value) => {
      jsonData= {...jsonData,step:value ? 1.0 : 0.0}
      ws.send(JSON.stringify(jsonData));
      // mesh.current.material.uniforms.step.value = value ? 1.0 : 0.0;
    });

    return () => {
      gui.destroy();
    };
  }, []);

  //initial values
  const uniforms = useMemo(
    () => ({
      time: {
        value: 0.0,
      },
      minStep: {
        value: 0.1,
      },
      maxStep: {
        value: 0.6,
      },
      frequency: {
        value: 1.0,
      },
      color1: { value: new THREE.Color(0xffffff) },
      color2: { value: new THREE.Color(0x000000) },
      speed: {
        value: 1.0,
      },
      invert: {
        value: 0.0,
      },
      step: {
        value: 0.0,
      },
      noiseOption: {
        value: 0.0,
      },
    }),
    [jsonData]
  );

  useEffect(() => {
    ws.onopen = () => {
      console.log("WebSocket connection established");
      setIsConnected(true);
    };

    ws.addEventListener("open", () => {
      console.log("we are connected!");

      ws.send(JSON.stringify(jsonData));

      ws.onmessage = (event) => {
        // // const message = JSON.parse(event.data).data.height;
        console.log("a message is sent!");
        const message = JSON.parse(event.data);

        // Check if it's a Buffer-like object
        if (message.type === "Buffer" && Array.isArray(message.data)) {
          // Convert the 'data' array back to a Buffer
          const buffer = new Uint8Array(message.data);

          // Convert buffer to a string
          const jsonString = new TextDecoder("utf-8").decode(buffer);

          // Parse the JSON string
          const parsedData = JSON.parse(jsonString);

          if (mesh.current != null) {
            mesh.current.material.uniforms.frequency.value =
              parsedData.frequency;

            mesh.current.material.uniforms.minStep.value = parsedData.minStep;

            mesh.current.material.uniforms.maxStep.value = parsedData.maxStep;
            
            mesh.current.material.uniforms.color1.value = new THREE.Color(parsedData.color1);
            mesh.current.material.uniforms.color2.value = new THREE.Color(parsedData.color2);
            mesh.current.material.uniforms.speed.value = parsedData.speed;
            mesh.current.material.uniforms.invert.value = parsedData.invert;
            mesh.current.material.uniforms.step.value = parsedData.step;
          }

          console.log(parsedData);
        }
      };
    });
  }, []);
  const mesh = useRef();

  return (
    <main
      style={{
        height: "100vh", // h-screen
        width: "100vw", // w-screen
        position: "relative", // relative
        overflowX: "hidden", // overflow-x-hidden
        backgroundColor: "#f5f5f4", // bg-stone-100
        display: "flex",
      }}
    >
      <Canvas
        style={{
          width: "50vw",
          background: "#faf9f8",
        }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
      >
        <directionalLight position={[0, 3, 2]} />
        <ambientLight intensity={2} />

        <Square2 mesh={mesh} uniforms={uniforms} />
      </Canvas>
      <Canvas
        style={{ width: "50vw", height: "100vh", background: "#faf9f8" }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
      >
        <directionalLight position={[0, 3, 2]} />
        <ambientLight intensity={2} />

        <Square mesh={mesh} uniforms={uniforms} />
      </Canvas>
    </main>
  );
}

export default App;
