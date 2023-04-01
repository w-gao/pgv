import { Graph } from "@pgv/core/src/model/vg"
import { Config, setDefaultOptions } from "./config"
import { ILayout } from "./layout"
import { TubeMapLayout } from "./layout/tubemap"
import { IRenderer } from "./renderer"
import { ThreeRenderer } from "./renderer/three"
import { GraphDesc, IRepo } from "./repo"
import { ExampleDataRepo } from "./repo/local"
import { UI } from "./ui"
import { Header } from "./ui/components"

/**
 * Functional interface for UI callbacks.
 *
 * @deprecated
 */
export interface UICallbacksFn {
    // Status bar related.
    updateNodes(nodes: number | undefined, silent?: boolean): void
    updateEdges(edges: number | undefined, silent?: boolean): void
    updatePaths(paths: number | undefined, silent?: boolean): void
    updateSelectedPath(
        // [index, name]
        path: [number, string] | undefined,
        silent?: boolean
    ): void
    updateRegion(region: string | undefined, silent?: boolean): void

    updateSelectedNode(
        // [nodeID, seqLen, numPaths]
        node: [string, number, number] | undefined,
        silent?: boolean
    ): void

    // Force update.
    updateStatusBar(): void
}

/**
 * Represents an instance of the PGV app.
 */
export class PGV {
    readonly config: Config

    /**
     * A list of available data sources.
     */
    private readonly repos: Map<string, IRepo>

    /**
     * The currently active repo.
     */
    currentRepo?: IRepo

    readonly headerUI: Header

    ui: UI
    layout: ILayout
    renderer: IRenderer

    constructor(root: HTMLElement, config?: Config) {
        // process config
        config = setDefaultOptions(config)
        this.config = config

        this.repos = new Map()
        for (let repoConfig of this.config.repos || []) {
            let repo
            switch (repoConfig.type) {
                case "demo":
                default:
                    repo = new ExampleDataRepo(
                        repoConfig.name,
                        repoConfig.config
                    )
            }
            this.repos.set(repoConfig.id, repo)
        }

        // WIP: use the preact-based component system for the new UI.
        this.ui = new UI(root, this, config)

        // inject UI components
        this.headerUI = new Header(this, root)
        this.headerUI.show()

        this.layout = new TubeMapLayout(root)
        this.renderer = new ThreeRenderer(root, this.headerUI as UICallbacksFn)

        // TODO: we ought show spinner and hide UI when this is loading, but this is fairly quick at the moment.
        if (this.renderer instanceof ThreeRenderer) {
            this.renderer.initialize().then(() => {
                console.log("renderer loaded")
            })
        }
    }

    /**
     * Switch the current repo.
     *
     * @param key The string identifier of the repo.
     */
    async switchRepo(key: string): Promise<IRepo> {
        if (this.currentRepo !== undefined) {
            this.layout.reset()
            this.renderer.clear()
            // this.currentRepo.disconnect()
        }

        let repo = this.repos.get(key)
        if (!repo) {
            return Promise.reject("weird... repo is gone")
        }

        await repo.connect()
        this.currentRepo = repo
        return repo
    }

    render(desc: GraphDesc, graph: Graph) {
        // Clear whatever we might have.
        this.renderer.clear()

        this.headerUI.updateRegion(desc.region)

        // Apply the layout.
        const g = this.layout.apply(graph)

        // Render the graph.
        this.renderer.drawGraph(g.nodes, g.edges, undefined)

        // Draw the paths.
        this.renderer.drawPaths(g.paths)
    }
}
