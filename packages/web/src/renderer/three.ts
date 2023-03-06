import { PGVNode, Edge, Path } from "@pgv/core/src/model"
import { IRenderer } from "."
import { mod } from "../utils/math"
import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    Mesh,
    Color,
    Clock,
    DoubleSide,
    Vector3,
    BoxGeometry,
    BufferGeometry,
    ShapeGeometry,
    PlaneGeometry,
    Material,
    LineBasicMaterial,
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    Line,
    HemisphereLight,
    CubicBezierCurve3,
} from "three"
import { FlyControls } from "three/examples/jsm/controls/FlyControls"
import { Font, FontLoader } from "three/examples/jsm/loaders/FontLoader"
import { CallbacksFn } from "../pgv"

/**
 * Represent the coordinates and size of a node.
 */
type NodeCoord = {
    x: number
    y: number
    width: number
    height: number
}

/**
 * Variation graph renderer using Three.js.
 */
export class ThreeRenderer implements IRenderer {
    private scene: Scene
    private camera: PerspectiveCamera
    private renderer: WebGLRenderer
    private element: HTMLCanvasElement

    private font: Font | undefined

    /**
     * True if we are rendering a graph.
     */
    private active: boolean = false

    private activePathIndex: number = -1
    private nodeCoords: Map<string, NodeCoord> = new Map()
    private pathNames: Array<string> = []
    private pathMeshes: Map<string, Array<Mesh>> = new Map()

    constructor(parent: HTMLElement, private uiCallbackFn: CallbacksFn) {
        // Create canvas container.
        const divElement = document.createElement("div")
        divElement.setAttribute("style", "width: 100%; height: 500px")
        parent.appendChild(divElement)

        const width = divElement.clientWidth
        const height = divElement.clientHeight

        // Initialize THREE.js - set scene, camera, renderer, etc.
        this.scene = new Scene()
        this.scene.background = new Color(0xfefefe)

        this.camera = new PerspectiveCamera(75, width / height, 1, 10000)
        this.camera.position.set(100, -50, 100)

        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(width, height)
        this.renderer.shadowMap.enabled = true

        // Disable pointer events registered by FlyControls.
        const addEventListenerFn = this.renderer.domElement.addEventListener
        this.renderer.domElement.addEventListener = (
            type: any,
            listener: any
        ) => {
            if (
                type === "contextmenu" ||
                type === "pointerdown" ||
                type === "pointermove" ||
                type === "pointerup"
            ) {
                return
            }

            addEventListenerFn(type, listener)
        }
        const controls = new FlyControls(this.camera, this.renderer.domElement)
        controls.movementSpeed = 100
        controls.rollSpeed = 0
        controls.autoForward = false
        controls.dragToLook = false

        this.element = this.renderer.domElement
        this.element.setAttribute("class", "renderCanvas")

        // Add canvas element to container.
        divElement.appendChild(this.element)

        // Set up scene.
        this.setUpScene()

        // Set up render loop.
        const render = () => {
            this.renderer.render(this.scene, this.camera)
        }

        const clock = new Clock(true)

        // Request animation frame from the browser - the browser tells us when
        // we get to render.
        const animate = () => {
            requestAnimationFrame(animate)

            controls.update(clock.getDelta())

            render()
        }

        // Add event handler for resize event.
        const resize = () => {
            const width = divElement.offsetWidth
            const height = divElement.offsetHeight

            this.camera.aspect = width / height
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(width, height)
            render()
        }
        window.addEventListener("resize", resize, false)

        // Add event handler for keyboard event.
        const keydown = (ev: KeyboardEvent) => {
            // Only handle events if we have actually rendered a graph.
            if (!this.active) {
                return
            }

            switch (ev.code) {
                case "ArrowUp":
                    this.setActivePath(
                        mod(this.activePathIndex - 1, this.pathNames.length)
                    )
                    break
                case "ArrowDown":
                    this.setActivePath(
                        mod(this.activePathIndex + 1, this.pathNames.length)
                    )
                    break
            }
        }

        window.addEventListener("keydown", keydown, false)

        // Kick off our render loop.
        animate()
    }

    /**
     * Async function to initialize the renderer.
     *
     * Download assets, etc.
     */
    async initialize(): Promise<void> {
        const loader = new FontLoader()
        try {
            this.font = await loader.loadAsync(
                "fonts/CourierPrime-Regular.json"
            )
        } catch (reason) {
            console.error("Failed to load font for THREE.js:", reason)
        }
    }

    /**
     * Set up the scene.
     */
    setUpScene(): void {
        // this.scene.add(new CameraHelper(this.camera))

        const light = new HemisphereLight(0xffffff, 0xe0e0e0, 1.1)
        this.scene.add(light)

        // Reset camera position.
        this.camera.position.set(100, -50, 100)
    }

    drawGraph(nodes: PGVNode[], edges: Edge[], _refPaths?: Path[]): void {
        this.active = true

        this.uiCallbackFn.updateNodes(nodes.length, false)
        this.uiCallbackFn.updateEdges(edges.length, false)
        this.uiCallbackFn.updateStatusBar()

        console.log("drawGraph()")
        console.log(JSON.stringify(nodes, undefined, 4))

        const nodeCoords = this.nodeCoords

        // Draw nodes.
        for (let node of nodes) {
            console.log("drawing node:", node.sequence)

            node.x *= 0.75
            node.width *= 0.75
            node.height *= 1.2

            // Transform the width a bit to fit better with our font.
            let width = node.width + 9 // + 18 - node.width / 3

            const geometry = new BoxGeometry(width, node.height, 4)
            const material = new MeshPhongMaterial({
                color: 0xadd8e6,
                // wireframe: true,
                side: DoubleSide,
            })

            // Create mesh for node.
            const mesh = new Mesh(geometry, material)
            mesh.castShadow = true
            mesh.position.x = node.x + node.width / 2
            mesh.position.y = -node.y

            this.scene.add(mesh)
            nodeCoords.set(node.id.toString(), {
                x: mesh.position.x,
                y: mesh.position.y,
                width: width,
                height: node.height,
            })

            // Draw text.
            const color = new Color(0x006699)

            const textMaterial = new MeshBasicMaterial({
                color: color,
                side: DoubleSide,
            })

            const shapes = this.font!.generateShapes(`${node.sequence}`, 5)
            const textGeometry = new ShapeGeometry(shapes)
            textGeometry.computeBoundingBox()
            // eslint-disable-next-line prettier/prettier
            const xMid = -0.5 * (textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x)
            // eslint-disable-next-line prettier/prettier
            const yMid = -0.5 * (textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y)
            textGeometry.translate(xMid, yMid, 0)

            const text = new Mesh(textGeometry, textMaterial)
            text.position.x = mesh.position.x
            text.position.y = mesh.position.y
            text.position.z = 2
            text.position.z += 0.01
            this.scene.add(text)
        }

        for (let edge of edges) {
            // Let's only work with string IDs.
            edge.from = `${edge.from}`
            edge.to = `${edge.to}`

            if (!this.nodeCoords.has(edge.from) || !nodeCoords.has(edge.to)) {
                // Some nodes were collapsed and so this edge might have been removed.
                console.log(`skipping edge: ${edge.from} -> ${edge.to}`)
                continue
            }

            console.log(`drawing edge: ${edge.from} -> ${edge.to}`)

            const fromCoord = nodeCoords.get(edge.from)!
            let from = edge.from_start
                ? [fromCoord.x - fromCoord.width / 2, fromCoord.y, 0]
                : [fromCoord.x + fromCoord.width / 2, fromCoord.y, 0]
            const toCoord = nodeCoords.get(edge.to)!
            let to = edge.to_end
                ? [toCoord.x + toCoord.width / 2, toCoord.y, 0]
                : [toCoord.x - toCoord.width / 2, toCoord.y, 0]

            // Bezier curve
            let dist = to[0] - from[0]
            let yScale = dist / 7

            if (edge.from_start || edge.to_end) {
                yScale *= 1.4
            }

            // Try to make curve in opposite direction if it's jumping over another node.
            // Doesn't always work but might avoid some overlapping.
            try {
                const offset = parseInt(edge.to) - parseInt(edge.from)
                if (offset > 1) {
                    yScale *= -1
                }
            } catch (err) {
                // never mind.
            }

            const curve = new CubicBezierCurve3(
                new Vector3(...from),
                new Vector3(from[0] + 5, from[1] + 5 + yScale, from[2]),
                new Vector3(to[0] - 5, to[1] + 5 + yScale, to[2]),
                new Vector3(...to)
            )

            const points = curve.getPoints(50)
            const lineGeometry = new BufferGeometry().setFromPoints(points)
            const lineMaterial = new LineBasicMaterial({
                color: 0x0000ff,
                opacity: 1,
            })

            const line = new Line(lineGeometry, lineMaterial)
            this.scene.add(line)
        }
    }

    drawPaths(paths: Path[]): void {
        this.uiCallbackFn.updatePaths(paths.length)

        let counter = 0
        const color = new Color()
        const nodeCoords = this.nodeCoords

        for (let path of paths) {
            const meshes = []
            color.setHSL(counter / paths.length, 0.8, 0.5)

            const mappings = path.mapping
            for (let mapping of mappings) {
                const node = `${mapping.position.node_id}`
                if (!this.nodeCoords.has(node)) {
                    continue
                }

                const coord = nodeCoords.get(node)!

                const geometry = new PlaneGeometry(coord.width, coord.height)
                const material = new MeshLambertMaterial({
                    color: new Color(color.r, color.g, color.b).getHex(),
                    opacity: 0.1,
                    transparent: true,
                })

                // Create mesh for node.
                const mesh = new Mesh(geometry, material)
                mesh.castShadow = true
                mesh.position.x = coord.x
                mesh.position.y = coord.y
                mesh.position.z = 2 + counter / paths.length
                this.scene.add(mesh)
                meshes.push(mesh)
            }

            this.pathNames.push(path.name)
            this.pathMeshes.set(path.name, meshes)
            counter++
        }

        this.setActivePath(0)
    }

    clear(): void {
        this.active = false
        this.activePathIndex = -1
        this.nodeCoords.clear()
        this.pathNames = []
        this.pathMeshes.clear()

        this.uiCallbackFn.updateNodes(undefined, false)
        this.uiCallbackFn.updateEdges(undefined, false)
        this.uiCallbackFn.updatePaths(undefined, false)
        this.uiCallbackFn.updateSelectedPath(undefined, false)
        this.uiCallbackFn.updateStatusBar()

        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0])
        }

        this.setUpScene()
    }

    /**
     * Select a path as the active one. This makes the path less transparent.
     */
    setActivePath(index: number): void {
        if (this.activePathIndex !== -1) {
            // Reset opacity of previous path.
            const prevMeshes = this.pathMeshes.get(
                this.pathNames[this.activePathIndex]
            )!
            for (let mesh of prevMeshes) {
                if (mesh.material instanceof Material) {
                    mesh.material.opacity = 0.1
                }
            }
        }

        // Change opacity of active path.
        this.activePathIndex = index
        const meshes = this.pathMeshes.get(
            this.pathNames[this.activePathIndex]
        )!
        for (let mesh of meshes) {
            if (mesh.material instanceof Material) {
                mesh.material.opacity = 0.5
            }
        }

        this.uiCallbackFn.updateSelectedPath(this.pathNames[index])
    }
}
