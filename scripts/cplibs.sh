#!/bin/sh
for i in ./lib/*; do for j in $i/*.{js,html}; do if [ -e "$j" ]; then cp "$j" ./htdocs ; fi; done; done;