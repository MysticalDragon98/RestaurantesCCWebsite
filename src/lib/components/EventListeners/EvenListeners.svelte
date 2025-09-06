<script lang="ts">  
	import type { ScrollEventManager } from "$lib/classes/ScrollEventManager";
	import { onMount } from "svelte";
    
    const { scrollEvents }: { scrollEvents: ScrollEventManager } = $props();

    onMount(() => {
        // Wheel events
        const onWheel = scrollEvents.onScroll.bind(scrollEvents);
        window.addEventListener("wheel", onWheel, { passive: false });

        // Keyboard events
        const onKeyDown = scrollEvents.onKeyDown.bind(scrollEvents);
        const onKeyUp = scrollEvents.onKeyUp.bind(scrollEvents);
        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        // Mouse drag events
        const onMouseDown = scrollEvents.onMouseDown.bind(scrollEvents);
        const onMouseMove = scrollEvents.onMouseMove.bind(scrollEvents);
        const onMouseUp = scrollEvents.onMouseUp.bind(scrollEvents);
        
        window.addEventListener("mousedown", onMouseDown);
        window.addEventListener("mousemove", onMouseMove);
        window.addEventListener("mouseup", onMouseUp);

        // Touch drag events for mobile
        const onTouchStart = scrollEvents.onTouchStart.bind(scrollEvents);
        const onTouchMove = scrollEvents.onTouchMove.bind(scrollEvents);
        const onTouchEnd = scrollEvents.onTouchEnd.bind(scrollEvents);
        
        window.addEventListener("touchstart", onTouchStart, { passive: false });
        window.addEventListener("touchmove", onTouchMove, { passive: false });
        window.addEventListener("touchend", onTouchEnd, { passive: false });

        return () => {
            // Cleanup all event listeners
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
            window.removeEventListener("mousedown", onMouseDown);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("touchend", onTouchEnd);
        }
    });
</script>