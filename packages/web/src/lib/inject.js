// ----------------------------------------------------------------------------
// This portion of code is injected by pgv.

export function createLayout(params) {
    // An actual DOM element is needed to calculate the pixel width, but we
    // can hide the SVG if we don't want to display it.
    svgID = params.svgID
    svg = d3.select(params.svgID)
    inputNodes = JSON.parse(JSON.stringify(params.nodes)) // deep copy
    inputTracks = JSON.parse(JSON.stringify(params.tracks)) // deep copy
    inputReads = params.reads || null
    inputRegion = params.region
    bed = params.bed || null
    config.clickableNodesFlag = params.clickableNodes || false
    config.hideLegendFlag = params.hideLegend || false
    return generateLayout()
}

export function generateLayout() {
    trackRectangles = []
    trackCurves = []
    trackCorners = []
    trackVerticalRectangles = []
    trackRectanglesStep3 = []
    assignments = []
    extraLeft = []
    extraRight = []
    maxYCoordinate = 0
    minYCoordinate = 0
    maxXCoordinate = 0
    trackForRuler = undefined
    svg = d3.select(svgID)
    svg.selectAll("*").remove() // clear svg for (re-)drawing

    // early exit is necessary when visualization options such as colors are
    // changed before any graph has been rendered
    if (inputNodes.length === 0 || inputTracks.length === 0) return

    straightenTrack(0)
    nodes = JSON.parse(JSON.stringify(inputNodes)) // deep copy (can add stuff to copy and leave original unchanged)
    tracks = JSON.parse(JSON.stringify(inputTracks))
    reads = JSON.parse(JSON.stringify(inputReads))

    assignColorSets()
    reads = filterReads(reads)

    for (let i = tracks.length - 1; i >= 0; i -= 1) {
        if (!tracks[i].hasOwnProperty("type")) {
            // TODO: maybe remove "haplo"-property?
            tracks[i].type = "haplo"
        }
        if (tracks[i].hasOwnProperty("hidden")) {
            if (tracks[i].hidden === true) {
                tracks.splice(i, 1)
            }
        }
        if (tracks[i] && tracks[i].hasOwnProperty("indexOfFirstBase")) {
            trackForRuler = tracks[i].name
        }
    }
    if (tracks.length === 0) return

    nodeMap = generateNodeMap(nodes)
    generateTrackIndexSequences(tracks)
    if (reads && config.showReads) generateTrackIndexSequences(reads)
    generateNodeWidth()

    if (config.mergeNodesFlag) {
        generateNodeSuccessors() // requires indexSequence
        generateNodeOrder() // requires successors
        if (reads && config.showReads) reverseReversedReads()
        mergeNodes()
        nodeMap = generateNodeMap(nodes)
        generateNodeWidth()
        generateTrackIndexSequences(tracks)
        if (reads && config.showReads) generateTrackIndexSequences(reads)
    }

    numberOfNodes = nodes.length
    numberOfTracks = tracks.length
    generateNodeSuccessors()
    generateNodeDegree()
    if (DEBUG) console.log(`${numberOfNodes} nodes.`)
    generateNodeOrder()
    maxOrder = getMaxOrder()

    // can cause problems when there is a reversed single track node
    // OTOH, can solve problems with complex inversion patterns
    switchNodeOrientation()
    generateNodeOrder(nodes, tracks)
    maxOrder = getMaxOrder()

    calculateTrackWidth(tracks)
    generateLaneAssignment()

    if (config.showExonsFlag === true && bed !== null) addTrackFeatures()
    generateNodeXCoords()

    if (reads && config.showReads) {
        generateReadOnlyNodeAttributes()
        reverseReversedReads()
        generateTrackIndexSequences(reads)
        placeReads()
        tracks = tracks.concat(reads)
        // we do not have any reads to display
    } else {
        nodes.forEach(node => {
            node.incomingReads = []
            node.outgoingReads = []
            node.internalReads = []
        })
    }

    generateSVGShapesFromPath(nodes, tracks)
    if (DEBUG) {
        console.log("Tracks:")
        console.log(tracks)
        console.log("Nodes:")
        console.log(nodes)
        console.log("Lane assignment:")
        console.log(assignments)
    }
    // getImageDimensions();
    // alignSVG(nodes, tracks);
    // defineSVGPatterns();

    drawTrackRectangles(trackRectangles)
    drawTrackCurves()
    drawReversalsByColor(trackCorners, trackVerticalRectangles)
    drawTrackRectangles(trackRectanglesStep3)
    drawTrackRectangles(trackRectangles, "read")
    drawTrackCurves("read")

    // draw only those nodes which have coords assigned to them
    const dNodes = removeUnusedNodes(nodes)
    drawReversalsByColor(trackCorners, trackVerticalRectangles, "read")
    drawNodes(dNodes)
    if (config.nodeWidthOption === 0) drawLabels(dNodes)
    // if (trackForRuler !== undefined) drawRuler()
    if (config.nodeWidthOption === 0) drawMismatches() // TODO: call this before drawLabels and fix d3 data/append/enter stuff
    if (DEBUG) {
        console.log(`number of tracks: ${numberOfTracks}`)
        console.log(`number of nodes: ${numberOfNodes}`)
    }

    let rv = []
    for (let obj of dNodes) {
        rv.push({
            id: obj.name,
            seq: obj.seq,
            x: obj.x,
            y: obj.y,
            width: obj.width > 1 ? obj.pixelWidth : 9,
            height: 9,
        })
    }

    return rv
}

// ----------------------------------------------------------------------------
