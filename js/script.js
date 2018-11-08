function createCardContent(element) {
    var title = document.createElement('div');
    var propertyOne = document.createElement('div');
    var propertyTwo = document.createElement('div');
    var propertyThree = document.createElement('div');
    var propertyFour = document.createElement('div');

    var properties = [propertyOne, propertyTwo, propertyThree, propertyFour];
    properties.forEach(property => property.className = "cardProperties");
    
    element.appendChild(title);
    properties.forEach(property => element.appendChild(property))

    title.innerHTML = "Panagiota";
}

function createCard(id) {
    var card = document.createElement('div');
    card.setAttribute('class', 'card');
    card.setAttribute('id', id);
    document.getElementById('deck').appendChild(card);
    createCardContent(card);
}

function createCards() {
    createCard("player1")
    createCard("player2")
}