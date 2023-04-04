import { ComponentChildren, createContext } from "preact"
import { useContext } from "preact/hooks"
import { Signal } from "@preact/signals-core"
import { Config } from "../../config"
import { PGV } from "../../pgv"
import { GraphDesc } from "../../repo"
import { UI } from "../ui"

/**
 * Signals to update the status bar.
 *
 * If the property is...
 *  - a value, then the field is updated to the new value
 *  - undefined, then the field is cleared
 */
export interface StatusBarUpdateSignals {
    nodes: Signal<number | undefined>
    edges: Signal<number | undefined>
    paths: Signal<number | undefined>
    region: Signal<string | undefined>
    selectedPath: Signal<[number, string] | undefined>
    selectedNode: Signal<[string, number, number] | undefined>
}

export interface AppState {
    app: PGV
    ui: UI
    config: Config

    // Headers
    graphsSignal: Signal<GraphDesc[]>
    statusBarSignals: StatusBarUpdateSignals

    // Tracks
    tracksSignal: Signal<Element | null>
}

const ApplicationContext = createContext<AppState>({} as AppState)

export function ApplicationProvider({
    children,
    state,
}: {
    children: ComponentChildren
    state: AppState
}) {
    return (
        <ApplicationContext.Provider value={state}>
            {children}
        </ApplicationContext.Provider>
    )
}

export function usePGV() {
    return useContext(ApplicationContext)
}
