import { PGV } from "./pgv"
import "./main.scss"

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
        debug: true,
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
        layout: "tubemap",
        renderer: "three",
    })

    console.log(app)
})()
