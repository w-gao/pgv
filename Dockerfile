FROM ubuntu:22.04
LABEL maintainer="William Gao <wlgao@ucsc.edu>"

ARG VG_VERSION=v1.46.0

ENV DEBIAN_FRONTEND noninteractive
WORKDIR /pgv

RUN apt-get update && apt-get install -y \
    nginx \
    vim \
    wget \
    curl

# Install Node.js
# RUN curl -sL https://deb.nodesource.com/setup_16.x | bash && apt-get install -y gnupg nodejs
# Install yarn
# RUN npm install -g yarn

# remove APT cache
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Download vg
RUN wget -O /usr/local/bin/vg "https://github.com/vgteam/vg/releases/download/${VG_VERSION}/vg" \
    && chmod +x /usr/local/bin/vg


EXPOSE 8000

# Set up nginx
COPY docker/nginx.conf /etc/nginx/sites-enabled/default
COPY docker/start.sh start.sh

# Copy over build files.
COPY ui ./ui
COPY cli.py ./cli.py

CMD ["./start.sh"]
