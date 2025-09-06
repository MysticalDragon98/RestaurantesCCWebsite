import { v2, type Vector2 } from "$lib/classes/Vector2";
import type { SpriteController } from "../Sprite/SpriteController";

export class SceneController extends EventTarget {

    size: Vector2 = v2(window.innerWidth, window.innerHeight);
    sprites: SpriteController[] = [];
    render?: (deltaTime: number, totalTime: number, scene: SceneController) => void;
    active: boolean = true;

    lastTick: number = 0;
    totalTime: number = 0;


    constructor () {
        super();
    }

    start () {
        this.lastTick = Date.now();
        this.loop();
    }

    stop () {
        this.active = false;
    }

    loop () {
        let deltaTime = (Date.now() - this.lastTick)/1000;
        this.lastTick = Date.now();

        this.update(deltaTime);
        this.active && requestAnimationFrame(this.loop.bind(this));
    }

    setRender (render: (deltaTime: number, totalTime: number, scene: SceneController) => void) {
        this.render = render;
    }

    update (deltaTime: number) {        
        this.totalTime += deltaTime;
        this.render?.(deltaTime, this.totalTime, this);

        this.sprites.forEach(sprite => {
            sprite.update(deltaTime);
        });
    }
    
    add (...sprites: SpriteController[]) {
        this.sprites.push(...sprites);
    }

    static new (callback: (controller: SceneController) => (deltaTime: number) => any) {
        const controller = new SceneController();

        const render = callback(controller);
        controller.setRender(render);

        return controller;
    }

}