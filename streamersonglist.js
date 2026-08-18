const apiUrl = "https://api.streamersonglist.com/v1/";
const streamerId = 26422; // y= 33022 , z = 26422
let requestStatus = null;
let currentSong = []
let currentSongType = 'normal';
let brb = false
let zName = null;
let statusSpeed = config.statusSpeed;
let liveLearns = config.livelearns;
const newDays = 15;

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
document.addEventListener('DOMContentLoaded', () => {
  updateQueue();
  setInterval(updateQueue, 3000);
 // setInterval(cycleInfoText, 5000);
  animateStatus();
window.addEventListener('resize', animateStatus);
});

function animateStatus() {
  const status = document.querySelector('.status');
  const start = -status.offsetWidth;
  const end = window.innerWidth;
  const distance = end - start;
  const speed = statusSpeed;
  const duration = (distance / speed) * 1000;
  status.style.animation = 'none';
  void status.offsetWidth;
  status.style.animation = `slideRight ${duration}ms linear infinite`;
}

async function updateQueue() {
  try {
    const [queueResponse, requestsResponse] = await Promise.all([
      fetch("https://zuljababot.onrender.com/api/songlist-queue"),
      fetch("https://zuljababot.onrender.com/api/songlist-requests-active")
    ]);

    const queueData = await queueResponse.json();
    const requestsData = await requestsResponse.json();

    if (!queueResponse.ok) {
      console.error("Queue error:", queueData);
      return;
    }

    if (!requestsResponse.ok) {
      console.error("Requests status error:", requestsData);
      return;
    }

    updateQueueSuccess(
      queueData,
      requestsData.requestsActive
    );

  } catch (err) {
    console.error("Failed to fetch queue or status:", err);
  }
}

async function getRequestsActive() {
  try {
    const response = await fetch(
      "https://zuljababot.onrender.com/api/songlist-requests-active"
    );
    const data = await response.json();
    if (!response.ok) {
      console.error("requestsActive HTTP error:", response.status, data);
      return null;
    }
    return data.requestsActive;
  } catch (err) {
    console.error("Failed to fetch requestsActive:", err);
    return null;
  }
}


function checkStatus(status) {
  const statusContainer = document.querySelector('.status-text');
  const statusImage = document.querySelector('.status');
  let colors;
  let newText;
  let image;
  if (status) {
    colors = ['#00FF00', '#39FF14', '#66FF66']
    newText = `${config.requestStatus[0]}<br>${config.requestStatus[1]}`
    image = 'images/status_open.gif'
  } else {
    colors = ['#FF0000', '#FF4C4C', '#FF7373']
    newText = `${config.requestStatus[2]}<br>${config.requestStatus[3]}`
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

function isSongNew(date) {
  const createdDate = new Date(date);
  const now = new Date();
  const diffMs = now - createdDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays < newDays
}

function updateQueueSuccess(data, requestStatus) {
  const userName = document.querySelector('.userName');
  const userNameColor = document.querySelector('.userNameColor');
  const songTitle = document.querySelector('.songTitle');
  const songArtist = document.querySelector('.songArtist');
  const songType = document.querySelector('.songType');
  const zImage = document.querySelector('.zulImage');
  let newSongType = 'normal';

  const zuldesc = config.zulRandomNames;

  checkStatus(requestStatus);

  let queue = [];

  if (data.playing) {
    queue = [data.playing];
  }

  if (!queue.length) {
    if (currentSongType != 'empty') {
      userName.style.visibility = 'hidden';
      userNameColor.style.visibility = 'hidden';
      songType.innerHTML = '';
      currentSongType = 'empty';

      zImage.style.backgroundImage = `url(images/normal.gif)`;

      songTitle.innerHTML = config.songRequest[0];
      songArtist.innerHTML = config.songRequest[1];

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

    return;
  }

  const current = queue[0];
const request = current.requests?.[0];

const name =
  request?.name ||
  request?.user?.username ||
  '';

let requestedBy = name;

  if (!requestedBy || requestedBy === 'zuljanim' || requestedBy === 'zulja') {
    if (!zName) {
      zName = zuldesc[Math.floor(Math.random() * zuldesc.length)];
    }

    requestedBy = zName;
  } else {
    if (/\bfor\b/i.test(requestedBy)) {
      requestedBy = `Requested ${requestedBy}`;
    } else {
      requestedBy = `Requested by ${requestedBy}`;
    }

    zName = null;
  }

  /*
   * SONG DATA
   */
  let songNote = ""
  if (current.songId === null) {
    songNote = current.requests?.[0].requestText || current.note || "";
  } else {
    songNote = current.note
  }

  if (current.songId === null) {
    const nonlistSong = current.nonlistSong;

    if (songNote === 'brb') {
      if (!brb) {
        zImage.style.backgroundImage = `url(images/brb.gif)`;
        songID = [config.brbDesc[0], config.brbDesc[1]];
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

  /*
   * NAME COLOR
   */

  let nameColor = '#6495ED';

  if (['imyooni', 'yooni', '유니', 'yuni', 'me'].includes(name)) {
    nameColor = '#FFA500';
  }

  if (['zuljanim', 'zulja', 'ㅈ'].includes(name)) {
    nameColor = '#FF69B4';
  }

  /*
   * NOTE TYPES
   */

  const notes = {
    practice: [
      '#00FA9A',
      '#32FFB8',
      '#50FFCD',
      `${config.practiceText[0]}<br>${config.practiceText[1]}`
    ],

    ll: [
      '#BA55D3',
      '#D288FF',
      '#E0B3FF',
      `${config.livelearnText[0]}<br>${config.livelearnText[1]}`
    ],

    new: [
      '#FFD700',
      '#FFE066',
      '#FFF3B0',
      `${config.newSongText[0]}<br>${config.newSongText[1]}`
    ],

    brb: [
      '#00ffddff',
      '#47f9ffff',
      '#80fff9ff',
      `${config.brbText[0]}<br>${config.brbText[1]}`
    ]
  };

  /*
   * NEW SONG
   */

  let newSong = false;

  if (current.song) {
    newSong = isSongNew(current.song.createdAt);
  }

  /*
   * NOTE KEY
   */

  let noteKey;

  if (songNote === 'practice') {
    noteKey = 'practice';
  } else {
    noteKey = newSong ? 'new' : songNote;
  }

  const [
    glow1,
    glow2,
    glow3,
    desc
  ] = notes[noteKey] || [
    '#87CEFA',
    '#ADD8E6',
    '#dbf6ff',
    ''
  ];

  if (notes[noteKey]) {
    nameColor = glow1;
    newSongType = noteKey;
  }

  /*
   * BRB STATE
   */

  if (songNote !== 'brb') {
    brb = false;
  }

  /*
   * IMAGE
   *
   * Recognized notes get their special image.
   * Unknown notes behave exactly like null/empty.
   */

  if (
    current.song &&
    current.song.title === '바나나 차차 Banana Cha Cha'
  ) {
    zImage.style.backgroundImage = `url(images/banana.gif)`;

  } else if (newSong) {
    zImage.style.backgroundImage = `url(images/sign.gif)`;

  } else if (songNote === 'brb') {
    zImage.style.backgroundImage = `url(images/brb.gif)`;

  } else if (notes[songNote]) {
    zImage.style.backgroundImage = `url(images/sign.gif)`;

  } else {
    zImage.style.backgroundImage = `url(images/cheer.gif)`;
  }

  /*
   * SHOW USER
   */

  if (
    getComputedStyle(userName).visibility === 'hidden' &&
    !brb
  ) {
    userName.style.visibility = 'visible';
    userNameColor.style.visibility = 'visible';
  }

  if (userName.textContent !== requestedBy) {
    userName.textContent = requestedBy;
  }

  if (
    getComputedStyle(userNameColor).backgroundColor !==
    toRGB(nameColor)
  ) {
    userNameColor.style.background = nameColor;
  }

  currentSongType = newSongType;

  /*
   * SONG TYPE DESCRIPTION
   */

  if (songType.innerHTML !== desc) {
    songType.innerHTML = desc;
  }

  if (
    current &&
    current.song &&
    current.song.title === '바나나 차차 Banana Cha Cha'
  ) {
    songType.innerHTML = '';
  }

  /*
   * GLOW COLORS
   */

  const colorVars = {
    '--glow1': glow1,
    '--glow2': glow1,
    '--glow3': glow2,
    '--glow4': glow3
  };

  Object.entries(colorVars).forEach(([key, value]) => {
    songType.style.setProperty(key, value);
  });

  const shadow =
    `0 0 6px ${glow1}, ` +
    `0 0 12px ${glow1}, ` +
    `0 0 20px ${glow2}, ` +
    `0 0 30px ${glow3}`;

  [songTitle, songArtist].forEach(el => {
    el.style.color = 'white';
    el.style.textShadow = shadow;
  });

  songType.style.color = 'white';
}

let currentIndex = 0;
function cycleInfoText() {
  const infoBox = document.querySelector('.infoText');
  const messages = liveLearns ? [
    config.llStatus[0], config.llStatus[1]] : [config.llStatus[2], config.llStatus[3]];
  if (document.hidden) {
    infoBox.textContent = messages[currentIndex];
    currentIndex = (currentIndex + 1) % messages.length;
    infoBox.classList.add('visible');
    return;
  }
  infoBox.classList.remove('visible');
  const handler = () => {
    clearTimeout(fallback);
    infoBox.removeEventListener('transitionend', handler);
    infoBox.textContent = messages[currentIndex];
    currentIndex = (currentIndex + 1) % messages.length;
    infoBox.style.textShadow = liveLearns
      ? `0 0 2px #000, 0 0 6px #FFFACD, 0 0 12px #FFD700, 0 0 16px #FFFFE0`
      : `0 0 2px #000, 0 0 6px #FF0000, 0 0 12px #FF4C4C, 0 0 16px #FF7373`;
    requestAnimationFrame(() => {
      infoBox.classList.add('visible');
    });
  };
  const fallback = setTimeout(handler, 1100);
  infoBox.addEventListener('transitionend', handler);
}


