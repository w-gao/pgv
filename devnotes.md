# dev notes

## MVP checklist

- [ ] visualization of the graph itself from the nodes and edges (no haplotypes)
    - [X] layout
        - [X] use tubemap as the layout engine
    - [X] nodes
    - [X] text for the sequence
    - [X] edges (curves)
        - [ ] improved curve calculation
- [X] visualization of haplotypes on the z-axis (paths)
    - should be simple to do if we can visualize the graph
- [ ] controls
    - [X] better camera positioning
    - [X] move graph with left, right arrow keys (simulate window move)
    - [X] select haplotypes with up, down arrow keys
- [ ] interactivity
    - [X] navigation buttons for mobile
    - [X] display number of nodes, edges, paths, selected path
    - [ ] hover node should show coverage (% of paths that walks over this node)
- [ ] demo graphs
    - [ ] find/generate better graphs to display different SVs
    - [ ] take screenshots for paper


Backend

- [ ] server (likely out of scope)
    - [ ] hook into tube-maps server
    - [ ] move window with arrow keys (actually dynamically download graph)


## vg notes

### Running a vg container

```console
docker run -it --name pgv-vg \
    -v "$(pwd)":/vg/pgv \
    quay.io/vgteam/vg:latest \
    bash
```

```console
docker start pgv-vg -i
```

### Data flow

```console
# Construct vg graph from a FASTA and VCF file (reference + variants).
vg construct -r z.fa -v z.vcf.gz > z.vg


# Get some basic stats on the graph.
vg stats -z z.xg
vg stats -N z.xg


# Index the graph.
vg index z.vg -x z.xg


# Construct a subgraph given a region.
vg chunk -x z.xg -g -c 20 -r 200 -T -b chunk -E regions.tsv > z.chunk.vg

# Index and generate a DOT and JSON file for the subgraph.
vg index z.chunk.vg -x z.chunk.xg 
vg view -dnp z.chunk.xg | dot -Tsvg -o z.chunk.svg

vg view -j z.chunk.xg > z.chunk.json
```


### Cactus example

```console
vg chunk -x cactus.xg -c 20 -r 24:27 | vg view -j - | jq . > cactus_r24\:27_c20.json
```


## Docker image

### Build the image

```
# Build project
yarn core:build
yarn web:build

# Build image (with latest tag)
docker build -t pgv .
```

### Run the image locally

```
docker run -it --name pgv --rm -v "$(pwd)/examples":/pgv/ui/examples -p 8000:8000 pgv:latest
```

### Publish to quay.io

```
# Login first
docker login quay.io

# Tag image
docker image tag pgv quay.io/wlgao/pgv:latest

# Push to quay.io
docker image push quay.io/wlgao/pgv
```
