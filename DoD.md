# Definition of Done

Before any PR may be considered finished, it must meet the following criteria. Failure to meet any of these will result in the PR being marked as "Needs Review" by the bot.

1. Unit tests written and passing
  * Run `gulp mocha`
1. Functional test of all touched code run by author
1. Code coverage must not decrease - Visible on [Coveralls.io](https://coveralls.io/r/botwillacceptanything/botwillacceptanything)
  * If new code has been added, a new test must be written.
1. [CHANGELOG.md](https://github.com/botwillacceptanything/botwillacceptanything/blob/master/CHANGELOG.md) updated with a short description of changes
1. [ideas.md](https://github.com/botwillacceptanything/botwillacceptanything/blob/master/ideas.md) has been updated with the current state of the idea
  * If the core functionality is implemented, but a user interface is missing, split it into two ideas.
  * If the functionality paves the way for a new idea, add it to the list.

# Definition of Needs Review

Any PR that does not meet the criteria for being "Done" will remain open for voting and comments. During this phase, the PR can be refined and updated with additional commits until it can be considered "Done".

When the majority of voters are satisfied, and the PR meets all requirements, open a new PR and provide a link to the previous one.
