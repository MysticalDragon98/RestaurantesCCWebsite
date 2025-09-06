import { v2 } from "./Vector2"

export const Sizes = {

    autoHeight (width: number) {
        return v2(width, NaN);
    },

    autoWidth (height: number) {
        return v2(NaN, height);
    },

    squared (size: number) {
        return v2(size, size);
    }
}