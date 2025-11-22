<script>
    const BASE_URL = import.meta.env.BASE_URL;

    let isModalView = $state(false);
    import SVGDemo from "../assets/SVGDemo.svelte";
    import SVGCode from "../assets/SVGCode.svelte";
    import SVGFigma from "../assets/SVGFigma.svelte";
    import SVGClose from "../assets/SVGClose.svelte";

    let {
        metadata,
        content,
        unmounte,
        rect,
        isClosing = $bindable(false),
    } = $props();

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

    /* 
    ════════════════════════════════════════════════════════════════════════════════
    ПРОЦЕСС ОТКРЫТИЯ МОДАЛЬНОГО ОКНА:
    ════════════════════════════════════════════════════════════════════════════════
    
    1. Пользователь кликает на кнопку .case-item (onclick={() => {...}))
    2. Сохраняем координаты карточки: isModalOpen = cardNode.getBoundingClientRect()
    3. Svelte рендерит <CaseModal> т.к. isModalOpen теперь truthy
    4. В CaseModal запускается $effect():
       - Меняет URL через history.pushState()
       - Запускает setTimeout на 10ms для запуска анимации
       - isModalView = true → применяется класс .render
       - updateStyleForScreenSize() изменяет style с initialStyle на центрированные координаты
    5. CSS transition плавно анимирует модалку от позиции карточки к центру экрана
    
    ════════════════════════════════════════════════════════════════════════════════
    ПРОЦЕСС ЗАКРЫТИЯ МОДАЛЬНОГО ОКНА:
    ════════════════════════════════════════════════════════════════════════════════
    
    ВАРИАНТ А: Пользователь кликает на curtain/кнопку закрытия/нажимает Escape
    ────────────────────────────────────────────────────────────────────────────────
    1. Вызывается closeModal(false) в CaseModal
    2. isModalView = false → убирается класс .render
    3. style = initialStyle → модалка возвращается к координатам карточки
    4. CSS transition анимирует возврат модалки (300ms)
    5. setTimeout на 350ms дожидается завершения анимации
    6. history.back() возвращает URL назад
    7. Срабатывает handlePopState в родителе (Case.svelte)
    8. isClosing = true передается в CaseModal
    9. Еще один setTimeout на 350ms
    10. isModalOpen = false → Svelte размонтирует <CaseModal>
    
    ВАРИАНТ Б: Пользователь нажимает кнопку "Назад" в браузере
    ────────────────────────────────────────────────────────────────────────────────
    1. history.back() меняет URL
    2. Срабатывает handlePopState в родителе (Case.svelte)
    3. Проверка: если URL больше не содержит "/cases/"
    4. isClosing = true передается в CaseModal через bind:isClosing
    5. В CaseModal срабатывает $effect() на изменение isClosing
    6. isModalView = false, style = initialStyle → запуск анимации закрытия
    7. CSS transition анимирует возврат (300ms)
    8. setTimeout на 350ms в родителе дожидается анимации
    9. isModalOpen = false → Svelte размонтирует <CaseModal>
    
    ════════════════════════════════════════════════════════════════════════════════
    КРИТИЧЕСКИ ВАЖНО:
    - Родитель НЕ размонтирует модалку сразу, а ждет 350ms для завершения анимации
    - isClosing используется как флаг для синхронизации между родителем и модалкой
    - Анимация всегда отрабатывает ДО размонтирования компонента
    ════════════════════════════════════════════════════════════════════════════════
    */

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

    /* 
    ════════════════════════════════════════════════════════════════════════════════
    ИНИЦИАЛИЗАЦИЯ МОДАЛЬНОГО ОКНА (при монтировании):
    ═══════════════════════════════════════════════════════════════════════════════*/
    $effect(() => {
        // 1. Меняем URL в браузере на /cases/[название-кейса]
        const newUrl = `${BASE_URL}cases/${metadata.url}`;
        history.pushState({ caseUrl: metadata.url }, "", newUrl);

        // 2. Небольшая задержка для корректного запуска анимации
        setTimeout(() => {
            isModalView = true; // Применяет класс .render к .curtain
            updateStyleForScreenSize(); // Устанавливает финальные координаты (центр экрана)
        }, 10);

        // 3. Обработчик кнопки "Назад" в браузере
        const handlePopState = (event) => {
            // Если вернулись на другую страницу (не этот кейс)
            if (event.state?.caseUrl !== metadata.url) {
                closeModal(true); // Закрываем с флагом isFromHistory=true
            }
        };

        window.addEventListener("popstate", handlePopState);
        document.addEventListener("keydown", handleKeydown);
        window.addEventListener("resize", updateStyleForScreenSize);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            document.removeEventListener("keydown", handleKeydown);
            window.removeEventListener("resize", updateStyleForScreenSize);
        };
    });
    /* END ИНИЦИАЛИЗАЦИЯ МОДАЛЬНОГО ОКНА */

    /* 
    ════════════════════════════════════════════════════════════════════════════════
    ЗАКРЫТИЕ МОДАЛКИ (клик на curtain, кнопку закрытия, Escape):
    ══════════════════════════════════════════════════════════════════════════════*/
    function closeModal(isFromHistory = false) {
        // 1. Запускаем анимацию закрытия
        isModalView = false; // Убирает класс .render
        style = initialStyle; // Возвращает модалку к координатам карточки

        // 2. Ждем завершения анимации (300ms transition + 50ms запас)
        setTimeout(() => {
            if (!isFromHistory) {
                // Если закрытие инициировано пользователем (не через history.back)
                history.back(); // Возвращаем URL назад
                // Это вызовет handlePopState в родителе → isClosing=true → размонтирование
            } else {
                // Если пришли из history.back (обработчик handlePopState выше)
                unmounte(); // Размонтируем компонент напрямую
            }
        }, 350);
    }

    function handleKeydown(e) {
        if (e.key === "Escape") {
            closeModal();
        }
    }
    /* END ЗАКРЫТИЕ МОДАЛКИ */

    /* 
    ════════════════════════════════════════════════════════════════════════════════
    РЕАКЦИЯ НА ЗАКРЫТИЕ ИЗ РОДИТЕЛЯ (через кнопку "Назад" браузера):
    ══════════════════════════════════════════════════════════════════════════════*/
    $effect(() => {
        // Если родитель установил isClosing=true (через bind:isClosing)
        if (isClosing) {
            isModalView = false; // Убирает класс .render
            style = initialStyle; // Возвращает к начальным координатам карточки
            // CSS transition автоматически анимирует переход (300ms)
            // Родитель дождется 350ms и размонтирует компонент
        }
    });
    /* END РЕАКЦИЯ НА ЗАКРЫТИЕ ИЗ РОДИТЕЛЯ*/

    /* 
    ════════════════════════════════════════════════════════════════════════════════
    ПРОЦЕСС РАЗВОРАЧИВАНИЯ МЕДИА НА ВЕСЬ ЭКРАН МОДАЛКИ:
    ════════════════════════════════════════════════════════════════════════════════

    ОТКРЫТИЕ МЕДИА (клик на изображение/видео в .left-scroll):
    ────────────────────────────────────────────────────────────────────────────────
    1. Пользователь кликает на button с медиа → вызывается previewMedia(e, mediaUrl)
    2. Проверка: if (window.innerWidth < 1144) return; (только на десктопе)
    3. Получаем элементы:
    - button = e.currentTarget (кнопка-контейнер)
    - videoWrapper или img = animatedElement (что анимировать)
    4. Сохраняем исходные координаты медиа:
    - button._mediaRect = animatedElement.getBoundingClientRect()
    - button._isVideo = true/false (тип медиа для обратной анимации)
    5. Вычисляем позицию медиа относительно модалки (не viewport):
    - modalRect = modalElement.getBoundingClientRect()
    - relativeTop = mediaRect.top - modalRect.top
    - relativeLeft = mediaRect.left - modalRect.left
    6. Фиксируем высоту кнопки: button.style.minHeight (чтобы не схлопнулась)
    7. Устанавливаем начальную позицию анимации:
    - position: absolute
    - top/left: текущие координаты относительно модалки
    - width/height: текущие размеры медиа
    - z-index: 103 (над всем контентом модалки)
    - transition: all 200ms ease-in-out
    8. Для видео: устанавливаем object-fit: contain для video внутри
    9. Для изображений: устанавливаем object-fit: contain и border-radius: 1.4rem
    10. void animatedElement.offsetHeight; (принудительный reflow для Firefox)
    11. requestAnimationFrame(() => {...}) - в следующем кадре:
        - top: 0, left: 0, width: 100%, height: 100%
        - border-radius: 0 (для изображений)
        - CSS transition плавно анимирует растягивание на всю модалку (200ms)
    12. setTimeout на 400ms (ждем завершения анимации + запас):
        - backgroundColor: var(--color-black) (черный фон)
        - isOpenMedia = true (флаг открытого состояния)
        - openMediaUrl = mediaUrl (для отображения контролов видео)

    ЗАКРЫТИЕ МЕДИА (повторный клик на то же медиа):
    ────────────────────────────────────────────────────────────────────────────────
    1. Проверка: else блок в previewMedia (если isOpenMedia === true)
    2. Получаем сохраненные данные:
    - mediaRect = button._mediaRect (исходные координаты)
    - isVideoElement = button._isVideo (тип медиа)
    3. Вычисляем обратную позицию относительно модалки:
    - modalRect = modalElement.getBoundingClientRect() (могла измениться)
    - relativeTop = mediaRect.top - modalRect.top
    - relativeLeft = mediaRect.left - modalRect.left
    4. Устанавливаем анимацию сжатия:
    - transition: all 200ms ease-in-out
    - border-radius: 1.4rem (для изображений)
    - top/left: возврат к исходным координатам
    - width/height: возврат к исходным размерам
    - backgroundColor: "" (убираем черный фон)
    5. setTimeout на 200ms (ждем завершения анимации):
    - animatedElement.style.cssText = "" (сброс всех inline стилей)
    - video.style.objectFit = "" (для видео)
    - button.style.minHeight = "" (убираем фиксированную высоту)
    - isOpenMedia = false (сброс флага)
    - openMediaUrl = null (скрываем контролы видео)

    ОСОБЕННОСТИ:
    ────────────────────────────────────────────────────────────────────────────────
    - Координаты вычисляются ОТНОСИТЕЛЬНО модалки, а не viewport
    (т.к. модалка может быть прокручена)
    - Для видео анимируется .video-wrapper, для изображений - сам img
    - button._mediaRect и button._isVideo хранят данные для обратной анимации
    - close-overlay появляется только когда openMediaUrl === media
    (overlay позволяет закрыть видео кликом, оставив контролы доступными)
    - На мобильных (< 1144px) функция сразу выходит через return

    ════════════════════════════════════════════════════════════════════════════════
    */

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
    onclick={() => history.back()}
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
                                src={`${BASE_URL}${media}`}
                                preload="metadata"
                                poster={`${BASE_URL}${media.replace(
                                    /\.mp4$/,
                                    ".webp",
                                )}`}
                                playsinline
                                data-fetchpriority="low"
                                controls={openMediaUrl === media}
                                muted={openMediaUrl !== media}
                                autoplay={openMediaUrl !== media}
                                loop={openMediaUrl !== media}
                                class="loadding"
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
                            <img src={`${BASE_URL}${media}`} alt="" />
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

    <button class="btn-close" onclick={() => history.back()}
        ><SVGClose /></button
    >
</div>

<style lang="scss">
    @use "../styles/md-text" as md;

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
                        bottom: 4em;
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
                @include md.message-shared($padding_in_item, $border_radius);
                overflow-y: auto;
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
