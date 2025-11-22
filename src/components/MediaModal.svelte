<script>
    let { rect, unmount, mediaUrl } = $props();

    let modalNode = $state(null);
    let isClosing = $state(false);
    let isVisible = $state(false);

    // Вычисляем стартовые стили заранее — на основе размеров кнопки
    const initialStyles = $derived(() => {
        if (!rect) return null;

        return {
            "--initial-scale-x": rect.width / window.innerWidth,
            "--initial-scale-y": rect.height / window.innerHeight,
            "--initial-x": `${rect.left - (window.innerWidth - rect.width) / 2}px`,
            "--initial-y": `${rect.top - (window.innerHeight - rect.height) / 2}px`,
        };
    });

    // Переводим их в inline-строку, чтобы применить на корневой контейнер
    const inlineInitialStyles = $derived(() => {
        if (!initialStyles) return "";
        return Object.entries(initialStyles)
            .map(([k, v]) => `${k}:${v}`)
            .join(";");
    });

    function isVideo(url) {
        return url && url.toLowerCase().endsWith(".mp4");
    }

    function closeModal() {
        isClosing = true;
        isVisible = false;
        setTimeout(unmount, 300);
    }

    function handleBackdropClick(event) {
        if (event.target === event.currentTarget) {
            closeModal();
        }
    }

    // Управление появлением + запуск анимации
    $effect(() => {
        if (!rect) {
            isClosing = false;
            return;
        }

        modalNode?.focus();

        // Фиксируем стартовый transform (критический момент)
        void modalNode?.offsetWidth;

        requestAnimationFrame(() => {
            if (!isClosing) isVisible = true;
        });

        const handleKeydown = (e) => {
            if (e.key === "Escape" && !isClosing) {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleKeydown);
        return () => window.removeEventListener("keydown", handleKeydown);
    });
</script>

{#if rect}
    <div
        class="media-modal"
        class:is-visible={isVisible}
        bind:this={modalNode}
        onclick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
        tabindex="-1"
        style={inlineInitialStyles}
    >
        <div class="media-modal__content" onclick={(e) => e.stopPropagation()}>
            {#if isVideo(mediaUrl)}
                <video src={mediaUrl} autoplay controls playsinline></video>
            {:else}
                <img src={mediaUrl} alt="Развернутое медиа" />
            {/if}
        </div>
    </div>
{/if}

<style lang="scss">
    .media-modal {
        position: fixed; /* Используем fixed для позиционирования относительно окна */
        inset: 0;
        background-color: transparent;
        backdrop-filter: blur(0px);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition:
            background-color 300ms ease,
            backdrop-filter 300ms ease;

        &.is-visible {
            background-color: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(10px);

            .media-modal__content {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
        }

        &__content {
            /* Начальное состояние задается через transform */
            transform: translate(var(--initial-x), var(--initial-y))
                scale(var(--initial-scale-x), var(--initial-scale-y));
            opacity: 0;
            transform-origin: center;
            transition:
                transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
                opacity 300ms ease;

            /* Максимальные размеры в открытом состоянии */
            max-width: 90vw;
            max-height: 90vh;

            img,
            video {
                display: block;
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: 0.5em;
            }
        }
    }
</style>
