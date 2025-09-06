import { SceneController } from "$lib/components/Scene/SceneController";
import type { SpriteController } from "$lib/components/Sprite/SpriteController";
import { ScrollEventManager } from "./ScrollEventManager";
import { Timeline } from "./Timeline";

interface SceneOptions {
    elements?: Record<string, HTMLElement>;
    scrollEvents?: ScrollEventManager;
    scene?: SceneController;
}

export class ViewController {

    private elements: Record<string, HTMLElement>;
    public scroll: ScrollEventManager;
    public timelines: Record<string, Timeline>;
    public actions: Record<string, Function>;
    public scene: SceneController;
    public sprites: Record<string, SpriteController>;

    constructor (options: SceneOptions) {
        this.elements = options.elements ?? {};
        this.scroll = options.scrollEvents ?? new ScrollEventManager();
        this.scene = options.scene ?? new SceneController();
        this.timelines = {};
        this.actions = {};
        this.sprites = {};
    }

    element (name: string) {
        if (!this.elements[name]) {
            throw new Error(`Element ${name} not found`);
        }
        return this.elements[name];
    }

    addElements (elements: Record<string, HTMLElement>) {
        this.elements = { ...this.elements, ...elements };
    }

    addSprites (sprites: Record<string, SpriteController>) {
        this.sprites = { ...this.sprites, ...sprites };
        this.scene.add(...Object.values(this.sprites));
    }

    sprite (name: string) {
        if (!this.sprites[name]) {
            throw new Error(`Sprite ${name} not found`);
        }
        
        return this.sprites[name];
    }

    addAction (name: string, callback: Function) {
        this.actions[name] = callback;
    }

    timeline (name: string) {
        if (!this.timelines[name]) {
            this.timelines[name] = new Timeline();
        }
        
        return this.timelines[name];
    }

    run (name: string, ...args: any[]) {
        this.actions[name]?.(...args);
    }

    clear () {
        for (const timeline in this.timelines) {
            this.timelines[timeline].stop();
        }

        this.scene.stop();
    }

}