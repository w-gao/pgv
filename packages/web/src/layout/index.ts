import { PGVGraph } from "@pgv/core/src/model/pgv"

/**
 * An interface for the graph layout algorithm.
 */
export interface ILayout {
    name: string

    // Apply layout to the input graph.
    apply(g: PGVGraph): void
}
