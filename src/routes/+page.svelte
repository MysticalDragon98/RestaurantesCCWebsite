<script lang="ts">
  import { Animations } from "$lib/classes/Animations";
  import { Sizes } from "$lib/classes/Sizes";
    import { vh, vw } from "$lib/classes/utils";
    import { v2 } from "$lib/classes/Vector2";
    import { ViewController } from "$lib/classes/ViewController";
    import EvenListeners from "$lib/components/EventListeners/EvenListeners.svelte";
    import Scene from "$lib/components/Scene/Scene.svelte";
    import { LogoSprite } from "$lib/sprites/logo.sprite";
    import { QrSprite } from "$lib/sprites/qr.sprite";
    import { onMount } from "svelte";
    
    const view = new ViewController({});
    
    let overlay: HTMLDivElement;
    let qrInfo: HTMLDivElement;

    const LOGO_WIDTH = .65;
    const LOGO_TOP = .14;
    const LOGO_LEFT = (1 - LOGO_WIDTH) / 2;

    const Sprites = {
        logo: LogoSprite(
            v2(vw(LOGO_LEFT), vh(LOGO_TOP)),
            Sizes.autoHeight(vw(LOGO_WIDTH))
        ),

        qr: QrSprite(
            v2(vw(.25), vh(.76)),
            Sizes.autoHeight(vw(.5))
        )
    };

    view.addSprites(Sprites);

    view.scroll.setTimeline([
        [0, 8, '@qr/enter'],
        [0, 8, '@overlay/blur'],
        [4, 12, '@qr-info/enter'],
    ])

    onMount(() => {
        const initialQrPosition = Sprites.qr.position.copy();

        Sprites.qr.setStyle('z-index', "3");
        Sprites.qr.setStyle('border-radius', "8px");

        view.scroll.addEventHandler('@qr/enter', ({ progress }) => {
            Animations.translateY(Sprites.qr, {
                from: initialQrPosition.y,
                to: vh(.05)
            }, progress);

            Sprites.qr.size.x = vw(.5 + progress * .25);
            Sprites.qr.position.x = vw(.25 - progress * .125);
        });

        view.scroll.addEventHandler('@overlay/blur', ({ progress }) => {
            overlay.style.backdropFilter = `blur(${progress * 48}px)`;
        });

        view.scroll.addEventHandler('@qr-info/enter', ({ progress }) => {
            Animations.fadeIn(qrInfo, progress);
        });

        view.addElements({ overlay, qrInfo });
    });
</script>

<EvenListeners scrollEvents={view.scroll} />

<div class="body">
    <Scene scene={view.scene} />
    <div class="blur-overlay" bind:this={overlay}>

    </div>
    <div class="title">
        Restaurantes.cc
    </div>
    <div class="subtitle">
        Tecnología de punta en tu restaurante
    </div>
    <div class="overlay">

    </div>


    <div class="qr-info" bind:this={qrInfo}>
        <div class="qr-title">
            Obtén tu NeoQR
        </div>
        <div class="qr-content">
            Un NeoQR es un código único y sin publicidad,
            el cual te notificará cada vez que un cliente lo
            escanee.<br/><br/>

            Además, junto a tu menú, tu cliente tendrá
            siempre disponible un botón que le permita
            llamar a un mesero, haciendo que tu atención
            sea óptima y sin esperas innecesarias
            <br/>
            <button class="action">Más información</button>
        </div>
    </div>
</div>

<style>
    :root {
        color-scheme: dark;
    }

    .blur-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        backdrop-filter: blur(0px);
        z-index: 1;
    }

    .title {
        font-size: 48px;
        position: fixed;
        top: 48vh;
        left: 0;
        font-family: 'Imperial Script', sans-serif;
        width: 100vw;
        text-align: center;
        text-shadow: 0px 0px 10px #FDBB65;
        z-index: -2;
    }
    
    .subtitle {
        font-size: 32px;
        position: fixed;
        top: calc(48vh + 69px);
        left: 0;
        font-family: 'Tangerine', sans-serif;
        width: 100vw;
        text-align: center;
        z-index: -2;
    }

    .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 58%, rgba(255,255,255,.2) 100%);
        z-index: 4;
    }

    .body {
        background: black;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    .qr-info {
        position: fixed;
        z-index: 3;
        top: 45vh;
        width: 75vw;
        left: 12.5vw;
        opacity: 0;
    }

    .qr-title {
        font-size: 32px;
        font-family: Vesper Libre, sans-serif;
        text-shadow: 0px 0px 10px #FDBB65;
        text-align: center;
    }

    .qr-content {
        font-family: Vesper Libre, sans-serif;
    }

    .action {
        width: 100%;
        font-size: 12px;
        height: 32px;
        background: #FDBB65;
        border: none;
        color: black;
        border-radius: 4px;

        font-weight: 600;
        margin-top: 16px;
    }
</style>