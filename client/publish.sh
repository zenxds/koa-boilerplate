#!/bin/bash

set -e

BRANCH=$(git symbolic-ref --short HEAD)
if [[ "${BRANCH}" =~ ^daily\/([0-9]+\.[0-9]+\.[0-9]+) ]]
then
  echo "current branch ${BRANCH}"
  VER=${BASH_REMATCH[1]}
else
  echo "current branch must be daily"
  exit 1
fi

STATUS=$(git status -s --untracked-files=no)
if [ -n "${STATUS}" ]
then
  echo "changes to be committed"
  echo ${STATUS}
  exit 1
fi

PUBLISH="release_${VER}"

TAG=$(git ls-remote --tags origin | grep ${PUBLISH} || true)
if [ -n "$TAG" ]
then
  echo "remote publish tag exists"
  exit 1
fi

git checkout master
git reset --hard
git merge ${BRANCH}
git tag ${PUBLISH}
git push origin ${PUBLISH}
git push origin --delete ${BRANCH}
git push origin master

echo 'done.'
