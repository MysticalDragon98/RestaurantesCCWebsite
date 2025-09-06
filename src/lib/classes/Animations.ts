import { SpriteController } from "$lib/components/Sprite/SpriteController";

export const Animations = {
  fadeOut(target: HTMLElement | SpriteController, progress: number) {
    const value = (1 - Math.max(0, Math.min(1, progress))).toString();

    if (target instanceof SpriteController) {
      target.setStyle("opacity", value);
      return value;
    }

    target.style.opacity = value;
    return value;
  },

  fadeIn(target: HTMLElement | SpriteController, progress: number) {
    const value = (Math.max(0, Math.min(1, progress))).toString();

    if (target instanceof SpriteController) {
      target.setStyle("opacity", value);
      return value;
    }

    target.style.opacity = value;
    return value;
  },

  translateY(
    target: HTMLElement | SpriteController,
    { from, to }: { from: number; to: number },
    progress: number
  ) {
    const y = from + Math.max(0, Math.min(1, progress)) * (to - from);

    if (target instanceof SpriteController) {
      target.position.y = y;
      return y;
    }

    target.style.top = `${y}px`;
    return target.style.top;
  },

  translateX(
    target: HTMLElement | SpriteController,
    { from, to }: { from: number; to: number },
    progress: number
  ) {
    const x = from + Math.max(0, Math.min(1, progress)) * (to - from);

    if (target instanceof SpriteController) {
      target.position.x = x;
      return x;
    }

    target.style.left = `${x}px`;
    return target.style.left;
  },

  waveX (element: HTMLElement | SpriteController, { frequency, amplitude }: { frequency: number; amplitude: number; }, progress: number) {
    if (element instanceof SpriteController) {
      element.setStyle("transform", `translateX(${amplitude * Math.cos(progress * Math.PI * 2 * frequency)}px)`);
      return element.position.x;
    }

    element.style.transform = `translateX(${amplitude * Math.cos(progress * Math.PI * 2 * frequency)}px)`;
    return element.style.transform;
  }

};
