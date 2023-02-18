# pgv

> A web-based, interactive pangenome visualization tool


- [ ] visualization of the graph itself from the nodes and edges (no haplotypes)
    - [ ] layout
        - [ ] use tubemap as the layout engine
    - [ ] nodes
    - [ ] text for the sequence
    - [ ] edges (curves)
- [ ] visualization of haplotypes on the z-axis
    - [ ] should be simple to do if we can visualize the graph
- [ ] controls
    - [ ] pan left and right
    - [ ] select haplotypes


- [ ] server
    - [ ] take in vg and convert to xg
    - [ ]


## vg notes

`vg chunk`

```
vg chunk -x cactus.xg -c 20 -r 24:27 | vg view -j - | jq . > cactus_r24\:27_c20.json
```
