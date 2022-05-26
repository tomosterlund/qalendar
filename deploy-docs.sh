#!/usr/bin/env sh

# abort on errors
set -e

npm run docs:build
cd docs/.vitepress/dist

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:tomosterlund/qalendar.git master:gh-pages

cd -