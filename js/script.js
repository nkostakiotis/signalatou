var firstArray = [];
var secondArray = [];

var playerOneName;
var playerTwoName;
var playerOneIdFromDB;
var playerTwoIdFromDB;
var players = ["player1", "player2"];
var wins = [{ id: "player1", wins: 0 }, { id: "player2", wins: 0 }];

var vesselData = [];
var myMusic;


function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function fetchData() {
    fetch('https://192.168.10.49/api/v1/HackTyphoon/Cards/Random/10').then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
        vesselData = data;
        firstArray = vesselData.slice(0, vesselData.length / 2);
        secondArray = vesselData.slice(vesselData.length / 2, vesselData.length);
    }).catch(err => {
        console.log(err.message);
    });
    myMusic = new sound("./sounds/goodNews.mp3");
}

function onPropertyClick(event) {
  var value = event.target.innerHTML;
  var key = event.target.key;
  var currentPlayer = event.target.currentPlayer;
  var otherPlayer = players.filter(player => player != currentPlayer)[0];

  var otherPlayersCards = document.getElementById(otherPlayer);
  var currentPlayersCards = document.getElementById(currentPlayer);

  var opponentsProperty = otherPlayersCards.getElementsByTagName("span")[key];
  var opponentPropertyValue = opponentsProperty.innerHTML;

  var currentPlayerProperty = currentPlayersCards.getElementsByTagName("span")[key];
  var currentPlayerPropertyValue = currentPlayerProperty.innerHTML;

  var message = "Draw!";
  if (opponentPropertyValue == currentPlayerPropertyValue){

  } else if (value > opponentPropertyValue || value.trim() == "Laden") {
    wins.forEach(w => {
      if (w.id == currentPlayer) {
        w.wins++;
        var winsElementId = currentPlayer + 'wins';
        document.getElementById(winsElementId).innerHTML = w.wins;
      }
    });
    message = "You won the current round! :-)";
    currentPlayerProperty.classList.add('blue');
    opponentsProperty.classList.add('red');
  } else if (value < opponentPropertyValue || value.trim() == "Laden") {
    wins.forEach(w => {
        if (w.id == otherPlayer) {
          w.wins++;
          var winsElementId = otherPlayer + 'wins';
          document.getElementById(winsElementId).innerHTML = w.wins;
        }
      });
      message = "You lost the current round! :-(";
      currentPlayerProperty.classList.add('red');
      opponentsProperty.classList.add('blue');
  }

  var properties = document.getElementsByClassName("cardProperties");

  for (var i = 0; i < properties.length; i++) {
    properties[i].classList.add("disabled");
  }

  document.getElementById('player2').style.visibility = 'visible';
  document.getElementById('message').innerHTML = message;

  currentPlayerProperty.classList.add('blue');
  opponentsProperty.classList.add('blue');
  document.getElementById('nextButton').disabled = false;
}

function createCardContent(id, element, data) {
  var vesselName = document.createElement("div");
  var yearBuilt = document.createElement("div");
  var deadweight = document.createElement("div");
  var draught = document.createElement("div");
  var total_main_hp = document.createElement("div");
  var voyageLeg = document.createElement("div");
  var speed = document.createElement("div");

  var properties = [yearBuilt, deadweight, draught, total_main_hp, voyageLeg, speed];
  properties.forEach(property => (property.className = "cardProperties"));

  element.appendChild(vesselName);
  properties.forEach(property => element.appendChild(property));

  var availableData = data.filter(item => !item.isSelected);
  var item = availableData[Math.floor(Math.random() * availableData.length)];
  item.isSelected = true;

  vesselName.innerHTML = 
    `<div>
      <div id='vesselNameContainer'>${item.vesselName}</div>
      <div id='companyNameContainer'>${item.companyName}</div>
      <div id='vesselClassContainer'>AFRAMAX</div>
    </div>`;

  yearBuilt.innerHTML = `Yearbuilt: <span>${item.yearBuilt}</span>`;
  deadweight.innerHTML = `Deadweight: <span>${item.deadweight}</span>`;
  draught.innerHTML = `Draught: <span>${item.draught}</span>`;
  total_main_hp.innerHTML = `Engine Horsepower: <span>${item.horsePower}</span>`;
  voyageLeg.innerHTML = `Voyage Leg: <span>${item.status}</span>`;
  speed.innerHTML = `Speed: <span>${item.speed}</span>`;
  properties.forEach((property, index) => {
    var item = property.getElementsByTagName("span")[0];
    item.onclick = onPropertyClick;
    item.key = index;
    item.currentPlayer = id;
  });
}

function createCard(id, data) {
  var card = document.createElement("div");

  card.setAttribute("class", "card");
  card.setAttribute("id", id);

  document.getElementById("deck").appendChild(card);

  createCardContent(id, card, data);

  if (id == "player2") {
      card.style.visibility = "hidden";
  }
  document.getElementById('nextButton').disabled = true;
}

function createCards() {
  document.getElementById("deck").innerHTML = "";
  document.getElementById('message').innerHTML = "";
  var remainCards = firstArray.filter(i => !i.isSelected).length

  if(remainCards > 0) {
    createCard("player1", firstArray);
    createCard("player2", secondArray);
  }
  else {
    saveWinningGame();
    getLeaderBoard();
    document.getElementById('endGamePanel').classList.remove('hide');
    document.getElementById('mainPanel').classList.add('hide');
  }
}


function startMusic() {
    myMusic.play();
}

function initializeGame() {
  onStartButtonClick();
  document.getElementById('startGamePanel').classList.add('hide');
  document.getElementById('mainPanel').classList.remove('hide');
  createCards();
}



function onStartButtonClick() {
  playerOneName = document.getElementsByTagName('input')[0].value;
  const url = `https://192.168.10.49/api/v1/HackTyphoon/Players/Add?name=${playerOneName}`;

  fetch(url, { method: 'POST' }, playerOneIdFromDB)
    .then(response => response.json())
    .then(data => assignPlayerOneId(data));
}

function assignPlayerOneId(id) {
  playerOneIdFromDB = id;
  getOpponent(playerOneIdFromDB);
}

function assignPlayerTwo(player) {
  console.log(player);
  playerTwoName = player.playerName + ` (${player.numberOfWins} total wins)`;
  playerTwoIdFromDB = player.id;
  renderPlayerNames();
}


function getOpponent(id) {
  const urlOpponent = `https://192.168.10.49/api/v1/HackTyphoon/Players/Random/${id}`;
  fetch(urlOpponent, { method: 'GET' })
    .then(response => response.json())
    .then(data => assignPlayerTwo(data))
    .catch(err => { console.log(err.message) });
}

function renderPlayerNames() {
  document.getElementById('playerOneId').innerHTML = `${playerOneName}<div id='player1wins'>`;
  document.getElementById('playerTwoId').innerHTML = `${playerTwoName}<div id='player2wins'>`;
}


function assignPlayerOneId(id) {
  playerOneIdFromDB = id;
  getOpponent(playerOneIdFromDB);
}


function getLeaderBoard() {
  
  const url = `https://192.168.10.49/api/v1/HackTyphoon/Players/Rank`;

  fetch(url, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      fillLeaderBoard(data);
    });

}
function fillLeaderBoard(data){
  var leaderinner="<table><th>Leader Board<th>";
  var newData = data;

  if(data.length > 5) {
    newData = data.slice(0, 5);
  }

  newData.forEach(w => {
    leaderinner+= "<tr><td>" + w.playerName + "</td><td>"+w.numberOfWins +"</td></tr>";
     });
     leaderinner +="</table>";
  document.getElementById('LeaderBoard').innerHTML = `${leaderinner}`;
}

function saveWinningGame(playerOneIdFromDB, playerTwoIdFromDB){
  const urlSaveGame = `https://192.168.10.49/api/v1/HackTyphoon/Games/New`;
  var dataToSave = "{\"Player1ID\":"+`${playerOneIdFromDB}`+",\"Player2ID\":"+`${playerTwoIdFromDB}`+",\"WinPlayerID\":3}";
  console.log(dataToSave);
  fetch(urlSaveGame, { 
    method: 'POST',
    body:`"data": "${dataToSave}"` })
    .then(response => response.json())
    .then(data => assignPlayerTwo(data))
    .catch(err => { console.log(err.message) });
}