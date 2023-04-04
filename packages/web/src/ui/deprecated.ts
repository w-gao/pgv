import { PGV } from "../pgv"

/**
 * @deprecated
 */
export class Header {
    private element: HTMLDivElement
    private statusBarElement: HTMLDivElement

    constructor(private app: PGV, private parent: HTMLElement) {
        this.element = document.createElement("div")
        this.element.setAttribute("class", "header")

        // Add navigation buttons.
        const buttonContainer = document.createElement("div")
        buttonContainer.setAttribute("class", "button-container")

        const leftButton = document.createElement("button")
        leftButton.innerHTML = "←"
        leftButton.setAttribute("title", "KeyA")
        leftButton.addEventListener("click", () =>
            this.handleButtonClick("KeyA")
        )

        const rightButton = document.createElement("button")
        rightButton.innerHTML = "→"
        rightButton.setAttribute("title", "KeyD")
        rightButton.addEventListener("click", () =>
            this.handleButtonClick("KeyD")
        )

        const upButton = document.createElement("button")
        upButton.innerHTML = "↑"
        upButton.setAttribute("title", "ArrowUp")
        upButton.addEventListener("click", () =>
            this.handleButtonClick("ArrowUp")
        )

        const downButton = document.createElement("button")
        downButton.innerHTML = "↓"
        downButton.setAttribute("title", "ArrowDown")
        downButton.addEventListener("click", () =>
            this.handleButtonClick("ArrowDown")
        )

        buttonContainer.appendChild(leftButton)
        buttonContainer.appendChild(rightButton)
        buttonContainer.appendChild(upButton)
        buttonContainer.appendChild(downButton)

        const tooltip = document.createElement("div")
        tooltip.setAttribute("class", "tooltip")
        tooltip.innerHTML = `
        <div class="content">
            <p>Select a graph above and use the arrow keys on the left to navigate the graph, or use keyboard shortcuts:</p>
            <ul>
                <li>A and D: left and right</li>
                <li>W and S: forward and backward</li>
                <li>R and F: up and down</li>
                <li>↑ and ↓: cycle through paths</li>
                <li>hover to select node</li>
            <ul>
        </div>
        `
        buttonContainer.appendChild(tooltip)

        this.element.appendChild(buttonContainer)

        this.statusBarElement = document.createElement("div")
        this.statusBarElement.setAttribute("class", "status-bar")
        buttonContainer.appendChild(this.statusBarElement)
    }

    handleButtonClick(code: string) {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: code }))
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { code: code }))
        }, 800)
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
