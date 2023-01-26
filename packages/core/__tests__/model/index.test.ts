import { it, expect, describe } from "vitest"
import { parseGraph } from "../../src/model/index"
import * as tinyJson from "./tiny.vg.json"

describe("parseGraph", () => {
    it("should parse nodes for tiny.vg", () => {
        const graph = parseGraph(tinyJson)
        expect(graph.nodes).toEqual([
            { id: 5, sequence: "C" },
            { id: 7, sequence: "A" },
            { id: 12, sequence: "ATAT" },
            { id: 8, sequence: "G" },
            { id: 1, sequence: "CAAATAAG" },
            { id: 4, sequence: "T" },
            { id: 6, sequence: "TTG" },
            { id: 15, sequence: "CCAACTCTCTG" },
            { id: 2, sequence: "A" },
            { id: 10, sequence: "A" },
            { id: 9, sequence: "AAATTTTCTGGAGTTCTAT" },
            { id: 11, sequence: "T" },
            { id: 13, sequence: "A" },
            { id: 14, sequence: "T" },
            { id: 3, sequence: "G" },
        ])
    })

    it("should parse edges for tiny.vg", () => {
        const graph = parseGraph(tinyJson)
        expect(graph.edges).toEqual([
            { from: 5, to: 6 },
            { from: 7, to: 9 },
            { from: 12, to: 13 },
            { from: 12, to: 14 },
            { from: 8, to: 9 },
            { from: 1, to: 2 },
            { from: 1, to: 3 },
            { from: 4, to: 6 },
            { from: 6, to: 7 },
            { from: 6, to: 8 },
            { from: 2, to: 4 },
            { from: 2, to: 5 },
            { from: 10, to: 12 },
            { from: 9, to: 10 },
            { from: 9, to: 11 },
            { from: 11, to: 12 },
            { from: 13, to: 15 },
            { from: 14, to: 15 },
            { from: 3, to: 4 },
            { from: 3, to: 5 },
        ])
    })
})
