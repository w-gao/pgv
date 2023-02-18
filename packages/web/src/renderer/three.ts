import { PGVNode, Edge, Path } from "@pgv/core/src/model"
import { IRenderer } from "."
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    BoxGeometry,
    MeshBasicMaterial,
    Mesh,
    Color,
} from "three"

export class ThreeRenderer implements IRenderer {
    private scene: Scene
    private camera: PerspectiveCamera
    private renderer: WebGLRenderer
    private element: HTMLCanvasElement

    constructor(parent: HTMLElement) {
        const width = parent.clientWidth
        const height = parent.clientHeight

        // Initialize THREE.js - set scene, camera, renderer, etc.
        this.scene = new Scene()
        this.scene.background = new Color(1, 1, 1)

        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
        this.camera.position.z = 2

        this.renderer = new WebGLRenderer()
        this.renderer.setSize(width, height)

        this.element = this.renderer.domElement
        this.element.setAttribute("class", "renderCanvas")

        // Add canvas element to parent.
        parent.appendChild(this.element)

        // Draw a little cube.
        const cube = this.addCube()

        const render = () => {
            this.renderer.render(this.scene, this.camera)
        }

        // Request animation frame from the browser - the browser twlls us when
        // we get to render.
        const animate = () => {
            requestAnimationFrame(animate)

            cube.rotation.x += 0.01
            cube.rotation.y += 0.01

            render()
        }

        // Add an event listener for the resize event.
        const resize = () => {
            const width = parent.clientWidth
            const height = parent.clientHeight

            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(width, height)
            render()
        }
        window.addEventListener("resize", resize, false)

        // Kick off our render loop.
        animate()
    }

    addCube() {
        const geometry = new BoxGeometry()
        const material = new MeshBasicMaterial({
            color: 0x005500,
            wireframe: true,
        })

        const cube = new Mesh(geometry, material)
        this.scene.add(cube)

        return cube
    }

    drawGraph(nodes: PGVNode[], edges: Edge[], refPaths: Path[]): void {
        throw new Error("Method not implemented.")
    }

    drawPaths(p: Path[]): void {
        throw new Error("Method not implemented.")
    }
}
