import { useEffect, useState } from "preact/hooks"
import { usePGV } from "../contexts"
import "./footer.scss"

/**
 * footer component.
 */
export function Footer() {
    const { config } = usePGV()

    // Don't display the footer if our app is embedded.
    if (config.embedded) {
        return <></>
    }

    // Assume the build process generated a "env.json" file at the root directory.
    const [env, setEnv] = useState()

    useEffect(() => {
        fetch("/env.json")
            .then(resp => resp.json())
            .then(resp => setEnv(resp))
            .catch(() => {
                /** ignore */
            })
    }, [])

    let info
    if (env) {
        const build_date = env["BUILD_DATE"] || "N/a"
        const branch = env["BRANCH"] || "dev"
        const commit_ref = (env["GITHUB_WORKFLOW_SHA"] as string) || "N/a"
        info = (
            <>
                Current build: {branch}@{commit_ref.slice(0, 7)} ({build_date}).
            </>
        )
    } else {
        info = <>unknown build</>
    }

    return (
        <div class="footer">
            <span>PGV</span>
            <span>{info}</span>
            <span>
                <a
                    rel="noopener noreferrer"
                    target="_blank"
                    href="https://github.com/w-gao/pgv"
                    aria-label="github link"
                    class="footer__link"
                >
                    GitHub
                </a>
            </span>
        </div>
    )
}
