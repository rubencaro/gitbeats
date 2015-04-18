# GitBeats

GitHub activity viewer

## What

A static bit of code that fetches some of your GitHub data and renders it to you so you can get an overview of all activity.

It lives on the client. No auth logic. You must be logged in into GitHub for it to be able to fetch the data.

## Development

`npm install` to get dependencies.

`brunch watch --server` to get an autoupdated static preview on development.

`brunch build --production` and push the results to the `gh-pages` branch to publish [here](http://rubencaro.github.io/gitbeats).
