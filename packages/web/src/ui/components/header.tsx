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
    const { app, config } = usePGV()
    const repos = config.repos || []

    const changeSource = (src: string) => {
        console.log(`changing source to: ${src}`)

        // TODO: show a spinner and freeze UI while we fetch.
        app.switchRepo(src)
            .then(repo => repo.getGraphDescs())
            .then(descs => {
                app.ui.updateGraphs(descs)
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

    return (
        <div class="header__status-bar">
            {nodes !== undefined && <span>nodes: {nodes}</span>}
            {edges !== undefined && <span>edges: {edges}</span>}
            {region !== undefined && <span>region: {region}</span>}
            {paths !== undefined && (
                <span>
                    paths: {paths}
                    {selectedPath !== undefined &&
                        ` (selected: ${selectedPath[0]} - ${selectedPath[1]})`}
                </span>
            )}

            {selectedNode !== undefined && (
                <span>
                    node ID: {selectedNode[0]}, length:{" "}
                    {format(selectedNode[1], "base")}, coverage:{" "}
                    {selectedNode[2]}/{paths ?? "N/a"}
                </span>
            )}
        </div>
    )
}

export function Header() {
    return (
        <div class="header">
            <SelectDataSource />
            <SelectVgFile />

            <hr />

            <div class="header__nav-container">
                <button title="KeyA">←</button>
                <button title="KeyD">→</button>
                <button title="ArrowUp">↑</button>
                <button title="ArrowDown">↓</button>

                <ToolTip>
                    <p>
                        Select a graph above and use the arrow keys on the left
                        to navigate the graph, or use keyboard shortcuts:
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

            <StatusBar />
        </div>
    )
}
