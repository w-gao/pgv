import { Graph } from "@pgv/core/src/model/vg"
import { Config, setDefaultOptions } from "./config"
import { ILayout, TubeMapLayout } from "./layout"
import { IRenderer, ThreeRenderer } from "./renderer"
import { GraphDesc, IRepo, ExampleDataRepo } from "./repo"
import { UI } from "./ui"

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

    readonly ui: UI
    readonly layout: ILayout
    readonly renderer: IRenderer

    constructor(root: HTMLElement, config?: Partial<Config>) {
        this.config = setDefaultOptions(config)

        this.repos = new Map()
        for (let repoConfig of this.config.repos) {
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

        // The UI: preact-based component system.
        this.ui = new UI(root, this, this.config)

        // For now, config.layout === "tubemap" and config.renderer === "three".
        this.layout = new TubeMapLayout(this.ui)
        this.renderer = new ThreeRenderer(this.ui)

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

        this.ui.updateRegion(desc.region)

        // Apply the layout.
        const g = this.layout.apply(graph)

        // Render the graph.
        this.renderer.drawGraph(g.nodes, g.edges, undefined)

        // Draw the paths.
        this.renderer.drawPaths(g.paths)
    }
}
