<script>
	import SITE_CONFIG from "$lib/config.json";
    import { PUBLIC_API_ROOT } from '$env/static/public'
    import { onMount } from "svelte";

    let top10Worlds = $state([]);
    let bestworld = $state([]);


    async function findbestworld() {
        const res = await fetch(`${PUBLIC_API_ROOT}top/1`)

        if (res.status >= 400) throw new Error("fetch failed")

        const world = await res.json()
        bestworld = world
    }
    
    async function fetchTop10() {
      const res = await fetch(`${PUBLIC_API_ROOT}top/10`);
      
      if (res.status >= 400) throw new Error("fetch failed")
      
      const worlds = await res.json()
      top10Worlds = worlds
    }
    
    onMount(async () => {
         await fetchTop10()
         await findbestworld()
    })
</script>

<svelte:head>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="World Stats"/>
    <meta property="og:description" content="See various world info here."/>
    <meta property="og:image" content="/img/legitimoose-api-mark.png">
</svelte:head>

<div class="main-container">
    <h1>World Stats™ (ALPHA)</h1>
    <h2 style="color: red">The "Best" World Ever</h2>
    {#each bestworld as world}
        <span title="Open {world.name}'s World Page"><a href="browse/{world.world_uuid}"><minecraft-text>{world.raw_name}</minecraft-text></a></span>
    {/each}
    <h2 style="color: yellow">Top 10 Worlds</h2>
    {#each top10Worlds as world}
        <span title="Open {world.name}'s World Page"><a href="browse/{world.world_uuid}"><minecraft-text>{world.raw_name}</minecraft-text></a></span>
    {/each}
</div>

<style>
    .main-container {
        display: flex;
        flex-direction: column;
        background-color: light-dark(var(--main-light), var(--main-dark));
        align-items: center;
        min-height: 100vmin;
    }

    h1 {
        font-size: 3rem; 
    }

    h2 {
        font-size: 2rem;
    }

    minecraft-text {
        font-size: 2.5rem; 
    }
</style>
