<script>
	import { SITE_CONFIG } from '$lib/config.js';
	import { onMount } from 'svelte';
	import { rehyphenateUUID } from '$lib/utils';
	import WorldCard from '../../browse/WorldCard.svelte';

    const { data } = $props();
    const IS_ME = data?.profile_data?.id ? data.player_uuid === rehyphenateUUID(data.profile_data.id) : false

    let worlds = $state([])

    onMount(async () => {
        const res = await fetch(`${SITE_CONFIG.API_ROOT}owner/${data.player_uuid}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${data.cookies?.MCAUTH_ACCESS_TOKEN ?? ""}`
            }
        })
        worlds = await res.json()
    })

    async function test() {
        const res = await fetch(`${SITE_CONFIG.API_ROOT}world/edit/description`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${data.cookies.MCAUTH_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                world_uuid: "dea9897f-95a7-409d-b553-646d02e708d5",
                content: `{"text":"Hello World","color":"#00ff00","random_thing_that_isnt_in_text_components":"abc"}`
            })
        })

        console.log(await res.json())
    }
</script>

<div class="main-container">
    <h1>{data.player_name}'s Profile</h1>
    <p>This is currently a public beta to test for vulnerabilities and bugs. Please report to the discord if you find one.</p>
    <p>If your world did not edit. You might have an expired session and might need to log in or you put garbage json syntax. Check logs.</p>
    <h2>Owned Worlds:</h2>
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
</style>