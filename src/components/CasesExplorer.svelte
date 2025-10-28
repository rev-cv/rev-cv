<script>
    import { onMount } from "svelte";
    let { allCases, filtersData, allPortfolios } = $props();

    const BASE_URL = import.meta.env.BASE_URL;

    let selectedRoles = $state([]);
    let selectedTags = $state([]);
    let currentPage = $state(1);
    const itemsPerPage = 6;

    let filteredCases = $derived(
        allCases
            .filter((c) => {
                // фильтр по ролям
                if (selectedRoles.length === 0) return true;
                const relevantPortfolios = allPortfolios.filter((p) =>
                    selectedRoles.includes(p.url),
                );
                return relevantPortfolios.some((p) =>
                    p.cases?.includes(c.metadata.url),
                );
            })
            .filter((c) => {
                // фильтр по тегам
                if (selectedTags.length === 0) return true;
                return selectedTags.every((tag) =>
                    c.metadata.tech?.includes(tag),
                );
            }),
    );

    let totalPages = $derived(Math.ceil(filteredCases.length / itemsPerPage));

    let paginatedCases = $derived(
        filteredCases.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage,
        ),
    );

    // cброс на первую страницу при изменении фильтров
    $effect(() => {
        if (filteredCases.length > 0) {
            currentPage = 1;
        }
    });

    function toggleTag(tag) {
        const index = selectedTags.indexOf(tag);
        if (index > -1) {
            selectedTags.splice(index, 1);
        } else {
            selectedTags.push(tag);
        }
    }

    function toggleRole(roleUrl) {
        const index = selectedRoles.indexOf(roleUrl);
        if (index > -1) {
            selectedRoles.splice(index, 1);
        } else {
            selectedRoles.push(roleUrl);
        }
    }

    function isVideo(url) {
        return url && url.toLowerCase().endsWith(".mp4");
    }

    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const tagsFromUrl = params.get("tags");
        const rolesFromUrl = params.get("roles");

        if (tagsFromUrl) {
            selectedTags = tagsFromUrl.split(",");
        }
        if (rolesFromUrl) {
            selectedRoles = rolesFromUrl.split(",");
        }
    });

    $effect(() => {
        const params = new URLSearchParams();

        if (selectedTags.length > 0) {
            params.set("tags", selectedTags.join(","));
        }
        if (selectedRoles.length > 0) {
            params.set("roles", selectedRoles.join(","));
        }

        const newUrl = `${window.location.pathname}${params.toString() ? "?" + params.toString() : ""}`;
        // replaceState не создает новую запись в истории браузера
        // pushState создает, позволяя нажимать "назад" для отмены фильтра
        history.replaceState({}, "", newUrl);
    });
</script>

<div class="explorer-cases container">
    <div class="explorer-cases__filters">
        <div class="filter-group">
            <h3>Роли:</h3>
            {#each filtersData.roles as role}
                <button
                    class:active={selectedRoles.includes(role.id)}
                    onclick={() => toggleRole(role.id)}
                >
                    {role.name}
                </button>
            {/each}
        </div>
        <div class="filter-group">
            <h3>Технологии:</h3>
            {#each filtersData.tags as tag}
                <button
                    class:active={selectedTags.includes(tag)}
                    onclick={() => toggleTag(tag)}
                >
                    {tag}
                </button>
            {/each}
        </div>
    </div>

    <p class="explorer-cases__found-count">
        {filteredCases.length} elements found
    </p>

    <div class="explorer-cases__grid">
        {#each paginatedCases as c (c.metadata.url)}
            <div class="case-card">
                <div class="title">{c.metadata.title}</div>
                <div class="descr">{c.metadata.descr}</div>
                <div class="tags">
                    {#each c.metadata.tech as tag}
                        <div>{tag}</div>
                    {/each}
                </div>
                <div class="preview">
                    {#if c.metadata.cover}
                        {#if isVideo(c.metadata.cover)}
                            <video
                                src={`${BASE_URL}${c.metadata.cover}`}
                                poster={`${BASE_URL}${c.metadata.cover.replace(/\.mp4$/, ".webp")}`}
                                preload="auto"
                                autoplay="autoplay"
                                playsinline="playsinline"
                                loop="loop"
                                muted="muted"
                                data-fetchpriority="low"
                                class="loadding"
                            ></video>
                        {:else}
                            <img
                                src={`${BASE_URL}${c.metadata.cover}`}
                                alt={c.metadata.title}
                            />
                        {/if}
                    {/if}
                </div>
                <a
                    href={`${BASE_URL}cases/${c.metadata.url}`}
                    class="link"
                    aria-label={c.metadata.title}
                ></a>
            </div>
        {/each}
    </div>

    <div class="explorer-cases__pagination">
        {#if totalPages > 1}
            {#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
                <button
                    class:active={currentPage === page}
                    onclick={() => (currentPage = page)}
                >
                    {page}
                </button>
            {/each}
        {/if}
    </div>
</div>

<style lang="scss">
    $border_radius: 2rem;
    $padding_in_item: 0.6rem;

    .explorer-cases {
        display: flex;
        flex-direction: column;
        gap: 1em;

        &__filters {
            display: flex;
            flex-direction: column;
            gap: 1em;
            user-select: none;

            h3 {
                font-size: 0.5em;
                color: var(--color-basic-white-80);
                margin-bottom: -0.8em;
                line-height: 1em;
            }

            .filter-group {
                display: flex;
                flex-wrap: wrap;
                align-items: center;
                gap: 0.5rem;

                button {
                    // background-color: red;
                    color: var(--color-basic-white);
                    border-radius: 2em;
                    padding: 0.5em 0.9em 0.4em 0.9em;
                    font-size: 0.5em;
                    line-height: 1em;
                    font-weight: 500;
                    text-transform: uppercase;
                    overflow: hidden;
                    position: relative;
                    cursor: pointer;

                    display: flex;
                    align-items: center;

                    &::after {
                        content: "";
                        position: absolute;
                        inset: 0;
                        background-color: #fff;
                        opacity: 0;
                        transition: opacity 300ms ease-in-out;
                    }

                    &:hover::after {
                        opacity: 0.2;
                    }

                    &.active {
                        background-color: var(--color-azure);
                        color: var(--color-black);
                    }
                }
            }
        }

        &__found-count {
            color: var(--color-basic-white-80);
            font-size: 0.6em;
            text-align: center;
        }

        &__grid {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        &__pagination {
            margin-top: 2rem;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
        }

        .case-card {
            display: grid;
            grid-template-columns: 20em 1fr;
            grid-template-rows: auto 1fr auto;
            grid-template-areas:
                "cover title"
                "cover descr"
                "cover tags";
            min-height: 10em;
            gap: 1em 1.6em;
            background-color: var(--color-black);
            position: relative;
            border-radius: $border_radius;
            padding: $padding_in_item 1.6em $padding_in_item $padding_in_item;
            overflow: hidden;
            z-index: 0;
            transition: scale 300ms ease-in-out;
            font-size: 1em;

            transition: scale 300ms ease-in-out;

            &:hover {
                scale: 1.01;
            }

            .title {
                grid-area: title;
                color: var(--color-basic-white-80);
                font-size: 1.4em;
                line-height: 1em;
                padding-top: 1em;
                font-weight: 800;
            }

            .descr {
                grid-area: descr;
                color: var(--color-basic-white-80);
                font-size: 0.8em;
                line-height: 1.4em;
                max-width: 80%;
            }

            .tags {
                grid-area: tags;
                display: flex;
                flex-wrap: wrap;
                gap: 0.2em 0.5em;
                padding: 0.5em 0;
                user-select: none;
                opacity: 0.6;

                div {
                    color: var(--color-basic-white-80);
                    font-size: 0.5em;
                    font-weight: 500;
                    text-transform: uppercase;

                    &:not(:last-child)::after {
                        content: ",";
                    }
                }
            }

            .preview {
                grid-area: cover;
                border-radius: $border_radius - $padding_in_item;
                overflow: hidden;
                user-select: none;

                img,
                video {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
            }

            .link {
                position: absolute;
                inset: 0;
                z-index: 2;
            }
        }
    }
</style>
