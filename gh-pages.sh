yarn build
git add .
git status
git commit -m "$1"
git push origin master
git subtree push --prefix dist origin gh-pages