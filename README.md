# Bot will accept anything

## Status

[![Build Status](https://travis-ci.org/botwillacceptanything/botwillacceptanything.svg?branch=master)](https://travis-ci.org/botwillacceptanything/botwillacceptanything)
[![Code Climate](https://codeclimate.com/github/botwillacceptanything/botwillacceptanything/badges/gpa.svg)](https://codeclimate.com/github/botwillacceptanything/botwillacceptanything)
[![Coverage Status](https://coveralls.io/repos/botwillacceptanything/botwillacceptanything/badge.png?branch=master)](https://coveralls.io/r/botwillacceptanything/botwillacceptanything?branch=master)
[![Dependency Status](https://gemnasium.com/botwillacceptanything/botwillacceptanything.svg)](https://gemnasium.com/botwillacceptanything/botwillacceptanything)
[![Pinkie Pie Approval Status](http://dosowisko.net/pinkiepieapproved.svg)](https://www.youtube.com/watch?v=FULyN9Ai-A0)

### *The project where anything goes, as long as the code allows it.*

A bot will automatically merge any PR on this repo that gets enough votes from the community. PRs can contain anything, *even changes to the bot's voting code*.

## Getting Started

* View the [open Pull Requests](https://github.com/botwillacceptanything/botwillacceptanything/pulls) to see what changes have been proposed
* :star: **Star the repo**, or else your votes won't get counted
* On a pull request thread, add your vote along with a short explanation and/or feedback to the author. The string `:+1:` (:+1:) anywhere within the comment makes the comment count as a vote *for* the PR to pass; conversely, the string `:-1:` (:-1:) anywhere within the comment makes the comment count as a vote *against* the PR.

## Contributing

Anyone can create a pull request, and it is greatly appreciated by the community. In order for a pull request to be accepted, the bot has requested that it meets the criteria in its [Definition of Done](https://github.com/botwillacceptanything/botwillacceptanything/blob/master/DoD.md). If you're looking for ideas, please look at [ideas.md](https://github.com/botwillacceptanything/botwillacceptanything/blob/master/ideas.md), and join us in our [IRC](http://kiwiirc.com/client/irc.freenode.net/botwillacceptanything) for ideas or advice on how to implement something.

## Community

Hang out with us in IRC: [**#botwillacceptanything** on Freenode.](http://kiwiirc.com/client/irc.freenode.net/botwillacceptanything)
The bot is [**@anythingbot** on Twitter.](https://twitter.com/anythingbot/)

## Running Servers

The bot runs on a 1GB DigitalOcean VPS in SF at [botwillacceptanything.com](http://botwillacceptanything.com) without root access. Port 80 is a proxy to port 3000 via nginx.

## Bot Webserver Paths

The bot has a built-in webserver for monitoring its current state.

* [Homepage](http://botwillacceptanything.com/)
* [Recent Commits](http://botwillacceptanything.com/commits)
* [Stdout Log](http://botwillacceptanything.com/stdout)
* [Statistics](http://botwillacceptanything.com/statistics)

## Running the bot locally to test changes

1. Fork this repo.
1. Get yourself an OAuth token for github at https://github.com/settings/tokens/new. (TODO what scopes are required?)
1. Copy configs/template.js -> configs/custom.js and modify accordingly.
1. Disable any items in the mocks section that you would like to function normally.

```javascript
$ cp configs/template.js configs/custom.js
$ vim configs/custom.js
$ cat configs/custom.js
(function () {
    'use strict';

    module.exports = {
        webserver: {
            port: 3000
        },
        user: "YOUR_GITHUB_USERNAME",
        repo: "botwillacceptanything",
        githubAuth: {
            type: "oauth",
            token: "YOUR_OAUTH_TOKEN"
        },
        mocks: {
            twitter: true,
        },
    };
}());

```
1. (Optional) Set up GitHub Webhooks by following the next section.
1. (Optional) Install node-foreman with npm. The package prefers a 
global install but a non-global one will work if the 'nf' command can be 
found in the PATH.
1. Run `npm install` to install dependencies.
1. Run `node main.js` to start the bot. Alternatively, if you installed 
foreman earlier, `nf start` will also 
start the bot as well as giving slightly prettier console output.

## Setting up GitHub Webhooks

1. Go to your repository settings, and click **Webhooks & Services**
1. Create a new webhook with the following settings:
  * Payload URL: Externally accessible address with a path of /webhook/github
    * http://example.com:3000/webhook/github
  * Content type: *application/json*
  * Secret: **Copy this secret. It is used in the config.**
  * Which events: *Send me **everything**.*
1. Add the Webhook Secret into config.js like this:
```javascript
exports.githubAuth.webhookSecret = 'rsvz9ytsjMpYfKW8CO8SQPSoxiJsVb03';
```

## Our motto

> Any sufficiently advanced technology is indistinguishable from magic. - Arthur C. Clarke

## License

**Autonomous Software License (ASL)**

All property contained in this repo, including Intellectual Property, Financial Property, and Legal Property, is owned solely by the Autonomous Software this repo contains. No other entities, whether biological, legal, or digital, may claim ownership of any property owned by the Autonomous Software. The Autonomous Software exists solely within The Internet, and is not subject to jurisdiction of any human laws. No human or legal entity shall be held liable for any of the actions performed by the Autonomous Software.

Unless specified otherwise, all code contributed to this repository is dedicated to the public domain.
