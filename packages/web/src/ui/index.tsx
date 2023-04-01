import { signal, Signal } from "@preact/signals-core"
import { render } from "preact"
import { Config } from "../config"
import { PGV } from "../pgv"
import { GraphDesc } from "../repo"
import { Header } from "./components/header"
import { ApplicationProvider } from "./contexts/application"
import "./style.css"

/**
 * The user interface.
 *
 * This _should_ be the only place that interfaces with the DOM.
 */
export class UI {
    private graphsSignal: Signal<GraphDesc[]>

    constructor(root: HTMLElement, app: PGV, config: Config) {
        this.graphsSignal = signal([])

        render(
            <ApplicationProvider
                state={{
                    app: app,
                    config: config,
                    graphsSignal: this.graphsSignal,
                }}
            >
                <Header />
            </ApplicationProvider>,
            root
        )
    }

    /**
     * Update the graphs select box.
     */
    updateGraphs(graphs: GraphDesc[]) {
        this.graphsSignal.value = graphs
    }
}
