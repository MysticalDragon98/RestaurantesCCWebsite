import { Vector2 } from "$lib/classes/Vector2";
import { SpriteController } from "$lib/components/Sprite/SpriteController";

export const QrSprite = (position: Vector2, size: Vector2, { justify }: { justify?: "left" | "right" } = {}) => new SpriteController({
    position, size,
    img: "sprites/qr.webp",
    justify
});