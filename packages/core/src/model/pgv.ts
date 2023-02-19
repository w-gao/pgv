/**
 * Useful models for PGV.
 */

import { Node, Edge, Path } from "./vg"

/**
 * Extension of vg structures to include coordinate info.
 */
export type PGVNode = Node & {
    x: number
    y: number
    width: number
    height: number
}

export type PGVEdge = Edge

export type PGVGraph = {
    nodes: PGVNode[]
    edges: PGVEdge[]
    paths: Path[]
}
