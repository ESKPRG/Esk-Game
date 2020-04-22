class AdjacencyMatrix {
    constructor(heightLength, widthLength, obstacleList, distance) {
        this.heightLength = Math.floor(heightLength / distance);
        this.widthLength = Math.floor(widthLength / distance);
        this.obstacleList = obstacleList;
        this.distance = distance;
        this.matrix = new Map();
        this.alreadyMoved = [];
    }

    addVertex(v) {
        this.matrix.set(v, {})
    }

    addEdge(v, w, direction) {
        this.matrix.get(v)[direction] = w;
    } 

    checkObstacle(currentX, currentY, objectList) {
        for (let object of objectList) {
            let x = Math.floor(object.x / this.distance);
            let y = Math.floor(object.y / this.distance);
            let width = Math.floor(object.width / this.distance);
            let height = Math.floor(object.height / this.distance);

            if (x < currentX && x + width > currentX && y < currentY && y + height > currentY) {
                return false;
            }
        }
        return true;
    }

    changeToCoordinates(idx) {
        let currentWidthLength = 1;
        let currentHeightLength = 1;

        for (let value = 1; value < (this.heightLength * this.widthLength +1); value++) {
            if (value === idx) {
                console.log(currentHeightLength, currentWidthLength)
                return {
                    x: currentWidthLength * this.distance,
                    y: currentHeightLength * this.distance
                }
            }
            
            if (currentWidthLength < this.widthLength) {
                currentWidthLength += 1
            } else {
                currentWidthLength = 1;
                currentHeightLength += 1;
            }
        }
    }

    traverse(x1, y1, x2, y2) {
        x1 = Math.floor(x1 / this.distance);
        y1 = Math.floor(y1 / this.distance);
        x2 = Math.floor(x2 / this.distance);
        y2 = Math.floor(y2 / this.distance);

        let currentWidthLength = 1;
        let currentHeightLength = 1;

        let final1;
        let final2;
        for (let idx = 1; idx < (this.heightLength * this.widthLength + 1); idx++) {
            if (currentWidthLength === x2 && currentHeightLength === y2) {
                final2 = {
                    x: currentWidthLength,
                    y: currentHeightLength,
                    idx: idx
                }
            }

            if (currentWidthLength === x1 && currentHeightLength === y1) {
                final1 = {
                    x: currentWidthLength,
                    y: currentHeightLength,
                    idx: idx
                }
            }

            if (currentWidthLength < this.widthLength) {
                currentWidthLength += 1
            } else {
                currentWidthLength = 1;
                currentHeightLength += 1;
            }
        }


        return this.findShortestRoute(final1, final2);
        
    }

    findShortestRoute(current, destination, currentList = []) {
        if (current.x === destination.x && current.y === destination.y) {
            console.log(currentList);
            return currentList
        }

        console.log(current, destination)

        let currentNumber = current;
        let destinationNumber = destination;
        
        let matrixValue = this.matrix.get(currentNumber.idx)

        if (currentNumber.y > destinationNumber.y) {
            if (matrixValue.up && !this.alreadyMoved.includes(matrixValue.up)) {
                this.alreadyMoved.push(matrixValue.up);
                currentNumber.idx -= this.widthLength;
                currentList.push(matrixValue.up)
                currentNumber.y -= 1;
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }

            if (matrixValue.left && !this.alreadyMoved.includes(matrixValue.left)) {
                this.alreadyMoved.push(matrixValue.left);
                currentNumber.idx -= 1;
                currentNumber.x -= 1;
                currentList.push(matrixValue.left)
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }

            if (matrixValue.right && !this.alreadyMoved.includes(matrixValue.right)) {
                this.alreadyMoved.push(matrixValue.right);
                currentNumber.idx += 1;
                currentNumber.x += 1;
                currentList.push(matrixValue.right)
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }
        } else {
            if (matrixValue.down && !this.alreadyMoved.includes(matrixValue.down)) {
                this.alreadyMoved.push(matrixValue.down);
                currentNumber.idx += this.widthLength;
                currentList.push(matrixValue.down)
                currentNumber.y += 1;
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }

            if (matrixValue.left && !this.alreadyMoved.includes(matrixValue.left)) {
                this.alreadyMoved.push(matrixValue.left);
                currentNumber.idx -= 1;
                currentNumber.x -= 1;
                currentList.push(matrixValue.left)
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }

            if (matrixValue.right && !this.alreadyMoved.includes(matrixValue.right)) {
                this.alreadyMoved.push(matrixValue.right);
                currentNumber.idx += 1;
                currentNumber.x += 1;
                currentList.push(matrixValue.right)
                return this.findShortestRoute(currentNumber, destinationNumber, currentList);
            }
        }

        // let up;
        // let down;
        // let left;
        // let right;

        // if (currentNumber.y < destinationNumber.y) { 
        //     currentNumber.y += 1; 
        //     down = true;
        //     currentNumber.idx = (down) ? currentNumber.idx + this.widthLength : currentNumber.idx;
        // } else if (currentNumber.y > destinationNumber.y) { 
        //     currentNumber.y -= 1
        //     up = true;
        //     currentNumber.idx = (up) ? currentNumber.idx - this.widthLength : currentNumber.idx;
        // }

        // if (currentNumber.x < destinationNumber.x) { 
        //     currentNumber.x += 1; 
        //     right = true;
        //     currentNumber.idx = (right) ? currentNumber.idx + 1: currentNumber.idx;
        // } else if (currentNumber.x > destinationNumber.x) { 
        //     currentNumber.x -= 1
        //     left = true;
        //     currentNumber.idx = (left) ? currentNumber.idx - 1: currentNumber.idx;
        // }
        
        // return this.findShortestRoute(currentNumber, destinationNumber, currentList.concat(currentNumber.idx))
    }

    addEntity(x, y, entity) {
        let currentWidthLength = 1;
        let currentHeightLength = 1;
        for (let idx = 1; idx < this.heightLength * this.widthLength + 1; idx++) {
            if (!this.get(idx)['entityList']) {
                this.get(idx)['entityList'] = [];
            }
            if (currentWidthLength === x && currentHeightLength === y) {
                this.matrix.get(idx)['entityList'].push(entity);
            }

            if (currentWidthLength < this.widthLength) {
                currentWidthLength += 1
            } else {
                currentWidthLength = 1;
                currentHeightLength += 1;
            }
        }
    }

    get(idx) {
        return this.matrix.get(idx);
    }

    set(idx, entityList) {
        this.matrix.get(idx).entityList = entityList;
    }
    

    createMap() {
        let currentWidthLength = 1;
        let currentHeightLength = 1;
        for (let idx = 1; idx < this.heightLength * this.widthLength + 1; idx++) {
            this.addVertex(idx);
        }
        for (let idx = 1; idx < this.heightLength * this.widthLength + 1; idx++) {
            let left = (currentWidthLength > 1) ? idx - 1 : null;
            let right = (currentWidthLength < this.widthLength) ? idx + 1: null;
            let up = (currentHeightLength > 1) ? idx - this.widthLength : null;
            let down = (currentHeightLength < this.heightLength) ? idx + this.widthLength: null;

            if (left) { this.addEdge(idx, left, "left") }
            if (right) { this.addEdge(idx, right, "right") }
            if (up) { this.addEdge(idx, up, "up") }
            if (down) { this.addEdge(idx, down, "down") }

            if (currentWidthLength < this.widthLength) {
                currentWidthLength += 1
            } else {
                currentWidthLength = 1;
                currentHeightLength += 1;
            }
        }
    }
}

module.exports = AdjacencyMatrix;