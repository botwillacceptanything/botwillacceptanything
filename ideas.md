# Ideas

### Completed
 - [x] Integrate Travis CI testing.
 - [x] Auto-label each PR 'winning'/'losing' after a vote
 - [x] When tweeting, shorten links and include PR title.
 - [x] IRC Bot to post live updates to the IRC chatroom.
 - [x] Write Definition of Done file that all PRs should try to meet
 - [x] When non-stargazers vote, poke them with a comment immediately.
 
### To-Do
 - [ ] Run self tests before restarting bot
 - [ ] Add an HTTP interface to report current status, display logs, per-user voting stats, etc.
 - [ ] Create a bitcoin wallet to receive donations
 - [ ] Have bot check for bad and malicious code in pull requests.
 - [ ] Don't start voting until Travis CI tests pass using [the webhooks](http://docs.travis-ci.com/user/notifications/#Webhook-notification).
 - [ ] Have the bot post post Travis CI notifications using webhooks instead of Travis CI.
 - [ ] Add merge algorithm to solve conflicts in text files caused by multiple changes.
 - [ ] IRC Bot updates the title of the IRC chatroom with the GitHub vote status.
 - [ ] Use [CloudFlare](https://www.cloudflare.com/) to integrate SSL into the website for free.
