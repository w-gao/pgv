import json
import os
import shutil
import subprocess
import sys
import argparse
import logging
from typing import List, Dict, Any

"""
pgv CLI.


Available commands:

- pgv ls
- pgv [add|update]
- pgv rm


Example usage:

- To add a graph:

$ python3 cli.py add tiny \
        --reference vgtests/c.fa \
        --vcf vgtests/c.vcf.gz


- To update a graph:

$ python3 cli.py update tiny \
    --node-range 1:3 \
    --name "tiny example"


- To update a graph (with GBWT): 
   
$ python3 cli.py update x \
    --node-range 1:100 \
    --gbwt-name x.vg.gbwt
"""


logger = logging.getLogger(__name__)
logging.basicConfig(
    format='[pgv][%(levelname)s] %(message)s',
    level=logging.INFO
)


class PgvCLI:
    """
    CLI functions for the pgv command.
    """
    def __init__(self, args: argparse.Namespace) -> None:
        self.args = args
        self.cwd = args.dest

        # Load sources.
        with open(os.path.join(self.cwd, "sources.json"), "r") as f:
            self.sources: List[Dict[str, Any]] = json.load(f)

    def _update_source(self) -> None:
        with open(os.path.join(self.cwd, "sources.json"), "w") as f:
            json.dump(self.sources, f, indent=4)

    def cmd_ls(self) -> None:
        """
        The "list" command.
        """
        print("IDENTIFIER\tREGION")
        for src in self.sources:
            print(f"{src.get('identifier')}\t\t{src.get('region')}")

    def cmd_rm(self) -> None:
        """
        The "remove" command.
        """
        args = self.args
        identifier = args.identifier

        for s in self.sources:
            if s.get("identifier") == identifier:
                src: Dict[str, str] = s
                break
        else:
            logger.warning(f"{identifier} does not exist in registry.")
            exit()

        # Remove from registry.
        self.sources.remove(src)
        self._update_source()

        # Remove actual directory.
        dir = os.path.join(self.cwd, identifier)
        if not os.path.exists(dir):
            logging.warning(f"ERROR: '{identifier}' does not exist.")
            exit(1)

        shutil.rmtree(dir)
        logger.info("SUCCESS")

    def cmd_add(self) -> None:
        """
        The "add" and "update" command.
        """
        args = self.args
        identifier = args.identifier
        dir = os.path.join(self.cwd, identifier)

        if not (exists := os.path.exists(dir)):
            # We are creating a new graph.
            os.mkdir(dir)

        src: Dict[str, str] = {}
        if exists:
            for s in self.sources:
                if s.get("identifier") == identifier:
                    src = s
                    break
            else:
                logger.warning(f"{identifier} does not exist in registry.")
                exit(1)

        references = args.reference
        vcfs = args.vcf

        if not exists and not references:
            logger.warning("ERROR: at least one FASTA file must be provided.")
            exit(1)

        vgFile = f"{identifier}.vg"
        xgFile = f"{identifier}.xg"
        if references:
            # Construct .vg file.
            cmd = ["vg", "construct"]
            for r in references:
                cmd.extend(["-r", r])
            for v in vcfs:
                cmd.extend(["-v", v])

            with open(os.path.join(dir, vgFile), "w") as f:
                popen = subprocess.Popen(cmd, cwd=os.getcwd(), stdout=f, stderr=subprocess.DEVNULL)
                popen.communicate()
            if popen.returncode != 0:
                # "vg construct" failed
                logger.warning("ERROR: 'vg construct' failed")
                exit(1)

            # Index .vg to get .xg file.
            cmd = ["vg", "index", os.path.join(dir, vgFile), "-x", os.path.join(dir, xgFile)]
            popen = subprocess.Popen(cmd, cwd=os.getcwd(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            _, stderr = popen.communicate()
            if popen.returncode != 0:
                # "vg index" failed
                logger.warning("ERROR: 'vg index' failed:", stderr)
                exit(1)

        # Chunk the file based on region
        if args.node_range:
            cmd = ["vg", "chunk", "-x", os.path.join(dir, xgFile), "-c", str(args.context_step), "-r", args.node_range]
            if args.gbwt:
                cmd.extend(["--gbwt-name", args.gbwt])
            cmd.extend(["-T", "-b", os.path.join(dir, "chunk"), "-E", os.path.join(dir, "regions.tsv")])

            xgFile = f"{identifier}.chunked.xg"
            with open(os.path.join(dir, xgFile), "w") as f:
                popen = subprocess.Popen(cmd, cwd=os.getcwd(), stdout=f, stderr=subprocess.PIPE)
                _, stderr = popen.communicate()
            if popen.returncode != 0:
                # "vg chunk" failed
                logger.warning("ERROR: 'vg chunk' failed:", stderr)
                exit(1)

        # Get a JSON graph for pgv to interpret.
        cmd = ["vg", "view", "-j", os.path.join(dir, xgFile)]
        jsonFile = f"{xgFile}.json"
        with open(os.path.join(dir, jsonFile), "w") as f:
            popen = subprocess.Popen(cmd, cwd=os.getcwd(), stdout=f, stderr=subprocess.PIPE)
            _, stderr = popen.communicate()
        if popen.returncode != 0:
            # "vg index" failed
            logger.warning("ERROR: 'vg index' failed:", stderr)
            exit(1)

        src["identifier"] = identifier
        if args.display_name:
            src["name"] = args.display_name
        elif not exists:
            src["name"] = identifier
        src["xgFile"] = xgFile
        src["region"] = args.node_range
        src["jsonFile"] = jsonFile

        if not exists:
            # Add this to sources.json.
            self.sources.append(src)

        self._update_source()
        logger.info("SUCCESS")


def main(args: List[str]) -> None:
    parser = argparse.ArgumentParser(description="CLI for pgv.")
    parser.add_argument("-d", "--dest", type=str, default=os.environ.get("PGV_DEFAULT_PATH", "./examples"), help="The destination directory.")
    parser.add_argument("-D", "--debug", action='store_true', help="Enable debug logging.")
    subparsers = parser.add_subparsers(dest="cmd")

    # "ls" command
    ls_parser = subparsers.add_parser("ls", help="List all graphs.")

    # "add" and "update" command
    add_parser = subparsers.add_parser("add", aliases=["update"], help="Add or update a graph.")
    add_parser.add_argument("identifier")
    add_parser.add_argument("-n", "--name", dest="display_name", help="display name")
    # construct args
    add_parser.add_argument("-f", "--reference", metavar="FILE", action="extend", nargs="*", help="input FASTA reference file(s)")
    add_parser.add_argument("-v", "--vcf", metavar="FILE", action="extend", nargs="*", help="input VCF file(s)")
    # chunk args
    add_parser.add_argument("-r", "--node-range", dest="node_range", metavar="N:M", help="the node range")
    add_parser.add_argument("-c", "--context-step", dest="context_step", type=int, metavar="N", help="expand N node steps as content", default=20)
    add_parser.add_argument("-G", "--gbwt-name", dest="gbwt", metavar="FILE", help="input GBWT file")

    # "rm" command
    rm_parser = subparsers.add_parser("rm", help="Remove a graph.")
    rm_parser.add_argument("identifier")

    options = parser.parse_args(args)
    if options.debug:
        logging.basicConfig(level=logging.DEBUG)

    # Make sure dest folder exists.
    if not os.path.exists(options.dest):
        os.mkdir(options.dest)
    src_file = os.path.join(options.dest, "sources.json")
    if not os.path.exists(src_file):
        with open(src_file, "w") as f:
            json.dump([], f)

    cli = PgvCLI(args=options)

    if options.cmd == "ls":
        cli.cmd_ls()
    elif options.cmd in ("add", "update"):
        cli.cmd_add()
    elif options.cmd == "rm":
        cli.cmd_rm()
    else:
        parser.print_help()


if __name__ == "__main__":
    main(sys.argv[1:])
