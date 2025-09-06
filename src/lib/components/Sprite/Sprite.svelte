    <script lang="ts">
	    import { onMount } from "svelte";
        import { SpriteController } from "./SpriteController";
	    import type { Vector2 } from "$lib/classes/Vector2";

        let picture: HTMLImageElement;
        let ready = $state(false);
        let { controller = null, }: {
            controller: SpriteController | null,
        } = $props();

        onMount(() => {
            controller?.addEventListener("update", onUpdate);
            onUpdate();
            ready = true;
            
            return () => {
                controller?.removeEventListener("update", onUpdate);
            }
        });

        function onUpdate () {
            if(!controller) return;

            onPosition(controller.position);
            onSize(controller.size);

            picture.style.zIndex = controller.zIndex.toString();

            for (const key in controller.style) {
                (<any>picture.style)[key] = controller.style[key];
            }
        }

        function onPosition (detail: Vector2) {
            
            picture.style.left = "auto";
            picture.style.top = "auto";

            if (!isNaN(detail.x)) picture.style[controller!.justification] = detail.x + "px";
            if (!isNaN(detail.y)) picture.style[controller!.alignment] = detail.y + "px";
        }

        function onSize (detail: Vector2) {
            if (!isNaN(detail.x)) picture.style.width = detail.x + "px";
            else picture.style.width = "auto";

            if (!isNaN(detail.y)) picture.style.height = detail.y + "px";
            else picture.style.height = "auto";
        }
        
    </script>

    <img
        src={controller?.img}
        alt="sprite"
        bind:this={picture}
        hidden={!ready}
    />

    <style>
        img {
            position: fixed;
        }
    </style>