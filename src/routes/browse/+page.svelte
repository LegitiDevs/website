<script>
	import { onMount } from 'svelte';
	import WorldCard from './WorldCard.svelte';

    // These stores all the worlds we fetched
    let worlds = $state([])
    let searchedWorlds = $state([])

    // Variables for searching
    let searchQuery = $state('');
    let isSearching = $state(false)
    
    // Variables for sorting
    let sort = $state('default')
    let sortDirection = $state('ascending')
    
    // Variables for loading more pages
    let pageIndex = $state(0)
    let isLoading = $state(false)
    let observer
    let sentinel = $state();

    async function refreshWorlds() {
        worlds = []
        pageIndex = 0
        await fetchPage()
    }

    async function fetchPage() {
        console.log(`https://api.legitimoose.net/page/${pageIndex}?sort=${sort}?sortDirection=${sortDirection}`)
        isLoading = true
        const res = await fetch(`https://api.legitimoose.net/page/${pageIndex}?sort=${sort}?sortDirection=${sortDirection}`)
        const newWorlds = await res.json()
        worlds = [...worlds, ...newWorlds]
        pageIndex++
        isLoading = false
    }
    
    async function fetchSearchedWorlds(query) {
        searchedWorlds = [];
        if (query === '') {
            isSearching = false;
            return;
        }

        isLoading = true
        isSearching = true
        const sanitizedQuery = encodeURIComponent(query)
        const res = await fetch(`https://api.legitimoose.net/search/${sanitizedQuery}`)
        const worldsMatched = await res.json()
        searchedWorlds = worldsMatched;
        isLoading = false
    }

    let debounceTimeout
    function searchWorlds() {
        if (searchQuery === '') {
            isSearching = false;
            searchedWorlds = [];
            sentinel.style.display = 'block';
            return;
        }
        sentinel.style.display = 'none';
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => { 
            await fetchSearchedWorlds(searchQuery) 
        }, 600);
    }

    onMount(async () => { await fetchPage(pageIndex) });

    onMount(() => {
        observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                await fetchPage(pageIndex)
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        });

        if (sentinel) observer.observe(sentinel)

        return () => {
            if (sentinel) observer.unobserve(sentinel);
        };
    })
</script>

<div class="main-container">
    <div class="search-container">
        <input 
            type="text"
            placeholder="Search worlds..." 
            bind:value={searchQuery} 
            oninput={searchWorlds}
            class="search-input"
        />
        <!-- <select bind:value={sort} onchange={refreshWorlds}>
            <option value="default">Online</option>
            <option value="votes">Votes</option>
            <option value="visits">Visits</option>
            <option value="recently_created">Recently Created</option>
            <option value="recently_scraped">Recently Scraped</option>
        </select>
        <div class="sort-direction-container">
            <button onclick={() => {sortDirection = "ascending"; console.log(sortDirection)}}>^</button>
            <button onclick={() => {sortDirection = "descending"; console.log(sortDirection)}}>&#8964;</button>
        </div> -->
    </div>
    <div class="world-container">
        {#if !isSearching}
            {#each worlds as world}
                <WorldCard
                    world_uuid={world.world_uuid} 
                    icon={world.icon} 
                    raw_name={world.raw_name}
                    owner_uuid={world.owner_uuid}
                    votes={world.votes}
                    visits={world.visits}
                    resource_pack_url={world.resource_pack_url}
                    locked={world.locked}
                    player_count={world.player_count}
                    enforce_whitelist={world.enforce_whitelist}
                />
            {/each}
        {:else}
            {#each searchedWorlds as world}
                <WorldCard
                    world_uuid={world.world_uuid} 
                    icon={world.icon} 
                    raw_name={world.raw_name}
                    owner_uuid={world.owner_uuid}
                    votes={world.votes}
                    visits={world.visits}
                    resource_pack_url={world.resource_pack_url}
                    locked={world.locked}
                    player_count={world.player_count}
                    enforce_whitelist={world.enforce_whitelist}
                />
            {/each}
        {/if}
    </div>
    <button bind:this={sentinel} class="sentinel" onclick={async () => { await fetchPage() }}>
        {#if isLoading}
            <img src="/img/reefloading.gif" alt="Loading Icon" class="loading-icon">
        {:else}
            ...Load more...
        {/if}
    </button>
    {#if isSearching && isLoading}
        <img src="/img/reefloading.gif" alt="Loading Icon" class="loading-icon">
    {/if}
</div>

<style>
    .main-container {
        display: flex;
        flex-direction: column;
		background-color: light-dark(var(--main-light), var(--main-dark));
		min-height: 100vmin;
        max-width: 100vw;
		align-items: center;
    }

    .search-container {
        display: flex;
        margin-top: 20px;
        width: 100%;
        justify-content: center;
    }

    
    .search-input {
        background-color: #a09172;
        color: white;
        font-family: 'Crafted', 'Poppins', Arial, Helvetica, sans-serif;
        font-size: 2em;
        border: none;
        box-shadow: 
            -2px -2px 0px 2px #e0ca9f,
            2px 2px 0px 2px #544c3b,
            2px -2px 0px 2px #a09172,
            -2px 2px 0px 2px #a09172,
            -2px -2px 0px 6px var(--outline),
            2px 2px 0px 6px var(--outline),
            2px -2px 0px 6px var(--outline),
            -2px 2px 0px 6px var(--outline);
        text-shadow: 3px 3px rgb(0, 0, 0, 0.5);
        padding-inline: 20px;
        padding-bottom: 10px;

        &:focus, &:focus-visible {
            outline: none;
        }

        &::placeholder {
            color: #d0c8b9;
        }
    }

    .world-container {
        max-width: 100%;
        margin: 20px;
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
        @media screen and (max-width: 680px) {
            grid-template-columns: 100%;
        }
    }

    .sentinel {
        font-family: 'Crafted', 'Poppins', Arial, Helvetica, sans-serif;
        text-decoration: none;
        font-size: 3em;
        text-align: center;
        background-color: unset;
        color: light-dark(rgb(0, 0, 0, 0.5), rgb(255, 255, 255, 0.5));
        padding: 8px;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-block: 20px;
        animation: pulse 2s ease infinite forwards;
    }

    .loading-icon {
        height: auto;
        width: 300px;
        image-rendering: pixelated;
        opacity: 0.5;
    }

    .sentinel:hover, .sentinel:focus, .sentinel:active {
        scale: 1.05;
    }


    @keyframes pulse {
        0% {
            opacity: 0.5;
            scale: 0.8;
        }
        50% {
            opacity: 1;
            scale: 1;
        }
        100% {
            opacity: 0.5;
            scale: 0.8;
        }
    }
</style>