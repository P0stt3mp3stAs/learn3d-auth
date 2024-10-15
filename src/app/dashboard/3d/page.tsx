'use client';

import React, { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';

const BUTTON_POSITION_X = 0.6;
const BUTTON_POSITION_Y = 0.36;
const BUTTON_POSITION_Z = 0.4;
const BUTTON_ROTATION_X = 0.3;
const BUTTON_ROTATION_Y = 0;
const BUTTON_ROTATION_Z = 0;

function CursorTracker() {
  useEffect(() => {
    const trackCursor = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      console.log('Cursor position:', {
        x: x.toFixed(2),
        y: y.toFixed(2),
      });
    };

    window.addEventListener('mousemove', trackCursor);
    return () => window.removeEventListener('mousemove', trackCursor);
  }, []);

  return null;
}

function Model({ url, buttonUrl, onClick }) {
  const { scene } = useGLTF(url);
  const { scene: buttonScene } = useGLTF(buttonUrl);
  const modelRef = useRef();
  const buttonRef = useRef();

  useFrame(({ mouse }) => {
    if (modelRef.current) {
      const rotationY = mouse.x * Math.PI / 6;
      modelRef.current.rotation.y = rotationY;
      const rotationZ = mouse.y * Math.PI / -6;
      modelRef.current.rotation.x = rotationZ;
    }
  });

  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.position.set(BUTTON_POSITION_X, BUTTON_POSITION_Y, BUTTON_POSITION_Z);
      buttonRef.current.rotation.set(BUTTON_ROTATION_X, BUTTON_ROTATION_Y, BUTTON_ROTATION_Z);
    }
  }, []);

  return (
    <group ref={modelRef} position={[0, 0, -2]}>
      <primitive object={scene} />
      <primitive 
        ref={buttonRef}
        object={buttonScene} 
        onClick={onClick}
      />
    </group>
  );
}

export default function ModelViewer() {
  const [buttonClicks, setButtonClicks] = useState(0);

  const handleButtonClick = () => {
    setButtonClicks((prevClicks) => prevClicks + 1);
    console.log('Button clicked!');
  };

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Canvas>
        <color attach="background" args={['#e6f2ff']} />
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Suspense fallback={null}>
          <Model 
            url="/bar2.glb" 
            buttonUrl="/3dbutton.glb"
            onClick={handleButtonClick} 
          />
        </Suspense>
        <CursorTracker />
        <OrbitControls enableRotate={false} enableZoom={false} enablePan={false} />
      </Canvas>
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'black' }}>
        Button clicks: {buttonClicks}
      </div>
    </div>
  );
}