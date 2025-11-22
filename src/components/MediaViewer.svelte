<script>
    import MediaModal from "./MediaModal.svelte"; // Или путь к вашему компоненту

    // 1. Деструктурируем пропсы и сниппет children (вместо <slot>)
    let { mediaUrl, children } = $props();

    // 2. Реактивное состояние
    let cardNode = $state();
    let modalRect = $state(false);

    // Функция блокировки скролла (логика осталась прежней)
    function scrollLock(isLock) {
        if (typeof document === "undefined") return;

        // Теперь, когда мы используем scrollbar-gutter,
        // достаточно просто переключать overflow.
        if (isLock) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
    }

    // 3. Эффект вместо $:
    // Он запустится, когда изменится modalRect
    $effect(() => {
        scrollLock(!!modalRect);
    });

    // Обработчик клика
    function handleClick() {
        if (cardNode instanceof HTMLElement) {
            modalRect = cardNode.getBoundingClientRect();
        }
    }

    // Коллбэк для закрытия
    function handleClose() {
        modalRect = false;
    }
</script>

<button
    type="button"
    class="media-viewer"
    bind:this={cardNode}
    onclick={handleClick}
>
    {@render children()}
</button>

{#if modalRect}
    <MediaModal rect={modalRect} {mediaUrl} unmount={handleClose} />
{/if}

<style>
    .media-viewer {
        padding: 0;
        margin: 0;
        border: none;
        background: none;
        cursor: pointer;
        display: block;
        /* Сбрасываем стили шрифта, чтобы кнопка наследовала их */
        font: inherit;
        color: inherit;
        text-align: inherit;
        width: 100%; /* Опционально, часто нужно для оберток */
    }
</style>
