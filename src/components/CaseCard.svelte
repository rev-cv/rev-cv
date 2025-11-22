<script>
    import { onMount } from "svelte";
    import CaseModal from "./CaseModal.svelte";
    import Loadding from "./Loadding.svelte";

    let isModalOpen = $state(false);
    let { metadata, content } = $props();

    let cardNode;

    // Функция для определения типа файла
    function isVideo(url) {
        return url && url.toLowerCase().endsWith(".mp4");
    }

    function scrollLock(isLock) {
        if (isLock) {
            const cwa = document.body.clientWidth;
            document.body.style.overflow = "hidden";
            const cwl = document.body.clientWidth;

            if (cwa < cwl) {
                document.body.style.paddingRight = cwl - cwa + "px";
            }
        } else {
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
        }
    }

    $effect(() => scrollLock(!!isModalOpen));

    function videoSuccessLoaded(e) {
        const video = e.currentTarget;
        if (video.duration > 0) {
            if (
                video.buffered.length > 0 &&
                video.buffered.end(0) >= video.duration
            ) {
                console.log("Весь видеофайл полностью загружен!");
                video.classList.remove("loadding");
            }
        }
    }

    let isClosing = $state(false);

    onMount(() => {
        const handlePopState = () => {
            if (!window.location.pathname.includes("/cases/")) {
                // Запускаем закрытие, но не размонтируем сразу
                isClosing = true;
                // Даем время на анимацию
                setTimeout(() => {
                    isModalOpen = false;
                    isClosing = false;
                }, 350);
            }
        };
        window.addEventListener("popstate", handlePopState);
        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    });
</script>

<button
    class="case-item"
    onclick={() => {
        if (cardNode instanceof HTMLElement) {
            isModalOpen = cardNode.getBoundingClientRect();
        }
    }}
    bind:this={cardNode}
    tabindex="-1"
>
    <div class="case-item__title">
        <h3>{metadata.title}</h3>
    </div>

    <div class="case-item__preview">
        {#if metadata.cover}
            {#if isVideo(metadata.cover)}
                <video
                    src={`${import.meta.env.BASE_URL}${metadata.cover}`}
                    poster={`${import.meta.env.BASE_URL}${metadata.cover.replace(
                        /\.mp4$/,
                        ".webp",
                    )}`}
                    preload="auto"
                    autoplay="autoplay"
                    playsinline="playsinline"
                    loop="loop"
                    muted="muted"
                    data-fetchpriority="low"
                    class="loadding"
                    onprogress={videoSuccessLoaded}
                ></video>
                <div class="is-loading">
                    <Loadding />
                </div>
            {:else}
                <img
                    src={`${import.meta.env.BASE_URL}${metadata.cover}`}
                    alt={metadata.title}
                />
            {/if}
        {/if}
    </div>

    <div class="case-item__tags">
        {#each metadata.tech as tag}
            <div>{tag}</div>
        {/each}
    </div>
</button>

{#if isModalOpen}
    <CaseModal
        {metadata}
        {content}
        rect={isModalOpen}
        bind:isClosing
        unmounte={() => {
            isModalOpen = false;
        }}
    />
{/if}

<style lang="scss">
    $border_radius: 2rem;
    $padding_in_item: 0.6rem;

    .case-item {
        background-color: var(--color-black);
        min-height: 38vh;
        max-height: 38vh;
        border-radius: 2em;
        padding: $padding_in_item;
        position: relative;
        overflow: hidden;
        display: flex;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;

        // transition: box-shadow 300ms ease-in-out;

        // &:hover {
        //     box-shadow: 0 0 20px -5px var(--color-azure);
        // }

        &__title {
            position: absolute;
            top: 0;
            right: 0;
            background-color: var(--color-black);
            border-bottom-left-radius: calc($border_radius / 2);
            color: var(--color-basic-white-80);
            user-select: none;
            z-index: 2;

            h3 {
                position: relative;
                padding: 0.5em 1.4em;
                font-size: 1.2em;
                text-align: right;

                &::after,
                &::before {
                    position: absolute;
                    content: "";
                    background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 0V20H0C11.0457 20 20 11.0457 20 0Z' fill='%23111111'/%3E%3C/svg%3E");
                    background-repeat: no-repeat no-repeat;
                    background-position: center center;
                    background-size: cover;
                    width: 1em;
                    height: 1em;
                }

                &::after {
                    top: 0.6rem;
                    left: 0;
                    transform: translateX(-100%) rotate(-90deg);
                }

                &::before {
                    right: 0.6rem;
                    bottom: 0;
                    transform: translateY(100%) rotate(-90deg);
                }
            }
        }

        &__preview {
            flex-grow: 1;
            border-radius: calc($border_radius - $padding_in_item);
            overflow: hidden;
            position: relative;

            video,
            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .is-loading {
                position: absolute;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                background-color: transparent;
                z-index: 1;
            }

            &:has(.loadding) .is-loading {
                display: flex;
            }
        }

        &__tags {
            position: absolute;
            bottom: 1.3em;
            left: 1.3em;
            max-width: calc(100% - 2em - 2em);

            display: flex;
            flex-wrap: wrap-reverse;
            gap: 0.5em;
            z-index: 2;

            > div {
                background-color: var(--color-black-60);
                color: var(--color-basic-white-80);
                font-size: 0.8em;
                font-weight: 500;
                line-height: 1em;
                padding: 0.5em 1em;
                border-radius: 1em;
                backdrop-filter: blur(2px);
                user-select: none;
            }
        }
    }

    .case-item {
        width: calc(1280px / 2 - 2em);
        scroll-snap-align: start;
    }

    @media (max-width: 999px) {
        .case-item {
            width: calc(100vw - 2em);
            min-height: 25em;
            max-height: 25em;
        }
    }

    @media (max-width: 533px) {
        .case-item {
            width: calc(100vw - 0.6em);
            font-size: 0.7em;
        }
    }
</style>
