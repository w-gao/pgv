/* eslint-disable @typescript-eslint/naming-convention */
import { Edge, Graph, Mapping, Node, Path } from "./vg"

export * from "./vg"
export * from "./pgv"

type Edit = {
    from_length: number
    to_length: number
    sequence?: string
}

/**
 * Parse the input into a typed vg graph.
 *
 * @param obj The raw graph object.
 */
export function parseGraph(obj: any): Graph {
    const nodes: Node[] = []
    const edges: Edge[] = []
    const paths: Path[] = []

    const nodesObj = obj["node"]
    const edgesObj = obj["edge"]
    const pathsObj = obj["path"]

    // Nodes
    for (let nodeObj of nodesObj) {
        let node: Node = {
            id: parseInt(nodeObj["id"]),
            sequence: nodeObj["sequence"],
        }

        if (nodeObj["name"] !== undefined) {
            node.name = nodeObj["name"]
        }

        nodes.push(node)
    }

    // Edges
    for (let edgeObj of edgesObj) {
        let edge: Edge = {
            from: parseInt(edgeObj["from"]),
            to: parseInt(edgeObj["to"]),
        }

        if (edgeObj["from_start"] !== undefined) {
            edge.from_start = true
        }

        if (edgeObj["to_end"] !== undefined) {
            edge.to_end = true
        }

        edges.push(edge)
    }

    // Paths
    for (let pathObj of pathsObj) {
        let mappings: Mapping[] = []

        for (let mappingObj of pathObj["mapping"]) {
            let edits = []
            for (let editObj of mappingObj["edit"]) {
                let edit: Edit = {
                    from_length: editObj["from_length"],
                    to_length: editObj["to_length"],
                }

                if (editObj["sequence"] !== undefined) {
                    edit.sequence = editObj["sequence"]
                }

                edits.push(edit)
            }

            let mapping: Mapping = {
                position: {
                    node_id: mappingObj["position"]["node_id"],
                },
                edit: edits,
                rank: mappingObj["rank"],
            }

            mappings.push(mapping)
        }

        let path: Path = {
            name: pathObj["name"],
            mapping: mappings,
        }

        if (pathObj["freq"] !== undefined) {
            path.freq = pathObj["freq"]
        }

        if (pathObj["indexOfFirstBase"] !== undefined) {
            path.freq = pathObj["indexOfFirstBase"]
        }

        paths.push(path)
    }

    return {
        nodes: nodes,
        edges: edges,
        paths: paths,
    }
}
