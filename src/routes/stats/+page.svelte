
<script>
    import { onMount } from "svelte";

    let top10Worlds = $state([]);
    
    async function fetchTop10() {
      const res = await fetch("https://api.omrih.me/top/10");
      
      if (res.status >= 400) throw new Error("fetch failed")
      
      const worlds = await res.json()
      top10Worlds = worlds
    }
    
    onMount(async () => { await fetchTop10() })
</script>
    

<div class="main-container">
    <h1>Legitimoose Stats</h1>
    <h2>Top 10 Worlds</h2>
    {#each top10Worlds as world}
        <div>{world.name}</div>
    {/each}
</div>