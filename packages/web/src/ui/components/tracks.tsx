import { useRef } from "preact/hooks"
import { effect } from "@preact/signals-core"
import { usePGV } from "../contexts"
import "./tracks.scss"

/**
 * The Tracks component of the UI. Contains a list of user-added HTML elements.
 */
export function Tracks() {
    const ref = useRef<HTMLDivElement>(null)

    // TODO: the tracks signal should support add, reorder, and remove operations.
    //   It should probably also take in JSX components.

    const { tracksSignal } = usePGV()
    effect(() => {
        if (tracksSignal.value && ref.current) {
            ref.current.appendChild(tracksSignal.value)
        }
    })

    return (
        <div class="tracks" ref={ref}>
            {/* Tracks will be populated here. */}
        </div>
    )
}
