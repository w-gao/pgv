import { PGV } from "./pgv"
import "./style.css"

/**
 * Main entry.
 */
;(function () {
    const root = document.querySelector<HTMLDivElement>("#app")
    if (root === null) {
        alert("cannot start app: missing container")
        return
    }

    const app = new PGV(root)
    console.log(app)
})()
