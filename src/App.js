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
import Page1 from "./Page1";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Page2 from "./Page2";
import PoistionController from "./PositionController";
import ShaderController from "./ShaderController";
import ShaderController2 from "./ShaderController2";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/3D" element={<Page1/>} />
        <Route path="/2D" element={<Page2/>} />
        <Route path="/PositionController" element={<PoistionController/>} />
        <Route path="/ShaderController" element={<ShaderController/>} />
        <Route path="/ShaderController2" element={<ShaderController2/>} />
      </Routes>
    </Router>
  );
}

export default App;
