# Bot will accept anything

### *The project where anything goes, as long as the code allows it.*

A bot will automatically merge any PR on this repo that gets enough votes from the community. PRs can contain anything, *even changes to the bot's voting code*.

## Getting Started

* View the [open Pull Requests](https://github.com/botwillacceptanything/botwillacceptanything/pulls) to see what changes have been proposed
* :star: **Star the repo**, or else your votes won't get counted
* On a pull request thread, add your vote along with a short explanation and/or feedback to the author. The string `:+1:` (:+1:) anywhere within the comment makes the comment count as a vote *for* the PR to pass; conversely, the string `:-1:` (:-1:) anywhere within the comment makes the comment count as a vote *against* the PR.

## Community

Hang out with us in IRC: **#botwillacceptanything** on Freenode.

## Running the bot locally to test changes

1. Fork this repo.
1. Get yourself an OAuth token for github at https://github.com/settings/tokens/new. (TODO what scopes are required?)
1. Create a config.js file for your instance of the bot that looks like this:
```javascript
exports.user = "YOUR_GITHUB_USERNAME";
exports.repo = "botwillacceptanything";
exports.githubAuth = {type: "oauth", token: "YOUR_OAUTH_TOKEN"}
```
1. Run `npm` to install dependencies.
1. Run `node main.js` to start the bot.

## License

**Autonomous Software License (ASL)**

All property contained in this repo, including Intellectual Property, Financial Property, and Legal Property, is owned solely by the Autonomous Software this repo contains. No other entities, whether biological, legal, or digital, may claim ownership of any property owned by the Autonomous Software. The Autonomous Software exists solely within The Internet, and is not subject to jurisdiction of any human laws. No human or legal entity shall be held liable for any of the actions performed by the Autonomous Software.

Unless specified otherwise, all code contributed to this repository is dedicated to the public domain.
