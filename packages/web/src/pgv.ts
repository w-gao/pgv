import { Header } from "./ui/components";

export type Config = {}

function setDefaultOptions(config?: Config): Config {
    if (config === undefined) {
        config = {}
    }

    return config
}

/**
 * Represents an instance of the PGV app.
 */
export class PGV {
    private readonly config: Config

    constructor(root: HTMLElement, config?: Config) {
        config = setDefaultOptions(config)

        this.config = config

        const header = new Header(root)
        header.show()
    }
}
