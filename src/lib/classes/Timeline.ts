export type TimelineEventArgs = {
    deltaTime: number;
    totalTime: number;

    progress: number;
    radialPosition: (freq: number) => number;
}

export type TimelineEvent = {
    from: number;
    to: number;
    callback: (args: TimelineEventArgs) => void;
}

export class Timeline {

    events: Set<TimelineEvent>;
    maxPossibleTime: number = 0;
    lastTime: number = 0;
    running: boolean = false;
    startTime: number = 0;

    constructor (...events: TimelineEvent[]) {
        this.events = new Set(events);
    }

    calculateMaxPossibleTime () {
        let maxPossibleTime = 0;
        for (const event of this.events) {
            if (event.from < maxPossibleTime) maxPossibleTime = event.from;
            if (event.to > maxPossibleTime) maxPossibleTime = event.to;
        }
        
        this.maxPossibleTime = maxPossibleTime;
    }

    add (...events: TimelineEvent[]) {
        events.forEach((e) => this.events.add(e));
        this.calculateMaxPossibleTime();
    }

    addEvent (from: number, to: number, callback: (args: TimelineEventArgs) => any) {
        this.events.add({ from, to, callback });
        this.calculateMaxPossibleTime();
    }

    start () {
        this.lastTime = Date.now();
        this.startTime = this.lastTime;
        this.running = true;
        this.loop();
    }

    stop () {
        this.running = false;
    }

    loop () {
        let deltaTime = (Date.now() - this.lastTime)/1000;
        this.lastTime = Date.now();
        let localTime = (this.lastTime - this.startTime)/1000;
        
        this.events.forEach(event => {
            if (event.from > localTime) return;
            if (event.to < localTime) return;
            const progress = (localTime - event.from) / (event.to - event.from)

            event.callback({
                deltaTime,
                totalTime: localTime,
                progress,
                radialPosition: freq => Math.sin(progress * Math.PI * 2 * freq)
            });
        });
        
        if (localTime > this.maxPossibleTime) this.stop();
        if (this.running) {
            requestAnimationFrame(this.loop.bind(this));
        }
    }
}