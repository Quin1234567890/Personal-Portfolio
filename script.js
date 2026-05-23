const cards = document.querySelectorAll(".card");
let cardOne, cardTwo;
let disableDeck = false;
let matchedCardCount = 0; // Standardized the match counter name

let score = document.getElementById("score");
let scoreNUM = 0;
let highScore = document.getElementById("high_score");

// Safely grab high score from localStorage, default to 0 if it doesn't exist yet
let highScoreNUM = parseInt(window.localStorage.getItem("highscoreLocal")) || 0;
highScore.innerHTML = "High Score: " + highScoreNUM;

const flipSound = new Audio("audio/flip.mp3"); // Update this path if your sound file is elsewhere

function flipCard(e) {
    let clickedCard = e.target.closest(".card") || e.target; // Ensures you grab the card even if clicking an inner element
    
    // Play sound if a source is provided
    if (flipSound.src) {
        flipSound.play().catch(() => {}); // catch prevents errors if src is empty
    }

    if (clickedCard !== cardOne && !disableDeck) {
        clickedCard.classList.add("flip");

        if (!cardOne) {
            return (cardOne = clickedCard);
        }
        
        cardTwo = clickedCard;
        disableDeck = true;

        let cardOneImg = cardOne.querySelector("img").src,
            cardTwoImg = cardTwo.querySelector("img").src;
        matchCards(cardOneImg, cardTwoImg);
    }   
}

function matchCards(img1, img2) {
    if (img1 === img2) {
        // If two cards match
        matchedCardCount++; 
        scoreNUM += 10000; // Corrected from =+ to +=
        score.innerHTML = "Score: " + scoreNUM;
        
        if (matchedCardCount === 8) {
            // If all 8 pairs are matched
            if (scoreNUM > highScoreNUM) {
                highScoreNUM = scoreNUM;
                window.localStorage.setItem("highscoreLocal", highScoreNUM); // Corrected syntax
                highScore.innerHTML = "High Score: " + highScoreNUM;
            }
            setTimeout(() => {
                shuffleCard();
            }, 1200);
        }
        cardOne.removeEventListener("click", flipCard);
        cardTwo.removeEventListener("click", flipCard);
        cardOne = cardTwo = ""; 
        disableDeck = false; // Corrected from "false" string to boolean
        return;
    } else {
        // If two cards do not match
        if (scoreNUM > 0) {
            scoreNUM -= 250;
            score.innerHTML = "Score: " + scoreNUM;
        }
        
        // Add a small delay before shaking or flipping back so the user can see the second card
        setTimeout(() => {
            cardOne.classList.add("shake");
            cardTwo.classList.add("shake");
        }, 400);

        setTimeout(() => {
            cardOne.classList.remove("shake", "flip");
            cardTwo.classList.remove("shake", "flip");
            cardOne = cardTwo = ""; // Clear values
            disableDeck = false;
        }, 1200); // Extended time so the shake animation actually has time to play
    }
}

function shuffleCard() {
    matchedCardCount = 0;
    cardOne = cardTwo = "";
    disableDeck = false;

    // Creating an array with pairs (1-8 twice makes 16 cards total)
    let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]; 
    arr.sort(() => (Math.random() > 0.5 ? 1 : -1)); 

    cards.forEach((card, index) => {
        card.classList.remove("flip", "shake");
        card.addEventListener("click", flipCard);

        let imgTag = card.querySelector("img");
        // Ensure this path aligns exactly with your local directory setup
        imgTag.src = `Images and Video/img-${arr[index]}.png`;
    });

    scoreNUM = 0;
    score.innerHTML = "Score: " + scoreNUM;
}

// Initial Setup
shuffleCard();