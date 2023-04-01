import { ComponentChildren, createContext } from "preact"
import { useContext } from "preact/hooks"
import { Signal } from "@preact/signals-core"
import { PGV } from "../../pgv"
import { Config } from "../../config"
import { GraphDesc } from "../../repo"

interface AppState {
    app: PGV
    config: Config

    graphsSignal: Signal<GraphDesc[]>
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
