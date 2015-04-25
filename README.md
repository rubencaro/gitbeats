# GitBeats

GitHub activity viewer

## What

A static bit of code that fetches some of your GitHub data and renders it to you so you can get an overview of all activity.

It lives on the client. No auth logic. You must supply a [personal api token](https://github.com/blog/1509-personal-api-tokens) for it to be able to fetch the data.

## Development

`npm install && bower install` to get dependencies.

`npm run dev` to get an autoupdated static preview on development. To mimic github pages' environment, simply open `index.html` inside the public folder.

`npm run build` and push the results to the `gh-pages` branch to publish [here](http://rubencaro.github.io/gitbeats).
