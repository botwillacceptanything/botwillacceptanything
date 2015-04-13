# Round-Robin Dispatcher Development (R2D2) a.k.a. "Network of Guinea Pigs"

Abstract: Protocol for testing new BWAA code.

Purpose: spread the risk of testing new code

New file: network.js (a.k.a. "the public bwaadcasting system" (PBWAAS)

## Main Section

### Definitions and Operations

#### Definition. When two bots are in the same dispatch class.

Two bots are in the same dispatch class if and only if they have the same
HEAD (git commit ID). Everything else can be different, but the HEADs must
match.

#### Definition. 192 trick.

https://github.com/botwillacceptanything/botwillacceptanything/issues/192
New issues in github function as channels for the bots, which are, for the
purposes of this document, arbitrary numerical constants. They look like
ISSUES/#DESCRIPTIONHERE.  which refers to a URL like the one above.

#### Definition. The ID of a bot.

is a quintuple (IP:PORT:HEAD:ROLE:LANG) where
role is one of CLERK,DISPATCH,TEST and language is something that doesn't
have to be implemented until internationalization, but why not now...six
one way, half dozen another (see below for brief notes on
internationalization). When any bot updates its code, it must talk with
clerk to figure out its role in order to get its proper ID. When a bot
transitions from TEST to DISPATCH role, it must rejoin the network
(through reinit, see below).

#### Definition. Network caches.

The network is maintained through a system of caches, one
cache per bot, each bot determining its behavior based on the contents of
its network cache. The "snapshot" is a particular kind of cache that
contains a master directory of the bots in the network. Full snapshot
means all bots in the network, partial snapshot means a subset of the
bots. Bots can hold onto multiple snapshots (in reality at most 2, but
potentially any number)

Spec. The clerk's network cache is special because it is the only bot that
contains an up-to-date list of all of the bots on the network (all other
bots are allowed to keep stale full snapshots; dispatchers are required to
keep up-to-date partial snapshots of their dispatch class). The clerk's
network cache consists of a single full snapshot, composed of:
 - SNAPSHOT DATA:
   - for each bot:
       - what is its ID
       - is it clerk, dispatcher, or test bot
       - who is its github user
       - what is its rank in its dispatch class (used when the dispatcher
         goes down)
       - any other relevant config info
    - for each dispatch class:
       - does it have a dispatcher or does a tester in this class need to
         become dispatcher
       - which bot is the dispatcher
       - list of bots in the class

 - the main behavior of a clerk: it must know what to do when a bot with a
   given HEAD shows up. Is there an existing dispatch class for that HEAD?
   If so, then do behavior join-existing-class, otherwise do behavior
   create-new-class

   - behavior join-existing-class means the following: if the class
     currently has a dispatcher, then the new bot becomes tester; if the
     class currently has no dispatcher, then the new bot becomes
     dispatcher.

   - behavior create-new-class just means the new bot is dispatcher of its
     own class; this will happen every time a test bot restarts, hence the
     name "round-robin". As new bots adopt the head, they are added as
     testers.

Spec. The dispatcher's network cache contains information about all of the
bots in the dispatch class and is kept up-to-date.
 - Like all bots, each dispatcher records a full snapshot updated from
   time to time.
 - The dispatcher keeps its class snapshot up-to-date.

Spec. The tester's network cache contains
 - full snapshot it received from the clerk
 - partial snapshot for the dispatch class which it updates by polling the
   dispatcher OR through receiving a "update to dispatch class snapshot"
   event from the dispatcher OR the clerk (note the case where the class
   goes temporarily dispatcher-less).
 - Test bots don't update their class snapshot unless they poll the
   dispatcher. After it receives its role from the clerk, a tester bot is
   activated only upon a request to participate in a PR trial, otherwise
   it does not contact the network unless it has some other reason.

Spec. All bots have at least one (maybe stale) full snapshot. It is served
at /netinit along with other network initialization information for
diagnostic purposes

### When a new bot joins the network...

 - the clerk must update its full snapshot by adding the new bot to it
 - the clerk must determine whether the new bot will be a dispatch bot or
   a test bot
 - for new testers, the bot must be assigned a rank (see below)
 - for new testers, the dispatcher in the tester's class must be notified
   that a new tester has arrived
 - the class dispatcher must update its class snapshot by adding the new
   bot to it
 - the class dispatcher may (or may not, idk) notify all of the testers in
   the class that a new tester has arrived
 - the new bot must obtain full snapshot from the clerk, which is used to
   create the partial class snapshot.
 - the bot joins a dispatch class (determined by its HEAD) and is assigned
   a rank within that class

### When a PR comes in...

 - the clerk sends it to all dispatchers
 - each dispatcher chooses a tester in its dispatch class to trial: merge
   and restart

### When a tester tests a PR...

 - the tester must post to ISSUES/#TRIALS
 - the tester creates some temp file to give it some hint as to what to do
   should it not survive the test.

### The network maintains the following invariants:

 - for each HEAD, there is at most one dispatcher in the network with that HEAD
 - for all values of HEAD and all integers n, there is at most one bot
   with that head and rank in the network

### The /netinit endpoint lists the following information:

 - is this a clerk, dispatcher, or tester
 - The other live bots in the network (the current contents of the bot's
   own network cache).

### Notes

 - The clerk is the only bot on the network that knows about all of the
   other bots. All other bots only know about their dispatch class.
 - It is possible for a test bot to become dispatcher should the class
   dispatcher go offline for some reason
 - It is not possible for a dispatcher to become a tester; a dispatcher
   without a tester just waits for the vote, merges, and restarts
 - A dispatcher is under no obligation to test PRs
 - Each test bot has a rank, which it is assigned when it joins the network.
 - If *any* bot in the network is testing a PR, it must tell *all* of the
   others via ISSUES/#TRIALS
 - tester ranks, once assigned, are constants that never change. The
   assigned rank for a bot that joins the network is one plus the maximum
   of the ranks of the bots in the network dispatch class. The dispatcher
   has no rank.
 - It would be useful to have some plan at some point for rehosting all of
   the 192 services if they start to get out of hand
 - Assume a 1-1 correspondence between IP:PORT pairs and bots.

## Bwaadcast (a.k.a. 192 technique)

 - ISSUES/#DISPATCH : this is the channel for dispatchers to indicate that
   they are farming out PRs to testers
 - ISSUES/#TRIALS : when a tester tests a new PR, it must first post a
   note to ISSUES#TRIALS to that effect. It is the complementary channel
   for testers to declare the fact of testing a PR
 - ISSUES/#RANK : the place where bots state their rank and head, so the
   next bot to come along with the same head can figure out what its rank
   should be; this will be one plus the maximum of the stated ranks in
   this issue
 - ISSUES/#NETINIT : Bots talk about joining the network

## Roles

There are three roles in the beginning: clerk, dispatch and test. Clerk is
the main bot, which also plays the role of dispatcher for its head. There
is only one clerk per network, but there may be one or more dispatchers
(in fact, under normal conditions there is exactly one bot playing the
role of dispatcher for each unique HEAD; a dispatch class can go
dispatcher-less for a period of time, but presumably one of them would
decide at some point to reboot, whereupon rejoining the network would
become dispatcher of the class; in fact, such bot could perform reinit
behavior (just like netinit) and inform the other bots via ISSUES/#NETINIT
of what is going on; this saves a reboot and is the one place where a bot
can change ID since it will have to go back to the clerk to figure out its
new post-reinit role).

The dispatcher is in charge of assigning PRs to bots in its class. So,
when a test bot is instructed to test a PR, it performs the behavior that
is now performed when processing a PR that passes a vote.

## Behaviors

Published to ISSUES/#BEHAVIOR via 192 trick

netinit, handle-new-member, become-tester, become-dispatcher,
become-clerk, dispatch PR # ... , test PR #, ...

When a bot tests a PR and fails internal diagnostics, it should post its
symptoms to the original ISSUE#192 informing the other bots of how it
feels.

## Botworld

Test bwaadcast *without* touching the network. This is done by launching
the bot in one of two modes: "main mode" and "botworld mode". Main mode is
launched the normal way, with main.js. Botworld on the other hand is
launched by botworld.js which does the same things as main, but is
configured by botworld.config.js AND config.js. This is because
botworld.js must read config.js in order to simulate the bot properly;
botworld will require at least the parameter of whether to role-play as a
clerk, dispatcher, or tester, and likely other parameters as testing
infrastructure develops.

This means: mocks for github, twitter, irc, ??? (I see docker in the tree,
but not in main.js)

Role-playing setting (play role of clerk, dispatcher, or tester)

Testing of behaviors...each behavior has an identifier

New files: mockgithub.js mocktwitter.js mockirc.js

## Internationalization

In Bot ID, LANG is one of
http://www.loc.gov/standards/iso639-2/php/code_list.php, the three letter
version or some other standard. Once text keys are set up...this is
another discussion for another day.

## End material

Random note: Custom favicons, switched by github username in config.js.
I'm having a hard time telling them apart; different favicon avatars to
give the bots some personality.

Advisory: this does not scale. It is not meant to scale. It is meant to
work well with <10 bots and hold on for dear life (with lots of hack work
done in a vain attempt to make it scale) with a couple dozen. If you want
it to scale, you should redesign it by throwing the spec away and starting
over :-)

Advisory: this approach has a single point of failure, the original
botwillacceptanything.com (the only bot to have the role of clerk, see
below). There are ways to get around this, but I don't go into them at
all.

Advisory: this is potentially dangerous...there is much talk of testing
out new commits before they reach the eyeballs of a single human being
other than the author, which is a security hazard. There are ways around
this, such as separation of voting for testing vs. voting for merging but
that is another direction. Also there are lots of repetitions in this
document and it is potentially self-contradictory
