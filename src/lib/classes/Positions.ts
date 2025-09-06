import { v2 } from "./Vector2"

export const Positions = {

    absolute (x: number, y: number) {
        return v2(x, y);
    },

    percentage (x: number, y: number) {
        return v2(x * window.innerWidth, y * window.innerHeight);
    }

}