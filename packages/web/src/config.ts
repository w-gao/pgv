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
    debug: boolean

    /**
     * Whether the app is embedded in another webpage or not. Set to true to
     * hide components like the footer.
     */
    embedded: boolean

    /**
     * List of repository configurations.
     */
    repos: RepoConfig[]

    /**
     * The layout engine.
     */
    layout: "tubemap"

    /**
     * The renderer.
     */
    renderer: "three"
}

export function setDefaultOptions(config?: Partial<Config>): Config {
    if (config === undefined) {
        config = {}
    }

    if (config.debug === undefined) {
        config.debug = false
    }

    if (config.embedded === undefined) {
        config.embedded = false
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

    return config as Config
}
