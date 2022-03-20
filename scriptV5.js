var hr=0;
var min=0;
var sec =0;
var stoptime = true;
// squares limits for deleting cells
const square1 = [0,3,0,3];
const square2 = [3,6,0,3];
const square3 = [6,9,0,3];
const square4 = [0,3,3,6];
const square5 = [3,6,3,6];
const square6 = [6,9,3,6];
const square7 = [0,3,6,9];
const square8 = [3,6,6,9];
const square9 = [6,9,6,9];
const squares = [square1,square2,square3,square4,square5,
    square6,square7,square8,square9];
var numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var full_board,new_grid,deleted_grid,difficult_level;
const input_disable = "grey";
const input_enable = "white";

// true - row and colomn without the number
function rowAndColomnCheck(grid,row,col,num){
    function checkForNumebrInRaw(grid,row,num){
        for (let i = 0; i<grid.length;i++){
            if (grid[row][i] == num){return true;}
        }
        return false;
    }
    function checkForNumebrInColomn(grid,colomn,num){
        for (let i = 0; i<grid.length;i++){
            if (grid[i][colomn] == num){return true;}
        }
        return false;
    }
    if (!checkForNumebrInColomn(grid,col,num) && !checkForNumebrInRaw(grid,row,num)){
        return true;
    }else{
        return false;
    }
};
// check if number is in sqare given
function checkForNumInSquare(square,num){
    for (let i=0;i<square.length;i++){
        for(let j=0;j<square[i].length;j++){
            if (square[i][j]== num){return true;}
        }
    }
    return false
};
// return list of numbers in range start and end
function range(start, end) {
    let res=[];
    for (i=start;i<end;i++){
        res.push(i)
    }
    return res
};
// return matrix 3x3 for fillSudoku method to check for num in square
function getSquare(mat,a,b,c,d) {
    var res = []
        rows = range(c, d);
  
    for (var cols = 0, ranges = rows.length; cols < ranges; cols += 1) {
      var i = rows[cols];
  
      res.push(mat[i].slice(a, b));
    }
  
    return res;
};
// return a list with sqare cells in matrix 9x9
function getSquareCells(square){
    let res = []
    let x_start = square[0];
    let x_end = square[1];
    let y_start = square[2];
    let y_end = square[3];
    for (let i=x_start;i<x_end;i++){
        for(let j=y_start;j<y_end;j++){
            res.push([i,j])
        }
    }
    return res;
}
// shuffle list for random delete of cells
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
};
// A function to check if the grid is full
function checkGrid(grid){
    for (let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            if (grid[i][j]== 0){return false;}
        }
    }
    // complete
    return true
};
// fill Sudoku board randomly 
function fillSudoku(mat){
    for(let i in range(0,81)){
        var mainRow = ~~(i / 9);
        var mainCol = i % 9;
        if (mat[mainRow][mainCol] == 0){
            shuffle(numberList);
            for (let value of numberList){
                if(rowAndColomnCheck(mat,mainRow,mainCol,value)){
                    let mySquare = [];
                    if(mainRow<3){
                        if (mainCol<3){
                            mySquare = getSquare(mat,0,3,0,3);
                        }
                        else if (mainCol<6){
                            mySquare = getSquare(mat,3,6,0,3);
                        }
                        else{
                            mySquare = getSquare(mat,6,9,0,3);
                        }
                    }
                    else if(mainRow<6){
                        if (mainCol<3){
                            mySquare = getSquare(mat,0,3,3,6);
                        }
                        else if (mainCol<6){
                            mySquare = getSquare(mat,3,6,3,6);
                        }
                        else{
                            mySquare = getSquare(mat,6,9,3,6);
                        }
                    }
                    else{
                        if (mainCol<3){
                            mySquare = getSquare(mat,0,3,6,9);
                        }
                        else if (mainCol<6){
                            mySquare = getSquare(mat,3,6,6,9);
                        }
                        else{
                            mySquare = getSquare(mat,6,9,6,9);
                        }
                    }
                    bol_t = checkForNumInSquare(mySquare,value);
                    if (bol_t == false){
                        mat[mainRow][mainCol] = value;
                        if (checkGrid(mat)){
                            return true;
                        }
                        else{
                            if (fillSudoku(mat)){
                                return true;
                            }
                        }
                    }
                }
            }
            break 
        }
    }
    mat[mainRow][mainCol] = 0;
};
// for difficult level - removing cells randomly
function delPercenetege(grid,difficult){
    var numOfCellsToDelPerSquare;
    switch (difficult) {
        case 'easy':
            numOfCellsToDelPerSquare = 3;
            break;
        case 'medium':
            numOfCellsToDelPerSquare = 4;
            break;
        case 'hard':
            numOfCellsToDelPerSquare = 6;
            break;
        case 'extreme':
            numOfCellsToDelPerSquare = 7;
            break;
    }
    for (sq of squares){
        let listOfCells = getSquareCells(sq);
        let counter = 0;
        shuffle(listOfCells);
        for(i of listOfCells){
            if (counter == numOfCellsToDelPerSquare){
                break;
            }
            grid[i[0]][i[1]] = 0;
            counter++;
        }
    }
    return grid;
}
// HTML FUNCTIONS

// check errors in HTML board
function checkForErrors(){
    let counter=0;
    for (let i=0;i<full_board.length;i++){
        for(let j=0;j<full_board[i].length;j++){
            if(document.getElementsByClassName("cells")[counter].value != full_board[i][j]){
                document.getElementsByClassName("cells")[counter].style.backgroundColor = "red";
            }else{
                document.getElementsByClassName("cells")[counter].disabled = true;
                document.getElementsByClassName("cells")[counter].style.backgroundColor = input_enable;
            }
            counter++;
        }
    }
    
}
// check if the board is ok , if ok alart you made it else count the erors with alart
function finishButton(){
    let errors = 0;
    let counter = 0;
    for (let i=0;i<full_board.length;i++){
        for(let j=0;j<full_board[i].length;j++){
            if (document.getElementsByClassName("cells")[counter].value != full_board[i][j]){
                errors++;
            }
            counter++;
        }
    }
    if (errors==0){
        stopTimer();
        alert(`You made it in ${document.getElementById("timer").innerHTML}!`)
        window.location.href = "finishLine.html"
    }else{
        alert(`You have ${errors} errors`)
    }
}
// clear board everytime that we generate
function clearBoard(){
    for (let i=0;i<81;i++){
        document.getElementsByClassName("cells")[i].value="";
        document.getElementsByClassName("cells")[i].style.backgroundColor="white";
    }
}
// genarate bord with web - including difficult level
function genarateBoard(){
    min,sec,hr = 0;
    document.getElementById("timerZone").hidden = false;
    document.getElementById("grid").hidden = false;
    document.getElementById("startBtn").innerHTML="Get New Board"
    document.getElementById("startBtn").style.color="rgb(255, 255, 255)"
    resetTimer();
    startTimer();
    clearBoard();
    difficult_level = document.getElementById("difficult").value;
    full_board = Array(9).fill().map(()=>Array(9).fill(0))
    fillSudoku(full_board);
    new_grid = duplicateMatrix(full_board)
    deleted_grid = delPercenetege(new_grid,difficult_level)
    let counter = 0;
    for (let i=0;i<full_board.length;i++){
        for(let j=0;j<full_board[i].length;j++){
            document.getElementsByClassName("cells")[counter].value="";
            document.getElementsByClassName("cells")[counter].disabled = false;
            document.getElementsByClassName("cells")[counter].style.backgroundColor = input_disable;
            document.getElementsByClassName("cells")[counter].addEventListener('change', checkBoardValue);
            if(deleted_grid[i][j] != 0){
                document.getElementsByClassName("cells")[counter].value = deleted_grid[i][j];
                document.getElementsByClassName("cells")[counter].disabled = true;
                document.getElementsByClassName("cells")[counter].style.backgroundColor = input_enable;
            }
            counter++;
        }
    }
}
// duplicate grid for deleting cells
function duplicateMatrix(grid){
    var res = Array(9).fill().map(()=>Array(9).fill(0));
    for (let i=0;i<grid.length;i++){
        for(let j=0;j<grid.length;j++){
            res[i][j] = grid[i][j]
        }
    }
    return res;
}
// login - redirect to board page
function login(){
    let userName = document.getElementById("userName").value;
    let password = document.getElementById("password").value;
    let loginmsg = document.getElementById("loginMsgs");
    console.log(userName);
    if (userName == "abcd" && password == "1234"){
        window.location.href = "board.html";
    }
    else if (userName == "abcd" && password !="1234"){
        loginmsg.style.color = "red";
        loginmsg.innerHTML="invalid password"
    }
    else if (userName != "abcd" && password =="1234"){
        loginmsg.style.color = "red";
        loginmsg.innerHTML="invalid username"
    }
    else{
        loginmsg.style.color = "red";
        loginmsg.innerHTML="invalid username and password"
    }
}
// check if input is number between 1-9
function checkBoardValue(){
    if (this.value.length > 0){
        if (!(checkLetterOrNum(this.value) && this.value > "0" && this.value <10)){
            alert("Sudoku can accept only numbers from 1 to 9")
            this.value = ""
        }
    }  
}
// check if input is number or letter
function checkLetterOrNum(inp){
    if (!isNaN(inp)){
        return true;
    }else{return false}
}
function startTimer() {
    if (stoptime == true) {
          stoptime = false;
          timerCycle();
      }
  }
function stopTimer() {
    if (stoptime == false) {
      stoptime = true;
    }
}
function timerCycle() {
    const timer = document.getElementById('timer');

    if (stoptime == false) {
    sec = parseInt(sec);
    min = parseInt(min);
    hr = parseInt(hr);

    sec = sec + 1;

    if (sec == 60) {
    min = min + 1;
    sec = 0;
    }
    if (min == 60) {
    hr = hr + 1;
    min = 0;
    sec = 0;
    }

    if (sec < 10 || sec == 0) {
    sec = '0' + sec;
    }
    if (min < 10 || min == 0) {
    min = '0' + min;
    }
    if (hr < 10 || hr == 0) {
    hr = '0' + hr;
    }

    timer.innerHTML = hr + ':' + min + ':' + sec;

    setTimeout("timerCycle()", 1000);
    }
}
function resetTimer() {
    const timer = document.getElementById('timer');
    sec=0;
    min=0;
    hr=0;
    timer.innerHTML = '00:00:00';
}