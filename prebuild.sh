#!/usr/bin/env bash

# Pull in the tube map source code as a dependency - it is not actively
# published to npm and I want the latest version.
kTubemapPath="packages/web/src/lib/"
curl -o $kTubemapPath/tubemap.js https://raw.githubusercontent.com/vgteam/sequenceTubeMap/dedf6cad8417e94acea671c9d52e03f3ebe4dfbf/src/util/tubemap.js

# Inject code that I need to get the layout from the tube map.
ed -s $kTubemapPath/tubemap.js <<EOF
492r $kTubemapPath/inject.js
w
EOF
