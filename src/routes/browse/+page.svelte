<script>
	import { onMount } from 'svelte';
	import WorldCard from './WorldCard.svelte';
	import SITE_CONFIG from "$lib/config.json";
	import Advertisement from '$lib/components/Advertisement.svelte';
    import { PUBLIC_API_ROOT } from '$env/static/public'
	import { get, writable } from 'svelte/store';

    // These stores all the worlds we fetched
    let worlds = $state([])
    let searchedWorlds = $state([])

    let players = $state([])

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
        isLoading = true
        const res = await fetch(`${PUBLIC_API_ROOT}page/${pageIndex}?sort=${sort}&sortDirection=${sortDirection}`)
        const newWorlds = await res.json()
        worlds = [...worlds, ...newWorlds]
        pageIndex++
        isLoading = false
    }

    async function fetchPlayers() {
        const res = await fetch(`${PUBLIC_API_ROOT}players`)
        const data = await res.json()

        players = Object.fromEntries(
            data.map(entry => [entry.world, entry.players])
        )
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
        const res = await fetch(`${PUBLIC_API_ROOT}search/${sanitizedQuery}`)
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

    onMount(async () => { 
        await fetchPage(pageIndex)
        await fetchPlayers()
    });

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

<svelte:head>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="World Browser"/>
    <meta property="og:description" content="Browse worlds from the legitimoose server here!"/>
    <meta property="og:image" content="/img/legitimoose-api-mark.png">
</svelte:head>

<div class="main-container">
    <div class="main-wrapper">
        <div class="left">
            <Advertisement />
            <div class="facet">
                <div>
                    <p>Sort</p>
                    <select bind:value={sortDirection} onchange={refreshWorlds}>
                         <option value="ascending">Ascending</option>
                         <option value="descending">Descending</option>
                    </select>
                    <p>Prioritize</p>
                    <select bind:value={sort} onchange={refreshWorlds}>
                         <option value="default">Default</option>
                         <option value="votes">Votes</option>
                         <option value="visits">Visits</option>
                         <option value="recently_scraped">Recently scraped</option>
                         <option value="recently_created">Recently created</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="search-container">
                <input 
                    type="text"
                    placeholder="Search worlds..." 
                    bind:value={searchQuery} 
                    oninput={searchWorlds}
                    class="search-input"
                />
            </div>
            <div class="world-container">
                {#if !isSearching}
                    {#each worlds as world, index}
                        <WorldCard
                            world_uuid={world.world_uuid} 
                            icon={world.icon} 
                            raw_name={JSON.stringify(world.raw_name)}
                            owner_uuid={world.owner_uuid}
                            votes={world.votes}
                            visits={world.visits}
                            resource_pack_url={world.resource_pack_url}
                            locked={world.locked}
                            player_count={world.player_count}
                            max_players={world.max_players}
                            enforce_whitelist={world.enforce_whitelist}
                            version={world.version}
                            players={players[world.world_uuid] ?? []}
                        />
                    {/each}
                {:else}
                    {#each searchedWorlds as world, index}
                        <WorldCard
                            world_uuid={world.world_uuid} 
                            icon={world.icon} 
                            raw_name={JSON.stringify(world.raw_name)}
                            owner_uuid={world.owner_uuid}
                            votes={world.votes}
                            visits={world.visits}
                            resource_pack_url={world.resource_pack_url}
                            locked={world.locked}
                            player_count={world.player_count}
                            max_players={world.max_players}
                            enforce_whitelist={world.enforce_whitelist}
                            version={world.version}
                            players={players[world.world_uuid] ?? []}
                        />
                    {/each}
                {/if}
            </div>
            <div class="sentinel-container">
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
        </div>
    </div>
</div>

<style>
    .main-container {
        display: flex;
		background-color: light-dark(var(--main-light), var(--main-dark));
		min-height: 100vmin;
        max-width: 100vw;
        font-family: 'MinecraftDefault';
    }

    .main-wrapper {
        display: flex;
        flex-direction: row;
        width: 100%;
        gap: 20px;
        margin: 20px;

        @media screen and (max-width: 576px){
            flex-direction: column;
            align-items: center;
        }
    }

    .left {
        display: flex;
        flex-direction: column;
        gap: 20px;
        width: 400px;

        @media screen and (max-width: 576px){
            flex-direction: column;
            align-items: center;
        }
    }

    .right {
        display: flex;
        flex-direction: column;
        width: 100%;
        gap: 20px;
    }

    .facet {
        position: sticky;
        display: flex;
        flex-direction: column;
        top: 20px;
        background-color: light-dark(#f1f0f5, #2b2b2f);
        box-shadow: 0px 5px light-dark(#9FA0AD, #111113);
        padding: 20px;
        font-family: 'MinecraftDefault';
        font-size: 1.75em;
        gap: 10px;

        p { margin: 0; }

        > div {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        > div > p:not(:first-of-type) { 
            color: light-dark(rgb(0, 0, 0, 0.5), rgb(255, 255, 255, 0.5));
            font-size: 0.8em;
        }

        select {
            background-color: light-dark(#d8d8dc, #555559);
            box-shadow: 0px 5px light-dark(#c1c0c4, #18181a);
            padding: 8px;
            font: inherit;
            font-size: 0.8em;
            border: none;

            &:focus, &:focus-visible { outline: none; }
        }

        option:nth-of-type(even) {
            background-color: light-dark(#c1c1ca, #424247);
            color: light-dark(var(--text-main-light), var(--text-main-dark));
        }
    }

    .search-container {
        display: flex;
        width: 100%;
        justify-content: center;
    }

    
    .search-input {
        color: white;
        font-family: 'MinecraftDefault', 'Poppins', Arial, Helvetica, sans-serif;
        font-size: 1.75em;
        border: none;
        background-color: light-dark(#f1f0f5, #18181b);
        box-shadow: inset 0px 3px light-dark(#9FA0AD, #0b0b0c);
        outline: light-dark(#9FA0AD, #0b0b0c) 3px solid;
        width: 100%;
        padding-inline: 15px;
        padding-block: 10px;

        &::placeholder {
            color: light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5));
        }
    }

    .world-container {
        max-width: 100%;
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
        @media screen and (max-width: 680px) {
            grid-template-columns: 100%;
        }
    }

    .sentinel-container {
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        justify-content: center;
    }

    .sentinel {
        font-family: 'MinecraftDefault', 'Poppins', Arial, Helvetica, sans-serif;
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
