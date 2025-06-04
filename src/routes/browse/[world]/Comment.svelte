<script>
	import { censorText, getOwnerName } from "$lib/utils";
	import { onMount } from "svelte";

    const { profile_uuid, date, content, uuid, client_uuid, deleteFunction } = $props()

    let profileName = $state("Herobrine");
    let formattedDate = $state("");
    onMount(async () => {
        profileName = await getOwnerName(profile_uuid);
        formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: "short", timeStyle: "short" }).format(date * 1000)
    })

    let loading = $state(false);
    const canEditComment = profile_uuid === client_uuid;
</script>

<div class="main-container">
    <div class="info-container">
        <div class="left">
            <a href="/profile/{profile_uuid}">
                <!-- svelte-ignore a11y_img_redundant_alt -->
                <img src="https://mc-heads.net/head/{profile_uuid}/left" alt="Profile Picture" class="profile-picture"/>
                <p class="profile-name">{profileName}</p>
            </a>
        </div>
        <div class="right">
            <a href="/browse/comment/{uuid}">Quote</a>
            <p class="date">{formattedDate}</p>
        </div>
    </div>
    <div class="comment-container">
        <p class="comment">{censorText(content)}</p>
    </div>
    {#if canEditComment}
        <div class="edit-container">
            <button class="delete" onclick={() => {deleteFunction(uuid, loading)}}><img src="/svg/icons/delete.svg" alt="Delete Icon"></button>
        </div>
    {/if}
</div>

<style>
    .main-container {
        display: flex;
		flex-direction: column;
		background-color: light-dark(#f1f0f5, #2b2b2f);
        width: 95%;
        outline: 4px rgba(0, 0, 0, 0.25) solid;
        font-size: 1em;
        padding: 10px;
    }

    .info-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-inline: 10px;
        font-size: 0.85em;
        
        > .left > a {
            display: flex;
            flex-direction: row;
            align-items: center;
            text-decoration: none;
            color: light-dark(var(--text-main-light), var(--text-main-dark));
            gap: 20px;
            
            img {
                width: 100%;
                height: 50px;
            }

            
            &:hover > .profile-name { color: light-dark(rgba(0, 0, 0, 0.8), rgba(255, 255, 255, 0.8)) }
        }

        .right {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 20px;
            font-size: 0.8em;
            color: light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5));
            
            a {
                color: light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5));
                text-decoration: none;
                &:hover { text-decoration: underline; }
            }
        }
    }

    .comment-container {
        display: inline-block;
        margin-inline: 10px;
        margin-left: 75px;
        max-width: 75%;
        font-size: 0.85em;
        .comment {
            margin: 0;
            margin-bottom: 20px;
            word-wrap: break-word;
            word-break: break-all;
        }
    }

    .edit-container {
        display: flex;
        flex-direction: row;
        align-self: end;
        margin-right: 10px;
        margin-bottom: 10px;
        
        > button {
            border: none;
            outline: none;
            font: inherit;
            margin-bottom: 10px;
            padding: 3px;
            font-size: 1.6em;
            color: black;
            background-color: #61a8f8;
            box-shadow: 0px 5px #4056e2;
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
                width: 30px;
            }
        }
    }
</style>