function getRandomInt(min, max) {
    return Math.floor((Math.random() * (max - min)) + min);
}


function renderBoard(squareBoard, levelIdx) {

    strHTML = `<table><tbody>`

    for (var i = 0; i < squareBoard.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < squareBoard.length; j++) {
            strHTML += `<td class="cell" "${levelIdx}" onclick="cellClicked(this,event.which)"
             oncontextmenu="cellClicked(this,event.which)" data-cell="${i}-${j}"></td>`
        }
        strHTML += `</tr>`
    }
    strHTML += `</table></tbody>`
    var gameBoard = document.querySelector('.gameBoard')
    gameBoard.innerHTML = strHTML

}


function renderCell(iCellIdx, jCellIdx) {

    var currentCell = gBoard[iCellIdx][jCellIdx];
    var elCurrCell = document.querySelector(`[data-cell="${iCellIdx}-${jCellIdx}"]`)

    var minesNumber = gBoard[iCellIdx][jCellIdx].minesAroundCount

    if (currentCell.isShown) {

        elCurrCell.classList.add('shown');

        if (currentCell.isMine) elCurrCell.innerHTML = MINE;
        else elCurrCell.innerHTML = (minesNumber) ? minesNumber : ''
    }

    if (!currentCell.isShown) {

        elCurrCell.classList.remove('shown');
        elCurrCell.innerHTML = ''
    }

}


//toggle for mark cells
function cellMarked(elCurrCell, iCellIdx, jCellIdx) {
    var currentCell = gBoard[iCellIdx][jCellIdx];
    if (currentCell.isShown) return;

    // update model + dom
    if (currentCell.isMarked) {
        currentCell.isMarked = false;
        elCurrCell.innerHTML = ''
    } else {
        currentCell.isMarked = true;
        elCurrCell.innerHTML = MARK
    }
}

// function hideCell(iCellIdx, jCellIdx){

//     var elCurrCell = document.querySelector(`[data-cell="${iCellIdx}-${jCellIdx}"]`)
//     elCurrCell.classList.add('shown');
//     elCurrCell.innerHTML = gBoard[iCellIdx][jCellIdx].minesAroundCount;


// }