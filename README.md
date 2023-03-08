# pgv

> A web-based, interactive pangenome visualization tool

<img src="https://user-images.githubusercontent.com/20177171/223407059-c04406bd-4b6c-427f-b1c3-106aaad06257.png" width="250px" />

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

