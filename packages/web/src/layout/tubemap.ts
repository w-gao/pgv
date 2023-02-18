import { PGVGraph } from "@pgv/core/src/model/pgv"
import { ILayout } from "."
import { create, createLayout } from "../lib/tubemap"

/**
 * Use sequence-tube-map as the underlying layout structure.
 */
export class TubeMapLayout implements ILayout {
    name: string

    constructor() {
        this.name = "tubemap"

        // TODO: this is just for debugging.
        const layout = createLayout({
            svgID: "#tubeMapSVG",
            hideLegend: true,
            nodes: [
                { name: "A", width: 1, seq: "A" },
                { name: "B", width: 2, seq: "AA" },
                { name: "C", width: 1, seq: "T" },
                { name: "D", width: 3, seq: "GGG" },
                { name: "E", width: 1, seq: "A" },
                { name: "F", width: 1, seq: "G" },
                { name: "G", width: 3, seq: "ATG" },
                { name: "H", width: 1, seq: "T" },
                { name: "I", width: 1, seq: "C" },
                { name: "J", width: 3, seq: "TAA" },
                { name: "K", width: 1, seq: "C" },
                { name: "L", width: 1, seq: "G" },
                { name: "M", width: 1, seq: "C" },
                { name: "N", width: 1, seq: "A" },
                { name: "O", width: 1, seq: "C" },
                { name: "P", width: 2, seq: "AA" },
                { name: "Q", width: 1, seq: "T" },
                { name: "R", width: 3, seq: "CG" },
                { name: "S", width: 2, seq: "GA" },
                { name: "T", width: 3, seq: "GTT" },
                { name: "U", width: 1, seq: "A" },
                { name: "V", width: 1, seq: "G" },
                { name: "W", width: 8, seq: "TTGTCTCT" },
                { name: "X", width: 1, seq: "T" },
                { name: "Y", width: 1, seq: "C" },
                { name: "Z", width: 1, seq: "A" },
                { name: "AA", width: 3, seq: "CGA" },
                { name: "AB", width: 1, seq: "T" },
                { name: "AC", width: 1, seq: "G" },
                { name: "AD", width: 1, seq: "A" },
                { name: "AE", width: 1, seq: "G" },
                { name: "AF", width: 1, seq: "T" },
                { name: "AG", width: 3, seq: "GTG" },
            ],
            tracks: [
                { id: 0, name: 'Track A', indexOfFirstBase: 1, sequence: ['A', 'B', 'D', 'E', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'S', 'U', 'W', 'X', 'Z', 'AA', 'AE', 'AG'], freq: 3000 },
                { id: 1, name: 'Track B', sequence: ['A', 'B', 'D', 'E', 'G', 'H', 'J', 'K', 'M', 'N', 'Q', 'S', 'U', 'AA', 'AE', 'AG'], freq: 15 },
                { id: 2, name: 'Track C', sequence: ['A', 'B', 'D', 'E', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'S', 'V', 'W', 'X', 'Z', 'AB', 'AE', 'AG'], freq: 300 },
                { id: 3, name: 'Track D', sequence: ['B', 'C', 'D', 'E', 'G', 'H', 'J', 'L', 'M', 'N', 'P', 'R', 'S', 'U', 'W', 'Y', 'Z', 'AC', 'AF', 'AG'], freq: 4 },
                { id: 4, name: 'Track E', sequence: ['B', 'D', 'F', 'G', 'I', 'J', 'L', 'M', 'O', 'P', 'Q', 'S', 'T', 'V', 'W', 'Y', 'Z', 'AD', 'AF', 'AG'], freq: 2 },
            ],

            // nodes: [
            //     { name: "5", seq: "C" },
            //     { name: "16", seq: "G" },
            //     { name: "20", seq: "TGCTATGTGTAACTAGTAATGGTAATGGATAT" },
            //     { name: "35", seq: "A" },
            //     { name: "55", seq: "T" },
            //     { name: "30", seq: "ACGTTTGACAATCTATCAC" },
            //     { name: "19", seq: "T" },
            //     { name: "32", seq: "T" },
            //     { name: "49", seq: "A" },
            //     { name: "6", seq: "TTG" },
            //     { name: "45", seq: "C" },
            //     { name: "44", seq: "ACAAATCTGGGT" },
            //     { name: "9", seq: "AAATTTTCTGGAGTTCTAT" },
            //     { name: "31", seq: "C" },
            //     { name: "29", seq: "G" },
            //     { name: "46", seq: "T" },
            //     { name: "4", seq: "T" },
            //     { name: "13", seq: "A" },
            //     { name: "21", seq: "GTTGGGCTT" },
            //     { name: "54", seq: "G" },
            //     { name: "38", seq: "AAGAT" },
            //     { name: "52", seq: "A" },
            //     { name: "12", seq: "ATAT" },
            //     { name: "24", seq: "TT" },
            //     { name: "28", seq: "A" },
            //     { name: "8", seq: "G" },
            //     { name: "17", seq: "T" },
            //     { name: "37", seq: "A" },
            //     { name: "1", seq: "CAAATAAG" },
            //     { name: "23", seq: "T" },
            //     { name: "22", seq: "C" },
            //     { name: "47", seq: "CAA" },
            //     { name: "41", seq: "TGGAGCCA" },
            //     { name: "43", seq: "G" },
            //     { name: "11", seq: "T" },
            //     { name: "36", seq: "TGGAAAGAATAC" },
            //     { name: "53", seq: "CA" },
            //     { name: "14", seq: "T" },
            //     { name: "3", seq: "G" },
            //     { name: "39", seq: "C" },
            //     { name: "51", seq: "G" },
            //     { name: "7", seq: "A" },
            //     { name: "25", seq: "C" },
            //     { name: "33", seq: "AGGGGTAATGTGGGGAA" },
            //     { name: "40", seq: "T" },
            //     { name: "48", seq: "G" },
            //     { name: "34", seq: "G" },
            //     { name: "50", seq: "TCCTCACTTTGCC" },
            //     { name: "15", seq: "CCAACTCTCTGG" },
            //     { name: "2", seq: "A" },
            //     { name: "10", seq: "A" },
            //     { name: "18", seq: "TCCTGG" },
            //     { name: "26", seq: "T" },
            //     { name: "27", seq: "CTTTGATTTATTTGAAGT" },
            //     { name: "42", seq: "T" },
            // ],
            // tracks: [
            //     { sequence: ["1", "2", "3", "4"], name: "thread_0", freq: "1" },
            //     { sequence: ["1", "2", "5", "4"], name: "thread_1", freq: "1" },
            //     { sequence: ["1", "2", "4"], name: "thread_1", freq: "1" },
            //     // { mapping: [Array], name: "thread_1", freq: "1" },
            //     // {
            //     //     mapping: [Array],
            //     //     name: "x",
            //     //     freq: "1",
            //     //     indexOfFirstBase: "0",
            //     // },
            // ],
            // region: [],
        })

        console.log("layout")
        console.log(layout)
    }

    apply(g: PGVGraph): void {
        throw new Error("Method not implemented.")
    }
}
