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

function Page1() {
const [yRotation,setYRotation] = useState(0)
const [zRotation,setZRotation] = useState(0)
function handleY(){
  setYRotation((prevRotation) => (prevRotation + 20) % 360);
}

function handleZ(){
  setZRotation((prevRotation) => (prevRotation + 20) % 360);
}

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
            {/* <button onClick={()=>{handleY()}}>h</button>
            
            <button onClick={()=>{handleZ()}}>G</button> */}
      <Canvas
        style={{
          width: "100vw",
          background: "#faf9f8",
        }}
        gl={{ antialias: true, toneMapping: THREE.NoToneMapping }}
      >
        <directionalLight position={[0, 3, 2]} />
        <ambientLight intensity={2} />
        <Square2 yRotation={yRotation} zRotation={zRotation}/>
      </Canvas>
    </main>
  );
}

export default Page1;