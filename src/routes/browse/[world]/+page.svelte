<script>
	import Advertisement from "$lib/components/Advertisement.svelte";
	import { SITE_CONFIG } from "$lib/config";
	import { lastPageURL } from "$lib/stores";
	import { censorText, getItemIcon, getOwnerName, handleError, refreshSession, rehyphenateUUID, sanitizeText, showAlert } from "$lib/utils.js";
	import ItemIcon from "../ItemIcon.svelte";
	import Comment from "./Comment.svelte";

    let { data } = $props();
    let world = $state({...data.world})
    world.legitidevs ??= {}

    const worldCommand = `/world ${world.world_uuid}`
    const openGraphImage = world.icon === "minecraft:player_head" ? `https://mc-heads.net/head/${world.owner_uuid}/left` : getItemIcon(world.icon)

    // transform plaintext to json
    if (world.legitidevs?.description && world.legitidevs.description[0] != "{" && world.legitidevs.description[0] != "[") { world.legitidevs.description = JSON.stringify({ text: world.legitidevs.description }) }

    const description = $derived(world.legitidevs?.description || world.raw_description)
    const unlisted = $derived(world.legitidevs?.unlisted || false)
    const comments = $derived.by(() => {
        if (!world.legitidevs?.comments) return []
        return world.legitidevs.comments.toSorted((a, b) => b.date - a.date)
    })

    // Editing
    const canEditWorld = data.cookies?.profile ? data.world.owner_uuid === data.cookies.profile.uuid : false
    let isEditing = $state(false)

    let edits = $state({
        description: { 
            content: world.legitidevs?.description || world.raw_description, 
            loading: false
        },
        unlisted: { loading: false },
        comment: {
            content: "",
            loading: false
        }
    })

    const sendEdit = {
        description: async () => {
            edits.description.loading = true

            const res = await fetch(`${SITE_CONFIG.API_ROOT}world/edit/description`, {
                method: 'POST',
                headers: { "Session-Token": data.cookies.authorization.sessionToken },
                body: JSON.stringify({ world_uuid: world.world_uuid, content: edits.description.content })
            })

            if (res.ok) {
                const { edit } = await res.json()
                world.legitidevs.description = edit
                edits.description.content = edit
                showAlert("Successfully edited!", "success", 1000) 
            } else { await handleError(res.status, "Bad request, description might be too long.") }

            isEditing = false
            edits.description.loading = false
        },
        unlist: async () => {
            edits.unlisted.loading = true

            const res = await fetch(`${SITE_CONFIG.API_ROOT}world/edit/unlist`, {
                method: 'POST',
                headers: { "Session-Token": data.cookies.authorization.sessionToken },
                body: JSON.stringify({ world_uuid: world.world_uuid })
            })

            if (res.ok) {
                world.legitidevs.unlisted = (await res.json()).edit
                showAlert("Successfully edited!", "success", 1000) 
            } else { await handleError(res.status) }

            edits.unlisted.loading = false
        },
        comment: async () => {
            edits.comment.loading = true

            const content = censorText(sanitizeText(edits.comment.content))

            const res = await fetch(`${SITE_CONFIG.API_ROOT}world/comment`, {
                method: 'POST',
                headers: { "Session-Token": data.cookies.authorization.sessionToken },
                body: JSON.stringify({ world_uuid: world.world_uuid, profile_uuid: data.cookies.profile.uuid, content: content })
            })

            if (res.ok) {
                const { edit } = await res.json();
                world.legitidevs.comments ??= []
                world.legitidevs.comments.push(edit)
                edits.comment.content = ""
                showAlert("Sent!", "success", 1000) 
            } else { await handleError(res.status, "Bad request, comment might be too long.") }

            edits.comment.loading = false
        },
        deleteComment: async (uuid, loading) => {
            loading = true
            const res = await fetch(`${SITE_CONFIG.API_ROOT}world/comment/delete`, {
                method: 'POST',
                headers: { "Session-Token": data.cookies.authorization.sessionToken },
                body: JSON.stringify({ uuid: uuid })
            })

            if (res.ok) {
                const { edit } = await res.json();
                world.legitidevs.comments ??= []
                world.legitidevs.comments = world.legitidevs.comments.filter((comment) => comment.uuid !== edit.removed_uuid)
                showAlert("Comment deleted.", "success", 1000)
                return
            } else { await refreshSession(true) }

            loading = false
        }
    }
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
                        <minecraft-text class="title">{world.raw_name}</minecraft-text>
                        {#if !edits.description.loading}
                            {#if !isEditing}
                                <minecraft-text class="description">{description}</minecraft-text>
                            {:else}
                                <textarea class="edit-description" bind:value={edits.description.content} maxlength="1024">{description}</textarea>
                                <button onclick={sendEdit.description} class="edit-button info">Save</button>
                            {/if}
                        {:else}
                            <img src="/img/loading.gif" alt="Loading Icon">
                        {/if}
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
                    {:else}
                        <p class="info on">{world.player_count} players online</p>
                    {/if}
                    {#if world.enforce_whitelist}
                        <p class="info warning">Whitelisted!</p>
                    {/if}
                    {#if world.version !== SITE_CONFIG.LATEST_LEGITIMOOSE_VERSION}
                        <p class="info special">Outdated ({world.version})</p>
                    {/if}
                    {#if unlisted}
                        <p class="info special">Unlisted</p>
                    {/if}
                    {#if canEditWorld}
                        <button class="edit-button info" onclick={() => {isEditing = !isEditing}}><img src="/svg/icons/edit.svg" alt="Edit Icon"></button>
                        {#if isEditing}
                            <button class="edit-button info" onclick={sendEdit.unlist} disabled={edits.unlisted.loading}>
                                <img src="{!edits.unlisted.loading ? (!unlisted ? '/svg/icons/public.svg' : '/svg/icons/unlisted.svg') : '/img/loading.gif'}" alt="Privacy Icon">
                            </button>
                        {/if}
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
                <div class="right">
                    <!-- LINKS GO HERE -->
                </div>
            </div>
        </div>

        <div class="line"></div>

        <div class="other-container">
            <div class="left">
                <div class="comments-container">
                    <div class="title-wrapper">
                        <p>Comments</p>
                    </div>
                    <div class="comment-bar">
                            <textarea placeholder="Type your comment here" bind:value={edits.comment.content} disabled={edits.comment.loading || !data.cookies?.profile} onkeypress={(e) => {if (e.key === "Enter") sendEdit.comment()}} maxlength="1024"></textarea>
                            <button class={["edit-button info", edits.comment.loading && "hidden"]} onclick={sendEdit.comment} disabled={edits.comment.loading || !data.cookies?.profile}>Send</button>
                    </div>
                    <div class="comments-wrapper">
                        {#if !world.legitidevs?.comments || world.legitidevs.comments.length === 0}
                            <p>It's quiet in here.</p>
                        {:else}
                            {#each comments as comment (comment.uuid)}
                                <Comment profile_uuid={comment.profile_uuid} content={comment.content} date={comment.date} uuid={comment.uuid} client_uuid={data.cookies?.profile?.uuid} deleteFunction={sendEdit.deleteComment}></Comment>
                            {/each}
                        {/if}
                    </div>
                </div>
            </div>
            <div class="right">
                <div class="hidden-info-container">
                    <p>World UUID: {world.world_uuid}</p>
                    <p>Version: {world.version}</p>
                    <p>Created on {new Intl.DateTimeFormat('en-US', { dateStyle: "full", timeStyle: "long" }).format(data.world.creation_date_unix_seconds * 1000)}</p>
                    <p>This data was last scraped on {new Intl.DateTimeFormat('en-US', { timeStyle: "long" }).format(data.world.last_scraped * 1000)}</p>
                </div>
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
        font-family: "Crafted", "Poppins", Arial, Helvetica, sans-serif;
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

    .header-container, .comments-container {
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

    .comments-container {
        display: flex;
        justify-content: center;
        flex-direction: column;
        max-width: 40vw;
        margin: 0;
        background-color: light-dark(#f1f0f5, #2b2b2f);
        box-shadow: 0px 5px light-dark(#9FA0AD, #111113);
        padding-inline: 20px;
        padding-block: 30px;
        gap: 20px;
        transition: 0.1s all ease;
        font-size: 1.5em;

        > .title-wrapper {
            display: flex;
            width: 100%;
            margin-left: 30px;
            font-size: 1.5em;
            > p { margin: 0; }
        }

        @media screen and (max-width: 576px){
            padding-inline: 0px;
        }
    }

    .comment-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 20px;
        > textarea {
            field-sizing: content;
            width: 80%;
            min-height: 1em;
            max-height: 100px;
            background-color: light-dark(#f1f0f5, #18181b);
            box-shadow: inset 0px 3px light-dark(#9FA0AD, #0b0b0c);
            outline: light-dark(#9FA0AD, #0b0b0c) 3px solid;
            font-family: inherit;
            font-size: 1em;
            padding: 5px;
            border: none;
            resize: none;
        }
        > button {
            color: black;
            font-size: 1.2em;
            padding-top: 0 !important; /* Since font is a bit broken, paddings are adjusted but this will get removed once fixed. */
        }
    }

    .comments-wrapper {
        display: flex;
        width: 100%;
        max-height: 500px;
        padding-block: 10px;
        flex-direction: column;
        align-items: center;
        overflow-y: scroll;
        gap: 20px;
        > p {
            color: light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5));
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
        gap: 20px;
        .info { margin: 0; }
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
        display: flex;
        flex-direction: column;
        gap: 20px;
        padding: 20px;
        background-color: light-dark(#f1f0f5, #2b2b2f);
        box-shadow: 0px 5px light-dark(#9FA0AD, #111113);
        font-size: 1.5em;
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