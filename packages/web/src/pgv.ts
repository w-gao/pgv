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
    private readonly _config: Config

    /**
     * A list of available data sources.
     */
    private readonly _repos: Map<string, IRepo>

    /**
     * The currently active repo.
     */
    private _currentRepo?: IRepo

    public get currentRepo() {
        return this._currentRepo
    }

    private readonly _ui: UI
    private readonly _layout: ILayout
    private readonly _renderer: IRenderer

    constructor(root: HTMLElement, config?: Partial<Config>) {
        this._config = setDefaultOptions(config)

        this._repos = new Map()
        for (let repoConfig of this._config.repos) {
            let repo
            switch (repoConfig.type) {
                case "demo":
                default:
                    repo = new ExampleDataRepo(
                        repoConfig.name,
                        repoConfig.config
                    )
            }
            this._repos.set(repoConfig.id, repo)
        }

        // The UI: preact-based component system.
        this._ui = new UI(root, this, this._config)

        // For now, config.layout === "tubemap" and config.renderer === "three".
        this._layout = new TubeMapLayout(this._ui)
        this._renderer = new ThreeRenderer(this._ui)

        // TODO: we ought to show spinner and hide UI when this is loading, but this is fairly quick at the moment.
        if (this._renderer instanceof ThreeRenderer) {
            this._renderer.initialize().then(() => {
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
        if (this._currentRepo !== undefined) {
            this._layout.reset()
            this._renderer.clear()
            // this.currentRepo.disconnect()
        }

        let repo = this._repos.get(key)
        if (!repo) {
            return Promise.reject("weird... repo is gone")
        }

        await repo.connect()
        this._currentRepo = repo
        return repo
    }

    render(desc: GraphDesc, graph: Graph) {
        // Clear whatever we might have.
        this._renderer.clear()

        // Show the selected region on the UI.
        this._ui.updateRegion(desc.region)

        // Apply the layout.
        const g = this._layout.apply(graph)

        // Render the graph.
        this._renderer.drawGraph(g.nodes, g.edges, undefined)

        // Draw the paths.
        this._renderer.drawPaths(g.paths)
    }
}
