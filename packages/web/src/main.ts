import { PGV } from "./pgv"
import "./style.css"

/**
 * Main entry.
 */
;(function () {
    const root = document.querySelector<HTMLDivElement>("#app")
    if (root) {
        const app = new PGV(root)
        console.log(app)
    }
})()
