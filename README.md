# pgv

> A web-based, interactive pangenome visualization tool


- [ ] visualization of the graph itself from the nodes and edges (no haplotypes)
    - [X] layout
        - [X] use tubemap as the layout engine
    - [X] nodes
    - [X] text for the sequence
    - [ ] edges (curves)
- [ ] visualization of haplotypes on the z-axis (paths)
    - should be simple to do if we can visualize the graph
- [ ] controls
    - [ ] better camera positioning
    - [ ] move graph with left, right arrow keys (simulate window move)
    - [ ] select haplotypes with up, down arrow keys


- [ ] server (likely out of scope)
    - [ ] hook into tube-maps server
    - [ ] move window with arrow keys (actually dynamically download graph)


## vg notes

`vg chunk`

```
vg chunk -x cactus.xg -c 20 -r 24:27 | vg view -j - | jq . > cactus_r24\:27_c20.json
```
