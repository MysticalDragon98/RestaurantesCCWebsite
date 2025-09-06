import { v2, type Vector2 } from "$lib/classes/Vector2";

export class SpriteController extends EventTarget {

    img?: string;
    speed: Vector2;
    acceleration: Vector2;
    position: Vector2;
    size: Vector2;
    style: any = {};

    alignment: "top" | "bottom" = "top";
    justification: "left" | "right" = "left";

    zIndex: number = 0;


    constructor({ position, size, img, align, justify, zIndex }: { img?: string, position: Vector2, size: Vector2, align?: "top" | "bottom", justify?: "left" | "right", zIndex?: number }) {
        super();

        this.position = position;
        this.size = size;
        this.img = img;
        this.alignment = align ?? "top";
        this.justification = justify ?? "left";
        this.speed = v2(0, 0);
        this.acceleration = v2(0, 0);
        this.zIndex = zIndex ?? 0;
    }

    align (direction: "top" | "bottom") {
        this.alignment = direction;
    }

    justify (direction: "left" | "right") {
        this.justification = direction;
    }

    setPosition (position: Vector2) {
        this.position = position;
    }

    setSize (size: Vector2) {
        this.size = size;
    }

    setSpeed (speed: Vector2) {
        this.speed = speed;
    }

    setZIndex (zIndex: number) {
        this.zIndex = zIndex;
    }

    setAcceleration (acceleration: Vector2) {
        this.acceleration = acceleration;
    }

    setImg (img: string) {
        this.img = img;
    }

    setStyle (property: string, value: string) {
        this.style[property] = value;
    }

    update (deltaTime: number) {
        this.updateVariables(deltaTime);
        this.dispatchEvent(new CustomEvent("update", {
            detail: {
                deltaTime
            }
        }));
    }

    updateVariables (deltaTime: number) {
        this.position = this.position.plus(this.speed.scaled(deltaTime));
        this.speed = this.speed.plus(this.acceleration.scaled(deltaTime));
    }

}