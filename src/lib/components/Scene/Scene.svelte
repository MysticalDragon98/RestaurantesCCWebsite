<script lang="ts">
	import { onMount } from "svelte";
	import { SceneController } from "./SceneController";
	import Sprite from "../Sprite/Sprite.svelte";
	import type { SpriteController } from "../Sprite/SpriteController";

    let sceneRef: HTMLDivElement;
    let { scene }: { scene: SceneController } = $props();
    let sprites: SpriteController[] = $state([]);
    onMount(() => {
        sprites = scene.sprites;
        scene.start();

        return () => {
            scene.stop();
        }
    });
</script>

<div bind:this={sceneRef}>
    {#each sprites as sprite}
        <Sprite controller={sprite} />
    {/each}
</div>