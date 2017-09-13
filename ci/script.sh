if [[ -n $GH_TOKEN ]]; then
    git config --global user.email $GH_EMAIL
    git config --global user.name $GH_NAME
    git remote remove origin
    git remote add origin https://$GH_USER:$GH_TOKEN@github.com/$TRAVIS_REPO_SLUG.git 
fi

if [[ "$TRAVIS_BRANCH" == "develop" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    npm i puppeteer
    node ci/screenshots.js
    git add screenshots
    # NOTICE: this commit is not sent
    git commit -m "temp"
    git fetch origin gh-pages
    git checkout gh-pages
    git checkout $TRAVIS_BRANCH screenshots
    git add screenshots
    git commit -m "docs(screenshots): add screenshots of the project"
    
    git push origin gh-pages
fi