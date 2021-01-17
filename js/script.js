// Globala konstanter och variabler
const allBricks = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40"]; // Array för alla siffror.
var bricks = allBricks.slice(0);                 // Array till brickorna som används
var boardElem;                                  // Referens till spelplanen
var controlElem;                                // Referens till Nya brickor div-en
var newGameBtn;                                 // Referens till Nytt spel knappen.
var newBricksBtn;                               // Referens till Ny bricka knappen
var newBricksElem;                              // Referens till de elementen för brickorna
var newElems;                                   // Array med referenser till de brickor som ska kunna dras
var msgElem;                                    // Referens till div-elementet för meddelande till användaren
var imgElems;			                        // Array med referenser till elementen med de fyra bilderna (img)
var dragBricksElem;                             // Array för att kunna flytta brickor
var dropBricksElem;                             // Array med referenser för drop zones 
var draggingBrickElem;                          // Brickan som flyttas under ett drag event
var saveState;                                  // Referens för att kunna spara ner poäng och spelade spel
            
// Initiera globala variabler

function init() { 
boardElem = document.getElementById("board");
controlElem = document.getElementById("control");
newGameBtn = document.getElementById("newGameBtn"); 
newBricksBtn = document.getElementById("newBricksBtn"); 
newBricksElem = document.getElementById("newBricks").getElementsByTagName("img"); 
newElems = document.getElementById("newBricks");
msgElem = document.getElementById("message");
pointsElem = document.getElementById("totPoints");
gamesElem = document.getElementById("countGames");
imgElems = document.getElementsByClassName("r1,r2,r3,r4");
markElems = document.getElementsByClassName("mark");
document.getElementById("newGameBtn").onclick=startGame; 
document.getElementById("newBricksBtn").onclick=newBricks;

// Händelsehanterare för drag and drop

dragBricksElem = document.getElementById("newBricks").getElementsByTagName("img"); 
dropBricksElem = document.getElementById("board").getElementsByClassName("empty"); 
        
newBricksBtn.disabled = true; // Inaktivera knappen newBricks

loadGame();
}
// end Init
window.addEventListener("load",init,);
// funktioner

// Nytt spel
function startGame() {
    newBricksBtn.disabled = false; // Aktivera Nya brickor knappen
    newGameBtn.disabled = true; // Avaktivera knappen vid klick
    saveState.gamesPlayed = saveState.gamesPlayed + 1;
    
    for (let i = 0; i < dragBricksElem.length; i++) { // En variabel för att hantera dragstart och dragend händelsehanterare
        dragBricksElem[i].draggable = true;
        dragBricksElem[i].addEventListener("dragstart",dragstartBricks);
        dragBricksElem[i].addEventListener("dragend",dragendBricks);
    }

    // Återställ alla brickor från tidigare spel till "empty"
    for (let i = 0; i < dropBricksElem.length; i++) {
        // Vi vill sätta bilden till empty
        dropBricksElem[i].src = "img/empty.png";
        // Vi vill ta bort id-taggen 
        dropBricksElem[i].removeAttribute('id');
        // Vi vill ta bort klassen brick?
        dropBricksElem[i].classList.remove("brick");
        // Vi vill lägga till empty class?????? Eller inte?
        dropBricksElem[i].classList.add("empty");
    }

    // Ta bort checkgrejen också
    for (let i = 0; i < markElems.length; i++) {
        markElems[i].innerHTML = "";
    }
    bricks = allBricks.slice(0); // Kopiera om allBricks igen för att kunna köra spelet från noll
    saveState.roundPoints = 0; // Skriv roundPoints till 0
    msgElem.innerHTML = ""; // Ta texten från föregående omgång
} // end startGame

// Nya brickor
function newBricks(){
	bricks = bricks.slice(0); // Kopiera allBricks till bricks
    for (let i = 0; i < 4; i++) {
        let ix = Math.floor(bricks.length * Math.random()); // Index till arrayen med alla brickor
        let brickValue = bricks[ix]
        let newUrl = "img/" + brickValue + ".png"; // URL för nya brickor
        
        newBricksElem[i].src = newUrl; // Definerar vad newBricksElem är för variabel.
        newBricksElem[i].classList.add("brick"); // Lägga till Brick Classen
        newBricksElem[i].classList.remove("empty"); // Ta bort Empty Classen
        newBricksElem[i].id = brickValue // Brickvalue används för att inte störa newBricksElem arrayen vid dragstart och dragend event
        
        bricks.splice(ix,1); // för att välja ut bilden och bara en bild
    }
    newBricksBtn.disabled = true; // Avaktivera knappen
} // end newBricks

// Funktion för att kunna dra brickorna över spelplanen
function dragstartBricks(e){
    e.dataTransfer.setData("url",this.src);
    
    draggingBrickElem = this;

    for (let i = 0; i < dropBricksElem.length; i++){ // En loop som slår på dragover, dragleave och drop händelsehanterare
        if (this.classList.contains("empty")){
            return;
        }
        dropBricksElem[i].addEventListener("dragover",dropZone)
        dropBricksElem[i].addEventListener("dragleave",dropZone)
        dropBricksElem[i].addEventListener("drop",dropZone)
        }
} // end dragstartBricks

// Funktion för att sluta dra brickorna över spelplanen
function dragendBricks(e) { // En loop som tar bort dragover, dragleave och drop händelsehanterare
    for (let i = 0; i < dropBricksElem.length; i++){
        dropBricksElem[i].removeEventListener("dragover",dropZone)
        dropBricksElem[i].removeEventListener("dragleave",dropZone)
        dropBricksElem[i].removeEventListener("drop",dropZone)
    }
} // end dragendBricks

function dropZone(e){
	e.preventDefault();
	if (e.type == "dragover") {
        if (e.target.classList.contains("brick")) {// Om den nya bricka innehåller en bricka, gör inget
            return;
        }   
        this.style.backgroundColor = "#9C9"; // Ändra bakgrundsfärg till annan färg vid hover
	}
	else if (e.type == "dragleave") {
        if (e.target.classList.contains("brick")) { // Om den nya bricka innehåller en bricka, gör inget
            return;
          }  
        this.style.backgroundColor = ""; // Ta bort bakgrundsfärg
	}
	else if (e.type == "drop") {
        // Om den nya brickan inte är tom så borde vi inte kunna lägga denna.
        if (e.target.classList.contains("brick")) {
                        return;
                }
        // Det här är när vi droppar en bricka från "nya brickor"
		this.style.backgroundColor = "";
		let imgUrl = e.dataTransfer.getData("url"); // Hämta bild-url från den dragna brickan
        e.target.src = imgUrl;
        // Target är den nya brickan till vänster        
        // Gör nya brickan till en brick
        e.target.classList.add("brick"); // Välja element med brick element
        e.target.id = draggingBrickElem.id
        
        draggingBrickElem.src = "img/empty.png"; // Sätta vilken bild dragginBricksElem ska ha
        draggingBrickElem.classList.remove("brick"); // Ta bort brick classen
        draggingBrickElem.classList.add("empty"); // Lägga till empty classen
        draggingBrickElem.removeAttribute('id'); // Göra ID till null för att kunna räkna ID sen för amountOfBricksLeft

       let amountOfBricksLeft = 4; // Sätta antal brickor till 4
        for (let i =0; i < 4; i++){
            // Anledningen att göra contains är för att classList är en "array" som kan innehålla flera värden
            if (newBricksElem[i].classList.contains("empty")) {
                amountOfBricksLeft -= 1;
            }
        }
        // Om valet av brickor är 0 så kan vi ju refresha det. Nice 
        if (amountOfBricksLeft === 0){
            newBricksBtn.disabled = false;
        }
        // Om vi har lagt ut alla brickor så kan vi validera
        // Bricks är från början 40 lång. Om den är 4*4=16 mindre och vi har lagt ut alla så kör vi
        if (bricks.length === 24 && amountOfBricksLeft === 0) {
            checkBricks("r")
            checkBricks("c")
            msgElem.innerHTML = "Du har fått " + saveState.roundPoints + " poäng";
            gamesElem.innerHTML = saveState.gamesPlayed;
            saveState.totalPoints = saveState.totalPoints + saveState.roundPoints;
            pointsElem.innerHTML = saveState.totalPoints;
            saveGame();
        }
    }
}   
// Funktion för att kontrollera brickorna
// mark = r för rad och c för kolumn
function checkBricks(mark) {
    // Du ska kontrollera R1,R2,R3,R4 samt C1,C2,C3,C4
    // Varför i = 1 och i < 5? Jo för att vi ska loopa 4 ggr från kolumn/rad 1 eftersom att den heter så i HTML
    outerLoop:
     for (let i =1; i < 5; i++){
        // För varje rad kolla om det är en serie
        let rowOfBricks = boardElem.getElementsByClassName(mark+i) // Lokal variabel hämtad för att hantera BOCKAR och KRYSS i raderna.
        let currentRowMarkElem = document.getElementById(mark+i+"mark") // Lokal variabel hämtad för att hantera BOCKAR och KRYSS i raderna.
        for (let j =0; j < 4; j++){
            // Är den här brickan större än förra?
            let brick = rowOfBricks[j] // Lokal variabel för att räkna brickor. rowOfBricks indexeras med [j]
            
            // Är det första brickan så är det ok
            if (j === 0) {
                continue;
            }
            // annars jämför "brick" mot föregående bricka "previousBrick". Den nuvarande måste vara lägre än föregående
            let previousBrick = rowOfBricks[j-1] // Previousbrick är rowofbricks (J) - 1
            // Parseint eftersom att id är en sträng
            if (parseInt(previousBrick.id) > parseInt(brick.id)) {
                // Den här är mindre! Strunta i resten av kolumnerna och lägg ett kryss
                currentRowMarkElem.innerHTML = ("&cross;");
                newGameBtn.disabled = false; // Slå på knappen newGame
                newBricksBtn.disabled = true; // Stänga av knappen newGame
                continue outerLoop; // Fortsätta till den yttre loopen
            }
            // Nu har vi gått igenom alla kolumner för den nuvarande raden
            // Nu lägger vi till en bock
            }
        currentRowMarkElem.innerHTML = ("&check;");
        newBricksBtn.disabled = true; // Stänga av knappen newBricks
        newGameBtn.disabled = false; // Slå på knappen newGame
        ++saveState.roundPoints; // Spara poängen i roundPoints
        }
} // end checkBricks

function saveGame(){ // Spara poäng och antal spel spelade
    window.localStorage.setItem('totalPointsja224ucUserInfo', saveState.totalPoints)
    window.localStorage.setItem('gamesPlayedja224ucUserInfo', saveState.gamesPlayed)
}
function loadGame(){ // Ladda in antal poäng och spel spelade.
    let localPoints =  window.localStorage.getItem('totalPointsja224ucUserInfo') // Sätta localStorage till totalPointsja224ucUserInfo
    let localGames = window.localStorage.getItem('gamesPlayedja224ucUserInfo') // Sätta localStorage gamesPlayed till gamesPlayedja224ucUserInfo
    // Skriva ut localStorage resultatet i totPoints och countGames
    gamesElem.innerHTML = localGames;
    pointsElem.innerHTML = localPoints;

    saveState = { // Spara localStorage i spelet och göra om till siffror med parseInt
        "totalPoints": parseInt(localPoints) || 0,
        "gamesPlayed": parseInt(localGames) || 0,
        "roundPoints": 0,
    }
}