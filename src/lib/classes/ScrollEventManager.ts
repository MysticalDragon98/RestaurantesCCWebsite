export type EasingFn = (t: number) => number;

// Penner-style easings
const linear: EasingFn = (t) => t;
const easeInOutQuad: EasingFn = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);
const easeInOutCubic: EasingFn = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export type ScrollEvent = {
  from: number;
  to: number;
  callback: (options: ScrollEventData) => void; // amount is eased distance from `from`
  easing?: EasingFn;                  // optional per-event easing
};

export interface ScrollEventData {
  delta: number;
  scroll: number;
  progress: number;
  windowScroll: number;
}

export class ScrollEventManager {
  // Public state
  scroll: number = 0;
  events: Set<ScrollEvent>;
  eventsByName: Record<string, Omit<ScrollEvent, "from" | "to">>;

  constructor(...events: ScrollEvent[]) {
    this.events = new Set(events);
    this.eventsByName = {};
  }

  // Internal state
  private current = 0;
  private target = 0;
  private rafId: number | null = null;
  private lastTs = 0;
  private acc = 0;
  private readonly STEP = 1000 / 60; // 60 fps fixed step
  private readonly APPROACH = 0.35;  // smoothing per 60fps step

  // Global default easing (used when event.easing undefined)
  private defaultEasing: EasingFn = easeInOutCubic;

  // Drag support
  private isDragging = false;
  private lastDragX = 0;
  private dragSensitivity = 2;

  // Keyboard support
  private pressedKeys = new Set<string>();
  private keyboardRafId: number | null = null;

  // ------------------------
  // Inputs
  // ------------------------

  onScroll = (e: WheelEvent) => {
    this.target += e.deltaY / 100;
    if (this.target < 0) this.target = 0;
    if (this.rafId === null) this.rafId = requestAnimationFrame(this._tick);
  };

  onKeyDown = (e: KeyboardEvent) => {
    const valid = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "w",
      "W",
      "s",
      "S",
      "a",
      "A",
      "d",
      "D",
    ];
    if (!valid.includes(e.key)) return;

    e.preventDefault();
    this.pressedKeys.add(e.key);
    if (this.keyboardRafId === null) {
      this.keyboardRafId = requestAnimationFrame(this._keyboardTick);
    }
  };

  onKeyUp = (e: KeyboardEvent) => {
    this.pressedKeys.delete(e.key);
    if (this.pressedKeys.size === 0 && this.keyboardRafId !== null) {
      cancelAnimationFrame(this.keyboardRafId);
      this.keyboardRafId = null;
    }
  };

  private _keyboardTick = () => {
    let deltaY = 0;

    for (const key of this.pressedKeys) {
      switch (key) {
        case "ArrowUp":
        case "w":
        case "W":
        case "ArrowLeft":
        case "a":
        case "A":
          deltaY -= 10;
          break;
        case "ArrowDown":
        case "s":
        case "S":
        case "ArrowRight":
        case "d":
        case "D":
          deltaY += 10;
          break;
      }
    }

    if (deltaY !== 0) {
      this.target += deltaY / 100;
      if (this.target < 0) this.target = 0;
      if (this.rafId === null) this.rafId = requestAnimationFrame(this._tick);
    }

    if (this.pressedKeys.size > 0) {
      this.keyboardRafId = requestAnimationFrame(this._keyboardTick);
    } else {
      this.keyboardRafId = null;
    }
  };

  onMouseDown = (e: MouseEvent) => {
    this.isDragging = true;
    this.lastDragX = e.clientY;
    e.preventDefault();
  };

  onMouseMove = (e: MouseEvent) => {
    if (!this.isDragging) return;
    const deltaX = (e.clientY - this.lastDragX) * this.dragSensitivity;
    this.lastDragX = e.clientY;

    // Natural drag: move content opposite to drag
    this.target -= deltaX / 100;
    if (this.target < 0) this.target = 0;

    if (this.rafId === null) this.rafId = requestAnimationFrame(this._tick);
    e.preventDefault();
  };

  onMouseUp = (e: MouseEvent) => {
    this.isDragging = false;
    e.preventDefault();
  };

  onTouchStart = (e: TouchEvent) => {
    if (e.touches.length !== 1) return;
    this.isDragging = true;
    this.lastDragX = e.touches[0].clientY;
    e.preventDefault();
  };

  onTouchMove = (e: TouchEvent) => {
    if (!this.isDragging || e.touches.length !== 1) return;
    const deltaX = (e.touches[0].clientY - this.lastDragX) * this.dragSensitivity;
    this.lastDragX = e.touches[0].clientY;

    this.target -= deltaX / 100;
    if (this.target < 0) this.target = 0;

    if (this.rafId === null) this.rafId = requestAnimationFrame(this._tick);
    e.preventDefault();
  };

  onTouchEnd = (e: TouchEvent) => {
    this.isDragging = false;
    e.preventDefault();
  };

  // ------------------------
  // Core loop (fixed-step 60Hz dispatch, eased progress)
  // ------------------------

  private _tick = (ts: number) => {
    if (!this.lastTs) this.lastTs = ts;
    const elapsed = ts - this.lastTs;
    this.acc += elapsed;

    while (this.acc >= this.STEP) {
      // Smoothly approach target with first-order filter
      const d = this.target - this.current;
      this.current += d * this.APPROACH;

      // Dispatch events with eased progress
      for (const event of this.events) {
        const min = Math.min(event.from, event.to);
        const max = Math.max(event.from, event.to);
        if (this.current < min || this.current > max) continue;

        const range = max - min;
        if (range === 0) {
          // Degenerate range: treat as completed
          continue;
        }

        // Normalize progress 0..1 from `from` to `to` regardless of ordering
        const rawT = (this.current - min) / range;
        // If event.from > event.to, invert progress so it still eases 0→1
        const linearT = event.from <= event.to ? rawT : 1 - rawT;

        // Apply easing
        const ease = event.easing ?? this.defaultEasing;
        const easedT = clamp01(ease(clamp01(linearT)));

        // Convert eased progress back into "amount from `from`"
        const easedAmount = easedT * Math.abs(event.to - event.from);

        event.callback({
          delta: easedAmount,
          scroll: this.current - event.from,
          progress: easedT,
          windowScroll: this.current
        });
      }

      this.acc -= this.STEP;
    }

    this.lastTs = ts;

    // Stop when essentially at target
    if (Math.abs(this.target - this.current) < 0.001) {
      this.current = this.target;
      this.rafId = null;
      this.lastTs = 0;
      this.acc = 0;
      return;
    }

    this.rafId = requestAnimationFrame(this._tick);
  };

  // ------------------------
  // API
  // ------------------------

  subscribe(event: ScrollEvent) {
    this.events.add(event);
  }

  unsubscribe(event: ScrollEvent) {
    this.events.delete(event);
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.keyboardRafId !== null) {
      cancelAnimationFrame(this.keyboardRafId);
      this.keyboardRafId = null;
    }
    this.lastTs = 0;
    this.acc = 0;
    this.events.clear();
    this.isDragging = false;
    this.pressedKeys.clear();
  }

  add(...events: ScrollEvent[]) {
    events.forEach((e) => this.events.add(e));
  }

  addEvent(from: number, to: number, callback: (options: ScrollEventData) => any, easing?: EasingFn) {
    this.events.add({ from, to, callback, easing });
  }

  setTimeline (events: [number, number, string][]) {
    for (const [from, to, name] of events) {
      this.addEvent(from, to, (options) => this.eventsByName[name]?.callback?.(options), this.eventsByName[name]?.easing);
    }
  }

  addEventHandler (name: string, callback: (options: ScrollEventData) => any, easing?: EasingFn) {
    this.eventsByName[name] = { callback, easing };
  }

  setDragSensitivity(sensitivity: number) {
    this.dragSensitivity = sensitivity;
  }

  setDefaultEasing(easing: EasingFn) {
    this.defaultEasing = easing;
  }
}

// ------------------------
// Utils
// ------------------------
function clamp01(v: number) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

// Optional: export some easings for callers
export const Easings = {
  linear,
  easeInOutQuad,
  easeInOutCubic,
};
