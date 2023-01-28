import { Graph } from "@pgv/core/src/model/vg"

/**
 * A description for a graph. Contains name, identifier, and basic stats but
 * not the graph itself.
 */
export type GraphDesc = {
    name: string
    identifier: string

    region?: string

    // basic stats
    numNodes?: number
    numEdges?: number
    numPaths?: number
    length?: number
}

export type DownloadGraphConfig = {
    region: string
    // TODO: can also specify options for "vg index", "vg chunk", etc
}

/**
 * A repository interface to get graphs from.
 */
export interface IRepo {
    /**
     * A short description of the repo that is displayed on the UI.
     */
    displayName: string

    /**
     * Whether or not this repo supports user to upload graph / haplotype files.
     */
    supportsUpload: boolean

    /**
     * If applicable, connect to the repository and return a session ID.
     *
     * If the connection failed, null should be returned.
     */
    connect(): Promise<string | null>

    /**
     * Return a list of graph descriptions available in this repo.
     */
    getGraphDescs(): Promise<GraphDesc[]>

    /**
     * Given an identifier from getGraphDescs(), return the actual graph object.
     *
     * @param identifier Unique identifier of the graph to retrieve.
     * @param config Configuration used to retrieve the graph.
     */
    downloadGraph(
        identifier: string,
        // config: DownloadGraphConfig
    ): Promise<Graph | null>
}
