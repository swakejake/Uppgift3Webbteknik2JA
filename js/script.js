// Globala konstanter och variabler
const allBricks = ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40"]; // Array för alla siffror.
var bricks = allBricks.slice(0);                 // Array till brickorna som används
var boardElem;              // Referens till spelplanen
var controlElem;           // Referens till Nya brickor div-en
var newGameBtn;             // Referens till Nytt spel knappen.
var newBricksBtn;           // Referens till Ny bricka knappen
var newBricksElem;          // Referens till de elementen för brickorna
var newElems;               // Array med referenser till de brickor som ska kunna dras
var msgElem;                // Referens till div-elementet för meddelande till användaren
var imgElems;			    // Array med referenser till elementen med de fyra bilderna (img)
var dragBricksElem;         // Array för att kunna flytta brickor
var dropBricksElem;         // Array med referenser för drop zones 
var draggingBrickElem;       // Brickan som flyttas under ett drag event
// Initiera globala variabler

function init() { 
boardElem = document.getElementById("board");
controlElem = document.getElementById("control");
newGameBtn = document.getElementById("newGameBtn"); 
newBricksBtn = document.getElementById("newBricksBtn"); 
newBricksElem = document.getElementById("newBricks").getElementsByTagName("img"); 
newElems = document.getElementById("newBricks");
msgElem = document.getElementById("message");
imgElems = document.getElementsByClassName("r1,r2,r3,r4");
document.getElementById("newGameBtn").onclick=startGame;
document.getElementById("newBricksBtn").onclick=newBricks;

// Händelsehanterare för drag and drop
let dragBricksElem = document.getElementById("newBricks").getElementsByTagName("img");
for (let i = 0; i < dragBricksElem.length; i++) {
    dragBricksElem[i].draggable = true;
    dragBricksElem[i].addEventListener("dragstart",dragstartBricks);
    dragBricksElem[i].addEventListener("dragend",dragendBricks);
}
let dropBricksElem = document.getElementById("board").getElementsByTagName("td");
for (let i = 0; i <dropBricksElem.length; i++){
    dropBricksElem[i].addEventListener("dragover",dropZone)
    dropBricksElem[i].addEventListener("dragleave",dropZone)
    dropBricksElem[i].addEventListener("drop",dropZone)
}

newBricksBtn.disabled = true;
}
// end Init
window.addEventListener("load",init);
//newBricks(); // Ladda in newBricks funktionen
// funktioner

// Nytt spel
function startGame() {
    newBricksBtn.disabled = false; // Aktivera Nya brickor knappen
    newGameBtn.disabled = true; // Avaktivera knappen vid klick
    newBricks();
} // end startGame

// Nya brickor
function newBricks(){
	bricks = bricks.slice(0); // Kopiera allBricks till bricks
    for (let i = 0; i < 4; i++) {
        let ix = Math.floor(bricks.length * Math.random()); // Index till arrayen med alla brickor
        let brickValue = bricks[ix]
        let newUrl = "img/" + brickValue + ".png"; // URL för nya brickor
        
        newBricksElem[i].src = newUrl;
        newBricksElem[i].classList.add("brick");
        newBricksElem[i].classList.remove("empty");
        newBricksElem[i].id = brickValue
        
        bricks.splice(ix,1);
    }
    newBricksBtn.disabled = true; // Avaktivera knappen
} // end newBricks

// Funktion för att kunna dra brickorna över spelplanen
function dragstartBricks(e){
    e.dataTransfer.setData("url",this.src);
    draggingBrickElem = this;
} // end dragstartBricks

// Funktion för att sluta dra brickorna över spelplanen
function dragendBricks(e) { 
} // end dragendWord

function dropZone(e){
	e.preventDefault();
	if (e.type == "dragover") {
		this.style.backgroundColor = "#9C9";
	}
	else if (e.type == "dragleave") {
		this.style.backgroundColor = "";
	}
	else if (e.type == "drop") {
        //TODO: Du kan inte droppa en brick till en redan befintlig bricka
        // Det här är när vi droppar en bricka från "nya brickor"
		this.style.backgroundColor = "";
		let imgUrl = e.dataTransfer.getData("url");
        e.target.src = imgUrl;
        // Target är den nya brickan till vänster
        // Gör nya brickan till en brick
        e.target.classList.add("brick");
        e.target.id = draggingBrickElem.id
        let imgElems = boardElem.getElementsByTagName("img");
        

        draggingBrickElem.src = "img/empty.png";
        draggingBrickElem.classList.remove("brick");
        draggingBrickElem.classList.add("empty");
        draggingBrickElem.id = null
        
       let amountOfBricksLeft = 4;
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
        console.log(bricks.length, amountOfBricksLeft)
        if (bricks.length === 24 && amountOfBricksLeft === 0) {
            checkBricks("r")
            checkBricks("c")
        }
        
    }

}   
// Funktion för att kontrollera brickorna
// mark = r för rad och c för kolumn
function checkBricks(mark) {
    // Du ska kontrollera R1,R2,R3,R4 samt C1,C2,C3,C4
    // Varför i = 1 och i < 5? Jo för att vi ska loopa 4 ggr från kolumn/rad 1 eftersom att den heter så i HTML
     for (let i =1; i < 5; i++){
        // För varje rad kolla om det är en serie
        let rowOfBricks = boardElem.getElementsByClassName(mark+i)

        for (let j =0; j < 4; j++){
            // Är den här brickan större än förra?
            let brick = rowOfBricks[j]
            // Är det första brickan så är det ok
            if (j === 0) {
                continue;
            }
            // annars jämför "brick" mot föregående bricka "previousBrick". Den nuvarande måste vara lägre än föregående
            let previousBrick = rowOfBricks[j-1]
            let currentRowMarkElem = document.getElementById(mark+i+"mark")
            // Parseint eftersom att id är en sträng
            if (parseInt(previousBrick.id) < parseInt(brick.id)) {
                // Den här är mindre! Strunta i resten av kolumnerna och lägg ett kryss
                currentRowMarkElem.innerHTML = ("&cross;");
                break;
            }
            // Nu har vi gått igenom alla kolumner för den nuvarande raden
            // Nu lägger vi till en bock
            currentRowMarkElem.innerHTML = ("&check;");
            
        }
     }
} // end checkBricks