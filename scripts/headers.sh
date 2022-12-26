#!/bin/bash

dist="dist"
output=$dist"/headers.js"

generate-headers tampermonkey \
    -g unsafe get set \
    -o $output \
    -m all meta "https://domain/questions/*" \
    --require "https://raw.githubusercontent.com/userscripters/storage/master/dist/browser.js" \
    --pretty

userscript="$(find -iwholename "./$dist/*\.js" -type f -not -iname "*headers\.js")"

sed -i -e "{1e cat $output; echo; echo" -e "; N}" $userscript
