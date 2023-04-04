#!/usr/bin/env bash

# Pull in the tube map source code directly - it is not published on npm but I
# want it as a dependency.
kTubemapPath="packages/web/src/lib/"
curl -o $kTubemapPath/tubemap.js https://raw.githubusercontent.com/vgteam/sequenceTubeMap/dedf6cad8417e94acea671c9d52e03f3ebe4dfbf/src/util/tubemap.js

# Inject code that I need to get the layout from the tube map.
cat $kTubemapPath/inject.js >> $kTubemapPath/tubemap.js
