import { useRef, useState } from "react"

export default function TorusKnot() {
    const ref = useRef(null)
    const [hovered, set] = useState(false)

    return (
        <mesh
            ref={ref}
            onPointerOver={() => set(true)}
            onPointerOut={() => set(false)}
        >
            <torusKnotGeometry args={[10, 3, 128, 32]} />
            <meshBasicMaterial color={hovered ? "lightblue" : "hotpink"} />
        </mesh>
    )
}
