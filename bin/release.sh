#!/bin/bash

args_version_next=$1

parent_path=$(cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P)
cd "$parent_path/.."

version_current=$(cat package.json | jq -r .version)
version_patch=$(echo $version_current | grep -Eo '[0-9]+$')
version_patch_next=$((version_patch+1))

if [ -z "$1" ]
then
  version_next=$(echo $version_current | sed -E 's/(.*)'$version_patch'/\1'$version_patch_next'/')
else
  version_next=$args_version_next
fi

version_next_tag="v${version_next}"
version_next_text="Release - ${version_next_tag}"

echo "[*] Version (current) : $version_current"
echo "[*] Version (next)    : $version_next"
echo ""
echo "[*] Release (tag)     : $version_next_tag"
echo "[*] Release (text)    : $version_next_text"

if [[ $(git status --porcelain) ]]; then
  echo "[x] Error: Git working directory is dirty. Exiting."
  exit 1
fi

git checkout main
git pull origin main

./bin/install.sh
./bin/docs.sh
./bin/version.sh $version_next

git add .
git commit -m "$version_next_text"
git tag -a "$version_next_tag" -m "$version_next_text"

git push origin "$version_next_tag"
git push origin main

echo ""
echo "[*] Done"
