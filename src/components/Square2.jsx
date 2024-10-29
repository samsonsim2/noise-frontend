
import React, { useMemo, useRef, useEffect, useState } from 'react'
import { OrbitControls, OrthographicCamera, useGLTF, View } from '@react-three/drei'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from "three";
import { GUI } from 'dat.gui'
 
const fragmentShader = `

varying vec2 vUvs;
uniform float time;
uniform float minStep;
uniform float maxStep;
uniform float frequency;
uniform vec3 color1;
uniform vec3 color2;
uniform float speed;
uniform float invert;
uniform float voronoi;
uniform float step;
uniform float noiseOption;

vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}
vec2 hexOffset(vec2 p) {
    float q = sqrt(3.0) / 2.0;
    vec2 hex = vec2(1.0, q);

    // Convert Cartesian coordinates to a hexagonal grid
    vec2 uv = vec2(p.x / hex.x, (p.y - mod(floor(p.x), 2.0) * 0.5) / hex.y);
    return floor(uv);
}

vec2 hash2(vec2 p) {
    return fract(sin(p * vec2(127.1, 311.7)) * 43758.5453);
}


float noise( in vec3 p )
{
    vec3 i = floor( p );
    vec3 f = fract( p );

    
    // cubic interpolant
    vec3 u = f*f*(3.0-2.0*f);
     

    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}
 
 float cellular2(vec3 coords) {
      // Calculate the centered grid base position
    vec2 gridBasePosition = floor(coords.xy); // Use floor directly
    vec2 gridCoordOffset = fract(coords.xy);   // Keep the original fractional part

    float closest = 1.0;

    // The offsets now include the necessary shift to center correctly
    vec2 offsets[5] = vec2[](
        vec2(-1.0, -1.0), vec2(0.0, -1.0), vec2(1.0, -1.0),
        vec2(-1.0, 0.0), vec2(0.0, 0.0)
    );

    for (int i = 0; i < 5; i++) {
        vec2 neighbourCellPosition = offsets[i];
        vec2 cellWorldPosition = gridBasePosition + neighbourCellPosition;

        // Center the noise offsets based on the grid position
        vec2 cellOffset = vec2(
            noise(vec3(cellWorldPosition, coords.z) + vec3(243.32, 324.235, 0.0)),
            noise(vec3(cellWorldPosition, coords.z))
        );

        // Calculate the position difference considering the offset
        vec2 diff = (neighbourCellPosition + cellOffset) - (gridCoordOffset - vec2(0.5)); // Adjusted for centering
        float distSquared = dot(diff, diff);  // Use squared distance
        if (distSquared < closest) {
            closest = distSquared;
        }
    }
    return sqrt(closest);  // Return the actual distance if needed
}
float fbm(vec3 p, int octaves, float persistence, float lacunarity){
    float amplitude = 0.01;
    float frequency = frequency;
    float total = 0.0;
    float normalization = 0.0;

    for (int i=0; i< octaves; i++){
        float noiseValue = noise(p* frequency);
        total += noiseValue * amplitude;
        normalization += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    total /= normalization;

    return total;
}

float ridgedFBM(vec3 p, int octaves, float persistence, float lacunarity){
    
   float amplitude = 0.01;
    float frequency = frequency;
    float total = 0.0;
    float normalization = 0.0;

    for (int i=0; i< octaves; i++){
        float noiseValue = noise(p* frequency);
        noiseValue = abs(noiseValue);
        noiseValue = 1.0 - noiseValue;
        total += noiseValue * amplitude;
        normalization += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    total /= normalization;
    total *= total;

    return total;
}

//voronoi
float cellular(vec3 coords){
vec2 gridBasePosition = floor(coords.xy);
vec2 gridCoordOffset = fract(coords.xy);

float closest = 1.0;
for(float y= -2.0;y<=2.0; y+=1.0){
    for(float x=-2.0; x<=2.0; x+=1.0){
    vec2 neighbourCellPosition = vec2(x,y);
    vec2 cellWorldPosition = gridBasePosition + neighbourCellPosition;
    vec2 cellOffset = vec2(
        noise(vec3(cellWorldPosition, coords.z) + vec3(243.32,324.235,0.0)),
        noise(vec3(cellWorldPosition, coords.z))
    );

    float distToNeighbour = length(
    neighbourCellPosition + cellOffset - gridCoordOffset);
    closest=min(closest,distToNeighbour);
    }
}
    return closest;

}

 
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float stepped(float noiseSample){
    float steppedSample = floor(noiseSample * 5.0)/5.0;
    float remainder = fract(noiseSample * 5.0);
    steppedSample = (steppedSample - remainder) * 0.5 + 0.5;
    return steppedSample;
}

float domainWarpingFBM(vec3 coords){
vec3 offset =  vec3(
fbm(coords,4,0.5,2.0),
fbm(coords + vec3(43.235,23.112,0.0),4,0.5,2.0), 0.0
);

float noiseSample = fbm(coords + offset , 1,0.5,2.0);

vec3 offset2 = vec3(
fbm(coords +4.0 * offset +vec3(5.325,1.421,3.235),4,0.5,2.0),
fbm(coords +4.0 * offset +vec3(4.32,0.532,6.324),4,0.5,2.0),0.0);

noiseSample = fbm(coords + 4.0 * offset2 , 1, 0.5, 2.0);

return noiseSample;
}



void main(void) {
  
 
    vec3 coords = vec3(vUvs * 10.0, time * speed); 
    float noiseSample = 0.0;
 

    if(noiseOption == 0.0){
      if(invert == 1.0){
    noiseSample = map(ridgedFBM(coords, 16, 0.5, 1.0),-1.0, 1.0, 0.0, 1.0 );    
    }
    else if(invert == 0.0){
    noiseSample = map(fbm(coords, 16, 0.5, 1.0),-1.0, 1.0, 0.0, 1.0 );    
    }

    }
    else if(noiseOption == 1.0){
       if(invert == 1.0){
     noiseSample =  1.0- cellular2(coords * frequency );
    }
    else if(invert == 0.0){
     noiseSample =  cellular2(coords * frequency );
    }
    }
     else if(noiseOption == 2.0){

         if(invert == 1.0){
   noiseSample = 1.0 - map(domainWarpingFBM(coords * frequency),-1.0, 1.0, 0.0, 1.0);
    }
    else if(invert == 0.0){
    noiseSample = map(domainWarpingFBM(coords * frequency),-1.0, 1.0, 0.0, 1.0);
    }
     
    
    }

 

    
    if (step == 1.0){
     noiseSample= stepped(noiseSample);
     noiseSample= smoothstep(minStep,maxStep,noiseSample);
    }else if (step == 0.0){
    noiseSample= smoothstep(minStep,maxStep,noiseSample);
    }


 


    vec3 color = mix(color1,color2,vec3(noiseSample));
 
    gl_FragColor = vec4(color,1.0);
} 
`

 

const vertexShader2 = `

varying vec2 vUvs; 
uniform float time;
uniform float speed;
 
uniform float frequency;
 
uniform float invert;
 uniform float minStep;
uniform float maxStep;
uniform float step;
uniform float noiseOption;

vec2 hexOffset(vec2 p) {
    float q = sqrt(3.0) / 2.0;
    vec2 hex = vec2(1.0, q);

    // Convert Cartesian coordinates to a hexagonal grid
    vec2 uv = vec2(p.x / hex.x, (p.y - mod(floor(p.x), 2.0) * 0.5) / hex.y);
    return floor(uv);
}

vec2 hash2(vec2 p) {
    return fract(sin(p * vec2(127.1, 311.7)) * 43758.5453);
}


 
 
vec3 hash( vec3 p ) // replace this by something better
{
	p = vec3( dot(p,vec3(127.1,311.7, 74.7)),
			  dot(p,vec3(269.5,183.3,246.1)),
			  dot(p,vec3(113.5,271.9,124.6)));

	return -1.0 + 2.0*fract(sin(p)*43758.5453123);
}

float noise( in vec3 p )
{
    vec3 i = floor( p );
    vec3 f = fract( p );

    
    // cubic interpolant
    vec3 u = f*f*(3.0-2.0*f);
     

    return mix( mix( mix( dot( hash( i + vec3(0.0,0.0,0.0) ), f - vec3(0.0,0.0,0.0) ), 
                          dot( hash( i + vec3(1.0,0.0,0.0) ), f - vec3(1.0,0.0,0.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,0.0) ), f - vec3(0.0,1.0,0.0) ), 
                          dot( hash( i + vec3(1.0,1.0,0.0) ), f - vec3(1.0,1.0,0.0) ), u.x), u.y),
                mix( mix( dot( hash( i + vec3(0.0,0.0,1.0) ), f - vec3(0.0,0.0,1.0) ), 
                          dot( hash( i + vec3(1.0,0.0,1.0) ), f - vec3(1.0,0.0,1.0) ), u.x),
                     mix( dot( hash( i + vec3(0.0,1.0,1.0) ), f - vec3(0.0,1.0,1.0) ), 
                          dot( hash( i + vec3(1.0,1.0,1.0) ), f - vec3(1.0,1.0,1.0) ), u.x), u.y), u.z );
}
 
 float cellular2(vec3 coords) {
     // Calculate the centered grid base position
    vec2 gridBasePosition = floor(coords.xy); // Use floor directly
    vec2 gridCoordOffset = fract(coords.xy);   // Keep the original fractional part

    float closest = 1.0;

    // The offsets now include the necessary shift to center correctly
    vec2 offsets[5] = vec2[](
        vec2(-1.0, -1.0), vec2(0.0, -1.0), vec2(1.0, -1.0),
        vec2(-1.0, 0.0), vec2(0.0, 0.0)
    );

    for (int i = 0; i < 5; i++) {
        vec2 neighbourCellPosition = offsets[i];
        vec2 cellWorldPosition = gridBasePosition + neighbourCellPosition;

        // Center the noise offsets based on the grid position
        vec2 cellOffset = vec2(
            noise(vec3(cellWorldPosition, coords.z) + vec3(243.32, 324.235, 0.0)),
            noise(vec3(cellWorldPosition, coords.z))
        );

        // Calculate the position difference considering the offset
        vec2 diff = (neighbourCellPosition + cellOffset) - (gridCoordOffset - vec2(0.5)); // Adjusted for centering
        float distSquared = dot(diff, diff);  // Use squared distance
        if (distSquared < closest) {
            closest = distSquared;
        }
    }
    return sqrt(closest);  // Return the actual distance if needed
}
 
float fbm(vec3 p, int octaves, float persistence, float lacunarity){
    float amplitude = 0.01;
    float frequency = frequency;
    float total = 0.0;
    float normalization = 0.0;

    for (int i=0; i< octaves; i++){
        float noiseValue = noise(p* frequency);
        total += noiseValue * amplitude;
        normalization += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    total /= normalization;

    return total;
}

float ridgedFBM(vec3 p, int octaves, float persistence, float lacunarity){
    
   float amplitude = 0.01;
    float frequency = frequency;
    float total = 0.0;
    float normalization = 0.0;

    for (int i=0; i< octaves; i++){
        float noiseValue = noise(p* frequency);
        noiseValue = abs(noiseValue);
        noiseValue = 1.0 - noiseValue;
        total += noiseValue * amplitude;
        normalization += amplitude;
        amplitude *= persistence;
        frequency *= lacunarity;
    }

    total /= normalization;
    total *= total;

    return total;
}

//voronoi


float cellular(vec3 coords){
vec2 gridBasePosition = floor(coords.xy);
vec2 gridCoordOffset = fract(coords.xy);

float closest = 1.0;
for(float y= -2.0;y<=2.0; y+=1.0){
    for(float x=-2.0; x<=2.0; x+=1.0){
    vec2 neighbourCellPosition = vec2(x,y);
    vec2 cellWorldPosition = gridBasePosition + neighbourCellPosition;
    vec2 cellOffset = vec2(
        noise(vec3(cellWorldPosition, coords.z) + vec3(243.32,324.235,0.0)),
        noise(vec3(cellWorldPosition, coords.z))
    );

    float distToNeighbour = length(
    neighbourCellPosition + cellOffset - gridCoordOffset);
    closest=min(closest,distToNeighbour);
    }
}
    return closest;

}

 
float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float stepped(float noiseSample){
    float steppedSample = floor(noiseSample * 5.0)/5.0;
    float remainder = fract(noiseSample * 5.0);
    steppedSample = (steppedSample - remainder) * 0.5 + 0.5;
    return steppedSample;
}
//originally it was 10.0 instead of 5.0

float domainWarpingFBM(vec3 coords){
vec3 offset =  vec3(
fbm(coords,4,0.5,2.0),
fbm(coords + vec3(43.235,23.112,0.0),4,0.5,2.0), 0.0
);

float noiseSample = fbm(coords + offset , 1,0.5,2.0);

vec3 offset2 = vec3(
fbm(coords +4.0 * offset +vec3(5.325,1.421,3.235),4,0.5,2.0),
fbm(coords +4.0 * offset +vec3(4.32,0.532,6.324),4,0.5,2.0),0.0);

noiseSample = fbm(coords + 4.0 * offset2 , 1, 0.5, 2.0);

return noiseSample;
}


void main() {   
float noiseSample = 0.0;
    vUvs = uv; // Pass UV to fragment shader
      vec3 coords = vec3(vUvs * 10.0, time * speed); 
    vec3 newPosition = position;

    
    if(noiseOption == 0.0){
      if(invert == 1.0){
    noiseSample = map(ridgedFBM(coords, 16, 0.5, 1.0),-1.0, 1.0, 0.0, 1.0 );    
    }
    else if(invert == 0.0){
    noiseSample = map(fbm(coords, 16, 0.5, 1.0),-1.0, 1.0, 0.0, 1.0 );    
    }

    }
    else if(noiseOption == 1.0){
       if(invert == 1.0){
     noiseSample =  1.0- cellular2(coords * frequency );
    }
    else if(invert == 0.0){
     noiseSample =  cellular2(coords * frequency );
    }
    }
     else if(noiseOption == 2.0){

         if(invert == 1.0){
   noiseSample = 1.0 - map(domainWarpingFBM(coords * frequency),-1.0, 1.0, 0.0, 1.0);
    }
    else if(invert == 0.0){
    noiseSample = map(domainWarpingFBM(coords * frequency),-1.0, 1.0, 0.0, 1.0);
    }
     
    
    }

      if (step == 1.0){
     noiseSample= stepped(noiseSample);
     noiseSample= smoothstep(minStep,maxStep,noiseSample);
    }else if (step == 0.0){
    noiseSample= smoothstep(minStep,maxStep,noiseSample);
    }

 
    newPosition += normal * noiseSample * 0.5;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`
export default function Square({ props,yRotation,zRotation}) {
    const mesh = useRef();
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
        yRotation:0.0,
        zRotation:0.0
      };
    
      const [isConnected, setIsConnected] = useState(false); // Connection status
      
    
      // const ws = new WebSocket("http://localhost:8080");
      
        const ws = new WebSocket("wss://simple-websocket-test.onrender.com")
    
      useEffect(() => {
        // const ws = new WebSocket("wss://simple-websocket-test.onrender.com")
    
        const gui = new GUI({
          width: 300,
        });
        gui.hide()
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
            const noiseOption = setChecked("perlin");
            ws.send(JSON.stringify({noiseOption:noiseOption}));
          });
        var neg1 = typeFolder
          .add(noiseType, "voronoi")
          .name("voronoi")
          .listen()
          .onChange(function () {
            const noiseOption = setChecked("voronoi");
            ws.send(JSON.stringify({noiseOption:noiseOption}));
          });
        var neu1 = typeFolder
          .add(noiseType, "warped")
          .name("warped")
          .listen()
          .onChange(function () {
            const noiseOption = setChecked("warped");
          
            ws.send(JSON.stringify({noiseOption:noiseOption}));
          });
    
        minStep.onChange((value) => {
                 
          ws.send(JSON.stringify({minStep:value }));
        });
    
        maxStep.onChange((value) => {
                 
          ws.send(JSON.stringify({maxStep:value}));
        });
    
        frequency.onChange((value) => {
           
          ws.send(JSON.stringify({frequency:value}));
        });
        color1.onChange((value) => {
          // mesh.current.material.uniforms.color1.value = new THREE.Color(value);
 
          ws.send(JSON.stringify({color1:  new THREE.Color(value)}));
        });
    
        color2.onChange((value) => {
          // mesh.current.material.uniforms.color2.value = new THREE.Color(value);
        
          ws.send(JSON.stringify({color2:  new THREE.Color(value)}));
        });
    
        speed.onChange((value) => {
          ws.send(JSON.stringify({speed:value}));
     
        });

 
        invert.onChange((value) => {
    
          
          // mesh.current.material.uniforms.invert.value = value ? 1.0 : 0.0;
        
         
          ws.send(JSON.stringify({speed:value ? 1.0 : 0.0}));
        });
    
        step.onChange((value) => {
      
          ws.send(JSON.stringify({step:value ? 1.0 : 0.0}));
 
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
        []
      );
    
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
    
           
              if (mesh.current != null) {
                mesh.current.material.uniforms.frequency.value =
                 message.frequency;
    
                mesh.current.material.uniforms.minStep.value = message.minStep;
    
                mesh.current.material.uniforms.maxStep.value =message.maxStep;
                
                mesh.current.material.uniforms.color1.value = new THREE.Color(message.color1);
                mesh.current.material.uniforms.color2.value = new THREE.Color(message.color2);
                mesh.current.material.uniforms.speed.value =message.speed;
                mesh.current.material.uniforms.invert.value =message.invert;
                mesh.current.material.uniforms.step.value = message.step;
                mesh.current.material.uniforms.noiseOption.value = message.noiseOption;
           
              }

            mesh.current.rotation.y = (message.yRotation * Math.PI) / 180
            mesh.current.scale.set(message.scale,message.scale,message.scale)
            

 
            mesh.current.rotation.z = (message.zRotation * Math.PI)/180
    
              console.log(message);
            
          };
        });
      }, []);

    
    const { viewport, camera, size } = useThree(); // Access the viewport and camera details
    const [planeSize, setPlaneSize] = useState([1, 1]); // State to store plane size
    const updatePlaneSize = () => {
        const aspect = size.width / size.height;
        setPlaneSize([viewport.width, viewport.height * aspect]);
    };

    useEffect(() => {
        window.addEventListener('resize', updatePlaneSize);
        updatePlaneSize(); // Initial update
        return () => window.removeEventListener('resize', updatePlaneSize); // Cleanup
    }, [size]);


    useFrame((state) => {
        const { clock } = state;
        mesh.current.material.uniforms.time.value = clock.getElapsedTime() * 0.3;


    });



    return (<>



        <OrthographicCamera
            name="Camera"
            makeDefault={true}
            enable
            zoom={50}
            far={100000}
            near={-100000}
            up={[0, 1, 0]}
            position={[10, 8, 7]}
            rotation={[-0.78, 1.1, 0.72]}
            scale={1}
        />
        <OrbitControls />
 
        <mesh ref={mesh} rotation={[-Math.PI / 2,0,0]} scale={1.0}>
            <planeGeometry args={[10, 10, 1000, 1000]} />
            <shaderMaterial fragmentShader={fragmentShader} vertexShader={vertexShader2} uniforms={uniforms} transparent={true} emissiveIntensity={10.0} side={THREE.DoubleSide} depthTest={false} depthWrite={false} />
        </mesh>


        
    </>

    )
}