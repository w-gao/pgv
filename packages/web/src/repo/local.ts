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

    constructor() {
        this.displayName = "demo [offline]"
        this.supportsUpload = false

        this.descs.push({
            name: "tiny example from vg",
            identifier: "tiny",
        })

        this.graphs.set("tiny", "data/tiny.vg.json")
    }

    connect(): string | null {
        return null
    }

    getGraphDescs(): Promise<GraphDesc[]> {
        return new Promise(resolve => {
            resolve(this.descs)
        })
    }

    downloadGraph(
        identifier: string,
        // config: DownloadGraphConfig
    ): Promise<Graph | null> {
        return (
            new Promise<string>((resolve, reject) => {
                const url = this.graphs.get(identifier)
                if (url === undefined) {
                    return reject()
                }

                resolve(url)
            })

                // fetch from URL
                .then(url => fetch(url))

                // convert to JSON
                .then(url => url.json())

                // parse it
                .then(graph => parseGraph(graph))
        )
    }
}
