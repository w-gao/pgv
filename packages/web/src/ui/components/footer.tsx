import "./footer.scss"

/**
 * footer component.
 */
export function Footer() {
    // TODO: add postbuild script
    return (
        <div class="footer">
            <span>PGV</span>
            <span>Current build: main@1c884f6 (Mar 6, 2023)</span>
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
