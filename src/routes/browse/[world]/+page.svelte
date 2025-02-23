<script>
	import { SITE_CONFIG } from "$lib/config";
	import { lastPageURL } from "$lib/stores";
	import { getItemIcon, getOwnerName, rehyphenateUUID } from "$lib/utils.js";
	import ItemIcon from "../ItemIcon.svelte";

    let { data } = $props();
    const worldCommand = `/world ${data.world.world_uuid}`
    const openGraphImage = data.world.icon === "minecraft:player_head" ? `https://mc-heads.net/head/${data.world.owner_uuid}/left` : getItemIcon(data.world.icon)
    
    let unlisted = $state(data.world?.legitidevs?.unlisted)
    let raw_description = $state(data.world.raw_description)
    if (data.world?.legitidevs?.description) {
        if (data.world.legitidevs.description[0] != "{" && data.world.legitidevs.description[0] != "[") {
            console.log(data.world.legitidevs.description[0] != "{" || data.world.legitidevs.description[0] != "[")
            raw_description = JSON.stringify({ text: data.world.legitidevs.description })
        } else {
            raw_description = data.world.legitidevs.description
        }
    }

    const canEditWorld = data?.profile_data?.id ? data.world.owner_uuid === rehyphenateUUID(data.profile_data.id) : false
    let isEditing = $state(false)
    let newDescription = $state("");
    let isLoading = $state({
        unlisted: false,
        description: false
    })

    async function unlist() {
        isLoading.unlisted = true
        const res = await fetch(`${SITE_CONFIG.API_ROOT}world/edit/unlist`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${data.cookies.MCAUTH_ACCESS_TOKEN}`
            },
            body: JSON.stringify({ world_uuid: data.world.world_uuid })
        })
        isLoading.unlisted = false

        if (res.status < 400) unlisted = !unlisted
    }

    async function editDescription() {
        isLoading.description = true
        let description = newDescription
        isEditing = false
        let content = description;
        if (description[0] != "{" && description[0] != "[") content = `{ "text": "${description}" }`

        const res = await fetch(`${SITE_CONFIG.API_ROOT}world/edit/description`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${data.cookies.MCAUTH_ACCESS_TOKEN}`
            },
            body: JSON.stringify({ world_uuid: data.world.world_uuid, content: content })
        })
        isLoading.description = false

        if (res.status < 400) raw_description = content
    }
</script>

<svelte:head>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content={data.world.name}/>
    <meta property="og:description" content={data.world.description}/>
    <meta property="og:image" content={openGraphImage}>
</svelte:head>

<div class="main-container">
    <div class="main-wrapper">
        <a class="back-button" href={$lastPageURL}>&lt; Go back</a>
        <div class="center-flex-wrapper">
            <div class="header-container">
                <div class="title-container">
                    <div class="icon-wrapper">
                        <ItemIcon item_id={data.world.icon} player_uuid={data.world.owner_uuid} />
                    </div>
                    <div class="title-wrapper">
                        <minecraft-text class="title">{data.world.raw_name}</minecraft-text>
                        {#if !isLoading.description}
                            {#if !isEditing}
                                <minecraft-text class="description">{raw_description}</minecraft-text>
                            {:else}
                                <textarea class="edit-description"  bind:value={newDescription}>{raw_description}</textarea>
                                <button onclick={editDescription} class="edit-button info">Save</button>
                            {/if}
                        {:else}
                            <img src="/img/loading.gif" alt="Loading Icon">
                        {/if}
                        {#await getOwnerName(data.world.owner_uuid)}
                            <p class="owner-name">By ...</p>  
                        {:then name}
                            <p class="owner-name">By <a href="/profile/{data.world.owner_uuid}">{name}</a></p> 
                        {:catch}
                            <p class="owner-name">We couldn't find the owner of this world.</p>
                        {/await}
                    </div>
                </div>
                <div class="status-container">
                    {#if !data.world.locked}
                        <p class="info hidden">Offline</p>
                    {:else}
                        <p class="info on">{data.world.player_count} players online</p>
                    {/if}
                    {#if data.world.enforce_whitelist}
                        <p class="info warning">Whitelisted!</p>
                    {/if}
                    {#if unlisted}
                        <p class="info special">Unlisted</p>
                    {/if}
                    {#if canEditWorld}
                        <button class="edit-button info" onclick={() => {isEditing = !isEditing}}><img src="/svg/icons/edit.svg" alt="Edit Icon"></button>
                        {#if isEditing}
                            <button class="edit-button info" onclick={unlist} disabled={isLoading.unlisted}>
                                <img src="{!isLoading.unlisted ? (!unlisted ? '/svg/icons/public.svg' : '/svg/icons/unlisted.svg') : '/img/loading.gif'}" alt="Privacy Icon">
                            </button>
                        {/if}
                    {/if}
                </div>
            </div>
        </div>
        <div class="center-flex-wrapper">
            <div class="info-container">
                <p class="info">{data.world.votes} votes</p>
                <p class="info">{data.world.visits} visits</p>
                {#if data.world.resource_pack_url !== ""}
                    <p class="info special">Has resource pack</p>
                {/if}
            </div>
        </div>
        <div class="center-flex-wrapper">
            <div class="button-container">
                <button class="button" onclick={ async () => { await navigator.clipboard.writeText(worldCommand) } }>Copy /world command</button>
                {#if data.world.resource_pack_url !== ""}
                    <a class="button" href="{data.world.resource_pack_url}" target="_blank">Download resource pack</a>
                {/if}
            </div>
        </div>
        <div class="hidden-info-container">
            <p>World UUID: {data.world.world_uuid}</p>
            <p>Version: {data.world.version}</p>
            <p>Created on {new Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "long" }).format(data.world.creation_date_unix_seconds * 1000)}</p>
            <p>This data was last scraped on {new Intl.DateTimeFormat('en-US', { timeStyle: "long" }).format(data.world.last_scraped * 1000)}</p>
        </div>
    </div>
</div>

<style>
    .main-container {
        display: flex;
		flex-direction: column;
		background-color: light-dark(var(--main-light), var(--main-dark));
		min-height: 100vmin;
        font-family: "Crafted", "Poppins", Arial, Helvetica, sans-serif;
    }

    .main-wrapper {
        margin-top: 15px;
        margin-bottom: 15px;
        align-self: center;
    }

    .center-flex-wrapper {
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
        padding-inline: 20px;
        padding-block: 30px;
        align-items: center;
        box-shadow: 0px 10px light-dark(#9FA0AD, #111113);
        transition: 0.1s all ease;

        @media screen and (max-width: 576px){
            padding-inline: 0px;
            flex-direction: column;
        }
    
    }

    .info-container, .button-container {
        display: flex;
        flex-direction: row;

        > * {
            margin-right: 10px;
            margin-bottom: 20px;
        }
    }

    .button {
        font-family: inherit;
        text-decoration: none;
        font-size: 1.5em;
        text-align: center;
        background-color: var(--accent);
        color: var(--text-main-dark);
        padding-bottom: 8px;
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

        > .info:not(:last-child) {
            margin: 0;
            margin-bottom: 15px;
        }
    }
    
    .edit-button {
        padding-top: 5px !important; /* Since font is a bit broken, paddings are adjusted but this will get removed once fixed. */
        border: none;
        outline: none;
        font: inherit;
        margin-bottom: 10px;
        transition: 0.1s all ease;
        &:hover:not(:disabled) {
            scale: 1.05;
            filter: brightness(1.1);
        }
        &:active:not(:disabled) {
            scale: 0.95;
            filter: brightness(1.1);
        }
        > img {
            image-rendering: pixelated;
            height: auto;
            width: 40px;
        }
    }

    .edit-description {
        margin-bottom: 10px;
        background-color: light-dark(#f1f0f5, #18181b);
        box-shadow: inset 0px 5px light-dark(#9FA0AD, #0b0b0c);
        outline: light-dark(#9FA0AD, #0b0b0c) 5px solid;
        font-family: inherit;
        font-size: 1.6em;
        border: none;
        resize: none;
    }

    .hidden-info-container {
        display: inline-flex;
        flex-direction: column;
        padding-block: 10px;
        padding-inline: 20px;
        background-color: light-dark(#f1f0f5, #2b2b2f);
        box-shadow: 0px 5px light-dark(#9FA0AD, #111113);
        font-size: 1.5em;
        color: light-dark(rgb(0, 0, 0, 0.5), rgb(255, 255, 255, 0.5));

        > p {
            margin: 0;
            margin-block: 10px;
        }
    }

    .title-wrapper {
        display: flex;
        flex-direction: column;
        > minecraft-text {
            margin: 0px;
            margin-bottom: 10px;
        }

        > img {
            height: auto;
            width: 100px;
            image-rendering: pixelated;
        }
    }

    .title {
        font-size: 4em;
        margin: 0;
        paint-order: stroke fill;
        -webkit-text-stroke: black 10px;
    }

    .description {
        margin: 0;
        font-size: 1.75em;
        max-width: 600px;
        paint-order: stroke fill;
        -webkit-text-stroke: black 5px;
    }

    .owner-name {
        color: light-dark(rgb(0, 0, 0, 0.5), rgb(255, 255, 255, 0.5));
        font-style: italic;
        margin: 0;
        font-size: 1.5em;

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
        padding: 7px;
        padding-top: 0px;
        font-size: 1.6em;
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