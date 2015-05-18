(function () {
  'use strict';

  var weekdayPL = [
    [
        'youtube',
        'Lecture 1A | MIT 6.001 Structure and Interpretation, 1986',
        'https://www.youtube.com/watch?v=2Op3QLzMgSY',
        1,12,55,
    ],
    [
        'youtube',
        'Star Trek: The Next Generation - S5E25 The Inner Light (1992)',
        'https://www.youtube.com/watch?v=RQKp27ZDuCk',
        0,4,3,
    ],
    [
        'youtube',
        'Chet Baker - Best Of Chet Baker',
        'https://www.youtube.com/watch?v=2Ynn3mzC2E4',
        1,23,53,
    ],
    [
        'youtube',
        'The Secret of Tremendous Corporation',
        'https://www.youtube.com/watch?v=SZMGCxnUQx8',
        0, 1,42,
    ],
    [
        'youtube',
        'PFUDOR metal',
        'https://www.youtube.com/watch?v=orrGbZaPgwY',
        0,1,59,
    ],
    [
        'soundcloud',
        'Essential mix - desyn masiello demi and omid 16b - 26-mar-2006',
        'https://soundcloud.com/walter-corral/essential-mix-desyn-masiello',
        '45849591',
        2,59,33,
    ],
    [
        'youtube',
        'RAVE ON The Eye Tech (92 min.) - Part 1',
        'https://www.youtube.com/watch?v=ubDbPrvqIoQ',
        1,31,54,
    ],
    [
        'youtube',
        'Lecture 1B | MIT 6.001 Structure and Interpretation, 1986',
        'https://www.youtube.com/watch?v=dlbMuv-jix8',
        0,58,21,
    ],
    [
        'youtube',
        'MTV Original Broadcast 8/1/1981',
        'https://www.youtube.com/watch?v=XBf0yJVMSzI',
        0,1,52,
    ],
    [
        'youtube',
        'Timecop1983 - Journeys [Full Album]',
        'https://www.youtube.com/watch?v=egAB2qtVWFQ',
        0,59,42,
    ],
    [
        'youtube',
        'The Kybalion of Hermes Trismegistus, [FULL Audiobook] ' +
          '(+ Emerald Tablet)',
        'https://www.youtube.com/watch?v=UvV8vLON-nY',
        3,43,53,
    ],
    [
        'youtube',
        'Sasha - Xpander',
        'https://www.youtube.com/watch?v=z3Gu7CXfRdA',
        0,10,44,
    ],
    [
        'youtube',
        'Nu-NRG live @Orgasmatron 07-09-2002',
        'https://www.youtube.com/watch?v=HvY016UyUVE',
        0,59,53,
    ],
    [
        'youtube',
        'Led Zeppelin - Stairway To Heaven',
        'https://www.youtube.com/watch?v=BcL---4xQYA',
        0,10,0,
    ],
  ];

  // Weekend mix
  var weekendPL = [
    [
        'youtube',
        'InvaderZIM - Episode 1 - The Nightmare Begins [part 1]',
        'https://www.youtube.com/watch?v=-S28LQYiJq0',
        0,9,57,
    ],
    [
        'youtube',
        'Enya - Only Time (Official Music Video)',
        'https://www.youtube.com/watch?v=7wfYIMyS_dI',
        0,3,41,
    ],
    [
        'youtube',
        'Enya - Orinoco Flow (video)',
        'https://www.youtube.com/watch?v=LTrk4X9ACtw',
        0,3,44,
    ],
    [
        'youtube',
        'Enya - Caribbean Blue (video)',
        'https://www.youtube.com/watch?v=Jl8iYAo90pE',
        0,3,41,
    ],
    [
        'youtube',
        'Enya ( Full Album ) The Best of Enya',
        'https://www.youtube.com/watch?v=uZ91KDaW7kc',
        2,38,43,
    ],
    [
        'youtube',
        'Kiss the Rain - Yiruma',
        'https://www.youtube.com/watch?v=so6ExplQlaY',
        0,4,13,
    ],
    [
        'youtube',
        'Eurythmics - Sweet Dreams (Are Made Of This) (Official Video)',
        'https://www.youtube.com/watch?v=qeMFqkcPYcg',
        0,3,34,
    ],
    [
        'youtube',
        'POE - ANGRY JOHNNY (Music Video - Original 1995)',
        'https://www.youtube.com/watch?v=lrygAv93Ick',
        0,4,18,
    ],
    [
        'youtube',
        'The Captain & Steve Thomas - The Leader (Tinrib Records)',
        'https://www.youtube.com/watch?v=7MAiBFSWu3s',
        0,7,30,
    ],
    [
        'youtube',
        'R.E.M. Man On the Moon',
        'https://www.youtube.com/watch?v=1hKSYgOGtos',
        0,4,46,
    ],
    [
        'youtube',
        'Into the Matrix of Leadership',
        'https://www.youtube.com/watch?v=l9gM13LKlwE',
        0,6,4,
    ],
    [
        'youtube',
        '1. Being No one Going Nowhere - Ajahn Brahm',
        'https://www.youtube.com/watch?v=isfuvHljSU4',
        0,57,29,
    ],
    [
        'youtube',
        '19. Self hate (2004/05/07) Ven Ajahn Brahm',
        'https://www.youtube.com/watch?v=PlD8kRqV2nw',
        1,1,39,
    ],
    [
        'youtube',
        'Inside LSD Full Length Documentary',
        'https://www.youtube.com/watch?v=QgUFqAdGN24',
        0,45,23,
    ],
    [
        'youtube',
        'Pulp Fiction | Taxi Ride (HD) | MIRAMAX',
        'https://www.youtube.com/watch?v=WO2q1iQX2UA',
        0,3,22,
    ],
    [
        'youtube',
        'Pulp Fiction | Overdose (HD) | MIRAMAX',
        'https://www.youtube.com/watch?v=Gg3G6smr7M0',
        0,3,49,
    ],
    [
        'youtube',
        'Pulp Fiction | I Want To Dance (HD) | MIRAMAX',
        'https://www.youtube.com/watch?v=o5qXCzknxn8',
        0,3,56,
    ],
    [
        'youtube',
        'DR Base Vs Karim - N.W.A. \'98 (Tinrib Records)',
        'https://www.youtube.com/watch?v=CVbGxNgppH4',
        0,6,13,
    ],
    [
        'youtube',
        'Charlie Rose - An hour with Zbigniew Brzezinski, Brent Scowcroft & Henry Kissinger',
        'https://www.youtube.com/watch?v=nzIcbhT6AMg',
        0,56,0,
    ],
    [
        'youtube',
        'B1. Basic Model Theory 1',
        'https://www.youtube.com/watch?v=XBa8kAv1prY',
        0,56,21,
    ],
    [
        'youtube',
        'US Tanks Deployed to Latvia: US armor in Baltics to defend against Russian invasion threat',
        'https://www.youtube.com/watch?v=qJU5OeI7vPM',
        0,2,14,
    ],
    [
        'youtube',
        'StarCraft 2 - Maru vs. Life (TvZ) - IEM 2015 Taipei - Grand Final',
        'https://www.youtube.com/watch?v=Kbwk2vwXNyU',
        1,59,13,
    ],
    [
        'youtube',
        'CIA, FBI, NSA Secret Covert Psychological Experiments - MK Ultra, New Phoenix, ELF Waves',
        'https://www.youtube.com/watch?v=F3F6EkfD9vw',
        3,9,58,
    ],
    [
        'youtube',
        'Stan Getz & Joao Gilberto - Getz/Gilberto (1963)',
        'https://www.youtube.com/watch?v=9KpIV57PSeo',
        0,34,6,
    ],
  ];

  var warningPL = [
    [
        'youtube',
        'Stanley Kubrick\'s Speech',
        'https://www.youtube.com/watch?v=3p1T3sVX4EY',
        0,3,39,
    ],
    [
        'youtube',
        'Andy Farley - The Warning (Madam Zu Remix)',
        'https://www.youtube.com/watch?v=zX0UdgkILa0',
        0,8,27,
    ],
    [
        'youtube',
        'Barry Lyndon - Movie trailer from Kubrick`s Film',
        'https://www.youtube.com/watch?v=M4aDIc4uCOc',
        0,2,10,
    ],
  ];

  var specialPL = [
    [
        'youtube',
        'Marc Johnson & Tripoli Trax A History Of Hard House',
        'https://www.youtube.com/watch?v=tevI1_-00Uc',
        1,56,0,
    ],
    [
        'youtube',
        'Elvis Presley - Jailhouse Rock (Music Video)',
        'https://www.youtube.com/watch?v=gj0Rz-uP4Mk',
        0,2,43,
    ],
    [
        'youtube',
        '50\'s Music Compilation',
        'https://www.youtube.com/watch?v=b4qtltfyFts',
        0,56,18,
    ],
    [
        'youtube',
        'Sasha & Digweed- Northern Exposure: Expeditions CD1',
        'https://www.youtube.com/watch?v=MOKKv6f4TlA',
        1,3,7,
    ],
  ];

  var makePlaylist = function (plSource) {
    var items = [];
    var grandTotalSeconds = 0;
    // compute total seconds and ETL
    var i;
    for (i = 0; i < plSource.length; i += 1) {
      var playlistItem = plSource[i]; var itemType = playlistItem[0];
      var itemTitle, itemTotalSeconds, itemSeconds, itemMinutes, itemHours,
          itemURL, itemMid;
      if (itemType === 'youtube') {
          itemTitle = playlistItem[1];
          itemURL = playlistItem[2];
          itemMid = playlistItem[2].slice(playlistItem[2].length-11);
          itemHours = playlistItem[3];
          itemMinutes = playlistItem[4];
          itemSeconds = playlistItem[5];
      } else if (itemType === 'soundcloud') {
          itemTitle = playlistItem[1];
          itemURL = playlistItem[2];
          itemMid = playlistItem[3];
          itemHours = playlistItem[4];
          itemMinutes = playlistItem[5];
          itemSeconds = playlistItem[6];
      } else {
          console.log('Unknown media type: ',playlistItem);
      }
      itemTotalSeconds = itemSeconds + 60 * itemMinutes + 60 * 60 * itemHours;
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
    }
    // returns a libEntry
    return {
      items : items,
      grandTotalSeconds : grandTotalSeconds,
    };
  }

  var getMediaAt = function (libEntry, seconds) {
    // libEntry: something with 'grandTotalSeconds' and 'items'
    // seconds = number of seconds since midnight
    // return the media item in progress and offset in seconds
    seconds = seconds % libEntry.grandTotalSeconds;
    var items = libEntry.items;

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
    weekday : makePlaylist(weekdayPL),
    weekend : makePlaylist(weekendPL),
    special : makePlaylist(specialPL),
    warning : makePlaylist(warningPL),
    preempt : null,
  };
  module.exports = media;
}());
