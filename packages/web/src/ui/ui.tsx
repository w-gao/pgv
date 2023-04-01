import { signal, Signal } from "@preact/signals-core"
import { render } from "preact"
import { Config, PGV } from ".."
import { GraphDesc } from "../repo"
import { Header } from "./components"
import { ApplicationProvider } from "./contexts"
import "./style.css"

/**
 * The user interface.
 *
 * This _should_ be the only place that interfaces with the DOM.
 */
export class UI {
    private graphsSignal: Signal<GraphDesc[]>

    // TODO: the UI shouldn't take in the app; instead, the app should register events.
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

    // TODO: event-based system for the UI to interface with the app?
}
