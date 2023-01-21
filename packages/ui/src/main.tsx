import "./index.css"
import { StrictMode } from "react"
import { createRoot, events, extend } from "@react-three/fiber"
import { SVGRenderer } from "three/examples/jsm/renderers/SVGRenderer"
import TorusKnot from "./components/TorusKnot"

import * as THREE from "three"
extend(THREE)

const root = createRoot(document.getElementById("root") as HTMLElement)
root.configure({
    gl: canvas => {
        const gl = new SVGRenderer()
        canvas.appendChild(gl.domElement)
        return gl
    },
    frameloop: "demand",
    events,
    camera: { position: [0, 0, 50] },
    size: {
        width: window.innerWidth,
        height: window.innerHeight,
        top: 0,
        left: 0,
    },
})

root.render(
    <StrictMode>
        <TorusKnot />
    </StrictMode>
)
