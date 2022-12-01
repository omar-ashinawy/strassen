class CustomMath {
    /*
    A class that exposes static methods. These methods implement mathematical concepts used in both normal and Strassens matrix multiplication.
    Methods:
        zeros:
            Public method. Returns a matrix of zeros given the dimensions of the matrix.
        performOperation: 
            Private method. Takes two matrices and the operation type (addition or subtraction). Returns the result matrix.
        add:
            Public method. Calls performOperation method to perform addition and returns the result matrix.
        subtract: 
            Public method. Calls performOperation method to perform subtraction and returns the result matrix.
        multiplyNormal: 
            Public method. Using the normal O(n^3) algorithm, it multiplies two input matrices and returns the result matrix.
        splitQuarter:
            Private method. Used during multiplying two matrices using Strassens method. It returns a quarter of a given matrix at a given starting point (startRow, startCol).
        split:
            Private method. Used during multiplying two matrices using Strassens method. Uses splitQuarter to return the 4 quarters of a given matrix.
        rowStack:
            Public method. Stacks two matrices horizontally. Used to assemble the intermediate matrices during Strassens multiplication.
        colStack:
            Public method. Stacks two matrices vertically. Used to assemble the intermediate matrices during Strassens multiplication.
        multiplyStrassens:
            Public method. Multiplies two matrices using Strassens method and returns the result matrix.
        getResultString:
            Public method. Returns a formatted string represnting a matrix for MathJax to detect and transform into an image of written matrix.
        getMultiplicationString:
            Public method. Returns a formatted string represnting a multiplication equation of two matrices for MathJax to detect and transform into an image of equation.
    */
    static zeros(size) {
        let mat = []
        for (let i = 0; i < size[0]; i++) {
            let rowMat = []
            for (let j = 0; j < size[1]; j++) {
                rowMat.push(0);
            }
            mat.push(rowMat);
        }
        return mat;
    }
    static #performOperation(matA, matB, addition) {
        if (typeof (matA) === 'number' || typeof (matB) === 'number') {
            return addition ? (matA + matB) : (matA - matB);
        }
        else if (!matA[0].length && !matB[0].length) {
            let matC = [];
            for (let i = 0; i < rowSizeA; i++) {
                matC.push(addition ? (matA[i] + matB[i]) : (matA[i] - matB[i]));
            }
            return matC;
        }
        const rowSizeA = matA.length;
        const rowSizeB = matB.length;
        const colSizeA = matA[0].length;
        const colSizeB = matB[0].length;
        if (rowSizeA === rowSizeB && colSizeA === colSizeB) {
            const rowSize = rowSizeA;
            const colSize = colSizeB;
            let matC = this.zeros([rowSize, colSize]);
            for (let i = 0; i < rowSizeA; i++) {
                for (let j = 0; j < colSizeA; j++) {
                    matC[i][j] = addition ? (matA[i][j] + matB[i][j]) : (matA[i][j] - matB[i][j]);
                }
            }
            return matC;
        }
    }
    static add(matA, matB) {
        return this.#performOperation(matA, matB, true);
    }
    static subtract(matA, matB) {
        return this.#performOperation(matA, matB, false);
    }
    static multiplyNormal(matA, matB) {
        const rowSize = matA.length;
        const colSize = matB[0].length;
        let matC = this.zeros([rowSize, colSize]);
        for (var i = 0; i < rowSize; i++) {
            for (var j = 0; j < rowSize; j++) {
                matC[i][j] = 0;
                for (var k = 0; k < rowSize; k++) {
                    matC[i][j] += matA[i][k] * matB[k][j];
                }
            }
        }
        return matC;
    }
    static #splitQuarter(mat, startRow, startCol) {
        const endRow = startRow + mat.length / 2;
        const endCol = startCol + mat[0].length / 2;
        let splittedMat = []
        for (let i = startRow; i < endRow; i++) {
            let rowSplittedMat = [];
            for (let j = startCol; j < endCol; j++) {
                rowSplittedMat.push(mat[i][j]);
            }
            splittedMat.push(rowSplittedMat);
        }
        return splittedMat.length === 1 ? splittedMat[0] : splittedMat;
    }
    static #split(mat) {
        const rowLength = mat.length;
        const colLength = mat[0].length
        if (rowLength === 2) {
            return {
                '1': mat[0][0],
                '2': mat[0][1],
                '3': mat[1][0],
                '4': mat[1][1]
            };
        }
        const hRowLength = rowLength / 2;
        const hColLength = colLength / 2;
        return {
            '1': this.#splitQuarter(mat, 0, 0),
            '2': this.#splitQuarter(mat, 0, hColLength),
            '3': this.#splitQuarter(mat, hRowLength, 0),
            '4': this.#splitQuarter(mat, hRowLength, hColLength)
        };
    }
    static rowStack(matA, matB) {
        if (typeof (matA) === 'number' && typeof (matB) === 'number') {
            return [[matA], [matB]];
        } else if (!matA[0].length && !matB[0].length) {
            return [[...matA], [...matB]];
        }
        const rowSize = matA.length + matB.length;
        const colSize = matA[0].length === matB[0].length ? matA[0].length : 0;
        let matC = this.zeros([rowSize, colSize]);
        for (let i = 0; i < rowSize; i++) {
            for (let j = 0; j < colSize; j++) {
                matC[i][j] = i < matA.length ? matA[i][j] : matB[i - matA.length][j];
            }
        }
        return matC;
    }
    static colStack(matA, matB) {
        if (typeof (matA) === 'number' && matB.length && !matB[0].length) {
            let matD = this.zeros([matB.length, 1]);
            matD.unshift(matA);
            return matD;
        } else if (matA.length && typeof (matB) === 'number' && !matA[0].length) {
            let matD = this.zeros([matA.length, 1]);
            matD.push(matB);
            return matD;
        } else if (typeof (matA) === 'number' && typeof (matB) === 'number') {
            return [matA, matB];
        } else if ((matA.length && matB.length) && (!matA[0].length && !matB[0].length)) {
            return [...matA, ...matB];
        }
        const rowSize = matA.length;
        const colSize = matA[0].length + matB[0].length;
        let matC = this.zeros([rowSize, colSize]);
        for (let i = 0; i < rowSize; i++) {
            for (let j = 0; j < colSize; j++) {
                matC[i][j] = j < matA[0].length ? matA[i][j] : matB[i][j - matA[0].length];
            }
        }
        return matC;
    }
    static multiplyStrassens(matA, matB) {
        if (!matA.length || !matB.length || matA.length === 1 || matB.length === 1) {
            return matA * matB;
        }

        const matAQuarters = this.#split(matA);
        const matBQuarters = this.#split(matB);
        const a = matAQuarters['1'];
        const b = matAQuarters['2'];
        const c = matAQuarters['3'];
        const d = matAQuarters['4'];
        const e = matBQuarters['1'];
        const f = matBQuarters['2'];
        const g = matBQuarters['3'];
        const h = matBQuarters['4'];

        const p1 = this.multiplyStrassens(a, this.subtract(f, h));
        const p2 = this.multiplyStrassens(this.add(a, b), h);
        const p3 = this.multiplyStrassens(this.add(c, d), e);
        const p4 = this.multiplyStrassens(d, this.subtract(g, e));
        const p5 = this.multiplyStrassens(this.add(a, d), this.add(e, h));
        const p6 = this.multiplyStrassens(this.subtract(b, d), this.add(g, h));
        const p7 = this.multiplyStrassens(this.subtract(a, c), this.add(e, f));

        const c11 = this.add(this.subtract(this.add(p5, p4), p2), p6);
        const c12 = this.add(p1, p2);
        const c21 = this.add(p3, p4);
        const c22 = this.subtract(this.subtract(this.add(p1, p5), p3), p7);

        return this.rowStack(this.colStack(c11, c12), this.colStack(c21, c22));
    }
    static getResultString(mat) {
        // \begin{bmatrix}6&0&0\\9&9&9\\8&8&8\\\end{bmatrix}
        let expression = '\\begin{bmatrix}';
        for (let i = 0; i < mat.length; i++) {
            for (let j = 0; j < mat.length; j++) {
                expression += mat[i][j].toString();
                expression += j !== mat.length - 1 ? '&' : '';
            }
            expression += '\\\\';
        }
        expression += '\\end{bmatrix}';
        return expression;
    }
    static getMultiplicationString(matA, matB, matC) {
        const resultStringA = CustomMath.getResultString(matA);
        const resultStringB = CustomMath.getResultString(matB);
        const resultStringC = CustomMath.getResultString(matC);
        const resultString = '\\[' + resultStringA + '*' + resultStringB + '=' + resultStringC + '\\]';
        return resultString;
    }
}
class Display {
    /*
    A class used to display the results.
    Attributes:
        matA, matB: 
            Private attributes. Stores the two input matrices after getting values from input fields.
        matC: 
            Private attribute. Stores the result matrix.
    Methods:
        getInputFields: 
            Private method. Returns all input fields associated with a matrix (defined by matrix name) given the parent ID.
        getParagraph: 
            Private method. Returns a paragraph element given its ID.
        fillMatrix: 
            Private method. Populates the values from input fields into a 2D array and returns the array.
        fillMatrices: 
            Public method. Sets the matA and matB attributes of the class to values returned by fillMatrix method.
        multiply: 
            Public method. Uses either of CustomMath two multiplication functions according to the clicked button (normal vs Strassens).
        updateResult:
            Public method. Updates the paragraphs with result strings and calls MathJax to transform the string into image of the mathematical equation.
    */
    #matA;
    #matB;
    #matC;
    constructor() {
        this.#matA = [];
        this.#matB = [];
        this.#matC = [];
    }
    #getInputFields(matrixName) {
        return document.getElementById(matrixName).children;
    }
    #getParagraph(pName) {
        return document.getElementById(pName);
    }
    #fillMatrix(size, matrixName) {
        const matElements = this.#getInputFields(matrixName);
        let mat = [];
        for (let i = 0; i < size; i++) {
            const rowOfMat = []
            for (let j = 0; j < size; j++) {
                const elementIndex = `${i}-${j}`; // Getting the string index based on the id of the input element which is preset in the HTML document
                const elementValue = matElements[elementIndex].value;
                rowOfMat.push(parseFloat(elementValue));
            }
            mat.push(rowOfMat);
        }
        return mat;
    }
    fillMatrices(matAName, matBName) {
        const sizeA = Math.sqrt(this.#getInputFields(matAName).length);
        const sizeB = Math.sqrt(this.#getInputFields(matBName).length);
        let size;
        if (sizeA === sizeB) {
            size = sizeA
        } else {
            return;
        }
        this.#matA = this.#fillMatrix(size, matAName);
        this.#matB = this.#fillMatrix(size, matBName);
    }
    multiply(strassens) {
        this.#matC = strassens ?
            CustomMath.multiplyStrassens(this.#matA, this.#matB) : CustomMath.multiplyNormal(this.#matA, this.#matB);
    }
    updateResult(pName, timePName, time) {
        const resultString = CustomMath.getMultiplicationString(this.#matA, this.#matB, this.#matC);
        const resultParagraph = this.#getParagraph(pName);
        const timeParagraph = this.#getParagraph(timePName);
        resultParagraph.innerText = resultString;
        timeParagraph.innerText = "Time(ms): " + time;
        MathJax.typeset(); // Very Important. Reloads MathJax to take care of changed results.
    }
}

let d = new Display();
const multiplyButtons = document.querySelectorAll('[fill-matrix="true"]');
multiplyButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const isStrassensMultiplication = event.target.getAttribute("strassens") === "true";
        const resultPName = isStrassensMultiplication ? 'strassens-result' : 'normal-result';
        const timePName = isStrassensMultiplication ? 'strassens-time' : 'normal-time';

        d.fillMatrices('matrix-A', 'matrix-B');
        const t0 = performance.now();
        d.multiply(isStrassensMultiplication);
        const t1 = performance.now();
        d.updateResult(resultPName, timePName, t1 - t0);
    });
});
