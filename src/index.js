import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
}
  
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            //xIsNext: true, 
        };
    }
  
    handleClick(i) {
        
        /*Checks if winner exists or clicked square is already filled*/
        const squares = this.state.squares.slice();


        if (calculateWinner(squares) || squares[i]) {
            return; 
        }
        squares[i] = 'X'; 
        this.setState({
            squares: squares,
            //xIsNext: !this.state.xIsNext,
        });

        //squares[actions(squares)[Math.floor(Math.random() * squares.length)]] = "O";
        squares[minimax(squares)] = "O";
        this.setState({
        squares: squares,
        //xIsNext: !this.state.xIsNext,
        });
          
        console.log(actions(squares)); 
        // console.log(result(squares, 0)); 
    }

    restart() {
        this.setState({
            squares: Array(9).fill(null),
            //xIsNext: !this.state.xIsNext,
        });
    }
  
    renderSquare(i) {
      return (
        <Square
          value={this.state.squares[i]}
          onClick={() => this.handleClick(i)}
        />
      );
    }
  
    render() {
        const winner = calculateWinner(this.state.squares);
        let status; 
        if (winner){
            if (winner === "X") {
                status = 'The 👩‍💻 Won';
            } else {
                status = '🧠 Algo Won';
            }
            
        } else if (terminal(this.state.squares)){
            status = "Tie ​🤝";
        } else {
            status = "Play Against Algo 🧠 ";
        }

    
        return (
            <div>
            <div className="status">{status}</div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
            <button className= "restart" 
            onClick={() => this.restart()}>
                Restart
            </button>
            </div>
        );
    }
}
  
class Game extends React.Component {
    render() {
        return (
            <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">

                <ol>{/* TODO */}</ol>
            </div>
            </div>
        );
    }
}
  
  // ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);














/*
    Checks if there is a winner in the current board. 
    @return The string value of the winning player.
*/
function calculateWinner(squares) {
    /*All the winning combinations*/
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


function actions(board) {
    const possibleActions = new Array(board.length);
    for (var i = 0; i < board.length; i++) {
        if (board[i] !== "X" && board[i] !== "O") {
            possibleActions[i] = "Possible"
        } else {
            possibleActions[i] = board[i]
        }
    }

    const position = []
    for (var y = 0; y < possibleActions.length; y++) {
        if (possibleActions[y] === "Possible"){
            position.push(y)
        }
    }
    return position;
  }

/**
 * Returns player who has the next turn on a board 
 * 
 */
function player(board){
    
    let xCount = 0
    let oCount = 0
    for(var i = 0; i < board.length; i++) {
        if (board[i] === "X"){
            xCount++;
        } else if (board[i] === "O"){
            oCount++;
        }
    }
    if (xCount === oCount){
        return "X"
    }else{
        return "O"
    }
}

/**
 *  Returns the board that results from making the given move on the board. 
 * 
 */ 
function result(board, action) {
    const newBoard = board.slice();
    newBoard[action] = player(board)
    return newBoard
}

/**
 * Returns true if game is over, False otherwise. 
 * 
 */
function terminal(board) {
    if(calculateWinner(board) !== null){
        return true 
    }
    
    if (board.filter(x => x === null).length >= 1) {
        return false
    } else{
        return true
    }
}

/**
 * Returns 1 if X has won the game, -1 if O has won, 0 otherwise
 * 
 */
function utility(board) {
    if (calculateWinner(board)==="X"){
        return 1;
    }
    else if (calculateWinner(board)==="O"){
        return -1;
    }else {
        return 0 
    }
}

function max_value(board){

    console.log(board)
    if (terminal(board)){
        return utility(board)
    } 
    let val = -1
    for (const element of actions(board)){
        val = Math.max(val, min_value(result(board,element)))
    }
    return val
}

function min_value(board){

    console.log(board)
    if (terminal(board)){
        return utility(board)
    } 
    let val = 1
    for (const element of actions(board)){
        val = Math.min(val, max_value(result(board,element)))
    }
    return val
}

function minimax(board) {
    
    if (terminal(board)) {
        return null
    }
    let bestAction = null;
    let bestScore = 1 
    console.log(actions(board))
    for (const element of actions(board)) {   
        let score = max_value(result(board,element));
        if (score<bestScore) {
            bestScore = score;                
            bestAction = element;
            }
        } 
    return bestAction;
}



    
