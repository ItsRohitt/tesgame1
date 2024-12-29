// Inisialisasi
let draggableObjects;
let dropPoints;
const startButton = document.getElementById("start");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const dragContainer = document.querySelector(".draggable-objects");
const dropContainer = document.querySelector(".drop-points");

document.getElementById("start").addEventListener("click", function () {
  var music = document.getElementById("game-music");
  music.play(); // Memutar musik saat tombol start diklik

  // Tambahkan logika game lainnya di sini
});

const data = [
  "Dilarang Berbicara",
  "Dilarang Masuk",
  "Dilarang Stop",
  "Dilarang Buang Sampah",
  "Wajib Mengitari Bundaran",
  "Lampu Lalu Lintas",
  "Wajib Jalan Lurus",
  "Dilarang Merokok",
  "Dilarang Parkir",
  "Putar Balik Kiri",
  "Penyebrangan Jalan",
  "Simpang Empat",
  "Tikungan Tajam Kiri",
  "Tikungan Tajam Kanan",
  "Halte Bus",
  "Jalur Sepeda",
];

let deviceType = "";
let initialX = 0,
  initialY = 0;
let currentElement = "";
let moveElement = false;

// Konfigurasi level
const levelConfig = {
  1: {
    pairs: 2, // 2 pasangan rambu
    timer: 30, // 30 detik
    lives: 5, // 5 nyawa
  },
  2: {
    pairs: 3, // 3 pasangan rambu
    timer: 25, // 25 detik
    lives: 4, // 4 nyawa
  },
  3: {
    pairs: 4, // 4 pasangan rambu
    timer: 20, // 20 detik
    lives: 3, // 3 nyawa
  },
  4: {
    pairs: 5, // 5 pasangan rambu
    timer: 15, // 15 detik
    lives: 2, // 2 nyawa
  },
  5: {
    pairs: 6, // 6 pasangan rambu
    timer: 10, // 10 detik
    lives: 1, // 1 nyawa
  },
};

// Menambahkan variabel untuk level, waktu, dan nyawa
let level = 1;
let lives = levelConfig[1].lives; // Start with level 1 lives
let timer = levelConfig[1].timer; // Timer awal dari level 1

const timerDisplay = document.createElement("p");
timerDisplay.id = "timer";
timerDisplay.style.color = "white";
timerDisplay.style.fontSize = "1.5em";
timerDisplay.style.textAlign = "center";
const livesDisplay = document.createElement("p");
livesDisplay.id = "lives";
livesDisplay.style.color = "white";
livesDisplay.style.fontSize = "1.5em";
livesDisplay.style.textAlign = "center";

controls.insertBefore(timerDisplay, startButton);
controls.insertBefore(livesDisplay, startButton);

// Fungsi untuk memperbarui timer dan nyawa
const updateHUD = () => {
  timerDisplay.textContent = `Level ${level} | Time Left: ${timer}s`;
  livesDisplay.textContent = `Lives: ${lives}`;
};

// Menangani logika waktu
let timerInterval;
const startTimer = () => {
  clearInterval(timerInterval);
  timer = levelConfig[level].timer; // Set timer berdasarkan level
  updateHUD();
  timerInterval = setInterval(() => {
    timer--;
    updateHUD();
    if (timer <= 0) {
      clearInterval(timerInterval);
      lives--;
      if (lives <= 0) {
        result.textContent = "Game Over!";
        result.style.color = "red"; // Ganti warna menjadi merah
        stopGame();
      } else {
        alert("Waktu Habis COBA LAGI!");
        startGame();
      }
    }
  }, 1000);
};

// Menyesuaikan level
const nextLevel = () => {
  level++;
  if (level > 5) {
    result.textContent =
      "Congratulations! KAMU MENJADI PAHLAWAN RAMBU LALU LINTAS!";
    result.style.color = "blue"; // Ganti warna menjadi biru
    stopGame();
    return;
  }

  // Update lives berdasarkan level baru
  lives = levelConfig[level].lives;

  alert(
    `Level ${level}!\nLives: ${lives}\nTime: ${levelConfig[level].timer}s\nPairs: ${levelConfig[level].pairs}`
  );
  startGame();
};

// Mendeteksi kursor
const isTouchDevice = () => {
  try {
    document.createEvent("TouchEvent");
    deviceType = "touch";
    return true;
  } catch (e) {
    deviceType = "mouse";
    return false;
  }
};

let count = 0;

// Nilai acak dari susunan
const randomValueGenerator = () => {
  return data[Math.floor(Math.random() * data.length)];
};

// Inisial untuk menang
const stopGame = () => {
  controls.classList.remove("hide");
  startButton.classList.remove("hide");
  clearInterval(timerInterval);
  level = 1; // Reset level ke level 1
  lives = levelConfig[1].lives; // Reset nyawa ke level 1
  timer = levelConfig[1].timer; // Reset timer ke level 1
};

// Memindahkan gambar ke bagian layar teks
function dragStart(e) {
  if (isTouchDevice()) {
    initialX = e.touches[0].clientX;
    initialY = e.touches[0].clientY;
    moveElement = true;
    currentElement = e.target;
  } else {
    e.dataTransfer.setData("text", e.target.id);
  }
}

// Rambu diletakkan ke tempat sasaran
function dragOver(e) {
  e.preventDefault();
}

// Untuk gerakan kursor
const touchMove = (e) => {
  if (moveElement) {
    e.preventDefault();
    let newX = e.touches[0].clientX;
    let newY = e.touches[0].clientY;
    let currentSelectedElement = document.getElementById(e.target.id);
    currentSelectedElement.parentElement.style.top =
      currentSelectedElement.parentElement.offsetTop - (initialY - newY) + "px";
    currentSelectedElement.parentElement.style.left =
      currentSelectedElement.parentElement.offsetLeft -
      (initialX - newX) +
      "px";
    initialX = newX;
    initialY - newY;
  }
};

// Logika drop yang diperbarui dengan tingkat kesulitan
const drop = (e) => {
  e.preventDefault();
  if (isTouchDevice()) {
    moveElement = false;
    const currentDrop = document.querySelector(`div[data-id='${e.target.id}']`);
    const currentDropBound = currentDrop.getBoundingClientRect();

    // Membuat area drop lebih kecil di level yang lebih tinggi
    const shrinkFactor = 1 - level * 0.1; // Area drop mengecil 10% per level
    if (
      initialX >= currentDropBound.left * shrinkFactor &&
      initialX <= currentDropBound.right * shrinkFactor &&
      initialY >= currentDropBound.top * shrinkFactor &&
      initialY <= currentDropBound.bottom * shrinkFactor
    ) {
      currentDrop.classList.add("dropped");
      currentElement.classList.add("hide");
      currentDrop.innerHTML = ``;
      currentDrop.insertAdjacentHTML(
        "afterbegin",
        `<img src= "asset/${currentElement.id}.png">`
      );
      count += 1;
    }
  } else {
    const draggedElementData = e.dataTransfer.getData("text");
    const droppableElementData = e.target.getAttribute("data-id");

    if (draggedElementData === droppableElementData) {
      const draggedElement = document.getElementById(draggedElementData);
      e.target.classList.add("dropped");
      draggedElement.classList.add("hide");
      draggedElement.setAttribute("draggable", "false");
      e.target.innerHTML = ``;
      e.target.insertAdjacentHTML(
        "afterbegin",
        `<img src="asset/${draggedElementData}.png">`
      );
      count += 1;
    }
  }

  // Win condition
  if (count == levelConfig[level].pairs) {
    clearInterval(timerInterval);
    result.style.color = "blue"; // Ganti warna menjadi biru saat menang
    result.textContent = `Level ${level} Completed!`;
    setTimeout(nextLevel, 2000);
  }
};

// Membuat bendera dan nama negara
const creator = () => {
  dragContainer.innerHTML = "";
  dropContainer.innerHTML = "";
  let randomData = [];
  let pairsCount = levelConfig[level].pairs; // Mengambil jumlah pasangan dari konfigurasi level

  for (let i = 1; i <= pairsCount; i++) {
    let randomValue = randomValueGenerator();
    if (!randomData.includes(randomValue)) {
      randomData.push(randomValue);
    } else {
      i -= 1;
    }
  }

  // Acak posisi rambu dengan lebih kompleks di level yang lebih tinggi
  for (let i of randomData) {
    const flagDiv = document.createElement("div");
    flagDiv.classList.add("draggable-image");
    flagDiv.setAttribute("draggable", true);
    if (isTouchDevice()) {
      flagDiv.style.position = "absolute";
      // Posisi random yang lebih tersebar di level tinggi
      const randomTop = Math.floor(Math.random() * (70 + level * 10)) + "%";
      const randomLeft = Math.floor(Math.random() * (70 + level * 10)) + "%";
      flagDiv.style.top = randomTop;
      flagDiv.style.left = randomLeft;
    }
    flagDiv.innerHTML = `<img src="asset/${i}.png" id="${i}">`;
    dragContainer.appendChild(flagDiv);
  }

  // Acak nama rambu dengan tingkat kesulitan yang meningkat
  randomData = randomData.sort(() => (0.5 - Math.random()) * (1 + level * 0.2));
  for (let i of randomData) {
    const countryDiv = document.createElement("div");
    countryDiv.innerHTML = `<div class='countries' data-id='${i}'>
    ${i.charAt(0).toUpperCase() + i.slice(1).replace("-", " ")}
    </div>`;
    dropContainer.appendChild(countryDiv);
  }
};

// Memulai permainan
startButton.addEventListener(
  "click",
  (startGame = async () => {
    if (lives <= 0) {
      lives = levelConfig[1].lives; // Reset nyawa ke level 1
      level = 1; // Reset level ke level 1
      result.style.color = "black"; // Reset warna teks menjadi hitam
    }
    currentElement = "";
    controls.classList.add("hide");
    startButton.classList.add("hide");

    await creator();
    count = 0;
    dropPoints = document.querySelectorAll(".countries");
    draggableObjects = document.querySelectorAll(".draggable-image");

    draggableObjects.forEach((element) => {
      element.addEventListener("dragstart", dragStart);
      element.addEventListener("touchstart", dragStart);
      element.addEventListener("touchend", drop);
      element.addEventListener("touchmove", touchMove);
    });
    dropPoints.forEach((element) => {
      element.addEventListener("dragover", dragOver);
      element.addEventListener("drop", drop);
    });

    startTimer();
    updateHUD();
  })
);
