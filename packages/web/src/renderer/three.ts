import { PGVNode, Edge, Path } from "@pgv/core/src/model"
import { IRenderer } from "."
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    BoxGeometry,
    ShapeGeometry,
    MeshBasicMaterial,
    Mesh,
    Color,
    PlaneGeometry,
    DoubleSide,
} from "three"
import { FlyControls } from "three/examples/jsm/controls/FlyControls"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader"

export class ThreeRenderer implements IRenderer {
    private scene: Scene
    private camera: PerspectiveCamera
    private renderer: WebGLRenderer
    private element: HTMLCanvasElement

    private font: Font | undefined

    constructor(parent: HTMLElement) {
        const width = parent.clientWidth
        const height = parent.clientHeight

        // Initialize THREE.js - set scene, camera, renderer, etc.
        this.scene = new Scene()
        this.scene.background = new Color(1, 1, 1)

        this.camera = new PerspectiveCamera(75, width / height, 0.1, 1000)
        this.camera.position.z = 100

        this.renderer = new WebGLRenderer()
        this.renderer.setSize(width, height)

        const controls = new FlyControls(this.camera, this.renderer.domElement)
        controls.movementSpeed = 100
        controls.rollSpeed = Math.PI / 24
        controls.autoForward = false
        controls.dragToLook = true

        this.element = this.renderer.domElement
        this.element.setAttribute("class", "renderCanvas")

        // Add canvas element to parent.
        parent.appendChild(this.element)

        // Draw a little cube.
        // const cube = this.addCube()

        const render = () => {
            this.renderer.render(this.scene, this.camera)
        }

        // Request animation frame from the browser - the browser twlls us when
        // we get to render.
        const animate = () => {
            requestAnimationFrame(animate)

            // cube.rotation.x += 0.01
            // cube.rotation.y += 0.01

            controls.update(0.01)

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

    async loadResources(): Promise<void> {
        const loader = new FontLoader()
        try {
            this.font = await loader.loadAsync(
                "fonts/CourierPrime-Regular.json"
            )
        } catch (reason) {
            console.error("Failed to load font for THREE.js:", reason)
        }
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

    drawGraph(nodes: PGVNode[], edges: Edge[], refPaths?: Path[]): void {
        console.log("drawGraph()")
        console.log(JSON.stringify(nodes, undefined, 4))

        const nodeMap = new Map()

        // Draw nodes.
        for (let node of nodes) {
            console.log("drawing node:", node.sequence)

            // Transform the width a bit to fit better with our font.
            const width = node.width + 18 - node.width / 3

            const geometry = new PlaneGeometry(width, node.height)
            const material = new MeshBasicMaterial({
                color: 0xadd8e6,
                // wireframe: true,
                side: DoubleSide,
            })

            const plane = new Mesh(geometry, material)

            plane.position.x = node.x + node.width / 2
            plane.position.y = -node.y

            this.scene.add(plane)

            const color = new Color(0x006699)

            const textMaterial = new MeshBasicMaterial({
                color: color,
                side: DoubleSide,
            })

            const shapes = this.font!.generateShapes(
                `${node.id}: ${node.sequence}`,
                4
            )
            const textGeometry = new ShapeGeometry(shapes)
            textGeometry.computeBoundingBox()
            const xMid =
                -0.5 *
                (textGeometry.boundingBox!.max.x -
                    textGeometry.boundingBox!.min.x)
            const yMid =
                -0.5 *
                (textGeometry.boundingBox!.max.y -
                    textGeometry.boundingBox!.min.y)
            textGeometry.translate(xMid, yMid, 0)

            const text = new Mesh(textGeometry, textMaterial)
            text.position.x = plane.position.x
            text.position.y = plane.position.y
            text.position.z += 0.01
            this.scene.add(text)
        }

        for (let edge of edges) {
            console.log(`drawing edge: ${edge.from} -> ${edge.to}`)
        }
    }

    drawPaths(p: Path[]): void {
        throw new Error("Method not implemented.")
    }

    clear(): void {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0])
        }
    }
}
