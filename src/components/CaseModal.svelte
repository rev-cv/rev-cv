<script>
    let isModalView = $state(false);
    import SVGDemo from "../assets/SVGDemo.svelte";
    import SVGCode from "../assets/SVGCode.svelte";
    import SVGFigma from "../assets/SVGFigma.svelte";

    let { metadata, content, unmounte, rect } = $props();

    let modalElement;

    // сохраняем начальный стиль один раз
    const initialStyle = `
        --transform: translate(${rect.left}px, ${rect.top}px);
        --width: ${Math.round(rect.width)}px; 
        --height: ${Math.round(rect.height)}px;
    `;

    let style = $state(initialStyle);

    $effect(() => {
        setTimeout(() => {
            isModalView = true;
            style = `
                --transform: translate(calc(50vw - 50%), calc(50vh - 50%)); 
                --width: 80%;
                --height: 70vh;
                `;
        }, 10);

        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    });

    function closeModal() {
        // Шаг 1: Начинаем анимацию закрытия (меняем стили)
        style = initialStyle;
        isModalView = false;
    }

    function handleKeydown(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    }

    // Шаг 2: Удаление из DOM
    function handleTransitionEnd(e) {
        // Убеждаемся, что переход закончился именно на нужных свойствах (например, transform)
        // и только при закрытии (когда isView: false).
        if (e.propertyName === "transform" && !isModalView) {
            unmounte();
        }
    }
</script>

<div
    class="curtain"
    class:render={isModalView}
    onclick={closeModal}
    onkeypress={() => {}}
    aria-label="Закрыть модальное окно"
    role="button"
    tabindex="0"
>
    <div
        class="modal"
        id="modal-case"
        {style}
        onkeydown={(e) => e.stopPropagation()}
        bind:this={modalElement}
        ontransitionend={handleTransitionEnd}
        onclick={(e) => e.stopPropagation()}
        role="dialog"
        tabindex="-1"
        aria-modal="true"
    >
        <div class="left-scroll">
            <video
                src={metadata.video}
                preload="metadata"
                autoplay="autoplay"
                playsinline="playsinline"
                loop="loop"
                muted="muted"
                data-fetchpriority="low"
            ></video>

            {#each metadata.pictures as pic}
                <picture>
                    <img src={pic} alt="" />
                </picture>
            {/each}
        </div>

        <div class="right-scroll">
            <div class="case-nav">
                {#if metadata.code_url}
                    <a href={metadata.code_url}>
                        <SVGCode /> <span>code</span>
                    </a>
                {/if}
                {#if metadata.demo_url}
                    <a href={metadata.demo_url}>
                        <SVGDemo /> <span>demo</span>
                    </a>
                {/if}
                {#if metadata.macket_url}
                    <a href={metadata.macket_url}
                        ><SVGFigma /> <span>layout</span></a
                    >
                {/if}
            </div>
            <div class="title">{metadata.title}</div>
            <div class="descr">{metadata.descr}</div>

            <div class="content">{@html content}</div>

            <div class="case-nav">
                {#if metadata.code_url}
                    <a href={metadata.code_url}>
                        <SVGCode /> <span>code</span>
                    </a>
                {/if}
                {#if metadata.demo_url}
                    <a href={metadata.demo_url}>
                        <SVGDemo /> <span>demo</span>
                    </a>
                {/if}
                {#if metadata.macket_url}
                    <a href={metadata.macket_url}
                        ><SVGFigma /> <span>layout</span></a
                    >
                {/if}
            </div>
        </div>
    </div>
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
                transform 300ms ease-in-out;

            overflow: hidden;

            display: grid;
            grid-template-columns: 1fr 1.6fr;
            padding: $padding_in_item 0 $padding_in_item $padding_in_item;
            gap: $padding_in_item * 2;

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

                video,
                picture {
                    width: 100%;
                    flex-grow: 0;
                    min-width: 100%;
                    height: auto;
                    object-fit: contain;
                    border-radius: $border_radius - $padding_in_item;
                }

                img {
                    border-radius: $border_radius - $padding_in_item;
                }
            }

            .right-scroll {
                font-size: 0px;
                overflow-y: auto;
                padding-right: $padding_in_item;
                display: flex;
                flex-direction: column;
                // opacity: 0;
                transition:
                    font-size 300ms ease-in-out 400ms,
                    opacity 300ms ease-in-out 500ms;

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
                }
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
                    transform 300ms ease-in-out;

                .right-scroll {
                    font-size: 1em;
                    opacity: 1;
                }
            }
        }
    }

    :global(#modal-case .right-scroll :is(h4, h5, h6, h1, h2, h3)) {
        font-size: 1.2em;
        padding: 1em 0 0.2em 0;
        color: var(--color-basic-white-80);
    }

    :global(#modal-case .right-scroll :is(p, li)) {
        font-size: 0.9em;
    }

    :global(#modal-case .right-scroll :is(p, ul)) {
        padding: 1em 0 0.1em 0;
    }

    :global(#modal-case .right-scroll :is(p:has(img))) {
        max-height: 25em;
        overflow: hidden;
        border-radius: $border_radius;
        padding: 0;
        margin: 1em 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    :global(#modal-case .right-scroll img) {
        object-fit: contain;
    }

    :global(#modal-case .right-scroll :is(li)) {
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

    :global(#modal-case .right-scroll .case-nav svg) {
        width: 1.3em;
        height: 1.3em;
        opacity: 0.8;
    }

    :global(#modal-case .right-scroll :is(a)) {
        color: var(--color-azure);
        text-decoration: none;
        opacity: 0.9;
        transition: opacity 300ms ease-in-out;

        &:hover {
            opacity: 1;
        }
    }
</style>
