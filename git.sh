#!/bin/bash

# Add all changes to the Git repository
git add .

# Prompt the user for a commit message and store it in a temporary file
echo "Enter commit message: "
read commit_message
echo $commit_message > /tmp/commit-message.txt

# Commit the changes with the custom message
git commit -F /tmp/commit-message.txt

git push

# chmod +x git.sh
