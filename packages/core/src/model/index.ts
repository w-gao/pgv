import { Edge, Graph, Node, Path } from "./vg"

export * from "./vg"
export * from "./pgv"

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
            edge.fromStart = true
        }
        if (edgeObj["to_end"] !== undefined) {
            edge.toEnd = true
        }

        edges.push(edge)
    }

    // Paths
    for (let pathObj of pathsObj) {
        console.log(pathObj)
    }

    return {
        nodes: nodes,
        edges: edges,
        paths: paths,
    }
}
