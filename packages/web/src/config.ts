export type RepoConfig = {
    type: "demo" | "api"
    id: string
    name: string
    config?: any
}

export type Config = {
    /**
     * Enable debug logging, etc.
     */
    debug?: boolean

    /**
     * List of repository configurations.
     */
    repos?: RepoConfig[]

    /**
     * The layout engine.
     */
    layout?: "tubemap"

    /**
     * The renderer.
     */
    renderer?: "three"
}

export function setDefaultOptions(config?: Config): Config {
    if (config === undefined) {
        config = {}
    }

    if (config.debug === undefined) {
        config.debug = false
    }

    if (config.repos === undefined) {
        config.repos = []
    }

    if (config.layout === undefined) {
        config.layout = "tubemap"
    }

    if (config.renderer === undefined) {
        config.renderer = "three"
    }

    return config
}
