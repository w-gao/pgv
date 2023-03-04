import { Graph } from "@pgv/core/src/model/vg"
import { ILayout } from "./layout"
import { TubeMapLayout } from "./layout/tubemap"
import { IRenderer } from "./renderer"
import { ThreeRenderer } from "./renderer/three"
import { IRepo } from "./repo"
import { ExampleDataRepo } from "./repo/local"
import { Header } from "./ui/components"

export type RepoConfig = {
    type: "demo" | "api"
    id: string
    name: string
    config?: any
}

export type Config = {
    repos?: RepoConfig[]
}

function setDefaultOptions(config?: Config): Config {
    if (config === undefined) {
        config = {}
    }

    if (config.repos === undefined) {
        config.repos = []
    }

    return config
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
                    repo = new ExampleDataRepo(repoConfig.name)
            }
            this.repos.set(repoConfig.id, repo)
        }

        // inject UI components
        this.headerUI = new Header(this, root)
        this.headerUI.show()

        this.layout = new TubeMapLayout(root)
        this.renderer = new ThreeRenderer(root)

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

    render(graph: Graph) {
        // Clear whatever we might have.
        this.renderer.clear()

        // Apply the layout.
        const g = this.layout.apply(graph)

        // Render the graph.
        this.renderer.drawGraph(g.nodes, g.edges, undefined)

        // Draw the paths.
        // this.renderer.drawPaths(g.paths)
    }
}
