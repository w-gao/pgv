import { Graph } from "@pgv/core/src/model/vg"
import { parseGraph } from "@pgv/core/src/model"
import { IRepo, GraphDesc } from "."

/**
 * A local repo that stores some small, synthetic examples.
 */
export class ExampleDataRepo implements IRepo {
    displayName: string
    supportsUpload: boolean

    private descs: GraphDesc[] = []
    private graphs: Map<string, string> = new Map()

    constructor(displayName: string) {
        this.displayName = displayName
        this.supportsUpload = false

        this.descs.push({
            name: "tiny example from vg",
            identifier: "tiny",
        })

        this.graphs.set("tiny", "data/tiny.vg.json")
    }

    async connect(): Promise<string | null> {
        return "local"
    }

    async getGraphDescs(): Promise<GraphDesc[]> {
        return this.descs
    }

    async downloadGraph(
        identifier: string,
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
