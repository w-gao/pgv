import { Graph } from "@pgv/core/src/model/vg"
import { parseGraph } from "@pgv/core/src/model"
import { IRepo, GraphDesc } from "."

/**
 * A local, static repo that stores some small, synthetic examples.
 */
export class ExampleDataRepo implements IRepo {
    displayName: string
    supportsUpload: boolean

    private descs: Map<string, GraphDesc> = new Map()
    private graphs: Map<string, string> = new Map()

    private readonly baseUrl: string

    constructor(name: string, config: any) {
        this.displayName = name
        this.supportsUpload = false

        this.baseUrl = config && config["baseUrl"] ? config["baseUrl"] : "data"
    }

    async connect(): Promise<string | null> {
        const data = await fetch(`${this.baseUrl}/sources.json`)
        const json = await data.json()

        for (let graph of json) {
            const identifier = graph["identifier"]
            const name = graph["name"]
            const jsonFile = graph["jsonFile"]
            const region = graph["region"]

            this.descs.set(identifier, {
                identifier: identifier,
                name: name,
                region: region,
            })
            this.graphs.set(
                identifier,
                `${this.baseUrl}/${identifier}/${jsonFile}`
            )
        }

        return "local"
    }

    async getGraphDescs(): Promise<GraphDesc[]> {
        return Array.from(this.descs.values())
    }

    async getGraphDesc(identifier: string): Promise<GraphDesc | undefined> {
        return this.descs.get(identifier)
    }

    async downloadGraph(
        identifier: string
        // config: DownloadGraphConfig
    ): Promise<Graph | null> {
        const url = this.graphs.get(identifier)

        if (url === undefined) {
            return Promise.reject()
        }

        // fetch from URL
        let data = await fetch(url)

        // convert to JSON
        let obj = await data.json()

        return parseGraph(obj)
    }
}
