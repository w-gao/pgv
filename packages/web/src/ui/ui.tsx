import { signal, Signal } from "@preact/signals-core"
import { render } from "preact"
import { Config, PGV } from ".."
import { GraphDesc } from "../repo"
import { Header, Tracks } from "./components"
import { ApplicationProvider } from "./contexts"
import "./style.css"

function Settings() {
    return <div>settings</div>
}

function Footer() {
    return <div>footer</div>
}

/**
 * The user interface.
 *
 * This _should_ be the only place that interfaces with the DOM.
 */
export class UI {
    private graphsSignal: Signal<GraphDesc[]>
    private tracksSignal: Signal<Element | null>

    // TODO: the UI shouldn't take in the app; instead, the app should register events.
    constructor(root: HTMLElement, app: PGV, config: Config) {
        this.graphsSignal = signal([])
        this.tracksSignal = signal(null)

        render(
            <ApplicationProvider
                state={{
                    app: app,
                    config: config,
                    graphsSignal: this.graphsSignal,
                    tracksSignal: this.tracksSignal,
                }}
            >
                <Header />
                <Tracks />
                <Settings />
                <Footer />
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

    /**
     * Add an HTML element as a new track to the UI.
     */
    addTrack(element: Element): void {
        console.log("adding new track: ", element)
        this.tracksSignal.value = element
    }

    // TODO: event-based system for the UI to interface with the app?
}
