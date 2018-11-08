var firstArray = [];
var secondArray = [];

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
        createCards();
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

  var opponentsProperty = otherPlayersCards.getElementsByTagName("span")[key + 1]
  var opponentPropertyValue = opponentsProperty.innerHTML;
  var currentPlayerProperty = currentPlayersCards.getElementsByTagName("span")[key + 1]

  var message = "Isopalia";
  if (value > opponentPropertyValue) {
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
  }
  if (value < opponentPropertyValue) {
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
  document.getElementsByTagName('button')[0].disabled = false;
}

function createCardContent(id, element, data) {
  var vesselName = document.createElement("div");
  var deadweight = document.createElement("div");
  var yearBuilt = document.createElement("div");
  var total_main_hp = document.createElement("div");

  var properties = [deadweight, yearBuilt, total_main_hp];
  properties.forEach(property => (property.className = "cardProperties"));

  element.appendChild(vesselName);
  properties.forEach(property => element.appendChild(property));

  var availableData = data.filter(item => !item.isSelected);
  var item = availableData[Math.floor(Math.random() * availableData.length)];
  item.isSelected = true;

  vesselName.innerHTML = `Vessel Name: <span>${item.vesselName}</span>`;
  deadweight.innerHTML = `Speed: <span>${item.speed}</span>`;
  yearBuilt.innerHTML = `Yearbuilt: <span>${item.yearBuilt}</span>`;
  total_main_hp.innerHTML = `Horse Power: <span>${item.horsePower}</span>`;
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
  document.getElementsByTagName('button')[0].disabled = true;
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
      document.getElementById("deck").innerHTML = "Game Over!";
  }
}

function startMusic() {
    myMusic.play();
}