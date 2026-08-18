
const liveLearnsPrice = ["$15", "2.5만 투네이션", "2.5만"]; // change the values as you like

const config = {
  livelearns: true,  // you can change this to true/false
  statusSpeed: 100,
  llStatus: [
    `You can request a song that is not on the list (ask first) \n${liveLearnsPrice[0]} / ${liveLearnsPrice[1]} / ${liveLearnsPrice[2]} 🧀`,
    `목록에 없는 곡도 라이브런으로 신청하실 수 있어요(악보와 문의먼저) \n${liveLearnsPrice[0]} / ${liveLearnsPrice[1]} / ${liveLearnsPrice[2]} 🧀`,
    "I'm not taking livelearns today Sorry :(",
    "오늘은 라이브런 신청을 받지 않아요 미안해요 ㅜ"
  ],
  requestStatus: [
    "Open",
    "신청가능",
    "Closed",
    "신청마감"
  ],
  songRequest: [
    "Take a look at the song list and feel free to request",
    "노래책 보시고 편하게 신청하세요"
  ],
  brbDesc: [
    "I will be back soon...",
    "빨리 다녀올게요 ^^"
  ],
  practiceText: [
    "Practice",
    "연습"
  ],
  livelearnText: [
    "Livelearn",
    "초견"
  ],
  newSongText: [
    "New Song",
    "신곡"
  ],
  brbText: [
    "BRB",
    "잠깐나감"
  ],
  zulRandomNames: [
     //add a , and '' to add more random zulja names
    'Zuljanim is playing', 'Zulja is playing', 'Zul is playing', 'BananaMom is playing',
    'Want puzzle type zulja', 'Anything is Fine :)',
    'Dota Feeder is playing', 'Yoonibabo :)', '(◕ ‿‿ <✿) ㅎ1ㅎ1'  
  ]
};