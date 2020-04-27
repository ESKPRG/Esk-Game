class Scene {
    constructor(name, level, run, startPosition) {
        this.name = name;
        this.level = level;
        this.startPosition = startPosition;
        this.run = run;
        this.connectedScenes = []
    }

    connect(scene) {
        this.connectedScenes.push(scene);
    }
}

module.exports = Scene;