import { PGVGraph } from "@pgv/core/src/model/pgv"
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

        this.layout = new TubeMapLayout()
        this.renderer = new ThreeRenderer(root)
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

    render(graph: PGVGraph) {
        this.layout.apply(graph)

        this.renderer.drawGraph(graph.nodes, graph.edges, graph.paths)
    }
}
