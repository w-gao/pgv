/**
 * Variation graph (vg) toolkit data structures.
 *
 * See: https://github.com/vgteam/libvgio/blob/master/deps/vg.proto
 */

/**
 * The unique ID of a node. This should be an int64 in vg, but becomes a string
 * in the JSON output. For our purpose, the type doesn't matter as long as it's
 * unique.
 */
type NodeId = number | string

// Represents a node that stores a sequence.
type Node = {
    id: NodeId
    name?: string
    sequence: string
}

// Represents an edge connecting two nodes.
type Edge = {
    from: NodeId
    to: NodeId

    // two flags to store the orientation of the edge.
    fromStart?: boolean
    toEnd?: boolean

    overlap?: number
}

// Represents a mapping in a path.
type Mapping = {
    position: {
        nodeId: NodeId
        offset?: number
        isReverse?: boolean
    }

    // A collection of edits.
    edit: {
        fromLength: number
        toLength: number
        sequence?: string
    }[]

    rank: number | string
}

type Path = {
    name: string
    mapping: Mapping[]
    freq?: number
    indexOfFirstBase?: number
}

type Graph = {
    nodes: Node[]
    edges: Edge[]
    paths: Path[]
}

type Read = {
    sequence: string
    path: Path
    score: number
    identity: number
}

export { NodeId, Node, Edge, Mapping, Path, Graph, Read }
