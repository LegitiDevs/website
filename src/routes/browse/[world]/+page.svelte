<script>
	import Advertisement from "$lib/components/Advertisement.svelte";
	import SITE_CONFIG from "$lib/config.json";
    import { PUBLIC_API_ROOT } from '$env/static/public'
	import { lastPageURL } from "$lib/stores";
	import { getItemIcon, getOwnerName, rehyphenateUUID, sanitizeText } from "$lib/utils.js";
	import ItemIcon from "../ItemIcon.svelte";

    let { data } = $props();
    let world = $state({...data.world})
    let players = $state({...data.players})

    const worldCommand = `/world ${world.world_uuid}`
    const openGraphImage = world.icon === "minecraft:player_head" ? `https://mc-heads.net/head/${world.owner_uuid}/left` : getItemIcon(world.icon)
</script>

<svelte:head>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content={world.name}/>
    <meta property="og:description" content={world.description}/>
    <meta property="og:image" content={openGraphImage}>
</svelte:head>

<div class="main-container">
    <div class="main-wrapper">
        <a class="back-button" href={$lastPageURL}>&lt; Go back</a>
        <div class="mobile-center-flex-wrapper">
            <div class="header-container">
                <div class="title-container">
                    <div class="icon-wrapper">
                        <ItemIcon item_id={world.icon} player_uuid={world.owner_uuid} />
                    </div>
                    <div class="title-wrapper">
                        <minecraft-text class="title">{JSON.stringify(world.raw_name)}</minecraft-text>
                        <minecraft-text class="description">{world.description}</minecraft-text>
                        {#await getOwnerName(world.owner_uuid)}
                            <p class="owner-name">By ...</p>  
                        {:then name}
                            <p class="owner-name">By <a href="/profile/{world.owner_uuid}">{name}</a></p> 
                        {:catch}
                            <p class="owner-name">We couldn't find the owner of this world.</p>
                        {/await}
                    </div>
                </div>
                <div class="status-container">
                    {#if !world.locked}
                        <p class="info hidden">Offline</p>
                    {:else if world.player_count == 1}
                        <div class="tooltip">
                            <p class="info on">{world.player_count}/{world.max_players} player online</p>
                            <span class="tooltiptext">{players?.players?.join(', ')}</span>
                        </div>
                    {:else}
                        <div class="tooltip">
                            <p class="info on">{world.player_count}/{world.max_players} players online</p>
                            <span class="tooltiptext">{players?.players?.join(', ')}</span>
                        </div>
                    {/if}
                    {#if world.enforce_whitelist}
                        <p class="info warning">Whitelisted!</p>
                    {/if}
                    {#if world.version !== SITE_CONFIG.LATEST_LEGITIMOOSE_VERSION}
                        <p class="info special">Outdated ({world.version})</p>
                    {/if}
                </div>
            </div>
        </div>
        <div class="mobile-center-flex-wrapper">
            <div class="subheader-container">
                <div class="left">
                    <div class="mobile-center-flex-wrapper">
                        <div class="info-container">
                            <p class="info">{world.votes} votes</p>
                            <p class="info">{world.visits} visits</p>
                            {#if world.resource_pack_url !== ""}
                                <p class="info special">Has resource pack</p>
                            {/if}
                        </div>
                    </div>
                    <div class="mobile-center-flex-wrapper">
                        <div class="button-container">
                            <button class="button" onclick={ async () => { await navigator.clipboard.writeText(worldCommand) } }>Copy /world command</button>
                            {#if world.resource_pack_url !== ""}
                                <a class="button" href="{world.resource_pack_url}" target="_blank">Download resource pack</a>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="line"></div>

        <div class="other-container">
            <div class="left">
                <div class="hidden-info-container">
                    <p>World UUID: {world.world_uuid}</p>
                    <p>Version: {world.version}</p>
                    <p>Created on {new Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "long" }).format(data.world.creation_date_unix_seconds * 1000)}</p>
                    <p>This data was last scraped on {new Intl.DateTimeFormat('en-US', { timeStyle: "long" }).format(data.world.last_scraped * 1000)}</p>
                </div>
            </div>
            <div class="right">
                <Advertisement />
            </div>
        </div>
    </div>
</div>

<style>
    .main-container {
        display: flex;
		flex-direction: column;
		background-color: light-dark(var(--main-light), var(--main-dark));
		min-height: 100vmin;
        font-family: "MinecraftDefault", "Poppins", Arial, Helvetica, sans-serif;
    }

    .main-wrapper {
        margin-top: 15px;
        margin-bottom: 15px;
        align-self: center;
    }

    .mobile-center-flex-wrapper {
        @media screen and (max-width: 576px){
            display: flex;
            justify-content: center;
        }
    }

    .header-container {
        display: flex;
        flex-direction: row;
        margin-top: 20px;
        width: 90vw;
        background-color: light-dark(#f1f0f5, #2b2b2f);
        padding: 20px;
        align-items: center;
        box-shadow: 0px 10px light-dark(#9FA0AD, #111113);
        transition: 0.1s all ease;

        @media screen and (max-width: 576px){
            padding-inline: 0px;
            flex-direction: column;
        }
    }

    .subheader-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .info-container, .button-container {
        display: flex;
        flex-direction: row;
        gap: 10px;
    }

    .other-container {
        display: flex;
        flex-direction: row;
        gap: 60px;

        .left, .right {
            display: flex;
            flex-direction: column;
            width: 100%;
            gap: 20px;
        }

        .right {
            align-items: end;
            @media screen and (max-width: 576px){
                align-items: center;
            }
        }

        @media screen and (max-width: 576px){
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
    }

    .button {
        font-family: inherit;
        text-decoration: none;
        font-size: 1.4em;
        text-align: center;
        background-color: var(--accent);
        color: var(--text-main-dark);
        padding-block: 5px;
        padding-inline: 15px;
        border: 3px solid var(--outline);
        border-radius: 100px;
        cursor: pointer;
        transition: scale 0.2s ease;
    }

    .button:hover, .button:focus {
        scale: 1.05;
        background-color: var(--outline);
        border: 3px solid var(--accent);
    }

    .button:active {
        scale: 1.05;
        background-color: var(--accent);
        border: 3px solid var(--accent);
    }

    .title-container {
        display: flex;
        flex-direction: row;

        @media screen and (max-width: 576px){
            flex-direction: column;
        }

        align-items: center;
        width: 70%;
    }

    .icon-wrapper {
        display: flex;
        height: auto;
        width: 125px;
        margin-right: 20px;
    }

    .status-container {
        display: flex;
        flex-direction: column;
        align-items: end;
        text-align: right;
        flex-grow: 1;
        gap: 20px;
        .info { margin: 0; }
    }

    .hidden-info-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        background-color: light-dark(#f1f0f5, #2b2b2f);
        box-shadow: 0px 5px light-dark(#9FA0AD, #111113);
        font-size: 1.3em;
        color: light-dark(rgb(0, 0, 0, 0.5), rgb(255, 255, 255, 0.5));

        > p {
            margin: 0;
        }
    }

    .title-wrapper {
        display: flex;
        flex-direction: column;
        > minecraft-text {
            margin: 0px;
            margin-bottom: 10px;
        }
    }

    .title {
        font-size: 3.5em;
        margin: 0;
        paint-order: stroke fill;
        -webkit-text-stroke: black 10px;
    }

    .description {
        margin: 0;
        font-size: 1.5em;
        max-width: 600px;
        paint-order: stroke fill;
        -webkit-text-stroke: black 5px;
    }

    .owner-name {
        color: light-dark(rgb(0, 0, 0, 0.5), rgb(255, 255, 255, 0.5));
        font-style: italic;
        margin: 0;
        font-size: 1.4em;

        > a {
            font-weight: bold;
            text-decoration: none;
            color: inherit;

            &:hover { color: light-dark(rgb(0, 0, 0, 0.8), rgb(255, 255, 255, 0.8)); }
        }
    }

    .back-button, .back-button:visited {
        text-decoration: none;
        color: light-dark(rgb(0, 0, 0, 0.5), rgb(255, 255, 255, 0.5));
        font-style: italic;
        font-size: 1.2em;
        cursor: pointer;
    }

    .back-button:hover, .back-button:focus {
        color: light-dark(rgb(0, 0, 0, 0.8), rgb(255, 255, 255, 0.8));
    }

    .info {
        padding-inline: 6px;
        padding-block: 4px;
        font-size: 1.4em;
        color: black;
        background-color: #61a8f8;
        box-shadow: 0px 5px #4056e2;
        
        &.on {
            background-color: #70ff44;
            box-shadow: 0px 5px #1eaf2f;
        }

        &.hidden {
            background-color: #96959d;
            box-shadow: 0px 5px #535168;
        }

        &.warning {
            background-color: #ff4444;
            box-shadow: 0px 5px #bb2222;
        }

        &.special {
            background-color: #fdce34;
            box-shadow: 0px 5px #f2882a;
        }
    }
</style>
