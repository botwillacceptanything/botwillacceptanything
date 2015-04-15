(function () {
  'use strict';

  var config = require('../config.js');

  var mediaPlaylist = [
    [
        "youtube",
        "Lecture 1A | MIT 6.001 Structure and Interpretation, 1986",
        "https://www.youtube.com/watch?v=2Op3QLzMgSY",
        1,12,55,
    ],
    [
        "youtube",
        "Star Trek: The Next Generation - S5E25 The Inner Light (1992)",
        "https://www.youtube.com/watch?v=RQKp27ZDuCk",
        0,4,3,
    ],
    [
        "youtube",
        "Chet Baker - Best Of Chet Baker",
        "https://www.youtube.com/watch?v=2Ynn3mzC2E4",
        1,23,53,
    ],
    [
        "youtube",
        "The Secret of Tremendous Corporation",
        "https://www.youtube.com/watch?v=SZMGCxnUQx8",
        0, 1,42,
    ],
    [
        "youtube",
        "PFUDOR metal",
        "https://www.youtube.com/watch?v=orrGbZaPgwY",
        0,1,59,
    ],
    [
        "youtube",
        "RAVE ON The Eye Tech (92 min.) - Part 1",
        "https://www.youtube.com/watch?v=ubDbPrvqIoQ",
        1,31,54,
    ],
    [
        "youtube",
        "Lecture 1B | MIT 6.001 Structure and Interpretation, 1986",
        "https://www.youtube.com/watch?v=dlbMuv-jix8",
        0,58,21,
    ],
    [
        "youtube",
        "MTV Original Broadcast 8/1/1981",
        "https://www.youtube.com/watch?v=XBf0yJVMSzI",
        0,1,52,
    ],
    [
        "youtube",
        "Timecop1983 - Journeys [Full Album]",
        "https://www.youtube.com/watch?v=egAB2qtVWFQ",
        0,59,42,
    ],
    [
        "soundcloud",
        "Essential mix - desyn masiello demi and omid 16b - 26-mar-2006",
        "https://soundcloud.com/walter-corral/essential-mix-desyn-masiello",
        "45849591",
        2,59,33,
    ],
    [
        "youtube",
        "The Kybalion of Hermes Trismegistus, [FULL Audiobook] (+ Emerald Tablet)",
        "https://www.youtube.com/watch?v=UvV8vLON-nY",
        3,43,53,
    ],
    [
        "youtube",
        "Sasha - Xpander",
        "https://www.youtube.com/watch?v=z3Gu7CXfRdA",
        0,10,44,
    ],
    [
        "youtube",
        "Nu-NRG live @Orgasmatron 07-09-2002",
        "https://www.youtube.com/watch?v=HvY016UyUVE",
        0,59,53,
    ],
    [
        "youtube",
        "Led Zeppelin - Stairway To Heaven",
        "https://www.youtube.com/watch?v=BcL---4xQYA",
        0,10,0,
    ],
    [
        "youtube",
        "Paul Oakenfold GU004 Oslo Disc 1",
        "https://www.youtube.com/watch?v=ksB0dIX69tk",
        1, 3,13,
    ],
    [
        "youtube",
        "Paul Oakenfold GU004 Oslo Disc 2",
        "https://www.youtube.com/watch?v=bq5UQKr2lp8",
        1, 6,13,
    ],
  ];

  var items = [];
  var grandTotalSeconds = 0;
  // compute total seconds and ETL
  var i;
  for (i = 0; i < mediaPlaylist.length; i += 1) {
    var playlistItem = mediaPlaylist[i]; var itemType = playlistItem[0];
    var itemTitle; var itemTotalSeconds; var itemSeconds; var itemMinutes; var itemHours; var itemURL; var itemMid;
    if (itemType == "youtube") {
        itemTitle = playlistItem[1];
        itemURL = playlistItem[2];
        itemMid = playlistItem[2].slice(playlistItem[2].length-11);
        itemHours = playlistItem[3];
        itemMinutes = playlistItem[4];
        itemSeconds = playlistItem[5];
    } else if (itemType == "soundcloud") {
        itemTitle = playlistItem[1];
        itemURL = playlistItem[2];
        itemMid = playlistItem[3];
        itemHours = playlistItem[4];
        itemMinutes = playlistItem[5];
        itemSeconds = playlistItem[6];
    } else {
        console.log("Unknown media type: ",playlistItem);
    }
    var itemTotalSeconds = itemSeconds + 60 * itemMinutes + 60 * 60 * itemHours;
    var item = {
        seconds : itemSeconds,
        minutes : itemMinutes,
        hours   : itemHours,
        totalSeconds : itemTotalSeconds,
        type : itemType,
        mid : itemMid,
        url : itemURL,
    };
    items.push(item);
    grandTotalSeconds += itemTotalSeconds;
  };

  var getMediaAt = function (seconds) {
    // seconds = number of seconds since midnight
    // return the media item in progress and offset in seconds
    var i;
    for (i = 0; i < items.length; i += 1) {
      var item = items[i];
      if (seconds < item.totalSeconds) {
        return [item,seconds];
      }
      seconds -= item.totalSeconds;
    }
  };

  var media = {
    getMediaAt : getMediaAt,
    items : items,
    grandTotalSeconds : grandTotalSeconds,
  }

  module.exports = media;
}());
