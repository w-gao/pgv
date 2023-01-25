import { PGVGraph } from "@pgv/core/model/pgv"
import { Path } from "@pgv/core/model/vg"

/**
 * An interface for the renderer.
 */
export interface IRenderer {
    drawGraph(g: PGVGraph): void
    drawPath(p: Path): void
}
