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

    return config
}
