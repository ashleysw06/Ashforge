class Debug {
    constructor(debugMode = true) {
        this.debugMode = debugMode;

        this.lastDebugTime = performance.now();
        this.logLength = 80;
    }

    log(message, showPT = true) {
        const currentTime = performance.now();
        const processTime = (currentTime - this.lastDebugTime);

        message.length > this.logLength ? message = message.slice(0, this.logLength - 3) + "..." : message = message.padEnd(this.logLength, " ");

        let pt = "";
        if (showPT) {
            pt = `( Process time: ${processTime.toFixed(0)} ms )`
            this.lastDebugTime = performance.now();
        }

        const text = `[ ${currentTime.toFixed(2)} ms ] ${message}  ${pt}`;
        console.log(text);
        
        return processTime;
    }

    warn(message) {
        const currentTime = performance.now();
        const text = `[ ${currentTime.toFixed(2)} ms ] WARNING: ${message}`;
        console.log(`%c${text}`, "color: orange");
    }

    startProcess() {
        this.lastDebugTime = performance.now();
    }
}