import { Subject } from "rxjs";

export const Events = {
    scroll: 0,
    $scroll: new Subject<number>()
}