'use strict'


// 1. start game init - start the program without board / start from current level
// 2. open modal - choose level
// 3.user choose level
// 4.build board and render with no mines
// 5.set lives to 3 , set hint to 3 , set safe click to 3
// 6.user press on first cell  - random mines, cells check mines , start clock , cant choose other level
// 7. user control for event - left = choose cell, right = mark cell , seconde right = remove mark
// 8. step on mine(after end lives) - game over , show mines , modal display 
// 9. user win - game over , show mines , modal display , save time for the level


const MINE = '💣'
const HAPPY_FACE = '😃'
const SAD_FACE = '😭'
const WIN_FACE = '😎'
const LIVE = '❤️'
const HINT = '💡'
const SAFE_CLICK = '🕯'
const OVER = '❌'
const MARK = '🚩'


var gBoard = [];
var gLevels = [{ size: 4, mines: 2 }, { size: 8, mines: 12 }, { size: 12, mines: 30 }];
var gLevelIdx;
var gLives;
var gSafeClicks;
var gGame = [{ isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 }];
var startTime;
var elModal;
var timeInterval;
var gHints;
var hint;
var strHint;
var firstPress;



function initGame(levelIdx = 0) {

    gLevelIdx = levelIdx;
    setHelpers()
    gGame.isOn = true;
    firstPress = false
    buildBoard(gLevels[levelIdx].size);
    renderBoard(gBoard, levelIdx);
    smileyButton(HAPPY_FACE)
}



function buildBoard(boardSize) {
    gBoard = []
    for (var i = 0; i < boardSize; i++) {
        gBoard[i] = [];
        for (var j = 0; j < boardSize; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            };;
        }
    }
}


//check how many mines is around the cell
function setMinesNegsCount(iCellIdx, jCellIdx) {

    var countMines = 0;
    var emptyCells = [];


    for (var i = iCellIdx - 1; i <= iCellIdx + 1; i++) {
        if (i < 0 || i === gBoard.length) continue;

        for (var j = jCellIdx - 1; j <= jCellIdx + 1; j++) {
            if (j < 0 || j === gBoard.length) continue;
            if (i === iCellIdx && j === jCellIdx) continue;
            if (gBoard[i][j].isMine) countMines++;

            if (!gBoard[i][j].isShown) emptyCells.push({ iIdx: i, jIdx: j })
        }
    }
    gBoard[iCellIdx][jCellIdx].minesAroundCount = countMines;

    if (!countMines && !gBoard[iCellIdx][jCellIdx.isMine]) {

        for (var k = 0; k < emptyCells.length; k++) {

            gBoard[emptyCells[k].iIdx][emptyCells[k].jIdx].isShown = true

            setMinesNegsCount(emptyCells[k].iIdx, emptyCells[k].jIdx)

        }

    }
    renderCell(iCellIdx, jCellIdx)
}



function cellClicked(elCurrCell, mouseKeyNum) {



    if (!gGame.isOn) return

    var cellData = elCurrCell.dataset.cell.split('-')


    var iCellIdx = parseInt(cellData[0])
    var jCellIdx = parseInt(cellData[1])

    var currentCell = gBoard[iCellIdx][jCellIdx];


    if (mouseKeyNum === 1 && !firstPress) {
        setRandomMines(iCellIdx, jCellIdx);
        startClock();
        firstPress = true
    }


    if (mouseKeyNum === 1 && hint) {

        peekCells(iCellIdx, jCellIdx, true)
        setTimeout(function () { peekCells(iCellIdx, jCellIdx, false) }, 1000);
        hint = false
        return
    }


    if (mouseKeyNum === 3) {

        cellMarked(elCurrCell, iCellIdx, jCellIdx);
        checkGameOver();
        return
    }

    if (mouseKeyNum === 1 && currentCell.isMarked) return;


    if (mouseKeyNum === 1 && currentCell.isMine) {
        gBoard[iCellIdx][jCellIdx].isShown = true
        smileyButton(SAD_FACE)
        showMines()
        stopGame()
        return
    }

    if (mouseKeyNum === 1) currentCell.isShown = true;

    setMinesNegsCount(iCellIdx, jCellIdx);

    checkGameOver();
}


//set the mines after the first press
function setRandomMines(iCellIdx, jCellIdx) {
    var minesCounter = gLevels[gLevelIdx].mines;

    while (minesCounter != 0) {

        var randomCol = getRandomInt(0, gLevels[gLevelIdx].size);
        var randomRow = getRandomInt(0, gLevels[gLevelIdx].size);

        if (randomCol === iCellIdx || randomRow === jCellIdx) continue;
        if (!gBoard[randomCol][randomRow].isMine) {
            gBoard[randomCol][randomRow].isMine = true;
            minesCounter--;
        }
    }
}

function startClock() {
    startTime = Date.now()
    timeInterval = setInterval(function () { getTime() }, 1000)

}


function getTime() {
    var endTime = Date.now()
    gGame.secsPassed = parseInt((endTime - startTime) / 1000)
    console.log(gGame.secsPassed)

}


function checkGameOver() {

    var MarkCellsCounter = 0;
    var showCellsCounter = 0;

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMarked) MarkCellsCounter++;
            if (gBoard[i][j].isShown) showCellsCounter++;
        }
    }

    if (gBoard.length ** 2 - MarkCellsCounter++ === showCellsCounter) {
        smileyButton(WIN_FACE)
    }

}

function stopGame() {
    gGame.isOn = false
    clearInterval(timeInterval)

}

function restart() {
    clearInterval(timeInterval)
    initGame(gLevelIdx)
}

function getHint() {
    if (!gHints) return
    gHints--
    strHint = ''
    hint = true
    if (!gHints) strHint = OVER
    else {
        for (var i = 0; i < gHints; i++) {
            strHint += HINT + ' '
        }
    }
    var elHint = document.querySelector('.hints')
    elHint.innerText = strHint

}

function smileyButton(face) {
    document.querySelector('.face button').innerHTML = face

}

function peekCells(iCellIdx, jCellIdx, toShow) {
    

    for (var i = iCellIdx - 1; i <= iCellIdx + 1; i++) {
        if (i < 0 || i === gBoard.length) continue;
        for (var j = jCellIdx - 1; j <= jCellIdx + 1; j++) {
            if (j < 0 || j === gBoard.length) continue;
            gBoard[i][j].isShown = toShow
            console.log(gBoard[i][j].isShown);
            renderCell(i,j)

        }
    }
}

function setHelpers() {
    gLives = gHints = gSafeClicks = 3;
    var elHint = document.querySelector('.hints')
    elHint.innerText = HINT + ' ' + HINT + ' ' + HINT
}



function showMines() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard.length; j++) {
            if (gBoard[i][j].isMine){
                gBoard[i][j].isShown = true
                renderCell(i, j)
            }
        }
    }
}




// function getSafeClick(){

//     while (!isNotMine) {

//         var randomCol = getRandomInt(0, gLevels[gLevelIdx].size);
//         var randomRow = getRandomInt(0, gLevels[gLevelIdx].size);

//         if (gBord[randomCol][randomRow].isShown) continue;
//         if (gBord[randomCol][randomRow].isMine) continue;

//         renderCell(randomCol,randomRow)


//         }

// }
