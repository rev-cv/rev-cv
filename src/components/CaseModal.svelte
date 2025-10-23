<script>
    let isModalView = $state(false);
    import SVGDemo from "../assets/SVGDemo.svelte";
    import SVGCode from "../assets/SVGCode.svelte";
    import SVGFigma from "../assets/SVGFigma.svelte";
    import SVGClose from "../assets/SVGClose.svelte";

    let { metadata, content, unmounte, rect } = $props();

    let modalElement;

    const initialStyle = `
        --transform: translate(${rect.left}px, ${rect.top}px);
        --width: ${Math.round(rect.width)}px; 
        --height: ${Math.round(rect.height)}px;
    `;

    let isOpenMedia = $state(false);
    let openMediaUrl = $state(null);
    let style = $state(initialStyle);

    // определение типа файла
    function isVideo(url) {
        return url && url.toLowerCase().endsWith(".mp4");
    }

    // все медиафайлы в один массив
    const allMedia = $derived(() => {
        const media = [];
        if (metadata.cover) {
            media.push(metadata.cover);
        }
        if (metadata.media && Array.isArray(metadata.media)) {
            media.push(...metadata.media);
        }
        return media;
    });

    function updateStyleForScreenSize() {
        const rectMobile = `
            --transform: translate(calc(50vw - 50%), calc(50vh - 50%)); 
            --width: 100%;
            --height: 100vh;
        `;

        const rectDesktop = `
            --transform: translate(calc(50vw - 50%), calc(50vh - 50%)); 
            --width: 80%;
            --height: 70vh;
        `;

        if (isModalView) {
            style = window.innerWidth >= 1144 ? rectDesktop : rectMobile;
        }
    }

    $effect(() => {
        setTimeout(() => {
            isModalView = true;
            updateStyleForScreenSize();
        }, 10);

        document.addEventListener("keydown", handleKeydown);
        window.addEventListener("resize", updateStyleForScreenSize);
        return () => {
            document.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("resize", updateStyleForScreenSize);
        };
    });

    function closeModal() {
        style = initialStyle;
        isModalView = false;
    }

    function handleKeydown(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    }

    function handleTransitionEnd(e) {
        if (e.propertyName === "transform" && !isModalView) {
            unmounte();
        }
    }

    function previewMedia(e, mediaUrl) {
        if (window.innerWidth < 1144) return;

        const button = e.currentTarget;
        const videoWrapper = button.querySelector(".video-wrapper");
        const img = button.querySelector("img");

        const isVideoElement = videoWrapper !== null;
        const animatedElement = isVideoElement ? videoWrapper : img;

        if (!isOpenMedia) {
            if (animatedElement instanceof HTMLElement) {
                const mediaRect = animatedElement.getBoundingClientRect();
                button._mediaRect = mediaRect;
                button._isVideo = isVideoElement;

                if (modalElement instanceof HTMLElement) {
                    const modalRect = modalElement.getBoundingClientRect();
                    const relativeTop = mediaRect.top - modalRect.top;
                    const relativeLeft = mediaRect.left - modalRect.left;

                    if (button instanceof HTMLElement) {
                        button.style.minHeight = `${button.offsetHeight}px`;

                        animatedElement.style.position = "absolute";
                        animatedElement.style.top = `${relativeTop}px`;
                        animatedElement.style.left = `${relativeLeft}px`;
                        animatedElement.style.width = `${mediaRect.width}px`;
                        animatedElement.style.height = `${mediaRect.height}px`;
                        animatedElement.style.zIndex = "103";
                        animatedElement.style.transition =
                            "all 200ms ease-in-out";

                        if (isVideoElement) {
                            const video = button.querySelector("video");
                            if (video instanceof HTMLElement) {
                                video.style.objectFit = "contain";
                                video.style.width = "100%";
                                video.style.height = "100%";
                            }
                        } else {
                            animatedElement.style.objectFit = "contain";
                            animatedElement.style.borderRadius = "1.4rem";
                        }

                        // принудительный reflow для Firefox,
                        // чтобы он успел обработать начальные стили.
                        void animatedElement.offsetHeight;

                        requestAnimationFrame(() => {
                            animatedElement.style.top = "0px";
                            animatedElement.style.left = "0px";
                            animatedElement.style.width = "100%";
                            animatedElement.style.height = "100%";
                            if (!isVideoElement) {
                                animatedElement.style.borderRadius = "0";
                            }
                        });

                        setTimeout(() => {
                            animatedElement.style.backgroundColor =
                                "var(--color-black)";
                            isOpenMedia = true;
                            openMediaUrl = mediaUrl;
                        }, 400);
                    }
                }
            }
        } else {
            const mediaRect = button._mediaRect;
            const isVideoElement = button._isVideo;

            if (!mediaRect) return;

            const animatedElement = isVideoElement ? videoWrapper : img;

            if (
                animatedElement instanceof HTMLElement &&
                modalElement instanceof HTMLElement
            ) {
                const modalRect = modalElement.getBoundingClientRect();
                const relativeTop = mediaRect.top - modalRect.top;
                const relativeLeft = mediaRect.left - modalRect.left;

                animatedElement.style.transition = "all 200ms ease-in-out";
                if (!isVideoElement) {
                    animatedElement.style.borderRadius = "1.4rem";
                }

                animatedElement.style.top = `${relativeTop}px`;
                animatedElement.style.left = `${relativeLeft}px`;
                animatedElement.style.width = `${mediaRect.width}px`;
                animatedElement.style.height = `${mediaRect.height}px`;
                animatedElement.style.backgroundColor = "";

                setTimeout(() => {
                    animatedElement.style.cssText = "";
                    if (isVideoElement) {
                        const video = button.querySelector("video");
                        if (video instanceof HTMLElement) {
                            video.style.objectFit = "";
                        }
                    }
                    if (button instanceof HTMLElement) {
                        button.style.minHeight = "";
                    }
                    isOpenMedia = false;
                    openMediaUrl = null;
                }, 200);
            }
        }
    }
</script>

<div
    class="curtain"
    class:render={isModalView}
    onclick={closeModal}
    onkeydown={(e) => e.key === "Enter" && closeModal()}
    aria-label="Закрыть модальное окно"
    role="button"
    tabindex="-1"
>
    <div
        class="modal"
        id="modal-case"
        {style}
        bind:this={modalElement}
        ontransitionend={handleTransitionEnd}
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        tabindex="-1"
        aria-modal="true"
    >
        <div class="left-scroll">
            {#each allMedia() as media}
                <button
                    onclick={(e) => previewMedia(e, media)}
                    title="100%"
                    tabindex={isOpenMedia ? -1 : 0}
                >
                    {#if isVideo(media)}
                        <div class="video-wrapper">
                            <video
                                src={`${import.meta.env.BASE_URL}${media}`}
                                preload="metadata"
                                playsinline
                                data-fetchpriority="low"
                                controls={openMediaUrl === media}
                                muted={openMediaUrl !== media}
                                autoplay={openMediaUrl !== media}
                                loop={openMediaUrl !== media}
                            ></video>
                            {#if openMediaUrl === media}
                                <div
                                    class="close-overlay"
                                    role="button"
                                    tabindex="0"
                                    title="Закрыть видео"
                                    onclick={(e) => {
                                        e.stopPropagation();
                                        const parentButton =
                                            e.currentTarget.closest("button");
                                        if (parentButton) {
                                            previewMedia(
                                                { currentTarget: parentButton },
                                                media,
                                            );
                                        }
                                    }}
                                    onkeydown={(e) => {
                                        if (
                                            e.key === "Enter" ||
                                            e.key === " "
                                        ) {
                                            e.preventDefault();
                                            e.currentTarget.click();
                                        }
                                    }}
                                ></div>
                            {/if}
                        </div>
                    {:else}
                        <picture>
                            <img
                                src={`${import.meta.env.BASE_URL}${media}`}
                                alt=""
                            />
                        </picture>
                    {/if}
                </button>
            {/each}
        </div>

        <div class="right-scroll">
            <div class="case-nav">
                {#if metadata.code_url}
                    <a
                        href={metadata.code_url}
                        tabindex={isOpenMedia ? -1 : 0}
                        target="_blank"
                    >
                        <SVGCode /> <span>code</span>
                    </a>
                {/if}
                {#if metadata.demo_url}
                    <a
                        href={metadata.demo_url}
                        tabindex={isOpenMedia ? -1 : 0}
                        target="_blank"
                    >
                        <SVGDemo /> <span>demo</span>
                    </a>
                {/if}
                {#if metadata.macket_url}
                    <a
                        href={metadata.macket_url}
                        tabindex={isOpenMedia ? -1 : 0}
                        target="_blank"
                    >
                        <SVGFigma /> <span>layout</span>
                    </a>
                {/if}
            </div>
            <div class="title">{metadata.title}</div>
            <div class="descr">{metadata.descr}</div>

            <div class="content">{@html content}</div>

            <div class="case-nav">
                {#if metadata.code_url}
                    <a
                        href={metadata.code_url}
                        tabindex={isOpenMedia ? -1 : 0}
                        target="_blank"
                    >
                        <SVGCode /> <span>code</span>
                    </a>
                {/if}
                {#if metadata.demo_url}
                    <a
                        href={metadata.demo_url}
                        tabindex={isOpenMedia ? -1 : 0}
                        target="_blank"
                    >
                        <SVGDemo /> <span>demo</span>
                    </a>
                {/if}
                {#if metadata.macket_url}
                    <a
                        href={metadata.macket_url}
                        tabindex={isOpenMedia ? -1 : 0}
                        target="_blank"
                    >
                        <SVGFigma /> <span>layout</span>
                    </a>
                {/if}
            </div>
        </div>
    </div>

    <button class="btn-close" onclick={closeModal}><SVGClose /></button>
</div>

<style lang="scss">
    $border_radius: 2rem;
    $padding_in_item: 0.6rem;

    .curtain {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 102;
        backdrop-filter: blur(0px);
        transition:
            backdrop-filter 600ms ease-in-out,
            background-color 600ms ease-in-out;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;

        .modal {
            isolation: isolate;
            cursor: default;
            position: absolute;
            background-color: var(--color-bg);
            border-radius: $border_radius;

            transform-origin: center;
            opacity: 0;
            max-width: 1200px;
            box-shadow: 0;

            transform: var(--transform);
            width: var(--width, 0);
            height: var(--height, 0);

            transition:
                opacity 300ms ease-in-out,
                width 300ms ease-in-out,
                height 300ms ease-in-out,
                grid-template-columns 200ms ease-in-out,
                gap 200ms ease-in-out,
                transform 300ms ease-in-out;

            overflow: hidden;

            display: grid;
            grid-template-columns: 1fr 0fr;
            padding: $padding_in_item 0 $padding_in_item $padding_in_item;
            gap: 0;

            .left-scroll {
                border-top-left-radius: $border_radius - $padding_in_item;
                border-bottom-left-radius: $border_radius - $padding_in_item;
                overflow-x: hidden;
                overflow-y: scroll;

                display: flex;
                flex-direction: column;
                gap: $padding_in_item;

                &::-webkit-scrollbar {
                    width: 0px;
                    height: 0px;
                }

                .video-wrapper {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative; /* Для позиционирования оверлея */

                    .close-overlay {
                        position: absolute;
                        inset: 0;
                        /* Оставляем 40px снизу для контролов */
                        bottom: 40px;
                        cursor: pointer;
                        /* z-index, чтобы быть над видео, но под его контролами */
                        z-index: 1;
                        -webkit-tap-highlight-color: transparent;
                    }
                }

                video,
                picture {
                    width: 100%;
                    height: 100%;
                    flex-grow: 0;
                    min-width: 100%;
                    height: auto;
                    object-fit: contain;
                    border-radius: $border_radius - $padding_in_item;
                    transition:
                        width 300ms ease-in-out 100ms,
                        height 300ms ease-in-out 100ms;
                }

                img {
                    border-radius: $border_radius - $padding_in_item;
                }

                button {
                    border: none;
                    background: none;
                    padding: 0;
                    margin: 0;
                    cursor: pointer;
                    transition: height 300ms ease-in-out;
                }
            }

            .right-scroll {
                overflow-y: auto;
                padding-right: $padding_in_item;
                display: flex;
                flex-direction: column;

                > * {
                    opacity: 0;
                    transform: translateY(1em);
                    transition:
                        opacity 300ms ease-out,
                        transform 300ms ease-out;
                }

                .title {
                    color: var(--color-basic-white);
                    font-size: 1.4em;
                    line-height: 1.1em;
                    font-weight: 800;
                    text-align: center;
                    padding-top: 1em;
                }

                .descr {
                    color: var(--color-basic-white-80);
                    font-size: 0.8em;
                    line-height: 1.1em;
                    max-width: 80%;
                    align-self: center;
                    text-align: center;
                    padding: 1em 0;
                }

                .content {
                    color: var(--color-basic-white);
                }

                .case-nav {
                    display: flex;
                    justify-content: center;
                    padding: 0.5em 0;
                    gap: 1em;

                    a {
                        color: var(--color-basic-white);
                        text-transform: uppercase;
                        text-decoration: none;
                        display: flex;
                        align-items: center;
                        gap: 0.5em;
                        font-size: 0.8em;
                        background-color: black;
                        padding: 0.3em 0.6em;
                        border-radius: 3px;
                        font-weight: 500;

                        transition:
                            color 300ms ease-in-out,
                            transform 200ms ease-in-out,
                            background-color 300ms ease-in-out;
                        position: relative;

                        &::after {
                            position: absolute;
                            inset: 0;
                            content: "";
                            background-color: transparent;
                            transition: background-color 300ms ease-in-out;
                        }

                        &:hover {
                            color: var(--color-azure);
                            background-color: #000;
                            transform: translateY(-2px);

                            &::after {
                                background-color: var(--color-button-hover-bg);
                            }
                        }
                    }

                    :global(svg) {
                        width: 1.3em;
                        height: 1.3em;
                        opacity: 0.8;
                    }

                    :global(:is(a)) {
                        color: var(--color-azure);
                        text-decoration: none;
                        opacity: 0.9;
                        transition: opacity 300ms ease-in-out;

                        &:hover {
                            opacity: 1;
                        }
                    }

                    &:last-child {
                        padding: 2em;
                    }
                }

                :global(:is(a)) {
                    color: var(--color-azure);
                    text-decoration: none;
                    opacity: 0.9;
                    transition: opacity 300ms ease-in-out;

                    &:hover {
                        opacity: 1;
                    }
                }

                :global(:is(li)) {
                    padding: 0.5em 0 0.5em 1.6em;
                    display: flex;
                    position: relative;

                    &::before {
                        content: "";
                        position: absolute;
                        width: 0.25em;
                        height: 0.25em;
                        top: 0.6em + 0.5em;
                        left: 0.5em;
                        background-color: var(--color-basic-white-80);
                        border-radius: 50%;
                    }
                }

                :global(img) {
                    object-fit: contain;
                }

                :global(:is(p:has(img))) {
                    max-height: 25em;
                    overflow: hidden;
                    border-radius: $border_radius;
                    padding: 0;
                    margin: 1em 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                :global(:is(h4, h5, h6, h1, h2, h3)) {
                    font-size: 1.3em;
                    padding: 1.2em 0 0 0;
                    color: var(--color-basic-white-80);
                    margin-bottom: -0.3em;
                }

                :global(:is(p, li)) {
                    font-size: 0.9em;
                }

                :global(li) {
                    display: inline-block;
                    flex-wrap: wrap;

                    &:last-child {
                        padding-bottom: 0;
                    }

                    &:first-child {
                        padding-top: 0;

                        &::before {
                            top: 0.6em !important;
                        }
                    }
                }

                :global(:is(p, ul)) {
                    padding: 1em 0 0.1em 0;
                }

                :global(hr) {
                    padding-top: 0;
                    margin: 1em 0 0.1em 0;
                    height: 1px;
                    width: 90%;
                    justify-self: center;
                    opacity: 0.2;
                }

                :global(code) {
                    color: var(--color-code);
                    background-color: var(--color-code-bg);
                    padding: 0.2em 0.4em;
                    // margin: -0.2em;
                    line-height: 1em;
                    font-size: 0.9em;
                    border-radius: 2px;
                }
            }
        }

        .btn-close {
            position: absolute;
            top: 1em;
            right: 1em;
            background-color: transparent;
            border: none;
            cursor: pointer;
            color: var(--color-basic-white-80);
            width: 3.1em;
            height: 3.1em;
            padding: 0;
            background-color: var(--color-black-60);

            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;

            opacity: 0;
            scale: 0;
            transition:
                scale 300ms ease-in-out,
                opacity 300ms ease-in-out;

            &:hover :global(svg) {
                width: 80%;
                height: 80%;
            }
        }

        &.render {
            backdrop-filter: blur(6px);
            background-color: transparent;

            .modal {
                opacity: 1;
                transition:
                    opacity 100ms ease-in-out,
                    width 300ms ease-in-out 300ms,
                    height 300ms ease-in-out 300ms,
                    grid-template-columns 300ms ease-in-out 300ms,
                    gap 300ms ease-in-out 200ms,
                    transform 300ms ease-in-out;

                gap: $padding_in_item * 2;
                grid-template-columns: 1fr 1.6fr;

                .right-scroll {
                    > * {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    @for $i from 1 through 5 {
                        > *:nth-child(#{$i}) {
                            transition-delay: #{300 + ($i - 1) * 200}ms;
                        }
                    }
                }
            }

            .btn-close {
                opacity: 1;
                scale: 1;
                transition:
                    scale 300ms ease-in-out 300ms,
                    opacity 300ms ease-in-out 300ms;
            }
        }
    }

    @media (max-width: 1144px) {
        .curtain.render {
            background-color: var(--color-black) !important;
            backdrop-filter: blur(0px);

            .btn-close {
                top: initial;
                bottom: 7em;
                right: 1em;
                background-color: #000;
            }

            .modal {
                grid-template-columns: 1fr;
                overflow-y: scroll;
                display: block;
                background-color: transparent;
                border-radius: 0;

                .left-scroll,
                .right-scroll {
                    overflow-x: hidden;
                    overflow-y: visible;
                    padding-right: $padding_in_item;
                    align-self: start;
                    border-top-left-radius: 0 !important;
                    border-bottom-left-radius: 0 !important;
                }

                .right-scroll {
                    overflow-y: hidden;
                }

                video,
                picture,
                img,
                :global(:is(p:has(img))) {
                    border-radius: 0;
                }

                .left-scroll {
                    padding-bottom: 1em;
                }

                .case-nav:first-child {
                    display: none;
                }

                .case-nav {
                    padding: 1em 0 2em 0;
                }
            }
        }
    }
</style>
