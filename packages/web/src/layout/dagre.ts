import { PGVGraph } from "@pgv/core/src/model/pgv"
import { ILayout } from "."

export class DagreLayout implements ILayout {
    name: string

    constructor() {
        this.name = "dagre"
    }

    apply(g: PGVGraph): void {
        throw new Error("Method not implemented.")
    }
}
