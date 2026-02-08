<script>
	import SITE_CONFIG from "$lib/config.json";
    import { PUBLIC_API_ROOT } from '$env/static/public'
	import { onMount } from 'svelte';
	import { rehyphenateUUID, showAlert } from '$lib/utils';
	import WorldCard from '../../browse/WorldCard.svelte';

    const { data } = $props();
    const canEditProfile = data.cookies?.profile ? data.profileOwnerUUID === data.cookies.profile.uuid : false

    let worlds = $state([])

    onMount(async () => {
        const res = await fetch(`${PUBLIC_API_ROOT}owner/${data.profileOwnerUUID}`, {
            method: 'POST',
            headers: {
                "Session-Token": data.cookies?.authorization?.sessionToken ?? ""
            },
        })
        worlds = await res.json()
    })

    async function test() {
        showAlert("what the sigma", "info", 10000)
    }
</script>

<div class="main-container">
    <h1>{data.profileOwnerName}'s Profile</h1>
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
            max_players={world.max_players}
            enforce_whitelist={world.enforce_whitelist}
            version={world.version}
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
