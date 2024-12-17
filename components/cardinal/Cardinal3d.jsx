import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box } from "@react-three/drei";

const SpinningBox = () => {
  const meshRef = React.useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return <Box ref={meshRef} position={[0, 0, 0]} args={[1, 1, 1]} />;
};

const Cardinal3d = () => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={<div>Loading 3D...</div>}>
        <SpinningBox />
      </Suspense>
    </Canvas>
  );
};

export default Cardinal3d;
