'use client';

import React, { useRef, useState, useMemo } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

function Button3D({ position, onClick }) {
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.5, -0.5);
    shape.lineTo(0.5, -0.5);
    shape.lineTo(0.4, 0.5);
    shape.lineTo(-0.4, 0.5);
    shape.lineTo(-0.5, -0.5);

    const extrudeSettings = {
      steps: 1,
      depth: 0.2,
      bevelEnabled: false,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, []);

  return (
    <group position={position}>
      <mesh
        ref={mesh}
        geometry={geometry}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial color={hovered ? 'blue' : 'red'} />
      </mesh>
      <Text
        position={[0, 0, 0.21]}
        fontSize={0.1}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Click me!
      </Text>
    </group>
  );
}

export default Button3D;