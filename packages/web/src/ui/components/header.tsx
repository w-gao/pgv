import { effect } from "@preact/signals-core"
import { useState } from "preact/hooks"
import { GraphDesc } from "../../repo"
import { usePGV } from "../contexts"
import { FormSelect, ToolTip } from "./elements"
import "./header.scss"

/**
 * select box for the data source.
 */
function SelectDataSource() {
    const { app, ui, config } = usePGV()
    const repos = config.repos || []

    const changeSource = (src: string) => {
        console.log(`changing source to: ${src}`)

        // TODO: show a spinner and freeze UI while we fetch.
        app.switchRepo(src)
            .then(repo => repo.getGraphDescs())
            .then(descs => {
                ui.updateGraphs(descs)
            })
    }

    return (
        <FormSelect
            id="repo"
            text="data source:"
            options={repos}
            defaultEmpty={false}
            onSelect={changeSource}
        />
    )
}

/**
 * select box for the vg file.
 */
function SelectVgFile() {
    const { app, graphsSignal } = usePGV()

    // use a local state to trigger re-renders because signals lazy load with arrays.
    const [graphs, setGraphs] = useState<GraphDesc[]>([])

    effect(() => {
        console.log("graph updated:", graphsSignal.value)
        setGraphs(graphsSignal.value)
    })

    const changeGraph = async (graph: string) => {
        console.log(`selected graph: ${graph}`)

        const repo = app.currentRepo!
        const desc = await repo.getGraphDesc(graph)
        const g = await repo.downloadGraph(graph)

        console.log(`graph: ${g}`)
        if (g !== null) {
            app.render(desc!, g)
        }
    }

    return (
        <FormSelect
            id="vg-file"
            text="vg file:"
            options={graphs.map(graph => {
                return {
                    id: graph.identifier,
                    name: graph.name,
                }
            })}
            defaultEmpty={true}
            onSelect={changeGraph}
        />
    )
}

/**
 * navigation buttons.
 */
function NavContainer() {
    const onClick = (code: string) => {
        window.dispatchEvent(new KeyboardEvent("keydown", { code: code }))
        setTimeout(() => {
            window.dispatchEvent(new KeyboardEvent("keyup", { code: code }))
        }, 800)
    }

    return (
        <div class="header__nav-container">
            <button title="KeyA" onClick={() => onClick("KeyA")}>
                ←
            </button>
            <button title="KeyD" onClick={() => onClick("KeyD")}>
                →
            </button>
            <button title="ArrowUp" onClick={() => onClick("ArrowUp")}>
                ↑
            </button>
            <button title="ArrowDown" onClick={() => onClick("ArrowDown")}>
                ↓
            </button>

            <ToolTip>
                <p>
                    Select a graph above and use the arrow keys on the left to
                    navigate the graph, or use keyboard shortcuts:
                </p>
                <ul>
                    <li>A and D: left and right</li>
                    <li>W and S: forward and backward</li>
                    <li>R and F: up and down</li>
                    <li>↑ and ↓: cycle through paths</li>
                    <li>hover to select node</li>
                </ul>
            </ToolTip>
        </div>
    )
}

function StatusBar() {
    const { statusBarSignals } = usePGV()
    const [nodes, setNodes] = useState<number>()
    const [edges, setEdges] = useState<number>()
    const [paths, setPaths] = useState<number>()
    const [region, setRegion] = useState<string>()
    const [selectedPath, setSelectedPath] = useState<[number, string]>()
    const [selectedNode, setSelectedNode] = useState<[string, number, number]>()

    effect(() => setNodes(statusBarSignals.nodes.value))
    effect(() => setEdges(statusBarSignals.edges.value))
    effect(() => setPaths(statusBarSignals.paths.value))
    effect(() => setRegion(statusBarSignals.region.value))
    effect(() => setSelectedPath(statusBarSignals.selectedPath.value))
    effect(() => setSelectedNode(statusBarSignals.selectedNode.value))

    const format = (count: number, item: string): string => {
        return `${count} ${item}${count === 1 ? "" : "s"}`
    }

    if (nodes === undefined && edges === undefined && paths === undefined) {
        return <></>
    }

    return (
        <div class="header__status-bar">
            {nodes !== undefined && (
                <div class="header__status-bar__entry">
                    nodes: <span>{nodes}</span>
                </div>
            )}
            {edges !== undefined && (
                <div class="header__status-bar__entry">
                    edges: <span>{edges}</span>
                </div>
            )}
            {region !== undefined && (
                <div class="header__status-bar__entry">
                    region: <span>{region}</span>
                </div>
            )}
            {paths !== undefined && (
                <div class="header__status-bar__entry">
                    paths: <span>{paths}</span>{" "}
                    {selectedPath !== undefined && (
                        <>
                            (selected:{" "}
                            <span>
                                {selectedPath[0]} - {selectedPath[1]}
                            </span>
                            )
                        </>
                    )}
                </div>
            )}

            {selectedNode !== undefined && (
                <div class="header__status-bar__entry">
                    node ID: <span>{selectedNode[0]}</span>, length:{" "}
                    <span>{format(selectedNode[1], "base")}</span>, coverage:{" "}
                    <span>{selectedNode[2]}</span>/<span>{paths ?? "N/a"}</span>
                </div>
            )}
        </div>
    )
}

export function Header() {
    return (
        <div class="header">
            <div class="header__container">
                <SelectDataSource />
                <SelectVgFile />
            </div>
            <hr />
            <NavContainer />
            <StatusBar />
        </div>
    )
}
