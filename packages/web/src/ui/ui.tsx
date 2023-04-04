import { render } from "preact"
import { batch, signal, Signal } from "@preact/signals-core"
import { Config } from "../config"
import { PGV } from "../pgv"
import { GraphDesc } from "../repo"
import { Header, Tracks } from "./components"
import { ApplicationProvider, StatusBarUpdateSignals } from "./contexts"
import "./style.css"

function Settings() {
    return <div>settings</div>
}

function Footer() {
    return <div>footer</div>
}

/**
 * Represents a "track" that can be displayed in the UI.
 */
export interface Track {
    /**
     * Returns the DOM element that is injected into the UI.
     */
    getElement(): Element

    /**
     * An event to update the view triggered by user (UI or keyboard).
     *
     * The track doesn't have to handle this event.
     */
    updateRegion(region: string): void
}

/**
 * The user interface.
 *
 * Use the method calls to update the values on the UI.
 *
 * Register events to handle user input from the UI. (WIP)
 *
 * This _should_ be the only place that interfaces with the DOM.
 */
export class UI {
    private graphsSignal: Signal<GraphDesc[]>
    private statusBarSignals: StatusBarUpdateSignals
    private tracksSignal: Signal<Element | null>

    // TODO: the UI shouldn't take in the app; instead, the app should register events.
    constructor(root: HTMLElement, app: PGV, config: Config) {
        this.graphsSignal = signal([])
        this.statusBarSignals = {
            nodes: signal(undefined),
            edges: signal(undefined),
            paths: signal(undefined),
            region: signal(undefined),
            selectedPath: signal(undefined),
            selectedNode: signal(undefined),
        }

        this.tracksSignal = signal(null)

        render(
            <ApplicationProvider
                state={{
                    app: app,
                    config: config,
                    graphsSignal: this.graphsSignal,
                    statusBarSignals: this.statusBarSignals,
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

    // Header

    /**
     * Update the graphs select box.
     */
    updateGraphs(graphs: GraphDesc[]) {
        this.graphsSignal.value = graphs
    }

    // Header - Status bar

    updateNodes(nodes: number | undefined): void {
        this.statusBarSignals.nodes.value = nodes
    }

    updateEdges(edges: number | undefined): void {
        this.statusBarSignals.edges.value = edges
    }

    updatePaths(paths: number | undefined): void {
        this.statusBarSignals.paths.value = paths
    }

    updateRegion(region: string | undefined): void {
        this.statusBarSignals.region.value = region
    }

    updateSelectedPath(path: [number, string] | undefined): void {
        this.statusBarSignals.selectedPath.value = path
    }

    updateSelectedNode(node: [string, number, number] | undefined): void {
        this.statusBarSignals.selectedNode.value = node
    }

    /**
     * Batch update the status for a slightly better performance.
     *
     * If the field is undefined, it is left unchanges. If the field is null,
     * it is cleared.
     */
    updateBatched({
        nodes,
        edges,
        paths,
        region,
        selectedPath,
        selectedNode,
    }: {
        nodes?: number | null
        edges?: number | null
        paths?: number | null
        region?: string | null
        selectedPath?: [number, string] | null
        selectedNode?: [string, number, number] | null
    }): void {
        batch(() => {
            if (nodes !== undefined) {
                this.updateNodes(nodes ?? undefined)
            }
            if (edges !== undefined) {
                this.updateEdges(edges ?? undefined)
            }
            if (paths !== undefined) {
                this.updatePaths(paths ?? undefined)
            }
            if (region !== undefined) {
                this.updateRegion(region ?? undefined)
            }
            if (selectedPath !== undefined) {
                this.updateSelectedPath(selectedPath ?? undefined)
            }
            if (selectedNode !== undefined) {
                this.updateSelectedNode(selectedNode ?? undefined)
            }
        })
    }

    // Tracks

    /**
     * Add an HTML element as a new track to the UI.
     */
    addTrack(element: Element): void {
        console.log("adding new track: ", element)
        this.tracksSignal.value = element
    }

    // TODO: event-based system for the UI to interface with the app?
}
