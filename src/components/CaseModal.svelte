<script>
    import { isOpenCaseModalStore } from "../store";
    let rect = $isOpenCaseModalStore.rect;

    // сохраняем начальный стиль один раз
    const initialStyle = `top: ${rect.top}px; left: ${rect.left}px; 
    width: ${rect.width}px; height: ${rect.height}px;`;

    let style = $state(initialStyle);

    $effect(() => {
        setTimeout(() => {
            isOpenCaseModalStore.update((value) => ({
                ...value,
                isView: true,
            }));
            style = `top: 50%; left: 50%; width: 80%;
            height: 70vh; transform: translate(-50%, -50%);`;
        }, 10);
        document.addEventListener("keydown", handleKeydown);

        return () => {
            document.removeEventListener("keydown", handleKeydown);
        };
    });

    function closeModal() {
        style = initialStyle; // возвращаем начальный стиль
        isOpenCaseModalStore.update((value) => ({
            ...value,
            isView: false,
        }));

        setTimeout(() => {
            isOpenCaseModalStore.update((value) => ({
                ...value,
                isMounted: false,
            }));
        }, 400);
    }

    function handleKeydown(e) {
        console.log(e.key);
        if (e.key === "Escape") {
            closeModal();
        }
    }
</script>

<div
    class="curtain"
    class:render={$isOpenCaseModalStore.isView}
    onclick={closeModal}
    onkeypress={() => {}}
    aria-label="Закрыть модальное окно"
    role="button"
    tabindex="0"
>
    <div
        class="modal"
        {style}
        onclick={(e) => e.stopPropagation()}
        onkeydown={(e) => e.stopPropagation()}
        role="dialog"
        tabindex="-1"
        aria-modal="true"
    >
        test
    </div>
</div>

<style lang="scss">
    .curtain {
        position: fixed;
        inset: 0;
        background-color: rgba(0, 0, 0, 0.3);
        z-index: 101;
        backdrop-filter: blur(0px);
        transition: backdrop-filter 300ms ease-in-out;
        cursor: pointer;

        .modal {
            cursor: default;
            position: absolute;
            background-color: var(--color-bg);
            border-radius: 2em;
            transition: all 400ms ease-in-out;
            transform-origin: bottom right;
            opacity: 0.8;
        }

        &.render {
            backdrop-filter: blur(6px);
        }

        &.render .modal {
            opacity: 1;
        }
    }
</style>
