import { PGVNode, Edge, Path } from "@pgv/core/src/model"
import { IRenderer } from "."

export class ThreeRenderer implements IRenderer {
    drawGraph(nodes: PGVNode[], edges: Edge[], refPaths: Path[]): void {
        throw new Error("Method not implemented.")
    }

    drawPaths(p: Path[]): void {
        throw new Error("Method not implemented.")
    }
}
