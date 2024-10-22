
import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

import { GUI } from "dat.gui";

const ShaderController = () => {


    const noiseParameters = {
        minStep: 0,
        maxStep: 1.0,
        frequency: 1.0,
        color1: "#ffffff",
        color2: "#000000",
        speed: 1.0,
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
            // mesh.current.material.uniforms.noiseOption.value = 0.0;

            return 0.0
        } else if (prop == "voronoi") {
            // mesh.current.material.uniforms.noiseOption.value = 1.0;

            return 1.0
        } else if (prop == "warped") {
            // mesh.current.material.uniforms.noiseOption.value = 2.0;

            return 2.0
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
        yRotation: 0.0,
        zRotation: 0.0
    };

    const [isConnected, setIsConnected] = useState(false); // Connection status


    // const ws = new WebSocket("http://localhost:8080");

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
    })
    useEffect(() => {
        // const ws = new WebSocket("wss://simple-websocket-test.onrender.com")



        const gui = new GUI({
            width: window.innerWidth,
        });

        if (ws ) {
            const folder = gui.addFolder("Noise Params");
            const typeFolder = gui.addFolder("Noise Type");
            folder.open()
            typeFolder.open()
            const minStep = folder.add(noiseParameters, "minStep", 0, 1, 0.1).setValue(initialValues.minStep);
            const maxStep = folder.add(noiseParameters, "maxStep", 0, 1, 0.1).setValue(initialValues.maxStep);
            const frequency = folder.add(noiseParameters, "frequency", 0, 5.0, 0.2).setValue(initialValues.frequency);
            const color1 = folder.addColor(noiseParameters, "color1").setValue(initialValues.color1);
            const color2 = folder.addColor(noiseParameters, "color2").setValue(initialValues.color2);
            const speed = folder.add(noiseParameters, "speed", 0, 10.0, 1.0).setValue(initialValues.speed);
            const invert = folder.add(noiseParameters, "invert", false).setValue(initialValues.invert ? true : false);
            const step = folder.add(noiseParameters, "step", false).setValue(initialValues.step ? true : false);



            var pos1 = typeFolder
                .add(noiseType, "perlin")
                .name("perlin")
                .setValue(initialValues.noiseOption == 0.0)
                .listen()
                .onChange(function () {
                    const noiseOption = setChecked("perlin");
                    ws.send(JSON.stringify({ noiseOption: noiseOption }));
                });
            var neg1 = typeFolder
                .add(noiseType, "voronoi")
                .name("voronoi")
                .setValue(initialValues.noiseOption == 1.0)
                .listen()
                .onChange(function () {
                    const noiseOption = setChecked("voronoi");
                    ws.send(JSON.stringify({ noiseOption: noiseOption }));
                });
            var neu1 = typeFolder
                .add(noiseType, "warped")
                .name("warped")
                .setValue(initialValues.noiseOption == 2.0)
                .listen()
                .onChange(function () {
                    const noiseOption = setChecked("warped");

                    ws.send(JSON.stringify({ noiseOption: noiseOption }));
                });

            minStep.onChange((value) => {


                ws.send(JSON.stringify({ minStep: value }));
            });

            maxStep.onChange((value) => {

                ws.send(JSON.stringify({ maxStep: value }));
            });

            frequency.onChange((value) => {

                ws.send(JSON.stringify({ frequency: value }));
            });
            color1.onChange((value) => {
                // mesh.current.material.uniforms.color1.value = new THREE.Color(value);

                ws.send(JSON.stringify({ color1: new THREE.Color(value) }));
            });

            color2.onChange((value) => {
                // mesh.current.material.uniforms.color2.value = new THREE.Color(value);

                ws.send(JSON.stringify({ color2: new THREE.Color(value) }));
            });

            speed.onChange((value) => {
                ws.send(JSON.stringify({ speed: value }));

            });


            invert.onChange((value) => {


                // mesh.current.material.uniforms.invert.value = value ? 1.0 : 0.0;


                ws.send(JSON.stringify({ invert: value ? 1.0 : 0.0 }));
            });

            step.onChange((value) => {

                ws.send(JSON.stringify({ step: value ? 1.0 : 0.0 }));

            });

            return () => {
                gui.destroy();
            };
        }

    }, [initialValues]);


    useEffect(() => {
        ws.onopen = () => {
            console.log("WebSocket connection established");
            setIsConnected(true);
        };

        ws.addEventListener("open", () => {
            console.log("we are connected!");


            // ws.send(JSON.stringify(jsonData));

            ws.onmessage = (event) => {
                // // const message = JSON.parse(event.data).data.height;
                console.log("a message is sent!");
                const message = JSON.parse(event.data);

                setInitialValues(message)




                console.log(message);

            };
        });
    }, []);

    const mesh = useRef()
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

        </main>
    );
}

export default ShaderController
