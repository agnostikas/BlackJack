var cardDeck, playerHand, dealerHand, playerCount, dealerCount
	cardDeck = [];
	dealerCount = 0;
	playerCount = 0;
	createDeck

var createDeck = function() {
    var cardRanks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    var cardSuits = ["&#9830", "&#9827", "&#9829", "&#9824"]; // codes for diamonds, clubs, hearts, spades

    for (var i = 0; i < cardRanks.length; i++) {
        for (j = 0; j < cardSuits.length; j++) {
            var newCard = {
                rank: cardRanks[i],
                suit: cardSuits[j]
            };
            cardDeck.push(newCard);
        }
    }
};

var dealCards = function() {
    playerHand = cardDeck.splice(0, 2);
    dealerHand = cardDeck.splice(0, 2);

    jQuery("#playerArea").html("<div class='card playingCard col-lg-1 col-xs-3 col-centered'>" + playerHand[0].rank + playerHand[0].suit +
        "</div><div class='card playingCard col-lg-1 col-xs-3 col-centered'>" + playerHand[1].rank + playerHand[1].suit + "</div>");

    jQuery("#dealerArea").html("<div class='card playingCard col-lg-1 col-xs-3 col-centered'>" + dealerHand[0].rank + dealerHand[0].suit +
        "</div><div id = 'hiddenCard' class='card playingCard col-lg-1 col-xs-3 col-centered'>?</div>");

    getCount(playerHand);
};

var dealerDraw = function() {
    dealerHand = dealerHand.concat(drawCard());

    var drawnCard = dealerHand[dealerHand.length - 1].rank + dealerHand[dealerHand.length - 1].suit;
    dealerCount = getCount(dealerHand);

    jQuery("#dealerArea").append("<div class='card playingCard col-lg-1 col-xs-3 col-centered'>" + drawnCard + "</div>");

    jQuery("#message").append("<p>The dealer draws " + drawnCard + ".</p>");

    jQuery("#dealerCount").html(dealerCount);
};

var drawCard = function() {
    return cardDeck.splice(0, 1);
};

var getCount = function(hand) {
    var count = 0;

    for (var i = 0; i < hand.length; i++) {
        if (hand[i].rank == "K" || hand[i].rank == "Q" || hand[i].rank == "J") {
            count += 10;
        } else if (hand[i].rank == "A") {
            count += 1;
        } else {
            count += parseInt(hand[i].rank);
        }
    }
    for (var j = 0; j < hand.length; j++) {
        if (hand[j].rank == "A" && count <= 11) {
            count += 10;
        }
    }
    return count;
};

var newRound = function() {
    playerCount = 0;
    dealerCount = 0;
    playerHand = [];
    dealerHand = [];
    jQuery("#dealerCount").html("?");
    jQuery("#hit, #stand").attr("disabled", false);
    jQuery("#redeal, #newgame").attr("disabled", true);
    shuffleDeck(1000);
    dealCards();
    playerTurn();
};

var playerTurn = function() {
    playerCount = getCount(playerHand);

    jQuery("#playerCount").html(" " + playerCount);

    if (playerCount == 21) {
        youWin();
    } else if (playerCount <= 21) {
        jQuery("#message").append("<p>Will you Hit or Stand?</p>");
    } else {
        youLose();
    }
};

var shuffleDeck = function(n) {
    for (var i = 0; i < n; i++) {
        var pulledCard = cardDeck.splice(Math.floor(Math.random() * 52), 1);
        cardDeck = cardDeck.concat(pulledCard);
    }
};

var youWin = function() {
    jQuery("#message").append("<p>YOU WIN!!</p>");
    jQuery("#redeal, #newgame").attr("disabled", false);
    jQuery("#hit, #stand").attr("disabled", true);
};

var youLose = function() {
    jQuery("#message").append("<p>You Lose! :(</p>");
    jQuery("#redeal, #newgame").attr("disabled", false);
    jQuery("#hit, #stand").attr("disabled", true);
};

jQuery("#hit").on("click", function() {
    playerHand = playerHand.concat(drawCard());

    var drawnCard = playerHand[playerHand.length - 1].rank + playerHand[playerHand.length - 1].suit;

    jQuery("#playerArea").append("<div class='card playingCard col-lg-1 col-xs-3 col-centered'>" + drawnCard + "</div>");
    jQuery("#message").html("<p>You drew " + drawnCard + ".</p>");

    playerTurn();
});

jQuery("#stand").on("click", function() {
    jQuery("#hit, #stand").attr("disabled", true);

    dealerCount = getCount(dealerHand);
    jQuery("#hiddenCard").html(dealerHand[1].rank + dealerHand[1].suit);
    jQuery("#dealerCount").html(dealerCount)
    jQuery("#message").html("<p>The dealer reveals his second card. It's " +
        dealerHand[1].rank + dealerHand[1].suit + ".</p>");

    while (dealerCount < 21) {
        if (dealerCount < playerCount) {
            dealerDraw();
        } else if (dealerCount > playerCount) {
            jQuery("#message").append("<p>Your count is " + playerCount + " and the dealer's count is " + dealerCount + ". Dealer's count is higher!</p>");
            youLose();
            break;
        } else if (dealerCount === playerCount) {
            jQuery("#message").append("<p>Both counts are " + playerCount + "! Push!");
            youWin();
            break;
        }
    }

    if (dealerCount > 21) {
        jQuery("#message").append("<p>Dealer busts!</p>");
        youWin();
    } else if (dealerCount === 21) {
        jQuery("#message").append("<p>Dealer gets 21!</p>");
        youLose();
    }
	
	scrolldown();
});

scrolldown = function() {
	var n = jQuery(document).height();
    jQuery('html, body').animate({ scrollTop: n }, 50);
//                                       |    |
//                                       |    --- duration (milliseconds) 
//                                       ---- distance from the top
}

jQuery("#redeal").on("click", function() {
    jQuery("#message").html("<p>Continuing with the same deck...</p>");
    if (cardDeck.length > 9) {
        newRound();
    } else {
        jQuery("redeal").attr("disabled", true);
        jQuery("#message").append("<p>Not enough cards! Click New Game to create a new deck.</p>");
    }
});

jQuery("#newgame").on("click", function() {
    jQuery("#message").html("<p>Resetting the deck...</p>");
    cardDeck = [];
    createDeck();
    newRound();
});

jQuery(document).ready(function() {
    createDeck();
    shuffleDeck(1000);
    dealCards();
    playerTurn();
	scrolldown();
});