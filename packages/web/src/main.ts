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

    const app = new PGV(root, {
        repos: [
            {
                type: "demo",
                id: "demo0",
                name: "local demo [examples]",
                config: {
                    baseUrl: "./examples",
                },
            },
            // {
            //     type: "api",
            //     id: "demo1",
            //     name: "local server",
            // },
        ],
    })
    console.log(app)
})()
