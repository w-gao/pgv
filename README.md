# pgv

> A web-based, interactive pangenome visualization tool

<img src="https://user-images.githubusercontent.com/20177171/223407059-c04406bd-4b6c-427f-b1c3-106aaad06257.png" width="250px" />

[![demo](https://github.com/w-gao/pgv/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/w-gao/pgv/actions/workflows/deploy.yml)


## Motivation

A pangenome represents genetic variation in a population as a _variation graph_, which greatly reduces the reference
bias that comes from using a linear reference genome. However, a linear reference genome is more intuitive to
understand and has been the traditional way that bioinformaticians use. As an effort to make it easier to visualize
and interpret variation graphs, I present `pgv`, an interactive visualization tool built on top of previous work
that aims to display structural variants in a variation graph interactively.

Instead of fitting the nodes, edges, and paths of a variation graph in a 2-dimensional space, `pgv` draws the sequence
graph itself on the x-y plane, and paths are rendered as separate layers that can be interactively selected/highlighted.


## Screenshots

![image](https://user-images.githubusercontent.com/20177171/223253829-4691fe27-412e-4474-927e-9e246f777885.png)


- The _paths_ in a variation grpah can be interactively selected/highlighted:

![image](https://user-images.githubusercontent.com/20177171/222947953-805d83d4-a556-41d8-963b-0124ba374898.gif)


## Getting Started

A live demo is available at: https://w-gao.github.io/pgv.

If you want to try `pgv` yourself, you can get started in the following ways. **Keep in mind that this project is under
development and may not work well with your own data**. If you encounter any issues, please let me know by
[opening an issue](https://github.com/w-gao/pgv/issues).


### Run via Docker

The easiest way to run `pgv` is through Docker:

```console
$ docker pull wlgao/pgv:latest
```

To run a container:

```console
$ docker run -d --name pgv \
    -v "$(pwd)/examples":/pgv/ui/examples \
    -p 8000:8000 \
    wlgao/pgv:latest
```

This creates a container in detach (`-d`) mode, exposes port `8000`, with a volume for the graph files.

You can add additional volumes if you want to construct your own graphs inside the container, or, if you have
[`vg`](https://github.com/vgteam/vg/) installed on your local system, you can use the [pgv CLI](./cli.py) to
pre-process graphs.

If successful, `pgv` should be running at:

```
http://localhost:8000
```

To stop the container, run:

```concole
docker stop pgv
```


### Run from source

Alternatively, you can pull the source code and build the project yourself. You would need the following minimum
requirements:

```
- Node.js >= 16
- Yarn
- Python >= 3.8
```

To clone the repo:

```console
get clone https://github.com/w-gao/pgv.git
cd pgv
```

Then, build the project:

```console
# Run the prebuild script.
# Note: this requires curl and ed, which might not be available on Windows.
./prebuild.sh

# Build core package.
yarn core:build

# Build web package.
yarn web:build

# Start a preview HTTP server.
yarn web:preview
```

If successful, `pgv` should be running at:

```
http://localhost:8000
```


## UI - Usage

When you select a graph, you are presented with this interface:

![image](https://user-images.githubusercontent.com/20177171/223928293-6c678556-dbea-4936-933b-caa04e78333d.png)


This is split into three sections:

- The header for graph selection and navigation
- The [sequenceTubeMap](https://github.com/vgteam/sequenceTubeMap) render of the graph
- The `pgv` render of the graph


### Basic controls

- To navigate the graph, you can use the `←` and `→` buttons in the header, or the `A` and `D` keys.
- To cycle between the paths, you can use the `↑` and `↓` buttons, or the `up` and `down` arrow keys.
- You can also move closer or away from the graph using the `W` and `S` keys, up and down using the `R` and `F` keys.
- (controls such as movement speed are limited at the moment, but can be easily added if needed)


## Using your own graph

If you want to use your own data, you need to pre-process the files first. This can be done by the [pgv CLI](./cli.py).
Currently supported file formats are: FASTA (`.fa`), VCF (`.vcf`, `.vcf.gz`), and GBWT (`.gbwt`).

The following assumes that you have [`vg`](https://github.com/vgteam/vg/) installed. You also need [`cli.py`](./cli.py),
which is pre-installed inside the pgv container, or can be downloaded via:

```console
curl -O https://raw.githubusercontent.com/w-gao/pgv/main/cli.py
```


For example, to construct a graph from a FASTA file (`x.fa`) and a VCF file (`x.vcf.gz`), run:

```console
$ python3 cli.py add example \
        --reference x.fa \
        --vcf x.vcf.gz
```

This will pre-process the input files and output the results to the folder set by `--dest`, which is `./examples/` by
default. When running locally, the dev server symlinks to this default folder to grab the graph files. When running via
Docker, the `/pgv/ui/examples` path inside the container is statically served. If you decide to modify this path, make
sure to update the configuration for the respective places as well.

Graph genomes are often large, so you can specify a range to only display a small chunk of the graph. Additionally, you
can also specify a GBWT file to include additional haplotypes for the particular range. For example, to limit the above
graph to nodes from `1:100`, with more haplotypes from `x.vg.gbwt`:

```
$ python3 cli.py add example \
        --reference x.fa \
        --vcf x.vcf.gz
        --node-range 1:100 \
        --gbwt-name x.vg.gbwt
```

If you have an existing graph but want to update the range, you can use the `update` subcommand so it doesn't have to
re-construct and re-index the graph file:

```
$ python3 cli.py update example \
        --node-range 1:100 \
        --gbwt-name x.vg.gbwt
```

For more information on the CLI, run:

```
$ python3 cli.py --help
```


## License

Copyright (C) 2023 William Gao, under the MIT license.
