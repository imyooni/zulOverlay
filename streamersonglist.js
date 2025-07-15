
/*
document.addEventListener('DOMContentLoaded', () => {
    updateQueue();
    setInterval(updateQueue, 10000);
    cycleInfoText(); 
    setInterval(cycleInfoText, 8000); 
});

*/

const apiUrl = "https://api.streamersonglist.com/v1/";
const streamerName = "imyooni";
const streamerId = 33022; // y= 33022 , z = 26422
let requestStatus = null;
let currentSong = []
let liveLearns = true



const style = document.createElement('style');
style.textContent = `
  * {
    user-select: none !important;
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
  }
`;
document.head.appendChild(style);



/*
document.addEventListener('DOMContentLoaded', () => {
    updateQueue();
    setInterval(updateQueue, 10000);
    cycleInfoText(); 
    setInterval(cycleInfoText, 8000); 
});
*/





document.addEventListener('DOMContentLoaded', () => {
  updateQueue();
  setInterval(updateQueue, 10000);
 // cycleInfoText()
  setInterval(cycleInfoText, 8000);
});





let currentSongType = 'normal';
let brb = false

function updateQueue() {
    const queueUrl = `${apiUrl}streamers/${streamerName}/queue`;
    const statusUrl = `${apiUrl}streamers/${streamerName}/`;


    Promise.all([
        fetch(queueUrl).then(res => res.json()),
        fetch(statusUrl).then(res => res.json())
    ])
        .then(([queueData, statusData]) => {
            updateQueueSuccess(queueData, statusData.requestsActive);
        })
        .catch(err => {
            console.error('Failed to fetch queue or status:', err);
        });
}

function checkStatus(status) {
    const statusContainer = document.querySelector('.status-text');
    const statusImage = document.querySelector('.status');
    let colors;
    let newText;
    let image;
    if (status) {
        colors = ['#00FF00', '#39FF14', '#66FF66']
        newText = 'Open<br>신청가능'
        image = 'images/status_open.gif'
    } else {
        colors = ['#FF0000', '#FF4C4C', '#FF7373']
        newText = 'Closed<br>신청마감'
        image = 'images/status_closed.gif'
    }
    if (statusContainer.innerHTML !== newText) {
        statusImage.style.backgroundImage = `url(${image})`;
        statusContainer.innerHTML = newText;
        statusContainer.style.color = colors[0];
        statusContainer.style.textShadow =
            `0 0 6px ${colors[0]},` +
            `0 0 12px ${colors[0]},` +
            `0 0 20px ${colors[1]},` +
            `0 0 30px ${colors[2]}`;
    }
}

function toRGB(color) {
    const el = document.createElement("div");
    el.style.color = color;
    document.body.appendChild(el);
    const rgb = getComputedStyle(el).color;
    document.body.removeChild(el);
    return rgb;
}

let zName = null;

function updateQueueSuccess(data, requestStatus) {
  const userName = document.querySelector('.userName');
  const userNameColor = document.querySelector('.userNameColor');
  const songTitle = document.querySelector('.songTitle');
  const songArtist = document.querySelector('.songArtist');
  const songType = document.querySelector('.songType');
  const zImage = document.querySelector('.zulImage');
  let newSongType = 'normal';

  const zuldesc = [
    'Zuljanim is playing', 'Zulja is playing', 'BananaMom is playing',
    'Want puzzle type Zulja', 'Yoonibabo :)', '쥴자님이 연주하고 있어요',
    '(◕ ‿‿ <✿) ㅎ1ㅎ1', '프리유어헤드 ^^'
  ];

  checkStatus(requestStatus);

  const queue = data.list || [];
  queue.sort((a, b) => a.position - b.position);

  if (!queue.length) {
    if (currentSongType != 'empty') {
    userName.style.visibility = 'hidden';
    userNameColor.style.visibility = 'hidden';
    songType.innerHTML = ''
    currentSongType = 'empty';
    zImage.style.backgroundImage = `url(images/normal.gif)`;
    songTitle.innerHTML = 'Take a look at the song list and feel free to request';
    songArtist.innerHTML = '송리스트 보시고 편하게 신청하세요';
    songTitle.style.color = 'white';
    songTitle.style.textShadow =
            `0 0 2px #000,` +
            `0 0 6px #FFFACD,` +
            `0 0 12px #FFD700,` +
            `0 0 16px #FFFFE0`;
    songArtist.style.color = 'white';
    songArtist.style.textShadow =
            `0 0 2px #000,` +
            `0 0 6px #FFFACD,` +
            `0 0 12px #FFD700,` +
            `0 0 16px #FFFFE0`;
    }
    return
  }

  const current = queue[0];
  const name = current.requests[0]?.name || '';
  let requestedBy = name;

  if (!requestedBy || requestedBy === 'zuljanim' || requestedBy === 'zulja') {
    if (!zName) zName = zuldesc[Math.floor(Math.random() * zuldesc.length)];
    requestedBy = zName;
  } else {
    requestedBy = `Requested by ${requestedBy}`;
    zName = null;
  }

  if (current.song === null) {
    const nonlistSong = current.nonlistSong;
    if (current.note === 'brb') {
      if (!brb) {
        zImage.style.backgroundImage = `url(images/brb.gif)`;
        songID = ['I will be back soon..', '빨리 다녀올게요 ^^'];
        brb = true;
        newSongType = 'brb';
        userName.style.visibility = 'hidden';
        userNameColor.style.visibility = 'hidden';
      }
    } else {
      songID = nonlistSong?.includes('/')
        ? nonlistSong.split(/\s*\/\s*/, 2)
        : [nonlistSong || '', '---'];
    }
  } else {
    songID = [current.song.title, current.song.artist];
  }

  songTitle.innerHTML = songID[0];
  songArtist.innerHTML = songID[1];

  let nameColor = '#6495ED';
  if (['imyooni', '유니'].includes(name)) nameColor = '#FFA500';
  if (['zuljanim', 'zulja'].includes(name)) nameColor = '#FF69B4';

  const notes = {
    practice: ['#00FA9A', '#32FFB8', '#50FFCD', 'Practice<br>연습'],
    livelearn: ['#BA55D3', '#D288FF', '#E0B3FF', 'Livelearn<br>초견'],
    new: ['#FFD700', '#FFE066', '#FFF3B0', 'New Song<br>신곡'],
    brb: ['#FFA500', '#FFB347', '#FFD580', 'BRB<br>잠깐나감']
  };

  const [glow1, glow2, glow3, desc] = notes[current.note] || ['#87CEFA', '#ADD8E6', '#dbf6ff', ''];
  if (notes[current.note]) {
    nameColor = glow1;
    newSongType = current.note;
  } 
  if (current.note !== 'brb') brb = false;

  if (current.note === '') {
    zImage.style.backgroundImage = `url(images/normal.gif)`;
  } else {
    if (current.note !== 'brb') {
    zImage.style.backgroundImage = `url(images/sign.gif)`;
    }
  }

  if (getComputedStyle(userName).visibility === 'hidden' && !brb) {
    userName.style.visibility = 'visible';
    userNameColor.style.visibility = 'visible';
  }

  if (userName.textContent !== requestedBy) userName.textContent = requestedBy;

  if (getComputedStyle(userNameColor).backgroundColor !== toRGB(nameColor)) {
    userNameColor.style.background = nameColor;
  }
     currentSongType = newSongType;
  if (songType.innerHTML !== desc) {
    songType.innerHTML = desc;
  }

  const colorVars = { '--glow1': glow1, '--glow2': glow1, '--glow3': glow2, '--glow4': glow3 };
  Object.entries(colorVars).forEach(([k, v]) => songType.style.setProperty(k, v));
  const shadow = `0 0 6px ${glow1}, 0 0 12px ${glow1}, 0 0 20px ${glow2}, 0 0 30px ${glow3}`;
  [songTitle, songArtist].forEach(el => {
    el.style.color = 'white';
    el.style.textShadow = shadow;
  });
  songType.style.color = 'white';
}

let currentIndex = 0;
function cycleInfoText() {
  const infoBox = document.querySelector('.infoText');

  const messages = liveLearns
    ? [
        "You can request a song that is not on the list (live-learn) for $10 / 10000원",
        "목록에 없는 곡도 라이브러른으로 신청하실 수 있어요 — $10 / 10000원"
      ]
    : [
        "I'm not taking livelearns today Sorry :(",
        "오늘은 라이브러른 신청을 받지 않아요 미안해요 ㅜ"
      ];

  infoBox.classList.remove('visible'); // Start fade out

  // Wait for fade out to finish
  infoBox.addEventListener('transitionend', function handler() {
    infoBox.removeEventListener('transitionend', handler);

    // Set message and style
    infoBox.textContent = messages[currentIndex];
    currentIndex = (currentIndex + 1) % messages.length;

    infoBox.style.textShadow = liveLearns
      ? `0 0 2px #000, 0 0 6px #FFFACD, 0 0 12px #FFD700, 0 0 16px #FFFFE0`
      : `0 0 2px #000, 0 0 6px #FF0000, 0 0 12px #FF4C4C, 0 0 16px #FF7373`;

    // Force reflow + fade in
    requestAnimationFrame(() => {
      infoBox.classList.add('visible');
    });
  });
}

