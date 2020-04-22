class Scene {
    constructor(name, level, run) {
        this.name = name;
        this.level = level;
        this.run = run;
        this.connectedScenes = []
    }

    connect(scene) {
        this.connectedScenes.push(scene);
    }
}

module.exports = Scene;