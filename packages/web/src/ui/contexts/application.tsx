import { ComponentChildren, createContext } from "preact"
import { useContext } from "preact/hooks"
import { Signal } from "@preact/signals-core"
import { Config, PGV } from "../.."
import { GraphDesc } from "../../repo"

/**
 * Object for a signal to update the status bar.
 *
 * If the property is...
 *  - a value, then the field is updated to the new value
 *  - undefined, then the field is left alone
 *  - null, then the field is cleared
 */
export interface StatusBarUpdate {
    nodes?: number | null
    edges?: number | null
    paths?: number | null
    region?: string | null
    selectedPath?: [number, string] | null
    selectedNode?: [string, number, number] | null
}

export interface AppState {
    app: PGV
    config: Config

    graphsSignal: Signal<GraphDesc[]>
    tracksSignal: Signal<Element | null>

    statusBarSignal: Signal<StatusBarUpdate>
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
