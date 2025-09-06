import { v2, Vector2 } from "$lib/classes/Vector2";
import { SpriteController } from "$lib/components/Sprite/SpriteController";

export const LogoSprite = (position: Vector2, size: Vector2, { justify }: { justify?: "left" | "right" } = {}) => new SpriteController({
    position, size,
    img: "sprites/logo.webp",
    justify
});