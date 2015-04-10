# Ideas

 - Post each successful PR to twitter

## Paying people for contributions
It would be great using this bot for autonomous project management.
Think of it like this:

You have an awesome idea, but very limited time to work on it. However, you want this idea to be implemented as you and everyone else using it would still benefit immensely from it.
So you go head and write down a functional requirement specifications document and put it on Github.
You also integrate this bot into the repository.
Once you're done, you create issues for that project that require an equal amout of work to be done for the contributor.

Here comes the new part:
The bot now registers the issues and requests donators that have an interest in this issue being solved to create [2 of 2 multisignature Bitcoin addresses](http://bitcoin.stackexchange.com/questions/3712/how-can-i-create-a-multi-signature-2-of-3-transaction).
One private key being the bots, the other one being the donator's one.
Is a multisignature address successfully created and money being sent to it by the donator, the bot automatically advertises the bounty in the relevant issue.

If the issue is then linked and solved in a Pull-Request and ultimately accepted by votes, the donator and the bot agree on sending the money in the multisignature address to the person successfully creating the merged pull request.
