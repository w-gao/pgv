import { PGV } from "../pgv"

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

export class Header {
    private element: HTMLDivElement
    private vgFileElement: HTMLDivElement

    constructor(private app: PGV, private parent: HTMLElement) {
        this.element = document.createElement("div")
        this.element.setAttribute("class", "header")

        // Add data sources
        this.element.appendChild(
            createFormGroupSelect(
                "repo",
                "Data source",
                app.config.repos || [],
                true,
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
    }

    changeSource(src: string) {
        console.log("changing source to " + src)
        this.app.switchRepo(src)

        let repo = this.app.currentRepo!
        repo.getGraphDescs().then(descs => {
            console.log(descs)

            const graphs = []
            for (let desc of descs) {
                graphs.push({
                    id: desc.identifier,
                    name: desc.name + "; " + src,
                })
            }

            replaceFormGroupSelect(this.vgFileElement, graphs, true)
        })
    }

    selectVgGraph(graph: string) {
        console.log("selected graph: " + graph)
    }

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
