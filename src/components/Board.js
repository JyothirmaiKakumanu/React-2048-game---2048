import React, { useEffect, useState } from "react";

export default function Board({ GridSize }) {

    const initGrid = [...Array(GridSize)].map(() => [...Array(GridSize)].fill(0));

    // initGrid[2][0] = 2;
    // initGrid[2][2] = 4;
    const [grid, setGrid] = useState([...initGrid]);
    const [gameOver, setGameOver] = useState(false);

    const [score, setScore] = useState(0);

    const addNewNumber = (gridCopy) => {
        let freeSpaces = [];

        for (let i = 0; i < GridSize; i++) {
            for (let j = 0; j < GridSize; j++) {
                if (grid[i][j] === 0) {
                    freeSpaces.push({ row: i, col: j });
                }
            }
        }
        console.log('freespaces', freeSpaces);

        if (freeSpaces.length === 0) {
            setGameOver(true);
        }

        let position = Math.floor(Math.random() * freeSpaces.length);
        console.log('position', position);
        gridCopy[freeSpaces[position].row][freeSpaces[position].col] =
            Math.random() > 0.49 ? 4 : 2;

        setGrid(gridCopy);

    }

    const rightShift = () => {
        let gridCopy = [...grid];
        console.log(gridCopy);
        gridCopy = gridCopy.map((row) => {
            // let rowCopy = [...row];
            let rowCopy = shift('right', row);
            mergeRight(rowCopy);
            rowCopy = shift('right', rowCopy);

            return rowCopy;
        })

        console.table(gridCopy);
        addNewNumber(gridCopy);
    }


    const leftShift = () => {
        let gridCopy = [...grid];
        console.log(gridCopy);
        gridCopy = gridCopy.map((row) => {
            // let rowCopy = [...row];
            let rowCopy = shift('left', row);
            mergeLeft(rowCopy);
            rowCopy = shift('left', rowCopy);

            return rowCopy;
        })

        console.table(gridCopy);
        addNewNumber(gridCopy);
    }

    const topShift = () => {
        let gridCopy = transpose(grid);

        gridCopy = gridCopy.map((row) => {
            // let rowCopy = [...row];
            let rowCopy = shift('left', row);
            mergeLeft(rowCopy);
            rowCopy = shift('left', rowCopy);
            return rowCopy;

        })
        addNewNumber(transpose(gridCopy));
    }

    const bottomShift = () => {
        let gridCopy = transpose(grid);

        gridCopy = gridCopy.map((row) => {
            // let rowCopy = [...row];
            let rowCopy = shift('right', row);
            mergeRight(rowCopy);
            rowCopy = shift('right', rowCopy);
            return rowCopy;

        })
        addNewNumber(transpose(gridCopy));
    }

    const mergeRight = (row) => {
        let netScoreAdd = 0;
        for (let i = GridSize - 1; i > 0; i--) {
            let a = row[i];
            let b = row[i - 1];
            if (a === b) {
                row[i] = a + b;
                netScoreAdd += row[i];
                row[i - 1] = 0;
            }
        }
        setScore(score + netScoreAdd);
    }

    const mergeLeft = (row) => {
        let netScoreAdd = 0;
        for (let i = 0; i < GridSize; i++) {
            let a = row[i];
            let b = row[i + 1];
            if (a === b) {
                row[i] = a + b;
                netScoreAdd += row[i];
                row[i + 1] = 0;
            }
        }
        setScore(score + netScoreAdd);
    }


    const transpose = (arr) => {
        return arr.map((_, colIndex) => arr.map((row) => row[colIndex]));
    };

    const shift = (direction, row) => {
        // let arr = row.filter((val) => val);
        // //will get arr without zeros

        // let missing = GridSize - arr.length;
        // let zeros = Array(missing).fill(0);

        // switch (direction) {
        //     case 'right':
        //         arr = zeros.concat(arr);
        //         return arr;
        //     case 'left':
        //         arr = arr.concat(zeros);
        //         return arr;
        // }
        let arr = row.filter((val) => val);
        let zeroCount = GridSize - arr.length;
        let zero = Array(zeroCount).fill(0);
        if (direction === "right") {
            arr = zero.concat(arr);
        } else {
            arr = arr.concat(zero);
        }
        return arr;
    }

    const handleKeydownListener = (event) => {
        event.preventDefault();
        // addNewNumber();
        if (gameOver) {
            return;
        }
        const { code } = event;
        switch (code) {
            case 'ArrowUp':
                topShift();
                break;
            case 'ArrowDown':
                bottomShift();
                break;
            case 'ArrowLeft':
                leftShift();
                break;
            case 'ArrowRight':
                rightShift();
                break;
            default:
                break;
        }
       

    }


    useEffect(() => {
        window.addEventListener('keydown', handleKeydownListener);
        return () => {
            window.removeEventListener('keydown', handleKeydownListener);
        }
    }, [grid]);

    useEffect(() => {
        addNewNumber([...grid]);
      }, []);

    return (
        <>
            <h2 className="m-5 text-center">Score:- {score}</h2>
            <div className='board'>
                {grid.map((row, rowIndex) => {
                    return (
                        <div className='board-row' key={rowIndex}>
                            {row.map((val, index) => (
                                <div className={`board-box ${val !== 0 && 'board-box-high'}`} key={index}>
                                    {val !== 0 && val}
                                </div>
                            ))}
                        </div>

                    )
                })}
            </div>
        </>
    )
}
