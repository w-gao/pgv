import { PGVNode, Edge, Path } from "@pgv/core/src/model"
import { IRenderer } from "."
import {
    Scene,
    WebGLRenderer,
    PerspectiveCamera,
    ShapeGeometry,
    MeshBasicMaterial,
    Mesh,
    Color,
    PlaneGeometry,
    DoubleSide,
    ShadowMaterial,
    Line,
    LineBasicMaterial,
    BufferGeometry,
    Vector3,
    CubicBezierCurve3,
    BoxGeometry,
    AmbientLight,
    SpotLight,
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
        this.scene.background = new Color(0xffffff)

        this.camera = new PerspectiveCamera(75, width / height, 1, 10000)
        this.camera.position.set(100, -50, 100)

        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(width, height)
        this.renderer.shadowMap.enabled = true

        const controls = new FlyControls(this.camera, this.renderer.domElement)
        controls.movementSpeed = 100
        controls.rollSpeed = Math.PI / 24
        controls.autoForward = false
        controls.dragToLook = true

        this.element = this.renderer.domElement
        this.element.setAttribute("class", "renderCanvas")

        // Add canvas element to parent.
        parent.appendChild(this.element)

        // Set up scene.
        this.setUpScene()

        // Set up render loop.
        const render = () => {
            this.renderer.render(this.scene, this.camera)
        }

        // Request animation frame from the browser - the browser twlls us when
        // we get to render.
        const animate = () => {
            requestAnimationFrame(animate)

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
        this.scene.add(new AmbientLight(0xf0f0f0))

        const light = new SpotLight(0xffffff, 1.5)
        light.position.set(0, 1500, 200)
        light.angle = Math.PI * 0.2
        light.castShadow = true
        light.shadow.camera.near = 200
        light.shadow.camera.far = 2000
        light.shadow.bias = -0.000222
        light.shadow.mapSize.width = 1024 * 3
        light.shadow.mapSize.height = 1024 * 3
        this.scene.add(light)

        const planeGeometry = new PlaneGeometry(10000, 200)
        planeGeometry.rotateX(-Math.PI / 2)

        // Shadow plane.
        const shadowMaterial = new ShadowMaterial({
            color: 0x0000e2,
            opacity: 0.2,
        })

        const shadowPlane = new Mesh(planeGeometry, shadowMaterial)
        shadowPlane.position.y = -200
        shadowPlane.receiveShadow = true
        this.scene.add(shadowPlane)

        // Ground.
        // const groundGeometry = new BoxGeometry(10000, 200, 4)
        // const groundMaterial = new MeshBasicMaterial({
        //     color: 0xffcccb,
        // })
        // const ground = new Mesh(groundGeometry, groundMaterial)
        // ground.position.y = -200
        // ground.receiveShadow = true
        // this.scene.add(ground)

        // Grid helper
        // const helper = new GridHelper(2000, 100)
        // helper.position.y = -199
        // if (helper.material instanceof Material) {
        //     helper.material.opacity = 0.25
        //     helper.material.transparent = true
        // }
        // this.scene.add(helper)
    }

    drawGraph(nodes: PGVNode[], edges: Edge[], refPaths?: Path[]): void {
        console.log("drawGraph()")
        console.log(JSON.stringify(nodes, undefined, 4))

        const nodeStarts = new Map()
        const nodeEnds = new Map()

        // Draw nodes.
        for (let node of nodes) {
            console.log("drawing node:", node.sequence)

            // Transform the width a bit to fit better with our font.
            const width = node.width + 18 - node.width / 3

            const geometry = new BoxGeometry(width, node.height, 4)
            const material = new MeshBasicMaterial({
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

            nodeStarts.set(node.id.toString(), [
                mesh.position.x - width / 2,
                mesh.position.y,
                0,
            ])
            nodeEnds.set(node.id.toString(), [
                mesh.position.x + width / 2,
                mesh.position.y,
                0,
            ])

            // Draw text.
            const color = new Color(0x006699)

            const textMaterial = new MeshBasicMaterial({
                color: color,
                side: DoubleSide,
            })

            const shapes = this.font!.generateShapes(
                `${node.id}:${node.sequence}`,
                5
            )
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

            if (!nodeStarts.has(edge.from) || !nodeStarts.has(edge.to)) {
                // Some nodes were collapsed and so this edge might have been removed.
                console.log(`skipping edge: ${edge.from} -> ${edge.to}`)
                continue
            }

            console.log(`drawing edge: ${edge.from} -> ${edge.to}`)

            let from = edge.from_start
                ? nodeStarts.get(edge.from)
                : nodeEnds.get(edge.from)
            let to = edge.to_end
                ? nodeEnds.get(edge.to)
                : nodeStarts.get(edge.to)

            // Basic line
            // const lineGeometry = new BufferGeometry().setFromPoints([
            //     new Vector3(...from),
            //     new Vector3(...to),
            // ])

            // const lineMaterial = new LineBasicMaterial({
            //     color: 0x0000ff,
            //     opacity: 1,
            // })

            // Bezier curve
            let dist = to[0] - from[0]
            let yScale = dist / 7

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

            // Fat lines (doesn't work yet)
            // const lineGeometry = new LineGeometry()
            // lineGeometry.setPositions([...from, ...to])
            // lineGeometry.setColors([0, 0, 0, 0, 0, 0])

            // const lineMaterial = new LineMaterial({
            //     color: 0xffffff,
            //     linewidth: 0.05,
            //     vertexColors: true,
            //     dashed: true,
            //     alphaToCoverage: true,
            // })

            const line = new Line(lineGeometry, lineMaterial)
            // line.computeLineDistances()
            // line.scale.set(1, 1, 1)
            this.scene.add(line)
        }
    }

    drawPaths(p: Path[]): void {
        throw new Error("Method not implemented.")
    }

    clear(): void {
        while (this.scene.children.length > 0) {
            this.scene.remove(this.scene.children[0])
        }

        this.setUpScene()
    }
}
