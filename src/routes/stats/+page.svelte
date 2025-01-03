
<script>
    import { onMount } from "svelte";

    let top10Worlds = $state([]);
    
    async function fetchTop10() {
      const res = await fetch("https://api.legitimoose.net/top/10");
      
      if (res.status >= 400) throw new Error("fetch failed")
      
      const worlds = await res.json()
      top10Worlds = worlds
    }
    
    onMount(async () => { await fetchTop10() })
</script>
    

<div class="main-container">
    <h1>World Stats (ALPHA)</h1>
    <h2>Top 10 Worlds</h2>
    {#each top10Worlds as world}
        <minecraft-text>{world.raw_name}</minecraft-text>
    {/each}
</div>

<style>
    .main-container {
        display: flex;
        flex-direction: column;
        background-color: light-dark(var(--main-light), var(--main-dark));
        align-items: center;
        height: 100vmin;
    }
</style>