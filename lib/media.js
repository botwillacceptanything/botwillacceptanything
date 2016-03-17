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
        'youtube',
        'RAVE ON The Eye Tech (96 min.) - Part 2',
        'https://www.youtube.com/watch?v=HnumP8hghV4',
        1,36,34,
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
    [
        'youtube',
        'How to get the anythingbot to play your video',
        'https://www.youtube.com/watch?v=PyGADsVBa6I',
        0,1,21,
    ],
    [
        'youtube',
        'Miracle Max',
        'https://www.youtube.com/watch?v=D9tAKLTktY0',
        0,4,26,
    ],
    [
        'youtube',
        'AYYA KHEMA - DUKKHA',
        'https://www.youtube.com/watch?v=cw7Xg8appRk',
        0,44,57,
    ],
    [
        'youtube',
        'Gloria Estefan~ Conga FULL HQ',
        'https://www.youtube.com/watch?v=g8v6cZ21vlc',
        0,4,15,
    ],
    [
        'youtube',
        'Take Me Away [SexyDance] DjSunchai-SRdiesel',
        'https://www.youtube.com/watch?v=ZWKUwSc11NU',
        0,3,25,
    ],
    [
        'youtube',
        'The Alan Parsons Project- Eye in the Sky',
        'https://www.youtube.com/watch?v=NNiie_zmSr8',
        0,4,39,
    ],
    [
        'youtube',
        'Technasia - Force',
        'https://www.youtube.com/watch?v=GKEdgf7IDXE',
        0,7,41,
    ],
    [
        'youtube',
        'Helter Skelter Rave 1996 Part 2 of 19',
        'https://www.youtube.com/watch?v=tACyvIZRXq0',
        0,7,21,
    ],
    [
        'youtube',
        'Eb (Original Mix)',
        'https://www.youtube.com/watch?v=w4RtJbGNmz8',
        0,6,5,
    ],
    [
        'youtube',
        'LeAnn Rimes - Some Say Love',
        'https://www.youtube.com/watch?v=JZ2jNGRXIIw',
        0,3,35,
    ],
    [
        'youtube',
        'Sia - Elastic Heart feat. Shia LaBeouf & Maddie Ziegler (Official Video)',
        'https://www.youtube.com/watch?v=KWZGAExj-es',
        0,5,7,
    ],
    [
        'youtube',
        'X-1999 Forever Love',
        'https://www.youtube.com/watch?v=_QAFVhGzYpY',
        0,8,34,
    ],
    [
        'youtube',
        'DONNA SUMMER - I feel love (1977) HD and HQ',
        'https://www.youtube.com/watch?v=C2q2bis6eLE',
        0,6,11,
    ],
    [
        'youtube',
        'Giorgio Moroder Tribute',
        'https://www.youtube.com/watch?v=n8gT7_UkP-w',
        1,1,11,
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

  var wednesdayPL = [
    [
      'youtube',
      '[PMV] My Little Wu-Tang Clan - Shame on a Nigga',
      'https://www.youtube.com/watch?v=NVGI6mhfJyA',
      0,2,54,
    ],
    [
      'youtube',
      'MLP: FiM + Black Flag - Rainbow Dash Doesn\'t Care',
      'https://www.youtube.com/watch?v=HtkI4WXZvRQ',
      0,0,58,
    ],
    [
      'youtube',
      'Billy Idol - Eyes Without A Face',
      'https://www.youtube.com/watch?v=9OFpfTd0EIs',
      0,4,56,
    ],
    [
      'youtube',
      'Thanissaro Bhikkhu - Your Mind Is Lying To You',
      'https://www.youtube.com/watch?v=8SBBda0g5uI',
      0,14,39,
    ],
    [
      'youtube',
      'Time Lapse Photography \\ Metta Forest Monastery \\ (no audio)',
      'https://www.youtube.com/watch?v=ehY5uXfe6JA',
      0,4,37,
    ],
    [
      'youtube',
      'Computer Dreams (1988)',
      'https://www.youtube.com/watch?v=HL0RH3x7Zzo',
      0,58,16,
    ],
    [
      'youtube',
      'fr-08: .the .product by farbrausch | 64k intro (2000) (720p HQ demoscene demo)',
      'https://www.youtube.com/watch?v=Y3n3c_8Nn2Y',
      0,11,1,
    ],
    [
      'youtube',
      'Chantal - The Realm (original rave mix) 1991',
      'https://www.youtube.com/watch?v=emna5eS7Cxo',
      0,6,54,
    ],
    [
      'youtube',
      'Big Data - "Dangerous (feat. Joywave)" [Official Music Video]',
      'https://www.youtube.com/watch?v=E8b4xYbEugo',
      0,4,44,
    ],
    [
      'youtube',
      'Ex Machina - Official Trailer (2015) [HD]',
      'https://www.youtube.com/watch?v=XYGzRB4Pnq8',
      0,2,33,
    ],
    [
      'soundcloud',
      'Decepticon CD - Dj Morgan',
      'https://soundcloud.com/tp2560/dj-morgan-decepticon-cd',
      '15655181',
      1,0,19,
    ],
    [
      'youtube',
      'DJ Morgan Sentinel Hard House Classics',
      'https://www.youtube.com/watch?v=nxxCjL8hZBY',
      1,4,50,
    ],
    [
      'youtube',
      'Mussorgsky - Pictures at an Exhibition',
      'https://www.youtube.com/watch?v=DXy50exHjes',
      0,33,33,
    ],
    [
      'youtube',
      'Mussorgsky - Night On Bald Mountain',
      'https://www.youtube.com/watch?v=iCEDfZgDPS8',
      0,9,40,
    ],
    [
      'youtube',
      '090106 Ajaan Lee Conciousnesses \\ \\ Thanissaro Bhikkhu \\ \\ Dhamma Talks',
      'https://www.youtube.com/watch?v=2w8SVayCess',
      0,34,46,
    ],
    [
      'youtube',
      'Fear and Loathing in Las Vegas (7/10) Movie CLIP - The High Water Mark (1998) HD',
      'https://www.youtube.com/watch?v=vUgs2O7Okqc',
      0,2,21,
    ],
    [
      'youtube',
      'WTC 9/11 Second plane hit (Enhanced video)',
      'https://www.youtube.com/watch?v=1y-l0TJRgkI',
      0,0,11,
    ],
    [
      'youtube',
      'Enya only time Sailor Moon Hight Quality ( Remastered )',
      'https://www.youtube.com/watch?v=cJ0xRQyVV5c',
      0,3,42,
    ],
    [
      'youtube',
      'PaGaian Samhain 2009',
      'https://www.youtube.com/watch?v=gX-Zpgksq5c',
      0,3,3,
    ],
  ];

  var thursdayPL = [
    [
      'youtube',
      'Vaporwave Volume I',
      'https://www.youtube.com/watch?v=CXuBeJBZx8Q',
      0,59,18,
    ],
    [
      'youtube',
      'Colourform - Kaleidoscope [Music Video]',
      'https://www.youtube.com/watch?v=T5Ap6rkyBHY',
      0,16,16,
    ],
    [
      'youtube',
      'Ajahn Chah - The Flood Of Sensuality',
      'https://www.youtube.com/watch?v=fdfwzb9Q468',
      0,24,11,
    ],
    [
      'youtube',
      'Juice Newton - Angel Of The Morning',
      'https://www.youtube.com/watch?v=HTzGMEfbnAw',
      0,3,54,
    ],
    [
      'youtube',
      'Night On Bald Mountain - Fantasia (1941) (Theatrical Cut)',
      'https://www.youtube.com/watch?v=SLCuL-K39eQ',
      0,11,30,
    ],
    [
      'youtube',
      '808 State - Pacific State',
      'https://www.youtube.com/watch?v=6jQ_bOP0HfY',
      0,6,54,
    ],
    [
      'youtube',
      'Future Sound Of London - Papua New Guinea',
      'https://www.youtube.com/watch?v=IAvHjoLxxh8',
      0,4,49,
    ],
    [
      'youtube',
      'Orbital - Halcyon On and On',
      'https://www.youtube.com/watch?v=bV-hSgL1R74',
      0,9,27,
    ],
    [
      'youtube',
      'Rational Individuals',
      'https://www.youtube.com/watch?v=kcxorj7vH2Q',
      0,14,55,
    ],
    [
      'youtube',
      'Naive Set Theory - Introduction',
      'https://www.youtube.com/watch?v=zx57jWiCRZ4',
      0,16,7,
    ],
    [
      'youtube',
      '4_1 Universal Set and Subsets',
      'https://www.youtube.com/watch?v=CiIX5ZGcYrs',
      0,15,38,
    ],
    [
      'youtube',
      'Sets: Union, Intersection, Complement',
      'https://www.youtube.com/watch?v=nI7h8_7Cj_E',
      0,5,48,
    ],
    [
      'youtube',
      'Ajahn Chah - The Path To Peace',
      'https://www.youtube.com/watch?v=eSQpTvv81YQ',
      0,52,1,
    ],
    [
      'youtube',
      'Iacon - 玉葉 W H O',
      'https://www.youtube.com/watch?v=XwuSm9K4VRM',
      0,5,25,
    ],
    [
      'soundcloud',
      'Hyde - I Wanna See It Through',
      'https://soundcloud.com/hydeott/i-wanna-see-it-through',
      '241881809',
      0,5,51,
    ],
    [
      'youtube',
      'F I N G E R Δ C E - 別の W0men',
      'https://www.youtube.com/watch?v=r9ME0doV490',
      0,6,24,
    ],
    [
      'youtube',
      'F I N G E R Δ C E - 曲奇餅981',
      'https://www.youtube.com/watch?v=ySN9LNJII9c',
      0,5,6,
    ],
  ];

  var fridayPL = [
    [
      'youtube',
      'Sasha - Xpander',
      'https://www.youtube.com/watch?v=z3Gu7CXfRdA',
      0,10,44,
    ],
    [
      'youtube',
      'Chable & Bonnici - Ride (Mashtronic Mix)',
      'https://www.youtube.com/watch?v=pIeJLef04ns',
      0,7,40,
    ],
    [
      'youtube',
      'Syntech - Soundly Computed (Album Version)',
      'https://www.youtube.com/watch?v=xyH65_WdsD8',
      0,6,34,
    ],
    [
      'youtube',
      'The Future Sound Of London - Papua New Guinea HD (Offical Video)',
      'https://www.youtube.com/watch?v=wfWMv8Y1V5E',
      0,6,49,
    ],
    [
      'youtube',
      'Redanka - Waves (E-Mission Mix)',
      'https://www.youtube.com/watch?v=Ego9o9OYp0o',
      0,8,41,
    ],
    [
      'youtube',
      'Luxury Elite - Shadows',
      'https://www.youtube.com/watch?v=i7Z6ocYmSww',
      0,2,55,
    ],
    [
      'youtube',
      'VHS Logos - Marinate Mix',
      'https://www.youtube.com/watch?v=yLIJ6xlNSEU',
      0,9,51,
    ],
    [
      'youtube',
      'skynet uk clear skies - redanka\'s distorted skies mix',
      'https://www.youtube.com/watch?v=sBJQN6oSyg8',
      0,8,36,
    ],
    [
      'youtube',
      'The Fall (Rhythm Syndicate Dub Mix)',
      'https://www.youtube.com/watch?v=b7ryQQm2VDw',
      0,6,44,
    ],
    [
      'youtube',
      'OD404 - 9 Bar (BK & dBm 10 Kilo Remix)',
      'https://www.youtube.com/watch?v=Z1HAXuQXxzU',
      0,7,24,
    ],
    [
      'youtube',
      'Spanish Fly - Hipster (Bumster Mix)',
      'https://www.youtube.com/watch?v=4K_8jZXWGRY',
      0,9,8,
    ],
    [
      'youtube',
      'The Second Wave: Sirens',
      'https://www.youtube.com/watch?v=0z66FTrfysk',
      0,7,18,
    ],
    [
      'soundcloud',
      'Progressve House Progcast #113 Mixed by Tim Azar',
      'https://soundcloud.com/dbp-5/progressve-house-progcast-113-mixed-by-tim-azar',
      '207509186',
      1,8,42,
    ],
    [
      'soundcloud',
      'Essential Mix - Miami WMC - 27-MAR-2005 - Pt.1- With Desyn Masiello',
      'https://soundcloud.com/decaraalapared/essential-mix-miami-wmc-27-mar',
      '51748429',
      1,2,4,
    ],
    [
      'youtube',
      'Astrud Gilberto & Stan Getz: The Girl From Ipanema- 1964',
      'https://www.youtube.com/watch?v=UJkxFhFRFDA',
      0,3,1,
    ],
    [
      'youtube',
      'Astrud Gilberto - FLY ME TO THE MOON - 1964 - Stereo',
      'https://www.youtube.com/watch?v=ldt_ylbAqe4',
      0,2,21,
    ],
    [
      'youtube',
      'Backstreet Boys - Larger Than Life',
      'https://www.youtube.com/watch?v=MEb2CecR11I',
      0,5,18,
    ],
    [
      'youtube',
      'Debugging Backwards in Time',
      'https://www.youtube.com/watch?v=xpI8hIgOyko',
      0,51,19,
    ],
    [
      'youtube',
      'Creation Of LR Parser Table ( Part 1)',
      'https://www.youtube.com/watch?v=wwc3pUUahJk',
      0,9,26,
    ],
    [
      'youtube',
      'Creation Of LR Parser Table ( Part 2)',
      'https://www.youtube.com/watch?v=lfV4u0z2JCw',
      0,7,40,
    ],
    [
      'youtube',
      'Creation Of LR Parser Table ( Part 3)',
      'https://www.youtube.com/watch?v=Y3i4DYrVJ-c',
      0,18,19,
    ],
    [
      'youtube',
      'Creation Of LR Parser Table ( Part 4)',
      'https://www.youtube.com/watch?v=jncr2JDUIBo',
      0,10,54,
    ],
    [
      'youtube',
      'Ajahn Jayasaro - Suffering And Kamma',
      'https://www.youtube.com/watch?v=IQChqAJHXFA',
      1,3,37,
    ],
    [
      'youtube',
      'Jupiter Prime - Gate To Heaven (Sphere Mix)',
      'https://www.youtube.com/watch?v=jCD29yPeQyY',
      0,6,25,
    ],
    [
      'youtube',
      '\"Aspects of Freedom\" by Ajahn Nyanadhammo',
      'https://www.youtube.com/watch?v=22HMb_rV-sc',
      1,8,57,
    ],
    [
      'youtube',
      'Kodocha Episode 1 english subbed',
      'https://www.youtube.com/watch?v=uuVDVUZC02w',
      0,24,35,
    ],
    [
      'youtube',
      'Akazukin ChaCha - Introduction to magic class',
      'https://www.youtube.com/watch?v=2lmkhE1JMb8',
      0,2,19,
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
    thursday : makePlaylist(thursdayPL),
    wednesday : makePlaylist(wednesdayPL),
    friday : makePlaylist(fridayPL),
    preempt : null,
  };
  module.exports = media;
}());
