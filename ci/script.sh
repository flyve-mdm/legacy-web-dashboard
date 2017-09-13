if [[ -n $GH_TOKEN ]]; then
    git config --global user.email $GH_EMAIL
    git config --global user.name $GH_NAME
    git config --list
    git remote remove origin
    git remote -v
    git remote add origin https://$GH_USER:$GH_TOKEN@github.com/$TRAVIS_REPO_SLUG.git 
fi

if [[ "$TRAVIS_BRANCH" == "feature/screenshots" && "$TRAVIS_PULL_REQUEST" == "false" ]]; then
    google-chrome-stable --headless --disable-gpu --screenshot https://flyve-mdm.github.io/flyve-mdm-web-dashboard/
    git fetch origin gh-pages
    git checkout gh-pages
    git checkout develop screenshot.png
    git add screenshot.png
    git commit -m "docs(screenshots): add screenshots of the project"
    
    git push origin gh-pages
fi