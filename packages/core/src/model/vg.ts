/* eslint-disable @typescript-eslint/naming-convention */

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
export type NodeId = number | string

// Represents a node that stores a sequence.
export type Node = {
    id: NodeId
    name?: string
    sequence: string
}

// Represents an edge connecting two nodes.
export type Edge = {
    from: NodeId
    to: NodeId

    // two flags to store the orientation of the edge.
    from_start?: boolean
    to_end?: boolean

    overlap?: number
}

// Represents a mapping in a path.
export type Mapping = {
    position: {
        node_id: NodeId
        offset?: number
        is_reverse?: boolean
    }

    // A collection of edits.
    edit: {
        from_length: number
        to_length: number
        sequence?: string
    }[]

    rank: number | string
}

export type Path = {
    name: string
    mapping: Mapping[]
    freq?: number
    indexOfFirstBase?: number
}

export type Graph = {
    nodes: Node[]
    edges: Edge[]
    paths: Path[]
}

export type Read = {
    sequence: string
    path: Path
    score: number
    identity: number
}
