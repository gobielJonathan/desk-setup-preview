"use client";

import { Canvas } from "@react-three/fiber";
import { Float, OrbitControls, RoundedBox, ContactShadows } from "@react-three/drei";
import { useMemo } from "react";
import { accessoryById, chairById, deskById, type Accessory, type Chair, type Desk, type Vibe } from "../../lib/catalog";
import { useWorkspace } from "../../lib/workspace-store";

const sceneColors: Record<
  Vibe,
  {
    background: string;
    wall: string;
    floor: string;
    light: string;
    window: string;
    city: string;
    wood: string;
  }
> = {
  morning: {
    background: "#C7DAD5",
    wall: "#E7DCCD",
    floor: "#B98968",
    light: "#FFE9A8",
    window: "#A9CDD0",
    city: "#78989A",
    wood: "#A66C49",
  },
  sunset: {
    background: "#BF8D86",
    wall: "#DCC2B8",
    floor: "#A9725E",
    light: "#FFD08A",
    window: "#B67D80",
    city: "#735765",
    wood: "#875542",
  },
  night: {
    background: "#29394A",
    wall: "#344454",
    floor: "#4B5963",
    light: "#F3D291",
    window: "#49637B",
    city: "#263B4E",
    wood: "#71584F",
  },
};

type Point = [number, number, number];

type MonitorSlot = {
  x: number;
  y: number;
  z: number;
  scale: number;
};

export default function Workspace3D({
  compact = false,
  className = "",
}: {
  compact?: boolean;
  className?: string;
}) {
  const { state } = useWorkspace();
  const desk = deskById(state.deskId);
  const chair = chairById(state.chairId);
  const colors = sceneColors[state.vibe];
  const selectedAccessories = useMemo(
    () =>
      Object.entries(state.accessories).flatMap(([id, quantity]) => {
        const accessory = accessoryById(id);
        return accessory ? [{ accessory, quantity }] : [];
      }),
    [state.accessories],
  );
  const placedAccessories = useMemo(() => {
    let monitorIndex = 0;
    return selectedAccessories.flatMap(({ accessory, quantity }) =>
      Array.from({ length: quantity }, (_, index) => ({
        accessory,
        index,
        monitorIndex: accessory.icon.includes("monitor") ? monitorIndex++ : -1,
      })),
    );
  }, [selectedAccessories]);
  const monitorAccessories = placedAccessories
    .filter(({ accessory }) => accessory.icon.includes("monitor"))
    .map(({ accessory }) => accessory);
  const monitorSlots = createMonitorSlots(monitorAccessories);
  const height = compact
    ? "workspace-scene workspace-scene--3d workspace-scene--compact"
    : "workspace-scene workspace-scene--3d";

  return (
    <div className={`${height} ${className}`}>
      <Canvas
        shadows
        dpr={[1, 1.7]}
        camera={{ position: [6.4, 4.8, 7.2], fov: 36 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[colors.background]} />
        <fog attach="fog" args={[colors.background, 8, 17]} />
        <ambientLight intensity={0.85} color={colors.light} />
        <directionalLight
          castShadow
          position={[-4, 8, 5]}
          intensity={2.4}
          color={colors.light}
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-7}
          shadow-camera-right={7}
          shadow-camera-top={7}
          shadow-camera-bottom={-5}
        />
        <pointLight position={[0, 4.7, 1]} intensity={1.2} distance={7} color={colors.light} />
        <pointLight position={[4.5, 3.8, -1]} intensity={0.7} distance={5} color="#E9B8A6" />

        <CafeRoom vibe={state.vibe} colors={colors} />
        <Rug />
        <PlacementZones monitorSlots={monitorSlots} />
        <ChairModel chair={chair} />
        <DeskModel desk={desk} />

        {placedAccessories.map(({ accessory, index, monitorIndex }) => (
          <AccessoryModel
            accessory={accessory}
            monitorSlot={monitorIndex >= 0 ? monitorSlots[monitorIndex] : undefined}
            monitorSlots={monitorSlots}
            key={`${accessory.id}-${index}`}
          />
        ))}

        <ContactShadows position={[0, 0.02, 0.8]} opacity={0.35} scale={11} blur={2.6} far={4.5} />
        <OrbitControls
          makeDefault
          enablePan={false}
          enableZoom={!compact}
          minDistance={5.7}
          maxDistance={8.2}
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 2.08}
          target={[0, 1.7, 0]}
        />
      </Canvas>
      {!compact && (
        <div className="scene-3d-hint">
          <span className="scene-3d-orbit" />
          Drag to explore your table
        </div>
      )}
      <div className="scene-3d-badge">
        <span className="scene-3d-live-dot" />
        Interactive 3D preview
      </div>
      {!compact && (
        <div className="scene-3d-zones" aria-label="Available workspace zones">
          <span><i className="scene-zone-dot scene-zone-dot--surface" />Surface slots</span>
          <span><i className="scene-zone-dot scene-zone-dot--floor" />Floor landing</span>
        </div>
      )}
    </div>
  );
}

function CafeRoom({
  vibe,
  colors,
}: {
  vibe: Vibe;
  colors: (typeof sceneColors)[Vibe];
}) {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, 0, 0]}>
        <planeGeometry args={[16, 15]} />
        <meshStandardMaterial color={colors.floor} roughness={0.78} />
      </mesh>
      <mesh position={[0, 4.7, -3.3]} receiveShadow>
        <boxGeometry args={[16, 9.5, 0.18]} />
        <meshStandardMaterial color={colors.wall} roughness={0.9} />
      </mesh>
      <CafeTiles color={colors.wall} />
      <CafeWindow colors={colors} vibe={vibe} />
      <CafeCounter colors={colors} />
      <CafeMenu colors={colors} />
      <CafeShelf colors={colors} />
      <CafePendant position={[-0.1, 5.75, -1.3]} colors={colors} scale={0.9} />
      <CafePendant position={[3.8, 5.2, -1.55]} colors={colors} scale={1.12} />
      <CafeNeighbor colors={colors} />
    </group>
  );
}

function CafeTiles({ color }: { color: string }) {
  return (
    <group position={[0, 2.4, -3.2]}>
      {Array.from({ length: 14 }, (_, index) => (
        <mesh key={`tile-v-${index}`} position={[-6.8 + index, 0, 0]}>
          <boxGeometry args={[0.015, 4.6, 0.012]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.26} />
        </mesh>
      ))}
      {Array.from({ length: 7 }, (_, index) => (
        <mesh key={`tile-h-${index}`} position={[0, -2.2 + index * 0.75, 0]}>
          <boxGeometry args={[14, 0.015, 0.012]} />
          <meshBasicMaterial color={color} transparent opacity={0.26} />
        </mesh>
      ))}
    </group>
  );
}

function CafeWindow({
  colors,
  vibe,
}: {
  colors: (typeof sceneColors)[Vibe];
  vibe: Vibe;
}) {
  return (
    <group position={[-3.35, 3.75, -3.15]}>
      <mesh>
        <boxGeometry args={[4.25, 3.55, 0.08]} />
        <meshStandardMaterial color={colors.window} roughness={0.4} />
      </mesh>
      <mesh position={[0, -0.35, -0.05]}>
        <boxGeometry args={[4.05, 1.75, 0.04]} />
        <meshStandardMaterial color={colors.city} roughness={0.9} />
      </mesh>
      {[-1.65, -0.95, -0.2, 0.45, 1.15, 1.75].map((x, index) => (
        <mesh key={`building-${index}`} position={[x, -0.08 + (index % 2) * 0.32, -0.09]}>
          <boxGeometry args={[0.48, 1 + (index % 3) * 0.4, 0.05]} />
          <meshStandardMaterial color={colors.city} roughness={1} />
        </mesh>
      ))}
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[0.09, 3.7, 0.12]} />
        <meshStandardMaterial color="#F5E7D6" roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.02, 0.07]}>
        <boxGeometry args={[4.3, 0.09, 0.12]} />
        <meshStandardMaterial color="#F5E7D6" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.78, 0.06]}>
        <boxGeometry args={[4.45, 0.12, 0.17]} />
        <meshStandardMaterial color={colors.wood} roughness={0.65} />
      </mesh>
      <mesh position={[0, -1.78, 0.06]}>
        <boxGeometry args={[4.45, 0.12, 0.17]} />
        <meshStandardMaterial color={colors.wood} roughness={0.65} />
      </mesh>
      {vibe === "night" && (
        <>
          <mesh position={[-1.2, 0.75, 0.1]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={colors.light} />
          </mesh>
          <mesh position={[0.85, 0.95, 0.1]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshBasicMaterial color={colors.light} />
          </mesh>
        </>
      )}
    </group>
  );
}

function CafePendant({
  position,
  colors,
  scale,
}: {
  position: Point;
  colors: (typeof sceneColors)[Vibe];
  scale: number;
}) {
  return (
    <Float speed={1.3} rotationIntensity={0.015} floatIntensity={0.025}>
      <group position={position} scale={scale}>
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 1.5, 8]} />
          <meshStandardMaterial color="#334044" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.44, 0.32, 32, 1, true]} />
          <meshStandardMaterial color={colors.wood} roughness={0.55} side={2} />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.25, 20, 12]} />
          <meshStandardMaterial color={colors.light} emissive={colors.light} emissiveIntensity={0.55} />
        </mesh>
        <pointLight position={[0, -0.2, 0.2]} intensity={0.6} distance={3} color={colors.light} />
      </group>
    </Float>
  );
}

function CafeCounter({ colors }: { colors: (typeof sceneColors)[Vibe] }) {
  return (
    <group position={[5.05, 1.42, -2.9]}>
      <RoundedBox args={[3.3, 2.6, 0.55]} radius={0.08} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={colors.wood} roughness={0.72} />
      </RoundedBox>
      <RoundedBox args={[3.65, 0.24, 0.75]} radius={0.06} smoothness={4} position={[0, 1.38, 0]}>
        <meshStandardMaterial color="#3F4A4A" roughness={0.58} />
      </RoundedBox>
      {[[-1.15, 0.4], [-0.45, 0.25], [0.25, 0.5]].map(([x, y], index) => (
        <mesh key={`counter-line-${index}`} position={[x, y, 0.3]}>
          <boxGeometry args={[0.72, 0.035, 0.02]} />
          <meshStandardMaterial color="#F4D18F" roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[-1.25, 1.62, 0.1]}>
        <cylinderGeometry args={[0.2, 0.22, 0.18, 24]} />
        <meshStandardMaterial color="#D3E1DD" roughness={0.35} />
      </mesh>
      <mesh position={[-1.25, 1.77, 0.1]}>
        <torusGeometry args={[0.11, 0.025, 12, 24]} />
        <meshStandardMaterial color="#D3E1DD" roughness={0.35} />
      </mesh>
    </group>
  );
}

function CafeMenu({ colors }: { colors: (typeof sceneColors)[Vibe] }) {
  return (
    <group position={[2.45, 4.25, -3.18]}>
      <RoundedBox args={[1.65, 1.72, 0.08]} radius={0.06} smoothness={3} castShadow>
        <meshStandardMaterial color="#3B3D49" roughness={0.9} />
      </RoundedBox>
      {[0.4, 0.08, -0.25, -0.58].map((y, index) => (
        <mesh key={`menu-line-${index}`} position={[-0.18 + (index % 2) * 0.16, y, 0.07]}>
          <boxGeometry args={[index === 3 ? 0.55 : 1.1 - (index % 2) * 0.25, 0.045, 0.015]} />
          <meshStandardMaterial color={colors.light} roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0.58, 0.58, 0.08]}>
        <sphereGeometry args={[0.1, 16, 10]} />
        <meshStandardMaterial color={colors.light} emissive={colors.light} emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
}

function CafeShelf({ colors }: { colors: (typeof sceneColors)[Vibe] }) {
  return (
    <group position={[4.1, 3.12, -3.12]}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.12, 0.42]} />
        <meshStandardMaterial color={colors.wood} roughness={0.65} />
      </mesh>
      <mesh position={[-0.95, -0.34, 0]}>
        <boxGeometry args={[0.09, 0.72, 0.12]} />
        <meshStandardMaterial color={colors.wood} roughness={0.65} />
      </mesh>
      <mesh position={[0.95, -0.34, 0]}>
        <boxGeometry args={[0.09, 0.72, 0.12]} />
        <meshStandardMaterial color={colors.wood} roughness={0.65} />
      </mesh>
      {[-0.7, 0, 0.7].map((x, index) => (
        <mesh key={`cup-${index}`} position={[x, 0.3 + (index % 2) * 0.1, 0]}>
          <cylinderGeometry args={[0.16, 0.13, 0.28, 20]} />
          <meshStandardMaterial color={index === 1 ? "#DDBA7C" : "#EEE7D6"} roughness={0.38} />
        </mesh>
      ))}
    </group>
  );
}

function CafeNeighbor({ colors }: { colors: (typeof sceneColors)[Vibe] }) {
  return (
    <group position={[-5.05, 0, 1]}>
      <mesh position={[0, 1.85, 0]}>
        <cylinderGeometry args={[1.05, 1.05, 0.12, 32]} />
        <meshStandardMaterial color={colors.wood} roughness={0.72} />
      </mesh>
      <mesh position={[0, 0.92, 0]}>
        <cylinderGeometry args={[0.09, 0.13, 1.7, 16]} />
        <meshStandardMaterial color="#455559" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.62, 0.52, 0.1, 24]} />
        <meshStandardMaterial color="#455559" roughness={0.8} />
      </mesh>
      <group position={[0.55, 1.98, 0]}>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.18, 0.22, 0.34, 20]} />
          <meshStandardMaterial color="#597A62" roughness={0.85} />
        </mesh>
        {[-0.25, -0.05, 0.16, 0.32].map((x, index) => (
          <mesh key={`neighbor-leaf-${index}`} position={[x, 0.75 + (index % 2) * 0.18, 0]} rotation={[0, 0, x * 0.8]}>
            <sphereGeometry args={[0.28, 12, 8]} />
            <meshStandardMaterial color={index % 2 ? "#80A06D" : "#688F6D"} roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function Rug() {
  return (
    <mesh position={[0, 0.035, 1.15]} receiveShadow>
      <cylinderGeometry args={[2.5, 2.5, 0.045, 64]} />
      <meshStandardMaterial color="#D9C19C" roughness={1} />
    </mesh>
  );
}

function PlacementZones({ monitorSlots }: { monitorSlots: MonitorSlot[] }) {
  return (
    <group>
      {monitorSlots.map((slot, index) => (
        <mesh
          key={`monitor-slot-${index}`}
          position={[slot.x, 2.38, slot.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.23 * slot.scale, 0.3 * slot.scale, 32]} />
          <meshBasicMaterial color="#F2CA7B" transparent opacity={0.25} />
        </mesh>
      ))}
      <mesh position={[4.05, 0.04, 0.35]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.65, 0.72, 32]} />
        <meshBasicMaterial color="#A7C67A" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function DeskModel({ desk }: { desk: Desk }) {
  const isWhite = desk.id === "cloud-white";
  return (
    <group position={[0, 0, -0.05]}>
      <RoundedBox args={[4.7, 0.22, 1.62]} radius={0.08} smoothness={5} position={[0, 2.25, 0]} castShadow receiveShadow>
        <meshStandardMaterial color={desk.colors.top} roughness={isWhite ? 0.3 : 0.56} metalness={isWhite ? 0.04 : 0} />
      </RoundedBox>
      <RoundedBox args={[4.76, 0.1, 1.67]} radius={0.04} smoothness={3} position={[0, 2.12, 0]} castShadow>
        <meshStandardMaterial color={desk.colors.edge} roughness={0.65} />
      </RoundedBox>
      {[-1.95, 1.95].map((x) => (
        <group key={x}>
          <RoundedBox args={[0.2, 2.1, 0.2]} radius={0.04} smoothness={3} position={[x, 1.08, -0.51]} castShadow>
            <meshStandardMaterial color={desk.colors.leg} roughness={0.48} metalness={0.12} />
          </RoundedBox>
          <RoundedBox args={[0.2, 2.1, 0.2]} radius={0.04} smoothness={3} position={[x, 1.08, 0.51]} castShadow>
            <meshStandardMaterial color={desk.colors.leg} roughness={0.48} metalness={0.12} />
          </RoundedBox>
        </group>
      ))}
      <RoundedBox args={[2.25, 0.62, 1.48]} radius={0.04} smoothness={3} position={[0, 1.74, -0.05]} castShadow>
        <meshStandardMaterial color={desk.colors.edge} roughness={0.65} />
      </RoundedBox>
      <mesh position={[0, 1.74, 0.7]}>
        <boxGeometry args={[1.1, 0.05, 0.02]} />
        <meshStandardMaterial color={desk.colors.top} roughness={0.6} />
      </mesh>
    </group>
  );
}

function ChairModel({ chair }: { chair: Chair }) {
  const isStool = chair.id === "citrus-stool";
  return (
    <group position={[0, 0, 1.6]} rotation={isStool ? [0, 0, 0] : [0, Math.PI, 0]}>
      {isStool ? (
        <>
          <RoundedBox args={[1.7, 0.3, 1.35]} radius={0.16} smoothness={5} position={[0, 1.27, 0]} castShadow>
            <meshStandardMaterial color={chair.colors.seat} roughness={0.42} />
          </RoundedBox>
          <mesh position={[0, 0.66, 0]}>
            <cylinderGeometry args={[0.11, 0.15, 1.1, 16]} />
            <meshStandardMaterial color={chair.colors.leg} roughness={0.42} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <torusGeometry args={[0.72, 0.07, 12, 32]} />
            <meshStandardMaterial color={chair.colors.leg} roughness={0.42} metalness={0.3} />
          </mesh>
        </>
      ) : (
        <>
          <RoundedBox args={[1.86, 0.38, 1.6]} radius={0.18} smoothness={6} position={[0, 1.18, 0]} castShadow>
            <meshStandardMaterial color={chair.colors.seat} roughness={0.56} />
          </RoundedBox>
          <RoundedBox args={[1.72, 2.3, 0.3]} radius={0.18} smoothness={6} position={[0, 2.22, -0.58]} castShadow>
            <meshStandardMaterial color={chair.colors.back} roughness={0.5} />
          </RoundedBox>
          <mesh position={[0, 0.62, 0]}>
            <cylinderGeometry args={[0.12, 0.17, 1.25, 16]} />
            <meshStandardMaterial color={chair.colors.leg} roughness={0.38} metalness={0.34} />
          </mesh>
          <mesh position={[0, 0.06, 0]}>
            <torusGeometry args={[0.72, 0.07, 12, 32]} />
            <meshStandardMaterial color={chair.colors.leg} roughness={0.38} metalness={0.34} />
          </mesh>
          {[-0.48, 0.48].map((x) => (
            <mesh key={x} position={[x, 0.14, 0]} rotation={[0, 0, x * 0.38]}>
              <boxGeometry args={[0.09, 0.1, 1.25]} />
              <meshStandardMaterial color={chair.colors.leg} roughness={0.38} metalness={0.34} />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
}

function AccessoryModel({
  accessory,
  monitorSlot,
  monitorSlots,
}: {
  accessory: Accessory;
  monitorSlot?: MonitorSlot;
  monitorSlots: MonitorSlot[];
}) {
  const color = accessory.colors.primary;
  const secondary = accessory.colors.secondary;
  const position = accessoryPosition(accessory, monitorSlot, monitorSlots);

  if (accessory.icon.includes("monitor")) {
    const wide = accessory.icon === "wide-monitor";
    return (
      <group position={position} scale={monitorSlot?.scale ?? 1}>
        <RoundedBox args={[wide ? 2.65 : 1.5, wide ? 1.14 : 1.2, 0.12]} radius={0.06} smoothness={4} castShadow>
          <meshStandardMaterial color="#25353B" roughness={0.3} metalness={0.28} />
        </RoundedBox>
        <RoundedBox args={[wide ? 2.37 : 1.27, wide ? 0.87 : 0.94, 0.035]} radius={0.035} smoothness={3} position={[0, 0, 0.08]}>
          <meshStandardMaterial color={secondary} roughness={0.22} metalness={0.05} />
        </RoundedBox>
        <mesh position={[0, -0.78, 0]}>
          <boxGeometry args={[0.12, 0.54, 0.12]} />
          <meshStandardMaterial color={color} roughness={0.38} metalness={0.25} />
        </mesh>
        <mesh position={[0, -1.04, 0]}>
          <boxGeometry args={[0.66, 0.07, 0.34]} />
          <meshStandardMaterial color={color} roughness={0.38} metalness={0.25} />
        </mesh>
      </group>
    );
  }

  if (accessory.icon === "lamp") {
    return (
      <group position={position}>
        <mesh position={[0, 0.62, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 1.25, 12]} />
          <meshStandardMaterial color="#7B6354" roughness={0.55} metalness={0.22} />
        </mesh>
        <mesh position={[0.18, 1.22, 0]} rotation={[0, 0, -0.38]}>
          <coneGeometry args={[0.27, 0.3, 24]} />
          <meshStandardMaterial color={color} roughness={0.5} />
        </mesh>
        <pointLight position={[0.18, 1.03, 0.15]} intensity={0.55} distance={2.2} color={secondary} />
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.34, 0.06, 24]} />
          <meshStandardMaterial color="#7B6354" roughness={0.55} metalness={0.22} />
        </mesh>
      </group>
    );
  }

  if (accessory.icon === "sprout") {
    return (
      <group position={position}>
        <mesh position={[0, 0.14, 0]}>
          <cylinderGeometry args={[0.22, 0.27, 0.35, 20]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {[-0.18, 0.18].map((x) => (
          <mesh key={x} position={[x, 0.57, 0]} scale={[0.7, 1.2, 0.24]} rotation={[0, 0, x * 1.2]}>
            <sphereGeometry args={[0.28, 16, 10]} />
            <meshStandardMaterial color={secondary} roughness={0.9} />
          </mesh>
        ))}
      </group>
    );
  }

  if (accessory.icon === "keyboard") {
    return (
      <group position={position}>
        <RoundedBox args={[1.5, 0.08, 0.5]} radius={0.05} smoothness={3} castShadow>
          <meshStandardMaterial color={color} roughness={0.38} />
        </RoundedBox>
        <mesh position={[0.86, 0.04, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 0.08, 24]} />
          <meshStandardMaterial color={secondary} roughness={0.35} />
        </mesh>
      </group>
    );
  }

  if (accessory.icon === "stand") {
    return (
      <group position={position}>
        <mesh position={[0, 0.28, 0]} rotation={[0.12, 0, 0]}>
          <boxGeometry args={[0.7, 0.08, 0.6]} />
          <meshStandardMaterial color={color} roughness={0.38} metalness={0.08} />
        </mesh>
        <mesh position={[0, 0.1, 0.04]}>
          <boxGeometry args={[0.55, 0.06, 0.48]} />
          <meshStandardMaterial color={secondary} roughness={0.38} metalness={0.08} />
        </mesh>
      </group>
    );
  }

  if (accessory.icon === "headphones") {
    return (
      <group position={position} rotation={[0, 0.2, 0]}>
        <mesh>
          <torusGeometry args={[0.3, 0.07, 14, 32, Math.PI]} />
          <meshStandardMaterial color={color} roughness={0.35} />
        </mesh>
        <RoundedBox args={[0.16, 0.35, 0.16]} radius={0.06} smoothness={3} position={[-0.29, -0.04, 0]}>
          <meshStandardMaterial color={secondary} roughness={0.4} />
        </RoundedBox>
        <RoundedBox args={[0.16, 0.35, 0.16]} radius={0.06} smoothness={3} position={[0.29, -0.04, 0]}>
          <meshStandardMaterial color={secondary} roughness={0.4} />
        </RoundedBox>
      </group>
    );
  }

  if (accessory.icon === "monstera") {
    return (
      <group position={position}>
        <mesh position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.34, 0.45, 0.58, 20]} />
          <meshStandardMaterial color={color} roughness={0.8} />
        </mesh>
        {[-0.35, -0.08, 0.23, 0.48].map((x, leafIndex) => (
          <mesh key={x} position={[x, 1.45 + (leafIndex % 2) * 0.35, 0]} scale={[0.7, 1.35, 0.16]} rotation={[0, 0, x * 0.45]}>
            <sphereGeometry args={[0.42, 16, 10]} />
            <meshStandardMaterial color={leafIndex % 2 ? secondary : color} roughness={0.88} />
          </mesh>
        ))}
      </group>
    );
  }

  if (accessory.icon === "rug") return null;

  return null;
}

function createMonitorSlots(monitors: Accessory[]): MonitorSlot[] {
  if (monitors.length === 0) return [];

  const hasWide = monitors.some((monitor) => monitor.icon === "wide-monitor");
  if (!hasWide) {
    const positions =
      monitors.length === 1
        ? [{ x: 0, scale: 1 }]
        : monitors.length === 2
          ? [{ x: -0.93, scale: 0.86 }, { x: 0.93, scale: 0.86 }]
          : [
              { x: -1.15, scale: 0.72 },
              { x: 0, scale: 0.72 },
              { x: 1.15, scale: 0.72 },
            ];
    return positions.map(({ x, scale }) => ({
      x,
      y: 3.02,
      z: -0.22,
      scale,
    }));
  }

  const wideSlot =
    monitors.length === 1
      ? { x: 0, scale: 1 }
      : monitors.length === 2
        ? { x: -0.58, scale: 0.88 }
        : { x: -0.85, scale: 0.76 };
  const haloSlots =
    monitors.length === 2
      ? [{ x: 1.4, scale: 0.74 }]
      : [
          { x: 0.58, scale: 0.6 },
          { x: 1.55, scale: 0.6 },
        ];
  let haloIndex = 0;

  return monitors.map((monitor) => {
    if (monitor.icon === "wide-monitor") {
      return { x: wideSlot.x, y: 3.02, z: -0.22, scale: wideSlot.scale };
    }
    const slot = haloSlots[haloIndex] ?? haloSlots[haloSlots.length - 1];
    haloIndex += 1;
    return { x: slot.x, y: 3.02, z: -0.22, scale: slot.scale };
  });
}

function accessoryPosition(
  accessory: Accessory,
  monitorSlot?: MonitorSlot,
  monitorSlots: MonitorSlot[] = [],
): Point {
  if (accessory.zone === "floor") {
    return accessory.icon === "monstera" ? [4.05, 0, 0.35] : [0, 0.08, 1.05];
  }
  if (accessory.zone === "wall") return [3.8, 3.6, -2.98];

  if (accessory.icon.includes("monitor")) {
    return monitorSlot
      ? [monitorSlot.x, monitorSlot.y, monitorSlot.z]
      : [0, 3.05, -0.25];
  }
  if (accessory.icon === "lamp") {
    return monitorSlots.length >= 3
      ? [-2.02, 2.38, 0.28]
      : [-1.82, 2.38, 0.08];
  }
  if (accessory.icon === "sprout") {
    return monitorSlots.length >= 3
      ? [2.12, 2.4, 0.32]
      : [1.85, 2.4, 0.08];
  }
  if (accessory.icon === "keyboard") return [0, 2.38, 0.48];
  if (accessory.icon === "stand") return [1.1, 2.42, 0.25];
  if (accessory.icon === "headphones") return [-1.7, 2.48, 0.42];
  return [0, 2.4, 0];
}
