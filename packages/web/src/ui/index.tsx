import { signal, Signal } from "@preact/signals-core"
import { render } from "preact"
import { Config } from "../config"
import { PGV } from "../pgv"
import { GraphDesc } from "../repo"
import { Header } from "./components/header"
import { ApplicationProvider } from "./contexts/application"
import "./style.css"

/**
 *
 */
export class UI {
    private graphsSignal: Signal<GraphDesc[]>

    constructor(id: string, app: PGV, config: Config) {
        this.graphsSignal = signal([])

        const state = {
            app: app,
            config: config,
            graphsSignal: this.graphsSignal,
        }
        render(
            <ApplicationProvider state={state}>
                <Header />
            </ApplicationProvider>,
            document.getElementById(id) as HTMLElement
        )
    }

    updateGraphs(graphs: GraphDesc[]) {
        this.graphsSignal.value = graphs
    }
}
