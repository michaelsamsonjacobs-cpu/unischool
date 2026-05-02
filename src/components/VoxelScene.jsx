import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─── Voxel Block ─────────────────────────────────────────
function Voxel({ position, color = '#8B6914', scale = 1, emissive = false }) {
    const ref = useRef();
    return (
        <mesh ref={ref} position={position} castShadow receiveShadow>
            <boxGeometry args={[scale, scale, scale]} />
            <meshStandardMaterial
                color={color}
                roughness={0.7}
                metalness={0.1}
                emissive={emissive ? color : '#000000'}
                emissiveIntensity={emissive ? 0.3 : 0}
            />
        </mesh>
    );
}

// ─── Ground Plane ────────────────────────────────────────
function SandGround() {
    const positions = useMemo(() => {
        const arr = [];
        for (let x = -12; x <= 12; x++) {
            for (let z = -8; z <= 8; z++) {
                const y = Math.sin(x * 0.3) * Math.cos(z * 0.4) * 0.3 - 0.5;
                const shade = `hsl(40, ${50 + Math.random() * 20}%, ${65 + Math.random() * 15}%)`;
                arr.push({ pos: [x, y, z], color: shade });
            }
        }
        return arr;
    }, []);

    return (
        <group>
            {positions.map((v, i) => (
                <Voxel key={i} position={v.pos} color={v.color} scale={1} />
            ))}
        </group>
    );
}

// ─── Workshop Structure ──────────────────────────────────
function Workshop() {
    const blocks = useMemo(() => {
        const arr = [];
        const wood = '#6B4226';
        const darkWood = '#4A2E1A';
        const fabric = '#C9A96E';

        // Floor
        for (let x = -4; x <= 4; x++) {
            for (let z = -3; z <= 3; z++) {
                arr.push({ pos: [x, 0, z], color: darkWood });
            }
        }
        // Walls (back & sides)
        for (let x = -4; x <= 4; x++) {
            for (let y = 1; y <= 4; y++) {
                arr.push({ pos: [x, y, -3], color: wood });
            }
        }
        for (let z = -3; z <= 3; z++) {
            for (let y = 1; y <= 4; y++) {
                arr.push({ pos: [-4, y, z], color: wood });
                if (z < 0 || z > 2) arr.push({ pos: [4, y, z], color: wood });
            }
        }
        // Roof
        for (let x = -5; x <= 5; x++) {
            for (let z = -4; z <= 4; z++) {
                const roofY = 5 - Math.abs(x) * 0.3;
                arr.push({ pos: [x, Math.round(roofY), z], color: darkWood });
            }
        }
        // Workbench
        for (let x = -3; x <= -1; x++) {
            arr.push({ pos: [x, 1, -2], color: fabric });
        }
        return arr;
    }, []);

    return (
        <group position={[0, 0, 0]}>
            {blocks.map((b, i) => (
                <Voxel key={i} position={b.pos} color={b.color} />
            ))}
        </group>
    );
}

// ─── Wright Flyer (simplified voxel model) ───────────────
function WrightFlyer({ highlight = false }) {
    const ref = useRef();
    useFrame((state) => {
        if (ref.current && highlight) {
            ref.current.position.y = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    const blocks = useMemo(() => {
        const arr = [];
        const frame = '#D4A574';
        const fabric2 = '#F5E6CC';
        const metal = '#8899AA';

        // Fuselage
        for (let x = -3; x <= 3; x++) {
            arr.push({ pos: [x, 0, 0], color: frame });
        }
        // Upper wing
        for (let x = -4; x <= 4; x++) {
            arr.push({ pos: [x, 1, 0], color: fabric2 });
            arr.push({ pos: [x, 1, -1], color: fabric2 });
        }
        // Lower wing
        for (let x = -4; x <= 4; x++) {
            arr.push({ pos: [x, -1, 0], color: fabric2 });
            arr.push({ pos: [x, -1, -1], color: fabric2 });
        }
        // Struts
        arr.push({ pos: [-3, 0, 0], color: frame });
        arr.push({ pos: [3, 0, 0], color: frame });
        // Propellers
        arr.push({ pos: [4, 0, 0], color: metal });
        arr.push({ pos: [4, 1, 1], color: metal });
        arr.push({ pos: [4, -1, -1], color: metal });

        return arr;
    }, []);

    return (
        <group ref={ref} position={[0, 1.5, 2]} scale={0.6}>
            {blocks.map((b, i) => (
                <Voxel key={i} position={b.pos} color={b.color} emissive={highlight} />
            ))}
        </group>
    );
}

// ─── Floating Particles ─────────────────────────────────
function DustParticles({ count = 80 }) {
    const ref = useRef();
    const particles = useMemo(() => {
        const arr = [];
        for (let i = 0; i < count; i++) {
            arr.push({
                x: (Math.random() - 0.5) * 30,
                y: Math.random() * 8,
                z: (Math.random() - 0.5) * 20,
                speed: 0.2 + Math.random() * 0.5,
            });
        }
        return arr;
    }, [count]);

    useFrame((state) => {
        if (!ref.current) return;
        const positions = ref.current.geometry.attributes.position;
        for (let i = 0; i < count; i++) {
            const p = particles[i];
            positions.setY(i, p.y + Math.sin(state.clock.elapsedTime * p.speed + i) * 0.02);
            positions.setX(i, p.x + Math.sin(state.clock.elapsedTime * 0.1 + i) * 0.01);
        }
        positions.needsUpdate = true;
    });

    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={new Float32Array(particles.flatMap(p => [p.x, p.y, p.z]))}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial size={0.08} color="#C9B47C" transparent opacity={0.6} sizeAttenuation />
        </points>
    );
}

// ─── Camera Controller ───────────────────────────────────
function CameraRig({ zone = 'workshop' }) {
    const { camera } = useThree();
    const target = useRef(new THREE.Vector3(0, 2, 0));

    const zones = {
        workshop: { pos: [8, 6, 10], look: [0, 2, 0] },
        push_test: { pos: [12, 4, 5], look: [0, 1, 3] },
        bicycle: { pos: [-6, 3, 6], look: [-3, 1, 0] },
        sand_drawing: { pos: [0, 8, 10], look: [0, 0, 0] },
        propeller: { pos: [6, 3, -2], look: [0, 2, 0] },
        launch: { pos: [0, 4, 14], look: [0, 2, 0] },
        flight: { pos: [0, 8, 16], look: [0, 4, 0] },
    };

    useFrame(() => {
        const z = zones[zone] || zones.workshop;
        camera.position.lerp(new THREE.Vector3(...z.pos), 0.02);
        target.current.lerp(new THREE.Vector3(...z.look), 0.02);
        camera.lookAt(target.current);
    });

    return null;
}

// ─── Zone Mapping ────────────────────────────────────────
export function getZoneForNode(nodeId) {
    const map = {
        n_opening: 'workshop', n_01: 'workshop',
        n_02: 'push_test', n_05: 'push_test', n_06: 'push_test', n_07: 'push_test',
        n_03: 'sand_drawing', n_08: 'sand_drawing', n_09: 'sand_drawing', n_10: 'sand_drawing',
        n_04: 'bicycle', n_11: 'bicycle', n_12: 'bicycle',
        n_13: 'workshop', n_14: 'workshop', n_15: 'workshop', n_16: 'workshop',
        n_17: 'sand_drawing', n_18: 'sand_drawing', n_19: 'sand_drawing',
        n_20: 'workshop', n_21: 'workshop', n_22: 'workshop', n_23: 'workshop',
        n_24: 'bicycle', n_25: 'bicycle', n_26: 'bicycle',
        n_27: 'propeller', n_28: 'propeller', n_29: 'propeller',
        n_30: 'workshop', n_31: 'workshop', n_32: 'workshop', n_33: 'workshop',
        n_34: 'workshop', n_35: 'workshop', n_36: 'workshop', n_37: 'workshop',
        n_38: 'workshop', n_39: 'workshop', n_40: 'workshop', n_41: 'workshop',
        n_42: 'workshop', n_43: 'workshop', n_44: 'workshop', n_45: 'workshop',
        n_46: 'workshop', n_47: 'workshop', n_48: 'workshop',
        n_49: 'launch', n_50: 'launch', n_51: 'launch',
        n_52: 'launch', n_53: 'launch', n_54: 'launch',
        n_55: 'launch', n_56: 'launch', n_57: 'launch',
        n_58: 'flight', n_59: 'flight', n_60: 'flight',
        n_61: 'flight', n_62: 'flight', n_63: 'flight',
        n_end: 'flight',
    };
    return map[nodeId] || 'workshop';
}

// ─── Error Boundary ──────────────────────────────────────
class SceneErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    render() {
        if (this.state.hasError) {
            return <SceneFallback zone={this.props.zone} />;
        }
        return this.props.children;
    }
}

// ─── CSS Fallback (no WebGL) ─────────────────────────────
function SceneFallback({ zone = 'workshop' }) {
    const zoneColors = {
        workshop: { bg: 'linear-gradient(135deg, #1a0e0a 0%, #2d1810 40%, #0A1628 100%)', accent: '#C9A96E' },
        push_test: { bg: 'linear-gradient(135deg, #1a1505 0%, #2d2510 40%, #0A1628 100%)', accent: '#D4A574' },
        bicycle: { bg: 'linear-gradient(135deg, #0a1a15 0%, #102d25 40%, #0A1628 100%)', accent: '#6B9080' },
        sand_drawing: { bg: 'linear-gradient(135deg, #1a1510 0%, #2d2818 40%, #0A1628 100%)', accent: '#E8D5A3' },
        propeller: { bg: 'linear-gradient(135deg, #101520 0%, #1a2030 40%, #0A1628 100%)', accent: '#8899AA' },
        launch: { bg: 'linear-gradient(135deg, #15100a 0%, #30200a 40%, #0A1628 100%)', accent: '#F0C040' },
        flight: { bg: 'linear-gradient(135deg, #0a1030 0%, #102050 40%, #0A1628 100%)', accent: '#80B0FF' },
    };
    const colors = zoneColors[zone] || zoneColors.workshop;

    return (
        <div style={{
            width: '100%', height: '100%', background: colors.bg,
            position: 'relative', overflow: 'hidden',
        }}>
            {/* Animated grid floor */}
            <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: '50%',
                background: `repeating-linear-gradient(90deg, ${colors.accent}08 0px, transparent 1px, transparent 40px),
                             repeating-linear-gradient(0deg, ${colors.accent}08 0px, transparent 1px, transparent 40px)`,
                transform: 'perspective(400px) rotateX(60deg)',
                transformOrigin: 'bottom',
            }} />
            {/* Floating particles (CSS) */}
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: 3, height: 3, borderRadius: '50%',
                    backgroundColor: colors.accent,
                    opacity: 0.15 + Math.random() * 0.25,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 80}%`,
                    animation: `float ${3 + Math.random() * 4}s ease-in-out infinite alternate`,
                    animationDelay: `${Math.random() * 3}s`,
                }} />
            ))}
            {/* Zone label */}
            <div style={{
                position: 'absolute', bottom: 20, right: 20,
                color: colors.accent, opacity: 0.3,
                fontSize: 12, fontFamily: 'monospace', textTransform: 'uppercase', letterSpacing: 3,
            }}>
                {zone.replace(/_/g, ' ')}
            </div>
            <style>{`
                @keyframes float {
                    from { transform: translateY(0px) translateX(0px); }
                    to { transform: translateY(-15px) translateX(8px); }
                }
            `}</style>
        </div>
    );
}

// ─── Main Exported Scene ─────────────────────────────────
export function VoxelScene({ activeZone = 'workshop', highlightFlyer = false }) {
    // Check for WebGL support before attempting Canvas
    const [webglSupported] = useState(() => {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
        } catch {
            return false;
        }
    });

    if (!webglSupported) {
        return <SceneFallback zone={activeZone} />;
    }

    return (
        <SceneErrorBoundary zone={activeZone}>
            <Canvas
                shadows
                camera={{ position: [8, 6, 10], fov: 50 }}
                style={{ background: 'transparent' }}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 15, 8]}
                    intensity={1.2}
                    castShadow
                    shadow-mapSize={[1024, 1024]}
                    color="#FFF5E0"
                />
                <pointLight position={[0, 3, 0]} intensity={0.6} color="#C9B47C" distance={12} />
                <hemisphereLight args={['#FFF5E0', '#3D2B1F', 0.5]} />
                <fog attach="fog" args={['#1a1028', 20, 40]} />

                {/* Scene Objects */}
                <SandGround />
                <Workshop />
                <WrightFlyer highlight={highlightFlyer} />
                <DustParticles />

                {/* Camera */}
                <CameraRig zone={activeZone} />
            </Canvas>
        </SceneErrorBoundary>
    );
}

export default VoxelScene;

