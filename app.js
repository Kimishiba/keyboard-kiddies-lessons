// Keyboard Kiddies Lessons - Main Game logic

// Frequencies and animals mapping
const NOTE_DATA = {
  'c-key':  { name: 'Cat', emoji: '🐱', freq: 261.63, letter: 'C' },
  'd-key':  { name: 'Dog', emoji: '🐶', freq: 293.66, letter: 'D' },
  'e-key':  { name: 'Elephant', emoji: '🐘', freq: 329.63, letter: 'E' },
  'f-key':  { name: 'Frog', emoji: '🐸', freq: 349.23, letter: 'F' },
  'g-key':  { name: 'Giraffe', emoji: '🦒', freq: 392.00, letter: 'G' },
  'a-key':  { name: 'Alligator', emoji: '🐊', freq: 440.00, letter: 'A' },
  'b-key':  { name: 'Bear', emoji: '🐻', freq: 493.88, letter: 'B' },
  'c5-key': { name: 'Cheetah', emoji: '🐆', freq: 523.25, letter: 'C5' },
  // Black keys
  'cs-key': { name: 'Crow', emoji: '🐦', freq: 277.18, letter: 'C#' },
  'ds-key': { name: 'Duck', emoji: '🦆', freq: 311.13, letter: 'D#' },
  'fs-key': { name: 'Fox', emoji: '🦊', freq: 369.99, letter: 'F#' },
  'gs-key': { name: 'Goat', emoji: '🐐', freq: 415.30, letter: 'G#' },
  'as-key': { name: 'Ant', emoji: '🐜', freq: 466.16, letter: 'A#' }
};

// Global App State
const state = {
  profiles: [],
  currentProfile: null,
  activeScreen: 'login',
  
  // Game Lesson States
  lesson1: {
    round: 0,
    maxRounds: 5,
    currentRoarIsLoud: false,
    correctCount: 0,
    hasListened: false
  },
  lesson2: {
    round: 0,
    maxRounds: 5,
    currentPitchIsHigh: false,
    correctCount: 0,
    isWaitingForChoice: false
  },
  lesson3: {
    bpm: 100,
    isPlaying: false,
    timerId: null,
    beatCount: 0,
    maxBeats: 12,
    targetBeatTimes: [],
    userTaps: [],
    hits: 0,
    speedStage: 1 // 1 = slow, 2 = fast
  },
  lesson4: {
    targetKey: null,
    step: 0,
    stepsList: ['c-key', 'e-key', 'g-key', 'f-key', 'd-key']
  },
  lesson6: {
    round: 0,
    maxRounds: 5,
    currentTempoIsFast: false,
    correctCount: 0,
    hasListened: false,
    tempoIntervalId: null,
    isWaitingForChoice: false
  },
  lesson7: {
    round: 0,
    maxRounds: 5,
    parrotSequence: [],
    userSequence: [],
    correctCount: 0,
    isUserTurn: false
  },
  lesson8: {
    round: 0,
    maxRounds: 5,
    currentChordIsMajor: false,
    correctCount: 0,
    hasListened: false,
    isWaitingForChoice: false
  },
  lesson5: {
    activeSong: null,
    isPlaying: false,
    score: 0,
    totalNotes: 0,
    spawnedNotes: [],
    animationFrameId: null,
    startTime: null,
    noteIndex: 0
  },
  sandbox: {
    isRecording: false,
    recordStartTime: null,
    recordedNotes: []
  }
};

// Song Data
const SONGS = {
  mary: [
    { note: 'e-key', time: 500 },
    { note: 'd-key', time: 1000 },
    { note: 'c-key', time: 1500 },
    { note: 'd-key', time: 2000 },
    { note: 'e-key', time: 2500 },
    { note: 'e-key', time: 3000 },
    { note: 'e-key', time: 3500 },
    { note: 'd-key', time: 4200 },
    { note: 'd-key', time: 4700 },
    { note: 'd-key', time: 5200 },
    { note: 'e-key', time: 5900 },
    { note: 'g-key', time: 6400 },
    { note: 'g-key', time: 6900 }
  ],
  twinkle: [
    { note: 'c-key', time: 500 },
    { note: 'c-key', time: 1000 },
    { note: 'g-key', time: 1500 },
    { note: 'g-key', time: 2000 },
    { note: 'a-key', time: 2500 },
    { note: 'a-key', time: 3000 },
    { note: 'g-key', time: 3500 },
    { note: 'f-key', time: 4500 },
    { note: 'f-key', time: 5000 },
    { note: 'e-key', time: 5500 },
    { note: 'e-key', time: 6000 },
    { note: 'd-key', time: 6500 },
    { note: 'd-key', time: 7000 },
    { note: 'c-key', time: 7500 }
  ]
};

// DOM Elements Cache
const DOM = {
  container: document.getElementById('game-container'),
  header: document.getElementById('game-header'),
  backBtn: document.getElementById('btn-back'),
  headerAvatar: document.getElementById('header-user-avatar'),
  headerStars: document.getElementById('header-star-count'),
  btnLogout: document.getElementById('btn-logout'),
  
  // Screens
  screens: {
    login: document.getElementById('screen-login'),
    map: document.getElementById('screen-map'),
    dynamics: document.getElementById('screen-dynamics'),
    pitch: document.getElementById('screen-pitch'),
    rhythm: document.getElementById('screen-rhythm'),
    notes: document.getElementById('screen-notes'),
    melody: document.getElementById('screen-melody'),
    tempo: document.getElementById('screen-tempo'),
    copycat: document.getElementById('screen-copycat'),
    feelings: document.getElementById('screen-feelings'),
    sandbox: document.getElementById('screen-sandbox')
  },
  
  // Login
  inputUsername: document.getElementById('input-username'),
  btnLoginStart: document.getElementById('btn-login-start'),
  existingUsersSec: document.getElementById('existing-users-section'),
  usersPillContainer: document.getElementById('users-pill-container'),
  avatarSelection: document.getElementById('login-avatar-selection'),
  
  // Map
  leoMapText: document.getElementById('leo-map-text'),
  
  // Lesson 1 - Dynamics
  leoRoarStage: document.getElementById('leo-roar-stage'),
  btnRoarListen: document.getElementById('btn-roar-listen'),
  dynamicsChoices: document.getElementById('dynamics-choices-container'),
  dynamicsPrompt: document.getElementById('dynamics-prompt'),
  choiceSoft: document.getElementById('choice-soft'),
  choiceLoud: document.getElementById('choice-loud'),
  
  // Lesson 2 - Pitch
  monkeyPitchSprite: document.getElementById('monkey-pitch-sprite'),
  btnPitchReplay: document.getElementById('btn-pitch-replay'),
  btnPitchHigh: document.getElementById('btn-pitch-high'),
  btnPitchLow: document.getElementById('btn-pitch-low'),
  
  // Lesson 3 - Rhythm
  hippoSprite: document.getElementById('hippo-sprite'),
  rhythmText: document.getElementById('rhythm-text'),
  rhythmVisualizer: document.getElementById('rhythm-visualizer-bar'),
  btnDrumPad: document.getElementById('btn-drum-pad'),
  
  // Lesson 4 - Notes
  notesInstruction: document.getElementById('notes-instruction-text'),
  keyboardNotes: document.getElementById('keyboard-notes'),
  
  // Lesson 5 - Melody
  btnSong1: document.getElementById('btn-select-song-1'),
  btnSong2: document.getElementById('btn-select-song-2'),
  melodyHighway: document.getElementById('melody-highway'),
  keyboardMelody: document.getElementById('keyboard-melody'),
  
  // Lesson 6 - Tempo
  tempoStage: document.getElementById('tempo-stage'),
  tempoCheetah: document.getElementById('tempo-cheetah'),
  tempoTurtle: document.getElementById('tempo-turtle'),
  btnTempoListen: document.getElementById('btn-tempo-listen'),
  tempoChoices: document.getElementById('tempo-choices-container'),
  tempoPrompt: document.getElementById('tempo-prompt'),
  choiceTempoSlow: document.getElementById('choice-tempo-slow'),
  choiceTempoFast: document.getElementById('choice-tempo-fast'),
  
  // Lesson 7 - Copycat
  copycatInstruction: document.getElementById('copycat-instruction-text'),
  keyboardCopycat: document.getElementById('keyboard-copycat'),
  
  // Lesson 8 - Feelings
  feelingsStage: document.getElementById('feelings-stage'),
  btnFeelingsListen: document.getElementById('btn-feelings-listen'),
  feelingsChoices: document.getElementById('feelings-choices-container'),
  feelingsPrompt: document.getElementById('feelings-prompt'),
  choiceFeelingsHappy: document.getElementById('choice-feelings-happy'),
  choiceFeelingsSad: document.getElementById('choice-feelings-sad'),
  
  // Sandbox
  recordDot: document.getElementById('sandbox-record-indicator'),
  btnRecordToggle: document.getElementById('btn-record-toggle'),
  btnRecordPlay: document.getElementById('btn-record-play'),
  keyboardSandbox: document.getElementById('keyboard-sandbox'),
  
  // Popup
  popupCongrats: document.getElementById('popup-congrats'),
  popupAvatar: document.getElementById('popup-avatar'),
  popupTitle: document.getElementById('popup-title'),
  popupText: document.getElementById('popup-text'),
  popupStars: document.getElementById('popup-stars-container'),
  popupBtnAction: document.getElementById('popup-btn-action')
};

// ----------------------------------------------------
// BOOTSTRAP & NAVIGATION
// ----------------------------------------------------

function init() {
  loadProfiles();
  setupEventListeners();
  renderKeyboard(DOM.keyboardNotes, 'notes');
  renderKeyboard(DOM.keyboardMelody, 'melody');
  renderKeyboard(DOM.keyboardCopycat, 'copycat');
  renderKeyboard(DOM.keyboardSandbox, 'sandbox');
  renderExistingUsers();
  
  // Pointer down selection for login avatar
  DOM.avatarSelection.addEventListener('pointerdown', (e) => {
    const option = e.target.closest('.avatar-option');
    if (!option) return;
    document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
    option.classList.add('selected');
  });

  // Auto-login to last active user
  const activeUser = localStorage.getItem('kiddies_active_user');
  if (activeUser) {
    const profile = state.profiles.find(p => p.name.toLowerCase() === activeUser.toLowerCase());
    if (profile) {
      state.currentProfile = profile;
      showScreen('map');
      updateMapUI();
    }
  }
}

function showScreen(screenName) {
  // Clean up any ongoing animations or loops
  cleanupActiveGames();

  // Route screen toggle
  Object.keys(DOM.screens).forEach(name => {
    if (name === screenName) {
      DOM.screens[name].classList.add('active');
    } else {
      DOM.screens[name].classList.remove('active');
    }
  });
  
  state.activeScreen = screenName;
  
  // Header bar visibility
  if (screenName === 'login') {
    DOM.header.style.display = 'none';
  } else {
    DOM.header.style.display = 'flex';
    updateHeaderUI();
  }
}

function updateHeaderUI() {
  if (!state.currentProfile) return;
  DOM.headerAvatar.textContent = state.currentProfile.avatar;
  DOM.headerName.textContent = state.currentProfile.name;
  DOM.headerStars.textContent = state.currentProfile.stars || 0;
}

function cleanupActiveGames() {
  // Stop rhythm game loops
  if (state.lesson3.isPlaying) {
    clearInterval(state.lesson3.timerId);
    state.lesson3.isPlaying = false;
  }
  // Stop melody game loops
  if (state.lesson5.isPlaying) {
    cancelAnimationFrame(state.lesson5.animationFrameId);
    state.lesson5.isPlaying = false;
    DOM.melodyHighway.querySelectorAll('.music-bubble').forEach(b => b.remove());
  }
  // Stop tempo timers
  if (state.lesson6.tempoIntervalId) {
    clearInterval(state.lesson6.tempoIntervalId);
    state.lesson6.tempoIntervalId = null;
  }
  state.lesson6.hasListened = false;
  
  // Polly turn
  state.lesson7.isUserTurn = false;

  // Clean sandbox playbacks
  state.sandbox.isRecording = false;
  DOM.recordDot.classList.remove('recording');
  DOM.btnRecordToggle.textContent = 'Record 🎙️';
}

function setupEventListeners() {
  // Back button
  DOM.backBtn.addEventListener('pointerdown', () => {
    if (state.activeScreen !== 'map' && state.activeScreen !== 'login') {
      showScreen('map');
      updateMapUI();
    }
  });

  // Login click
  DOM.btnLoginStart.addEventListener('pointerdown', () => {
    const name = DOM.inputUsername.value.trim();
    if (!name) {
      alert("Please enter your name!");
      return;
    }
    const selectedAvatarEl = DOM.avatarSelection.querySelector('.selected');
    const avatar = selectedAvatarEl ? selectedAvatarEl.dataset.avatar : '🦁';
    
    loginOrCreateUser(name, avatar);
  });

  // Setup Map Node Clicks
  document.querySelectorAll('.map-node').forEach(node => {
    node.addEventListener('pointerdown', () => {
      if (node.classList.contains('locked')) {
        window.kidsAudioEngine.playMistake();
        return;
      }
      const lessonNum = parseInt(node.dataset.lesson);
      if (lessonNum === 9) {
        showScreen('sandbox');
        initSandboxGame();
      } else {
        startLesson(lessonNum);
      }
    });
  });

  // Popup overlay close/action button
  DOM.popupBtnAction.addEventListener('pointerdown', () => {
    DOM.popupCongrats.classList.remove('active');
    showScreen('map');
    updateMapUI();
  });

  // Logout Switch Player click
  DOM.btnLogout.addEventListener('pointerdown', () => {
    localStorage.removeItem('kiddies_active_user');
    state.currentProfile = null;
    showScreen('login');
  });
}

// ----------------------------------------------------
// PROFILE LOGIC (LOCAL STORAGE)
// ----------------------------------------------------

function loadProfiles() {
  const saved = localStorage.getItem('kiddies_profiles');
  state.profiles = saved ? JSON.parse(saved) : [];
}

function saveProfiles() {
  localStorage.setItem('kiddies_profiles', JSON.stringify(state.profiles));
}

function loginOrCreateUser(name, avatar) {
  let user = state.profiles.find(p => p.name.toLowerCase() === name.toLowerCase());
  if (!user) {
    user = {
      name: name,
      avatar: avatar,
      stars: 0,
      completedLessons: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
      highScore: 0
    };
    state.profiles.push(user);
    saveProfiles();
  }
  state.currentProfile = user;
  localStorage.setItem('kiddies_active_user', user.name); // Set active session
  renderExistingUsers();
  showScreen('map');
  updateMapUI();
}

function renderExistingUsers() {
  DOM.usersPillContainer.innerHTML = '';
  if (state.profiles.length > 0) {
    DOM.existingUsersSec.style.display = 'block';
    state.profiles.forEach(p => {
      const pill = document.createElement('div');
      pill.className = 'user-pill';
      pill.innerHTML = `<span>${p.avatar}</span> <span>${p.name}</span>`;
      pill.addEventListener('pointerdown', () => {
        state.currentProfile = p;
        localStorage.setItem('kiddies_active_user', p.name); // Set active session
        showScreen('map');
        updateMapUI();
      });
      DOM.usersPillContainer.appendChild(pill);
    });
  } else {
    DOM.existingUsersSec.style.display = 'none';
  }
}

function saveLessonResult(lessonNum, starsEarned) {
  if (!state.currentProfile) return;
  const currentStars = state.currentProfile.completedLessons[lessonNum] || 0;
  if (starsEarned > currentStars) {
    const diff = starsEarned - currentStars;
    state.currentProfile.completedLessons[lessonNum] = starsEarned;
    state.currentProfile.stars = (state.currentProfile.stars || 0) + diff;
    saveProfiles();
    updateHeaderUI();
  }
}

function updateMapUI() {
  if (!state.currentProfile) return;
  
  // Loop lessons 1-8 and lock/unlock
  // Lesson 1 is always unlocked.
  // Lesson N is unlocked if Lesson N-1 has at least 1 star.
  let prevLessonCleared = true;
  
  for (let i = 1; i <= 8; i++) {
    const node = document.getElementById(`node-lesson-${i}`);
    const starsContainer = document.getElementById(`node-stars-${i}`);
    const score = state.currentProfile.completedLessons[i] || 0;
    
    // Draw stars
    starsContainer.innerHTML = '';
    for (let s = 1; s <= 3; s++) {
      const star = document.createElement('span');
      star.textContent = '⭐';
      if (s > score) star.className = 'empty';
      starsContainer.appendChild(star);
    }
    
    if (i === 1 || prevLessonCleared) {
      node.classList.remove('locked');
      prevLessonCleared = score > 0;
    } else {
      node.classList.add('locked');
      prevLessonCleared = false;
    }
  }

  // Choose speech advice from Leo
  const completedCount = Object.values(state.currentProfile.completedLessons).filter(s => s > 0).length;
  if (completedCount === 0) {
    DOM.leoMapText.textContent = `Welcome ${state.currentProfile.name}! Tap Leo's Roars (Node 1) to start our musical safari!`;
  } else if (completedCount === 5) {
    DOM.leoMapText.textContent = `Wow, you completed the full map! Try to get 3 stars on everything, or play in the Sandbox!`;
  } else {
    DOM.leoMapText.textContent = `You are doing great! Let's continue down the path to unlock more animals!`;
  }
}

// ----------------------------------------------------
// PIANO KEYBOARD RENDERING & MIDI
// ----------------------------------------------------

function renderKeyboard(targetEl, mode) {
  targetEl.innerHTML = '';
  
  // Separate keys into White and Black lists
  const whiteKeys = [];
  const blackKeys = [];
  
  Object.keys(NOTE_DATA).forEach(keyId => {
    if (keyId.includes('s-key')) {
      blackKeys.push(keyId);
    } else {
      whiteKeys.push(keyId);
    }
  });

  // Render White Keys first
  whiteKeys.forEach(keyId => {
    const data = NOTE_DATA[keyId];
    const key = document.createElement('div');
    key.className = `piano-key white-key ${keyId}`;
    key.dataset.key = keyId;
    
    key.innerHTML = `
      <div class="key-label">
        <span style="font-size: 1.5rem;">${data.emoji}</span>
        <span class="key-letter">${data.letter}</span>
      </div>
    `;
    
    setupKeyEvents(key, keyId, mode);
    targetEl.appendChild(key);
  });

  // Render Black Keys absolutely positioned over White Keys
  blackKeys.forEach(keyId => {
    const data = NOTE_DATA[keyId];
    const key = document.createElement('div');
    key.className = `piano-key black-key ${keyId}`;
    key.dataset.key = keyId;
    
    key.innerHTML = `
      <div class="key-label" style="padding-bottom: 5px;">
        <span style="font-size: 1.1rem; filter: grayscale(20%);">${data.emoji}</span>
      </div>
    `;
    
    setupKeyEvents(key, keyId, mode);
    targetEl.appendChild(key);
  });
}

function setupKeyEvents(keyEl, keyId, mode) {
  const triggerPress = () => {
    keyEl.classList.add('pressed');
    
    const info = NOTE_DATA[keyId];
    window.kidsAudioEngine.playNote(info.freq, 0.6);
    
    // Core Game Mechanics integrations
    if (mode === 'notes') {
      handleNotesGameKeyPress(keyId);
    } else if (mode === 'melody') {
      handleMelodyKeyPress(keyId);
    } else if (mode === 'copycat') {
      handleCopyCatKeyPress(keyId);
    } else if (mode === 'sandbox') {
      handleSandboxKeyPress(keyId);
    }
  };

  const triggerRelease = () => {
    keyEl.classList.remove('pressed');
  };

  // Modern pointer down
  keyEl.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    triggerPress();
  });
  
  keyEl.addEventListener('pointerup', triggerRelease);
  keyEl.addEventListener('pointerleave', triggerRelease);
}

// Show Congrats popup overlay
function showCongrats(stars, icon, title, message) {
  window.kidsAudioEngine.playLevelComplete();
  DOM.popupAvatar.textContent = icon;
  DOM.popupTitle.textContent = title;
  DOM.popupText.textContent = message;
  
  DOM.popupStars.innerHTML = '';
  for (let i = 1; i <= 3; i++) {
    const star = document.createElement('span');
    star.textContent = '⭐';
    if (i > stars) {
      star.style.opacity = '0.2';
    }
    DOM.popupStars.appendChild(star);
  }
  
  DOM.popupCongrats.classList.add('active');
}

// ----------------------------------------------------
// GAME ROUTING (LESSON TRIGGERS)
// ----------------------------------------------------

function startLesson(lessonNum) {
  if (lessonNum === 1) {
    showScreen('dynamics');
    initDynamicsGame();
  } else if (lessonNum === 2) {
    showScreen('pitch');
    initPitchGame();
  } else if (lessonNum === 3) {
    showScreen('rhythm');
    initRhythmGame();
  } else if (lessonNum === 4) {
    showScreen('notes');
    initNotesGame();
  } else if (lessonNum === 5) {
    showScreen('melody');
    initMelodyGame();
  } else if (lessonNum === 6) {
    showScreen('tempo');
    initTempoGame();
  } else if (lessonNum === 7) {
    showScreen('copycat');
    initCopyCatGame();
  } else if (lessonNum === 8) {
    showScreen('feelings');
    initFeelingsGame();
  }
}

// ----------------------------------------------------
// LESSON 1: LEO'S ROARS (DYNAMICS GAME)
// ----------------------------------------------------

function initDynamicsGame() {
  state.lesson1.round = 0;
  state.lesson1.correctCount = 0;
  DOM.dynamicsChoices.style.display = 'none';
  DOM.btnRoarListen.style.display = 'block';
  DOM.dynamicsPrompt.textContent = "Tap the Roar button to hear Leo, then guess if it's LOUD or SOFT!";
  
  setupDynamicsRound();
}

function setupDynamicsRound() {
  state.lesson1.round++;
  state.lesson1.hasListened = false;
  state.lesson1.currentRoarIsLoud = Math.random() < 0.5;
  DOM.dynamicsChoices.style.display = 'none';
  DOM.btnRoarListen.style.display = 'block';
  
  // Re-bind click
  DOM.btnRoarListen.onpointerdown = () => {
    DOM.leoRoarStage.classList.add('lion-roaring');
    window.kidsAudioEngine.playLeoRoar(state.lesson1.currentRoarIsLoud);
    
    // Scale visual roar ripples based on dynamics
    const scaleFactor = state.lesson1.currentRoarIsLoud ? 'scale(2)' : 'scale(0.8)';
    document.querySelectorAll('.roar-ripple').forEach(el => {
      el.style.transform = scaleFactor;
      el.style.borderColor = state.lesson1.currentRoarIsLoud ? 'var(--color-red)' : 'var(--color-sky)';
    });

    setTimeout(() => {
      DOM.leoRoarStage.classList.remove('lion-roaring');
    }, 800);

    state.lesson1.hasListened = true;
    DOM.btnRoarListen.style.display = 'none';
    DOM.dynamicsChoices.style.display = 'flex';
  };
}

// Choice evaluations
[DOM.choiceSoft, DOM.choiceLoud].forEach(card => {
  card.onpointerdown = () => {
    if (!state.lesson1.hasListened) return;
    
    const choice = card.dataset.choice;
    const isCorrect = (choice === 'loud' && state.lesson1.currentRoarIsLoud) || 
                      (choice === 'soft' && !state.lesson1.currentRoarIsLoud);
    
    if (isCorrect) {
      state.lesson1.correctCount++;
      window.kidsAudioEngine.playSuccess();
      DOM.dynamicsPrompt.textContent = "Hooray! Correct answer! 🎉";
      DOM.leoRoarStage.style.transform = 'scale(1.3) rotate(15deg)';
      setTimeout(() => { DOM.leoRoarStage.style.transform = 'none'; }, 600);
    } else {
      window.kidsAudioEngine.playMistake();
      DOM.dynamicsPrompt.textContent = state.lesson1.currentRoarIsLoud ? 
        "Oops! That was a LOUD roar! 🦁" : "Oops! That was a soft roar! 🤫";
    }

    // Delay next round
    setTimeout(() => {
      if (state.lesson1.round < state.lesson1.maxRounds) {
        setupDynamicsRound();
      } else {
        // Complete Lesson
        const stars = state.lesson1.correctCount >= 5 ? 3 : 
                      state.lesson1.correctCount >= 3 ? 2 : 
                      state.lesson1.correctCount >= 1 ? 1 : 0;
        
        saveLessonResult(1, stars);
        showCongrats(
          stars, '🦁', "Lion's Roar Cleared!", 
          `You guessed ${state.lesson1.correctCount} out of 5 roars correctly!`
        );
      }
    }, 2000);
  };
});

// ----------------------------------------------------
// LESSON 2: MONKEY SWINGS (PITCH GAME)
// ----------------------------------------------------

function initPitchGame() {
  state.lesson2.round = 0;
  state.lesson2.correctCount = 0;
  DOM.monkeyPitchSprite.style.bottom = '20px';
  DOM.monkeyPitchSprite.style.left = '45%';
  
  setupPitchRound();
}

function setupPitchRound() {
  state.lesson2.round++;
  state.lesson2.currentPitchIsHigh = Math.random() < 0.5;
  state.lesson2.isWaitingForChoice = true;
  
  // Play initial sound
  playPitchSound();
  
  DOM.btnPitchReplay.onpointerdown = () => {
    playPitchSound();
  };

  const handleChoice = (isHighChosen) => {
    if (!state.lesson2.isWaitingForChoice) return;
    state.lesson2.isWaitingForChoice = false;

    const isCorrect = (isHighChosen && state.lesson2.currentPitchIsHigh) ||
                      (!isHighChosen && !state.lesson2.currentPitchIsHigh);
    
    // Animate monkey to target branch
    if (isHighChosen) {
      DOM.monkeyPitchSprite.style.bottom = '200px';
      DOM.monkeyPitchSprite.style.left = '60%';
    } else {
      DOM.monkeyPitchSprite.style.bottom = '30px';
      DOM.monkeyPitchSprite.style.left = '10%';
    }

    if (isCorrect) {
      state.lesson2.correctCount++;
      window.kidsAudioEngine.playSuccess();
      DOM.monkeyPitchSprite.textContent = '🐒🎉';
    } else {
      window.kidsAudioEngine.playMistake();
      DOM.monkeyPitchSprite.textContent = '🐒😢';
    }

    // Delay next round
    setTimeout(() => {
      DOM.monkeyPitchSprite.style.bottom = '20px';
      DOM.monkeyPitchSprite.style.left = '45%';
      DOM.monkeyPitchSprite.textContent = '🐵';
      
      if (state.lesson2.round < state.lesson2.maxRounds) {
        setupPitchRound();
      } else {
        const stars = state.lesson2.correctCount >= 5 ? 3 :
                      state.lesson2.correctCount >= 3 ? 2 :
                      state.lesson2.correctCount >= 1 ? 1 : 0;
        
        saveLessonResult(2, stars);
        showCongrats(
          stars, '🐵', "Monkey Climber Cleared!",
          `You identified ${state.lesson2.correctCount} out of 5 swings!`
        );
      }
    }, 2000);
  };

  DOM.btnPitchHigh.onpointerdown = () => handleChoice(true);
  DOM.btnPitchLow.onpointerdown = () => handleChoice(false);
}

function playPitchSound() {
  window.kidsAudioEngine.playMonkeyChirp(state.lesson2.currentPitchIsHigh);
}

// ----------------------------------------------------
// LESSON 3: HIPPO HEAVY BEATS (RHYTHM GAME)
// ----------------------------------------------------

function initRhythmGame() {
  state.lesson3.isPlaying = true;
  state.lesson3.beatCount = 0;
  state.lesson3.hits = 0;
  state.lesson3.speedStage = 1;
  state.lesson3.bpm = 100; // start slow
  state.lesson3.targetBeatTimes = [];
  state.lesson3.userTaps = [];
  
  DOM.rhythmText.textContent = "Get ready! Tap the drum matching the Hippo's green light beats!";
  startRhythmLoop();

  DOM.btnDrumPad.onpointerdown = (e) => {
    e.preventDefault();
    // Vibrate / Scale drum visual slightly
    DOM.btnDrumPad.style.transform = 'scale(0.95)';
    setTimeout(() => DOM.btnDrumPad.style.transform = 'none', 80);
    
    // Play deep kick drum
    window.kidsAudioEngine.playHippoBeat(true);

    if (!state.lesson3.isPlaying) return;

    // Check hit correctness
    const tapTime = performance.now();
    let hit = false;
    
    state.lesson3.targetBeatTimes.forEach(beatTime => {
      const diff = Math.abs(tapTime - beatTime);
      if (diff < 220) { // +/- 220ms rhythm acceptance window for a 5yo
        hit = true;
      }
    });

    if (hit) {
      state.lesson3.hits++;
      DOM.rhythmText.textContent = "Great Beat! Keep going! 🦛🥁";
      // Hippo bounce
      DOM.hippoSprite.classList.add('hippo-bumping');
      setTimeout(() => DOM.hippoSprite.classList.remove('hippo-bumping'), 150);
    }
  };
}

function startRhythmLoop() {
  const interval = (60 / state.lesson3.bpm) * 1000;
  
  if (state.lesson3.timerId) clearInterval(state.lesson3.timerId);
  
  state.lesson3.timerId = setInterval(() => {
    if (!state.lesson3.isPlaying) return;

    // Flash Hippo light
    state.lesson3.beatCount++;
    const nodeIndex = (state.lesson3.beatCount - 1) % 4;
    
    // Light up visualizer dots
    const nodes = DOM.rhythmVisualizer.children;
    for (let i = 0; i < nodes.length; i++) {
      nodes[i].classList.remove('active');
    }
    nodes[nodeIndex].classList.add('active');

    // Synthesize hippo metronome stamp
    window.kidsAudioEngine.playHippoBeat(false);
    
    // Record target timestamp
    state.lesson3.targetBeatTimes.push(performance.now());
    
    // Limit queue size
    if (state.lesson3.targetBeatTimes.length > 5) {
      state.lesson3.targetBeatTimes.shift();
    }

    // Check end condition of Stage 1
    if (state.lesson3.beatCount === state.lesson3.maxBeats) {
      clearInterval(state.lesson3.timerId);
      
      if (state.lesson3.speedStage === 1) {
        // Speed up to stage 2!
        DOM.rhythmText.textContent = "Nice work! Now let's try it FASTER! 🚀";
        state.lesson3.speedStage = 2;
        state.lesson3.bpm = 150; // faster
        state.lesson3.beatCount = 0;
        setTimeout(() => {
          if (state.lesson3.isPlaying) startRhythmLoop();
        }, 1500);
      } else {
        // End game
        state.lesson3.isPlaying = false;
        
        // Calculate stars
        const totalPossibleTaps = state.lesson3.maxBeats * 2; // 24 beats
        const accuracy = state.lesson3.hits / totalPossibleTaps;
        
        const stars = accuracy >= 0.7 ? 3 :
                      accuracy >= 0.4 ? 2 :
                      accuracy >= 0.15 ? 1 : 0;
        
        saveLessonResult(3, stars);
        showCongrats(
          stars, '🦛', "Hippo Rhythm Cleared!",
          `You tapped the drum in sync ${state.lesson3.hits} times!`
        );
      }
    }
  }, interval);
}

// ----------------------------------------------------
// LESSON 4: MEET THE NOTES (SINGING KEYS)
// ----------------------------------------------------

function initNotesGame() {
  state.lesson4.step = 0;
  setupNotesGameStep();
}

function setupNotesGameStep() {
  const keys = DOM.keyboardNotes.querySelectorAll('.piano-key');
  keys.forEach(k => k.classList.remove('glow'));
  
  if (state.lesson4.step >= state.lesson4.stepsList.length) {
    // Complete lesson
    saveLessonResult(4, 3);
    showCongrats(3, '🐼', "Singing Keys Completed!", "You found all the musical animal keys!");
    return;
  }

  const targetId = state.lesson4.stepsList[state.lesson4.step];
  state.lesson4.targetKey = targetId;
  
  const noteInfo = NOTE_DATA[targetId];
  DOM.notesInstruction.textContent = `Can you find ${noteInfo.name} ${noteInfo.emoji} on the ${noteInfo.letter} key?`;
  
  // Highlight target key
  const targetEl = DOM.keyboardNotes.querySelector(`.${targetId}`);
  if (targetEl) {
    targetEl.classList.add('glow');
  }
}

function handleNotesGameKeyPress(keyId) {
  if (keyId === state.lesson4.targetKey) {
    state.lesson4.targetKey = null; // Guard against double-clicks
    window.kidsAudioEngine.playSuccess();
    state.lesson4.step++;
    setTimeout(setupNotesGameStep, 1000);
  }
}

// ----------------------------------------------------
// LESSON 5: SONG HERO (MELODY GAME)
// ----------------------------------------------------

function initMelodyGame() {
  state.lesson5.isPlaying = false;
  state.lesson5.spawnedNotes = [];
  DOM.melodyHighway.querySelectorAll('.music-bubble').forEach(b => b.remove());
  
  DOM.btnSong1.onpointerdown = () => startSong('mary');
  DOM.btnSong2.onpointerdown = () => startSong('twinkle');
}

function startSong(songKey) {
  cleanupActiveGames();
  
  state.lesson5.activeSong = SONGS[songKey];
  state.lesson5.isPlaying = true;
  state.lesson5.score = 0;
  state.lesson5.totalNotes = state.lesson5.activeSong.length;
  state.lesson5.noteIndex = 0;
  state.lesson5.startTime = performance.now();
  state.lesson5.spawnedNotes = [];

  // Start Animation Highway Loop
  requestAnimationFrame(melodyGameLoop);
}

function melodyGameLoop(timestamp) {
  if (!state.lesson5.isPlaying) return;

  const elapsed = timestamp - state.lesson5.startTime;

  // 1. Spawn notes that match current timestamp
  while (state.lesson5.noteIndex < state.lesson5.activeSong.length && 
         state.lesson5.activeSong[state.lesson5.noteIndex].time <= elapsed) {
    
    const noteData = state.lesson5.activeSong[state.lesson5.noteIndex];
    spawnNoteBubble(noteData.note);
    state.lesson5.noteIndex++;
  }

  // 2. Move spawned bubbles down the highway
  const bubbles = DOM.melodyHighway.querySelectorAll('.music-bubble');
  const highwayHeight = DOM.melodyHighway.offsetHeight;
  const speed = 2.8; // px per frame
  
  bubbles.forEach(bubble => {
    let top = parseFloat(bubble.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
    top += speed;
    bubble.style.transform = `translateY(${top}px)`;

    // Check if missed (went past target bar completely)
    // Target bar is located around bottom 25px, height 16px. Out of bounds if > highwayHeight
    if (top > highwayHeight - 5) {
      bubble.remove();
      // Remove from active array
      state.lesson5.spawnedNotes = state.lesson5.spawnedNotes.filter(n => n.el !== bubble);
    }
  });

  // End song condition
  if (state.lesson5.noteIndex >= state.lesson5.activeSong.length && 
      DOM.melodyHighway.querySelectorAll('.music-bubble').length === 0) {
    
    state.lesson5.isPlaying = false;
    
    // Stars
    const accuracy = state.lesson5.score / state.lesson5.totalNotes;
    const stars = accuracy >= 0.85 ? 3 :
                  accuracy >= 0.55 ? 2 :
                  accuracy >= 0.25 ? 1 : 0;
    
    saveLessonResult(5, stars);
    showCongrats(
      stars, '🦒', "Song Completed!",
      `You hit ${state.lesson5.score} out of ${state.lesson5.totalNotes} bubbles!`
    );
    return;
  }

  requestAnimationFrame(melodyGameLoop);
}

function spawnNoteBubble(keyId) {
  const laneIndex = ['c-key', 'd-key', 'e-key', 'f-key', 'g-key', 'a-key', 'b-key', 'c5-key'].indexOf(keyId);
  if (laneIndex === -1) return; // ignore black keys in simple melody game

  const bubble = document.createElement('div');
  bubble.className = `music-bubble`;
  bubble.style.backgroundColor = getNoteColor(keyId);
  bubble.style.left = `calc(${(laneIndex * 12.5) + 6.25}% - 20px)`;
  bubble.style.transform = `translateY(-40px)`;
  bubble.textContent = NOTE_DATA[keyId].emoji;
  
  DOM.melodyHighway.appendChild(bubble);

  state.lesson5.spawnedNotes.push({
    key: keyId,
    el: bubble
  });
}

function getNoteColor(keyId) {
  switch (keyId) {
    case 'c-key': return 'var(--color-red)';
    case 'd-key': return 'var(--color-orange)';
    case 'e-key': return 'var(--color-yellow)';
    case 'f-key': return 'var(--color-grass)';
    case 'g-key': return 'var(--color-sky)';
    case 'a-key': return 'var(--color-purple)';
    case 'b-key': return 'var(--color-pink)';
    case 'c5-key': return '#80deea';
    default: return 'white';
  }
}

function handleMelodyKeyPress(keyId) {
  if (!state.lesson5.isPlaying) return;

  const highwayHeight = DOM.melodyHighway.offsetHeight;
  const targetBottomY = highwayHeight - 25; // bottom line of target
  const targetTopY = targetBottomY - 35;     // top line of target (generous window)

  // Find bubble in matching key lane that is closest to target bar
  const matchingNotes = state.lesson5.spawnedNotes.filter(n => n.key === keyId);
  if (matchingNotes.length === 0) return;

  // Find if any is within target boundary
  let hitNote = null;
  for (let i = 0; i < matchingNotes.length; i++) {
    const note = matchingNotes[i];
    const top = parseFloat(note.el.style.transform.replace('translateY(', '').replace('px)', '')) || 0;
    
    if (top >= targetTopY && top <= targetBottomY + 25) {
      hitNote = note;
      break;
    }
  }

  if (hitNote) {
    // HIT!
    state.lesson5.score++;
    
    // Bubble burst animation
    hitNote.el.style.transform += ' scale(1.6)';
    hitNote.el.style.opacity = '0';
    hitNote.el.style.transition = 'transform 0.2s, opacity 0.2s';
    
    setTimeout(() => hitNote.el.remove(), 200);

    state.lesson5.spawnedNotes = state.lesson5.spawnedNotes.filter(n => n !== hitNote);
  }
}

// ----------------------------------------------------
// SANDBOX / FREE PLAY MODE
// ----------------------------------------------------

function initSandboxGame() {
  state.sandbox.isRecording = false;
  state.sandbox.recordedNotes = [];
  DOM.recordDot.classList.remove('recording');
  DOM.btnRecordToggle.textContent = 'Record 🎙️';
  DOM.btnRecordPlay.style.display = 'none';

  DOM.btnRecordToggle.onpointerdown = () => {
    if (!state.sandbox.isRecording) {
      // Start Recording
      state.sandbox.isRecording = true;
      state.sandbox.recordStartTime = performance.now();
      state.sandbox.recordedNotes = [];
      DOM.recordDot.classList.add('recording');
      DOM.btnRecordToggle.textContent = 'Stop ⏹️';
      DOM.btnRecordPlay.style.display = 'none';
    } else {
      // Stop Recording
      state.sandbox.isRecording = false;
      DOM.recordDot.classList.remove('recording');
      DOM.btnRecordToggle.textContent = 'Record 🎙️';
      
      if (state.sandbox.recordedNotes.length > 0) {
        DOM.btnRecordPlay.style.display = 'inline-block';
      }
    }
  };

  DOM.btnRecordPlay.onpointerdown = () => {
    if (state.sandbox.recordedNotes.length === 0) return;
    
    // Playback recorded notes
    state.sandbox.recordedNotes.forEach(item => {
      setTimeout(() => {
        // Highlight key
        const keyEl = DOM.keyboardSandbox.querySelector(`.${item.key}`);
        if (keyEl) {
          keyEl.classList.add('pressed');
          setTimeout(() => keyEl.classList.remove('pressed'), 250);
        }
        window.kidsAudioEngine.playNote(NOTE_DATA[item.key].freq, 0.6);
      }, item.delay);
    });
  };
}

function handleSandboxKeyPress(keyId) {
  if (state.sandbox.isRecording) {
    const elapsed = performance.now() - state.sandbox.recordStartTime;
    state.sandbox.recordedNotes.push({
      key: keyId,
      delay: elapsed
    });
  }
}

// ----------------------------------------------------
// LESSON 6: CHEETAH & TURTLE (TEMPO - FAST VS SLOW)
// ----------------------------------------------------

function initTempoGame() {
  state.lesson6.round = 0;
  state.lesson6.correctCount = 0;
  DOM.tempoChoices.style.display = 'none';
  DOM.btnTempoListen.style.display = 'block';
  DOM.tempoPrompt.textContent = "Tap Listen to hear the drum beat, then guess if it's FAST or SLOW!";
  DOM.tempoCheetah.style.transform = 'none';
  DOM.tempoTurtle.style.transform = 'none';
  
  setupTempoRound();
}

function setupTempoRound() {
  state.lesson6.round++;
  state.lesson6.hasListened = false;
  state.lesson6.currentTempoIsFast = Math.random() < 0.5;
  state.lesson6.isWaitingForChoice = true;
  DOM.tempoChoices.style.display = 'none';
  DOM.btnTempoListen.style.display = 'block';

  DOM.btnTempoListen.onpointerdown = () => {
    state.lesson6.hasListened = true;
    DOM.btnTempoListen.style.display = 'none';
    
    // Play tempo beat pattern
    const bpm = state.lesson6.currentTempoIsFast ? 190 : 80;
    const interval = (60 / bpm) * 1000;
    let count = 0;
    const maxBeats = 6;
    
    // Animate characters during beat
    if (state.lesson6.currentTempoIsFast) {
      DOM.tempoCheetah.style.animation = 'shake 0.1s infinite';
    } else {
      DOM.tempoTurtle.style.animation = 'idleBounce 0.8s infinite ease-in-out';
    }

    state.lesson6.tempoIntervalId = setInterval(() => {
      window.kidsAudioEngine.playHippoBeat(true); // cowbell style high click
      count++;
      if (count >= maxBeats) {
        clearInterval(state.lesson6.tempoIntervalId);
        state.lesson6.tempoIntervalId = null;
        
        DOM.tempoCheetah.style.animation = 'none';
        DOM.tempoTurtle.style.animation = 'none';
        DOM.tempoChoices.style.display = 'flex';
      }
    }, interval);
  };
}

// Choice evaluations
[DOM.choiceTempoSlow, DOM.choiceTempoFast].forEach(card => {
  card.onpointerdown = () => {
    if (!state.lesson6.hasListened || !state.lesson6.isWaitingForChoice) return;
    state.lesson6.isWaitingForChoice = false;
    state.lesson6.hasListened = false;
    
    const choice = card.dataset.choice;
    const isCorrect = (choice === 'fast' && state.lesson6.currentTempoIsFast) ||
                      (choice === 'slow' && !state.lesson6.currentTempoIsFast);
                      
    if (isCorrect) {
      state.lesson6.correctCount++;
      window.kidsAudioEngine.playSuccess();
      DOM.tempoPrompt.textContent = "Awesome! That is correct! 🐆💨";
      
      if (state.lesson6.currentTempoIsFast) {
        DOM.tempoCheetah.style.transform = 'translateX(50px) scale(1.3)';
        setTimeout(() => DOM.tempoCheetah.style.transform = 'none', 1000);
      } else {
        DOM.tempoTurtle.style.transform = 'scale(1.3) rotate(10deg)';
        setTimeout(() => DOM.tempoTurtle.style.transform = 'none', 1000);
      }
    } else {
      window.kidsAudioEngine.playMistake();
      DOM.tempoPrompt.textContent = state.lesson6.currentTempoIsFast ?
        "Oops! That was a FAST tempo (like Cheetah)!" : "Oops! That was a SLOW tempo (like Turtle)!";
    }

    // Delay next round
    setTimeout(() => {
      if (state.lesson6.round < state.lesson6.maxRounds) {
        setupTempoRound();
      } else {
        const stars = state.lesson6.correctCount >= 5 ? 3 :
                      state.lesson6.correctCount >= 3 ? 2 :
                      state.lesson6.correctCount >= 1 ? 1 : 0;
                      
        saveLessonResult(6, stars);
        showCongrats(
          stars, '🐆', "Cheetah & Turtle Cleared!",
          `You guessed ${state.lesson6.correctCount} out of 5 tempos correctly!`
        );
      }
    }, 2500);
  };
});

// ----------------------------------------------------
// LESSON 7: POLLY'S COPY CAT (MELODY ECHO)
// ----------------------------------------------------

function initCopyCatGame() {
  state.lesson7.round = 0;
  state.lesson7.correctCount = 0;
  
  // Render Copycat specific 5-key piano keyboard (C, D, E, F, G)
  renderCopycatKeyboard();
  
  setupCopyCatRound();
}

function renderCopycatKeyboard() {
  DOM.keyboardCopycat.innerHTML = '';
  // Only play keys: C4, D4, E4, F4, G4
  const targetKeys = ['c-key', 'd-key', 'e-key', 'f-key', 'g-key'];
  targetKeys.forEach(keyId => {
    const data = NOTE_DATA[keyId];
    const key = document.createElement('div');
    key.className = `piano-key white-key ${keyId}`;
    key.dataset.key = keyId;
    
    key.innerHTML = `
      <div class="key-label">
        <span style="font-size: 1.5rem;">${data.emoji}</span>
        <span class="key-letter">${data.letter}</span>
      </div>
    `;
    
    setupKeyEvents(key, keyId, 'copycat');
    DOM.keyboardCopycat.appendChild(key);
  });
}

function setupCopyCatRound() {
  state.lesson7.round++;
  state.lesson7.userSequence = [];
  state.lesson7.isUserTurn = false;
  DOM.copycatInstruction.textContent = "Shh... Listen to Polly sing!";
  
  // Generate random 2 or 3 note sequence from C, D, E, F, G
  const possibleNotes = ['c-key', 'd-key', 'e-key', 'f-key', 'g-key'];
  const len = state.lesson7.round <= 2 ? 2 : 3;
  state.lesson7.parrotSequence = [];
  for (let i = 0; i < len; i++) {
    const randIndex = Math.floor(Math.random() * possibleNotes.length);
    state.lesson7.parrotSequence.push(possibleNotes[randIndex]);
  }

  // Play sequence to user with visual keyboard highlights
  setTimeout(() => {
    playParrotSequence(0);
  }, 1000);
}

function playParrotSequence(index) {
  if (index >= state.lesson7.parrotSequence.length) {
    // End sequence playback, hand over to user
    state.lesson7.isUserTurn = true;
    DOM.copycatInstruction.textContent = "Your turn! Tap the same animal keys!";
    return;
  }
  
  const keyId = state.lesson7.parrotSequence[index];
  const info = NOTE_DATA[keyId];
  
  // Play note
  window.kidsAudioEngine.playNote(info.freq, 0.6);
  
  // Visual glow key
  const keyEl = DOM.keyboardCopycat.querySelector(`.${keyId}`);
  if (keyEl) {
    keyEl.classList.add('glow');
    setTimeout(() => keyEl.classList.remove('glow'), 400);
  }
  
  setTimeout(() => {
    playParrotSequence(index + 1);
  }, 600);
}

function handleCopyCatKeyPress(keyId) {
  if (!state.lesson7.isUserTurn) return;
  
  const targetIndex = state.lesson7.userSequence.length;
  const expectedKey = state.lesson7.parrotSequence[targetIndex];
  
  if (keyId === expectedKey) {
    state.lesson7.userSequence.push(keyId);
    
    // Check if fully matching sequence
    if (state.lesson7.userSequence.length === state.lesson7.parrotSequence.length) {
      state.lesson7.isUserTurn = false;
      state.lesson7.correctCount++;
      
      window.kidsAudioEngine.playSuccess();
      DOM.copycatInstruction.textContent = "Fantastic! Polly is happy! 🦜🎉";
      
      setTimeout(() => {
        if (state.lesson7.round < state.lesson7.maxRounds) {
          setupCopyCatRound();
        } else {
          const stars = state.lesson7.correctCount >= 5 ? 3 :
                        state.lesson7.correctCount >= 3 ? 2 :
                        state.lesson7.correctCount >= 1 ? 1 : 0;
                        
          saveLessonResult(7, stars);
          showCongrats(
            stars, '🦜', "Polly Echo Completed!",
            `You copied Polly correctly ${state.lesson7.correctCount} times!`
          );
        }
      }, 1500);
    }
  } else {
    // Mistake
    state.lesson7.isUserTurn = false;
    window.kidsAudioEngine.playMistake();
    DOM.copycatInstruction.textContent = "Oops! Polly sang something else. Listen again!";
    
    // Replay sequence in 1.5s
    setTimeout(() => {
      state.lesson7.userSequence = [];
      playParrotSequence(0);
    }, 1500);
  }
}

// ----------------------------------------------------
// LESSON 8: MUSIC FEELINGS (HAPPY VS SAD CHORDS)
// ----------------------------------------------------

function initFeelingsGame() {
  state.lesson8.round = 0;
  state.lesson8.correctCount = 0;
  DOM.feelingsChoices.style.display = 'none';
  DOM.btnFeelingsListen.style.display = 'block';
  DOM.feelingsPrompt.textContent = "Listen to the chord, does it sound HAPPY or SAD?";
  DOM.feelingsStage.style.transform = 'none';
  DOM.feelingsStage.textContent = '🎭';
  
  setupFeelingsRound();
}

function setupFeelingsRound() {
  state.lesson8.round++;
  state.lesson8.hasListened = false;
  state.lesson8.currentChordIsMajor = Math.random() < 0.5;
  state.lesson8.isWaitingForChoice = true;
  DOM.feelingsChoices.style.display = 'none';
  DOM.btnFeelingsListen.style.display = 'block';

  DOM.btnFeelingsListen.onpointerdown = () => {
    state.lesson8.hasListened = true;
    DOM.btnFeelingsListen.style.display = 'none';
    
    DOM.feelingsStage.classList.add('lion-roaring');
    window.kidsAudioEngine.playChord(state.lesson8.currentChordIsMajor);
    
    setTimeout(() => {
      DOM.feelingsStage.classList.remove('lion-roaring');
      DOM.feelingsChoices.style.display = 'flex';
    }, 1000);
  };
}

// Choice evaluations
[DOM.choiceFeelingsHappy, DOM.choiceFeelingsSad].forEach(card => {
  card.onpointerdown = () => {
    if (!state.lesson8.hasListened || !state.lesson8.isWaitingForChoice) return;
    state.lesson8.isWaitingForChoice = false;
    state.lesson8.hasListened = false;
    
    const choice = card.dataset.choice;
    const isCorrect = (choice === 'happy' && state.lesson8.currentChordIsMajor) ||
                      (choice === 'sad' && !state.lesson8.currentChordIsMajor);
                      
    if (isCorrect) {
      state.lesson8.correctCount++;
      window.kidsAudioEngine.playSuccess();
      DOM.feelingsPrompt.textContent = "Hooray! Correct feeling! 🎉";
      
      if (state.lesson8.currentChordIsMajor) {
        DOM.feelingsStage.textContent = '☀️😎';
        DOM.feelingsStage.style.transform = 'scale(1.3) rotate(5deg)';
        setTimeout(() => { DOM.feelingsStage.style.transform = 'none'; }, 1000);
      } else {
        DOM.feelingsStage.textContent = '🌧️😢';
        DOM.feelingsStage.style.transform = 'scale(1.2)';
        setTimeout(() => { DOM.feelingsStage.style.transform = 'none'; }, 1000);
      }
    } else {
      window.kidsAudioEngine.playMistake();
      DOM.feelingsPrompt.textContent = state.lesson8.currentChordIsMajor ?
        "Oops! That was a HAPPY major chord! ☀️" : "Oops! That was a SAD minor chord! 🌧️";
    }

    // Delay next round
    setTimeout(() => {
      DOM.feelingsStage.textContent = '🎭';
      if (state.lesson8.round < state.lesson8.maxRounds) {
        setupFeelingsRound();
      } else {
        const stars = state.lesson8.correctCount >= 5 ? 3 :
                      state.lesson8.correctCount >= 3 ? 2 :
                      state.lesson8.correctCount >= 1 ? 1 : 0;
                      
        saveLessonResult(8, stars);
        showCongrats(
          stars, '☀️', "Music Feelings Cleared!",
          `You identified ${state.lesson8.correctCount} out of 5 chords correctly!`
        );
      }
    }, 2500);
  };
});

// WINDOW BOOTSTRAP INIT
// ----------------------------------------------------
window.addEventListener('DOMContentLoaded', init);
window.showScreen = showScreen;
window.startLesson = startLesson;
