<script>
    import { onMount } from "svelte";

    // 1. Получаем пропсы через руну $props
    // Обратите внимание: я переименовал unmounte в unmount для чистоты
    let { rect, unmount, mediaUrl } = $props();

    // 2. Реактивное состояние через руну $state
    let isClosing = $state(false);
    let modalNode = $state();

    // Состояние для анимации контента (изображения/видео)
    let contentRect = $state({
        top: rect.top + "px",
        left: rect.left + "px",
        width: rect.width + "px",
        height: rect.height + "px",
        opacity: 0, // Начинаем с прозрачного контента
    });
    let showBackdrop = $state(false); // Состояние для фона-"шторки"

    function isVideo(url) {
        return url && url.toLowerCase().endsWith(".mp4");
    }

    function closeModal() {
        if (isClosing) return;

        isClosing = true;

        // Возвращаем координаты обратно к размерам карточки
        contentRect = {
            top: rect.top + "px",
            left: rect.left + "px",
            width: rect.width + "px",
            height: rect.height + "px",
            opacity: 0,
        };

        setTimeout(() => {
            if (unmount) unmount();
        }, 350);
    }

    function handleBackdropClick(event) {
        // Проверяем, что клик был именно по подложке
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    function handleContentClick(event) {
        // В Svelte 5 нет модификаторов событий типа |stopPropagation,
        // делаем это явно в функции
        if (event.target === event.currentTarget) {
            closeModal();
        }
        event.stopPropagation();
    }

    onMount(() => {
        // Устанавливаем фокус для доступности (accessibility)
        modalNode?.focus();

        // Плавное открытие: ждем 1 кадр, чтобы браузер отрисовал начальное положение,
        // затем разворачиваем на весь экран
        requestAnimationFrame(() => {
            // 1. Показываем фон
            showBackdrop = true;
            // 2. Анимируем контент в центр
            contentRect = {
                ...contentRect, // сохраняем начальные размеры
                opacity: 1,
            };
        });

        const handleKeydown = (e) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleKeydown);

        return () => {
            window.removeEventListener("keydown", handleKeydown);
        };
    });
</script>

<div
    class="media-modal"
    class:is-closing={isClosing}
    bind:this={modalNode}
    class:show-backdrop={showBackdrop}
    onclick={(event) => handleBackdropClick(event)}
    role="dialog"
    aria-modal="true"
    tabindex="-1"
>
    <div
        class="media-modal__content"
        style:--top={contentRect.top}
        style:--left={contentRect.left}
        style:--width={contentRect.width}
        style:--height={contentRect.height}
        style:--opacity={contentRect.opacity}
        onclick={(event) => handleContentClick(event)}
    >
        {#if isVideo(mediaUrl)}
            <video src={mediaUrl} autoplay controls playsinline></video>
        {:else}
            <img src={mediaUrl} alt="Full screen media" />
        {/if}
    </div>
</div>

<style lang="scss">
    .media-modal {
        position: fixed;
        inset: 0; // Растягиваем на весь экран
        background-color: transparent;
        backdrop-filter: blur(0px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition:
            background-color 350ms ease,
            backdrop-filter 350ms ease;

        // Когда "шторка" активна
        &.show-backdrop {
            background-color: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);
        }

        &.is-closing {
            background-color: transparent;
            backdrop-filter: blur(0px);

            .media-modal__content {
                opacity: 0;
            }
        }

        &__content {
            // Начальное положение и размер берутся из JS
            position: absolute;
            top: var(--top);
            left: var(--left);
            width: var(--width);
            height: var(--height);
            opacity: var(--opacity);

            display: flex;
            align-items: center;
            justify-content: center;
            cursor: default;
            transition: all 1000ms cubic-bezier(0.4, 0, 0.2, 1);
            // При открытии контент перемещается в центр
            inset: 0;
            margin: auto;
            cursor: pointer;

            img,
            video {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 0.5em;
            }

            // В раскрытом состоянии контент занимает доступное место с отступами
            .media-modal.show-backdrop & {
                // Убираем фиксированные размеры, чтобы контейнер
                // подстраивался под размер медиа внутри.
                width: auto;
                height: auto;
            }
        }
    }
</style>
