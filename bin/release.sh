#!/bin/bash

parent_path=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
cd "$parent_path/.."

version_current=$(cat package.json | jq -r .version)
version_patch=$(echo $version_current | grep -Eo '[0-9]+$')
version_patch_next=$((version_patch + 1))
version_next=$(echo $version_current | sed 's/.$/'$version_patch_next'/')
version_next_text="Release - ${version_next}"

echo "[*] Version (current) : $version_current"
echo "[*] Version (next)    : $version_next"

git diff --quiet || echo "[x] Error: Git working directory is dirty. Exiting." && exit 1

git checkout main
git pull origin main

./bin/build.sh
npm version $version_next

git add .
git commit -m $version_next_text
git tag -a $version_next -m $version_next_text
git push origin $version_next
git push origin main

echo "[*] Done"

