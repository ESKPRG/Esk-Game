class UpgradePlan {
    constructor() {
        this.first = null
    }

    add(token, selectedToken, currentToken = this.first, layer = 1) {
        if (currentToken === null) {
            this.first = token
            return
        }
        if (selectedToken === currentToken) {
            currentToken.connect(token)
            return
        } else {
            let idx = 0
            while (currentToken.hasNext(idx)) {
                this.add(token, selectedToken, currentToken.hasNext(idx), layer + 1)
                idx++
            }
        }
    }
    

    traverse(action = (value, layer) => {
        console.log(value.name)
        console.log("On layer:", layer,"\n") }, currentToken = this.first, layer = 1) 
    {
        if (currentToken === null) {
            return
        }
        action(currentToken, layer)
        let idx = 0
        while (true) {
            let next = currentToken.hasNext(idx)
            if (next) {
                this.traverse(action, next, layer + 1)
            } else {
                return
            }
            idx += 1
        }
    }
}

module.exports = UpgradePlan