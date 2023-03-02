import { PGVEdge, PGVNode } from "@pgv/core/src/model/pgv"
import { Path } from "@pgv/core/src/model/vg"

/**
 * An interface for the renderer.
 */
export interface IRenderer {
    /**
     * Draw a graph.
     *
     * @param nodes The nodes of the graph.
     * @param edges The edges of the graph.
     * @param refPaths If applicable, a collection of starting paths that
     *                 can be used to influence the graph layout. The
     *                 paths should not be drawn.
     */
    drawGraph(nodes: PGVNode[], edges: PGVEdge[], refPaths?: Path[]): void

    drawPaths(p: Path[]): void

    /**
     * Clear all rendered graphs.
     */
    clear(): void
}
