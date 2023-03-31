import { render } from "preact"
import "./style.css"

function App() {
    return (
        <>
            <div>A</div>
            <div>B</div>
        </>
    )
}

/**
 * Render app under the given ID.
 */
export function renderApp(id?: string): void {
    render(<App />, document.getElementById(id || "app") as HTMLElement)
}
