# Bot will accept anything

### *The project where anything goes, as long as the code allows it.*

A bot will automatically merge any PR on this repo that gets enough votes from the community. PRs can contain anything, *even changes to the bot's voting code*.

## :warning: NOTICE
The bot is currently hitting Github's API rate limit.

**Please send a message to Github support telling them we need the rate limit lifted for this account!**
https://github.com/contact?form%5Bsubject%5D=botwillacceptanything%20Rate%20Limiting

## Getting Started

* View the [open Pull Requests](https://github.com/botwillacceptanything/botwillacceptanything/pulls) to see what changes have been proposed
* :star: **Star the repo**, or else your votes won't get counted
* On a pull request thread, comment with `:+1:` (:+1:) to vote for the PR to pass, or `:-1:` (:-1:) to vote against the PR

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
