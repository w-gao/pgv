# pgv

> A web-based, interactive pangenome visualization tool

[![demo](https://github.com/w-gao/pgv/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/w-gao/pgv/actions/workflows/deploy.yml)


## Motivation

A pangenome represents genetic variation in a population as a _variation graph_, which greatly reduces the reference
bias that comes from using linear reference genomes. However, a linear reference genome is more intuitive to reason
about and has been the traditional way that bioinformaticians use. As an effort to make it easier to visualize and
interpret variation graphs, `pgv` is an interactive visualization tool built on top of previous work that aims to
display small structural variations in a variation graph.

Instead of fitting the nodes, edges, and paths of a variation graph in the same 2-dimensional space, `pgv` draws the
sequence graph itself on the x-y plane, and paths are rendered as separate layers that can be interactively selected.


## Screenshots

![image](https://user-images.githubusercontent.com/20177171/223253829-4691fe27-412e-4474-927e-9e246f777885.png)


- The _paths_ in a variation grpah can be interactively selected/highlighted:

![image](https://user-images.githubusercontent.com/20177171/222947953-805d83d4-a556-41d8-963b-0124ba374898.gif)


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


```
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

vg view -j z.chunk.xg | dot -Tsvg -o z.chunk.json
```


### Cactus example

```
vg chunk -x cactus.xg -c 20 -r 24:27 | vg view -j - | jq . > cactus_r24\:27_c20.json
```
