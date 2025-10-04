<script>
    import CaseModal from "./CaseModal.svelte";

    let isModalOpen = $state(false); // вместо true принимает rectungle
    let { metadata, content } = $props();

    let cardNode;

    function scrollLock(isLock) {
        // isLock == true | false
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

    $effect(() => scrollLock(isModalOpen ? true : false));
</script>

<button
    class="case-item"
    onclick={() => {
        // isModalOpen = true;
        isModalOpen = cardNode.getBoundingClientRect();
    }}
    bind:this={cardNode}
>
    <div class="case-item__title">
        <h3>{metadata.title}</h3>
    </div>

    <div class="case-item__preview">
        <video
            src={metadata.video}
            preload="metadata"
            autoplay="autoplay"
            playsinline="playsinline"
            loop="loop"
            muted="muted"
            data-fetchpriority="low"
        ></video>
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
        min-height: 20em;
        border-radius: 2em;
        padding: $padding_in_item;
        position: relative;
        overflow: hidden;
        display: flex;
        cursor: pointer;

        &__title {
            position: absolute;
            top: 0;
            right: 0;
            background-color: var(--color-black);
            border-bottom-left-radius: calc($border_radius / 2);
            color: var(--color-basic-white-80);
            user-select: none;

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
            box-shadow: inset 0 0 0 5px #000;

            video {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        &__tags {
            position: absolute;
            bottom: 1.3em;
            left: 1.3em;
            max-width: calc(100% - 2em - 2em);

            display: flex;
            flex-wrap: wrap;
            gap: 0.5em;

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
</style>
