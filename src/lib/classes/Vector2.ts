export class Vector2 {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    minus (vector: Vector2) {
        return v2(this.x - vector.x, this.y - vector.y);
    }

    plus (vector: Vector2) {
        return v2(this.x + vector.x, this.y + vector.y);
    }

    scaled (scalar: number) {
        return v2(this.x * scalar, this.y * scalar);
    }

    times (vector: Vector2) {
        return v2(this.x * vector.x, this.y * vector.y);
    }

    magnitude () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    angle () {
        return Math.atan2(this.y, this.x);
    }

    unit () {
        return this.scaled(1 / this.magnitude());
    }

    rotated (angle: number) {
        return v2(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle)
        );
    }

    copy () {
        return v2(this.x, this.y);
    }

    static unitary (angle: number) {
        return v2(Math.cos(angle), Math.sin(angle));
    }

}
export function v2(x: number, y: number) {
    return new Vector2(x, y);
}