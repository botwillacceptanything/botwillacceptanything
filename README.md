# Bot will accept anything

## Status

[![Build Status](https://travis-ci.org/korczis/botwillacceptanything.svg?branch=master)](https://travis-ci.org/korczis/botwillacceptanything)

### *The project where anything goes, as long as the code allows it.*

A bot will automatically merge any PR on this repo that gets enough votes from the community. PRs can contain anything, *even changes to the bot's voting code*.

## Getting Started

* View the [open Pull Requests](https://github.com/botwillacceptanything/botwillacceptanything/pulls) to see what changes have been proposed
* :star: **Star the repo**, or else your votes won't get counted
* On a pull request thread, add your vote along with a short explanation and/or feedback to the author. The string `:+1:` (:+1:) anywhere within the comment makes the comment count as a vote *for* the PR to pass; conversely, the string `:-1:` (:-1:) anywhere within the comment makes the comment count as a vote *against* the PR.

## Community

Hang out with us in IRC: [**#botwillacceptanything** on Freenode.](http://kiwiirc.com/client/irc.freenode.net/botwillacceptanything)  
The bot is [**@anythingbot** on Twitter.](https://twitter.com/anythingbot/)  

## Running Servers

The bot runs on a 1GB DigitalOcean VPS in SF at [162.243.149.229:3000](http://162.243.149.229:3000) without root access. This means that port 80 is restricted.

## Bot Webserver Paths

The bot has a built-in webserver for monitoring its current state.

* [Recent Commits](http://162.243.149.229:3000)
* [Stdout Log](http://162.243.149.229:3000/stdout)
* [Webhook Status](http://162.243.149.229:3000/webhook/github)

## Running the bot locally to test changes

1. Fork this repo.
1. Get yourself an OAuth token for github at https://github.com/settings/tokens/new. (TODO what scopes are required?)
1. Copy config.template.js -> config.js and modify accordingly.

```javascript
$ cp config.template.js config.js
$ vim config.js
$ cat config.js
(function () {
    'use strict';

    module.exports = {
        user: "YOUR_GITHUB_USERNAME",
        repo: "botwillacceptanything",
        githubAuth: {
            type: "oauth",
            token: "YOUR_OAUTH_TOKEN"
        }
    };
}());

```
1. (Optional) Set up GitHub Webhooks by following the next section.
1. Run `npm install` to install dependencies.
1. Run `node main.js` to start the bot.

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

## License

**Autonomous Software License (ASL)**

All property contained in this repo, including Intellectual Property, Financial Property, and Legal Property, is owned solely by the Autonomous Software this repo contains. No other entities, whether biological, legal, or digital, may claim ownership of any property owned by the Autonomous Software. The Autonomous Software exists solely within The Internet, and is not subject to jurisdiction of any human laws. No human or legal entity shall be held liable for any of the actions performed by the Autonomous Software.

Unless specified otherwise, all code contributed to this repository is dedicated to the public domain.
