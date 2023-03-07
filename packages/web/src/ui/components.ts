import { CallbacksFn, PGV } from "../pgv"

function createFormGroupSelect(
    id: string,
    text: string,
    options: { id: string; name: string }[],
    defaultEmpty?: boolean,
    onSelect?: (id: string) => void
): HTMLDivElement {
    /*
        <div class="form-group">
        <label for="{id}">{text}</label>
        <select name="{id}" id="{id}">
            {for entry : options}
            <option value="{entry.id}">{entry.name}</option>
            {endfor}
        </select>
        </div>
    */
    const div = document.createElement("div")
    div.className = "form-group"

    const label = document.createElement("label")
    label.htmlFor = id
    label.innerHTML = `${text}: `
    div.appendChild(label)

    const select = document.createElement("select")
    select.name = id
    select.id = id

    if (defaultEmpty) {
        let option = document.createElement("option")
        option.disabled = true
        option.selected = true
        option.innerHTML = " - select - "
        select.appendChild(option)
    } else {
        // Invoke the callback for the first element.
        if (onSelect) {
            let id = options[0].id
            onSelect(id)
        }
    }

    for (let entry of options) {
        const option = document.createElement("option")
        option.value = entry.id
        option.innerHTML = entry.name
        select.appendChild(option)
    }

    select.addEventListener("change", function () {
        if (onSelect) {
            let id = select.options[select.selectedIndex].value
            onSelect(id)
        } else {
            console.log("detected change event to select box but no listener")
        }
    })

    div.appendChild(select)
    return div
}

function replaceFormGroupSelect(
    element: HTMLDivElement,
    options: { id: string; name: string }[],
    defaultEmpty?: boolean
) {
    const select = element.querySelector("select")!

    // remove all children
    select.innerHTML = ""

    if (defaultEmpty) {
        let option = document.createElement("option")
        option.disabled = true
        option.selected = true
        option.innerHTML = " - select - "
        select.appendChild(option)
    }

    for (let entry of options) {
        const option = document.createElement("option")
        option.value = entry.id
        option.innerHTML = entry.name
        select.appendChild(option)
    }
}

export class Header implements CallbacksFn {
    private element: HTMLDivElement
    private statusBarElement: HTMLDivElement
    private vgFileElement: HTMLDivElement

    private numNodes?: number
    private numEdges?: number
    private numPaths?: number
    private selectedPath?: [number, string]

    constructor(private app: PGV, private parent: HTMLElement) {
        this.element = document.createElement("div")
        this.element.setAttribute("class", "header")

        // Add data sources
        this.element.appendChild(
            createFormGroupSelect(
                "repo",
                "Data source",
                app.config.repos || [],
                false,
                this.changeSource.bind(this)
            )
        )

        this.vgFileElement = createFormGroupSelect(
            "vg-file",
            "vg file",
            [],
            true,
            this.selectVgGraph.bind(this)
        )
        // this.vgFileElement.style.display = "none"
        this.element.appendChild(this.vgFileElement)

        this.element.appendChild(document.createElement("hr"))

        // Add navigation buttons.
        const buttonContainer = document.createElement("div")
        buttonContainer.setAttribute("class", "button-container")

        const leftButton = document.createElement("button")
        leftButton.innerHTML = "←"
        leftButton.addEventListener("click", () =>
            this.handleButtonClick("KeyA")
        )

        const rightButton = document.createElement("button")
        rightButton.innerHTML = "→"
        rightButton.addEventListener("click", () =>
            this.handleButtonClick("KeyD")
        )

        const upButton = document.createElement("button")
        upButton.innerHTML = "↑"
        upButton.addEventListener("click", () =>
            this.handleButtonClick("ArrowUp")
        )

        const downButton = document.createElement("button")
        downButton.innerHTML = "↓"
        downButton.addEventListener("click", () =>
            this.handleButtonClick("ArrowDown")
        )

        buttonContainer.appendChild(leftButton)
        buttonContainer.appendChild(rightButton)
        buttonContainer.appendChild(upButton)
        buttonContainer.appendChild(downButton)

        this.element.appendChild(buttonContainer)

        this.statusBarElement = document.createElement("div")
        this.statusBarElement.setAttribute("class", "status-bar")
        buttonContainer.appendChild(this.statusBarElement)
    }

    changeSource(src: string) {
        console.log("changing source to " + src)

        this.app
            .switchRepo(src)
            .then(repo => repo.getGraphDescs())
            .then(descs => {
                console.log(descs)

                const graphs = []
                for (let desc of descs) {
                    graphs.push({
                        id: desc.identifier,
                        name: desc.name,
                    })
                }

                // TODO: show a spinner and freeze UI?
                replaceFormGroupSelect(this.vgFileElement, graphs, true)
            })
    }

    selectVgGraph(graph: string) {
        console.log("selected graph: " + graph)

        this.app.currentRepo!.downloadGraph(graph).then(g => {
            console.log("graph:", g)
            if (g !== null) {
                this.app.render(g)
            }
        })
    }

    handleButtonClick(code: string) {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: code }))
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { code: code }))
        }, 800)
    }

    // CallbacksFn ---

    updateNodes(nodes: number | undefined, silent?: boolean): void {
        this.numNodes = nodes
        if (!silent) {
            this.updateStatusBar()
        }
    }

    updateEdges(edges: number | undefined, silent?: boolean): void {
        this.numEdges = edges
        if (!silent) {
            this.updateStatusBar()
        }
    }

    updatePaths(paths: number | undefined, silent?: boolean): void {
        this.numPaths = paths
        if (!silent) {
            this.updateStatusBar()
        }
    }

    updateSelectedPath(
        path: [number, string] | undefined,
        silent?: boolean
    ): void {
        this.selectedPath = path
        if (!silent) {
            this.updateStatusBar()
        }
    }

    updateStatusBar(): void {
        let text = []

        if (this.numNodes) {
            text.push(`nodes: ${this.numNodes}`)
        }
        if (this.numEdges) {
            text.push(`edges: ${this.numEdges}`)
        }
        if (this.numPaths) {
            text.push(
                `paths: ${this.numPaths}` +
                    (this.selectedPath
                        ? ` (selected: ${this.selectedPath[0]} - <span>${this.selectedPath[1]}</span>)`
                        : "")
            )
        }

        this.statusBarElement.innerHTML = text.join(" | ")
    }
    // ---

    show() {
        this.parent.appendChild(this.element)
    }

    hide() {
        this.element.style.display = "none"
    }

    remove() {
        this.parent.removeChild(this.element)
    }
}
