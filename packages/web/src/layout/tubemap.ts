import { Graph } from "@pgv/core/src/model/vg"
import { PGVGraph, PGVNode } from "@pgv/core/src/model"
import { ILayout } from "."
import { createLayout, vgExtractNodes, vgExtractTracks } from "../lib/tubemap"

/**
 * Use sequence-tube-map as the underlying layout structure.
 */
export class TubeMapLayout implements ILayout {
    name: string

    constructor(parent: HTMLElement) {
        this.name = "tubemap"

        const svgElement = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        )
        svgElement.id = "tubeMapSVG"
        svgElement.setAttribute("style", "width: 100%; max-width: 2000px")
        parent.appendChild(svgElement)
    }

    apply(g: Graph): PGVGraph {
        // Slight diff in semantics between tubemap and pgv, but the format should be the same.
        // @ts-ignore
        g.node = g.nodes
        // @ts-ignore
        g.path = g.paths

        const nodes = vgExtractNodes(g)
        const tracks = vgExtractTracks(g)

        // We're not quite ready for rendering reads yet.
        // const gam = []
        // const reads = vgExtractReads(nodes, tracks, gam)

        const layout = createLayout({
            svgID: "#tubeMapSVG",
            nodes: nodes,
            tracks: tracks,
            region: [],
        })!

        const pgvNodes: PGVNode[] = []

        for (let node of layout) {
            pgvNodes.push({
                id: node.id,
                sequence: node.seq,
                x: node.x,
                y: node.y,
                width: node.width,
                height: node.height,
            })
        }

        return {
            nodes: pgvNodes,
            edges: g.edges,
            paths: g.paths,
        }
    }

    reset(): void {
        const element = document.getElementById("tubeMapSVG")
        if (element) {
            element.innerHTML = ""
        }
    }
}
