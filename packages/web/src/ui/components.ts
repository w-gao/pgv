const template = `
<div>
    pgv
</div>
`

export class Header {
    parent: HTMLElement
    element: HTMLElement

    constructor(parent: HTMLElement) {
        this.parent = parent

        const div = document.createElement("div")
        div.innerHTML = template
        this.element = div
    }

    show() {
        this.parent.appendChild(this.element)
    }

    hide() {
        this.element.setAttribute("style", "display: none")
    }

    remove() {
        this.parent.removeChild(this.element)
    }
}
