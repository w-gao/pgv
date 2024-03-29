import { useRef, useEffect } from "preact/hooks"
import { ComponentChildren } from "preact"
import "./elements.scss"

// This file contains all the reusable UI elements of PGV.

/**
 * select box component.
 */
export function FormSelect(props: {
    id: string
    text: string
    options: { id: string; name: string }[]
    defaultEmpty?: boolean
    onSelect?: (id: string) => void
}) {
    const { id, text, options, defaultEmpty, onSelect } = props
    const selectRef = useRef<HTMLSelectElement>(null)

    // When "options" change, reset selection.
    useEffect(() => {
        if (selectRef.current) {
            selectRef.current.selectedIndex = 0
        }
    }, [options])

    // When user selects an option, invoke the callback.
    const onChange = () => {
        const select = selectRef.current
        if (select === null) {
            console.warn("ref to <select> is gone")
            return
        }

        if (onSelect) {
            let id = select.options[select.selectedIndex].value
            onSelect(id)
        } else {
            console.log(
                "detected change to <select> but no listener is defined"
            )
        }
    }

    // If we select the first element by default, make sure to invoke the callback.
    if (
        defaultEmpty === false &&
        options.length > 0 &&
        onSelect !== undefined
    ) {
        let id = options[0].id
        onSelect(id)
    }

    return (
        <div class="form-group">
            <label for={id}>{text}</label>
            <select name={id} id={id} ref={selectRef} onChange={onChange}>
                {defaultEmpty && (
                    <option disabled selected>
                        - select -
                    </option>
                )}
                {options.map(({ id, name }) => (
                    <option value={id}>{name}</option>
                ))}
            </select>
        </div>
    )
}

/**
 * A small UI element that shows the children as a tooltip message on hover.
 *
 * Useful for displaying help information.
 */
export function ToolTip(props: { children: ComponentChildren }) {
    return (
        <div class="tooltip">
            <div class="content">{props.children}</div>
        </div>
    )
}
