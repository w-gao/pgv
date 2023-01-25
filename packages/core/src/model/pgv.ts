/**
 * Useful models for PGV.
 */

import { Node, Edge, Path } from "./vg"

type Position = {
    x: number
    y: number
}

/**
 * Extension of vg structures to include coordinate info.
 */
export type PGVNode = Node & { position: Position; length: number }
export type PGVEdge = Edge

export type PGVGraph = {
    node: PGVNode[]
    edge: PGVEdge[]
    path: Path[]
}
