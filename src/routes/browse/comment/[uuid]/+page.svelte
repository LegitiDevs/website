<script>
	import { currentPageURL } from "$lib/stores.js";
	import { showAlert } from "$lib/utils";
	import { onMount } from "svelte";
	import { fly } from "svelte/transition";

    const { data } = $props();
    const { profile_uuid, profile_name, content, uuid, date, from } = data.comment

    let backgroundImagePath = $state("")

    async function getBackgroundImages() {
        const images = await import.meta.glob("/static/img/lobby/*.png");
        const paths = Object.keys(images)
        const path = paths[Math.floor(Math.random() * paths.length)]
        backgroundImagePath = `${path}?url`.replace("/static","")
    }
    let formattedDate = $state("");
    let loaded = $state(false)
    onMount(async () => {
        formattedDate = new Intl.DateTimeFormat('en-US', { dateStyle: "medium", timeStyle: "short" }).format(date * 1000)
        await getBackgroundImages()
        loaded = true
    })

    async function copyURL() {
        await navigator.clipboard.writeText($currentPageURL)
        showAlert("Copied!", "success", 500)
    }
</script>


<svelte:head>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="{profile_name} said"/>
    <meta property="og:description" content={content.length > 256 ? `"${content.slice(0, 256)}..."` : `"${content}"`}/>
    <meta property="og:image" content="https://mc-heads.net/head/{profile_uuid}/left">
</svelte:head>

<div class="main-container" style="background-image: url('{backgroundImagePath}');">
    <div class="main-wrapper">
        {#if loaded}
            <div class="head-container" transition:fly={{y:20,duration:1000}}>
                <img src="https://mc-heads.net/head/{profile_uuid}/left" alt="Player profile" class="profile-picture"/>
            </div>
            <div class="text-container" transition:fly={{y:40,duration:2000}}>
                <p class="comment">"{content}"</p>
            </div>
            <div class="info-container" transition:fly={{y:60,duration:2500}}>
                <a href="/profile/{profile_uuid}" class="profile-name">
                    - {profile_name}
                </a>
                <div class="meta-container">
                    <p>from</p>
                    <a href="/browse/{from.world_uuid}">
                        <minecraft-text class="world">{from.raw_name}</minecraft-text>
                    </a>
                    <p class="date">sent on {formattedDate}</p>
                </div>
                <button onclick={copyURL}>Copy link</button>
            </div>
        {:else}
            <img src="/img/reefloading.gif" alt="reefloading">
        {/if}
    </div>
</div> 

<style>
    .main-container {
        display: flex;
		flex-direction: column;
        min-height: 100vh;
        background-repeat: no-repeat;
        background-size: cover;
        align-items: center;
        justify-content: center;
		background-color: light-dark(var(--main-light), var(--main-dark));
        background-position: center;
        font-size: 2em;
        font-family: MinecraftDefault;
    }

    .main-wrapper {
        display: flex;
		flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 100vh;
        background-image: linear-gradient(to top, black,rgba(0, 0, 0, 0));
    }

    .head-container {
        display: flex;
        align-items: center;
    }

    .text-container {
        display: flex;
		flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
        max-width: 75%;
        color: white;
        p {
            font-size: 1.5em;
            text-align: center;
            word-wrap: break-word;
            word-break: break-all;
            margin: 0;
        }
    }

    .info-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        a, p {
            margin: 0;
            text-decoration: none;
        }
        margin-bottom: 20px;

        button {
            background: none;
            border: none;
            font: inherit;
            font-size: 0.6em;
            color: rgba(255, 255, 255, 0.5);
            transition: all 0.05s ease;
            &:hover {
                scale: 1.1;
            }
            &:active {
                scale: 1;
            }
        }
    }
    .profile-name {
        color: rgba(255, 255, 255, 0.8);
        font-size: 1.2em;
        margin: 0;
        font-style: italic;

        &:hover {
            text-decoration: underline;
        }
    }
    .meta-container {
        display: flex;
        color: rgba(255, 255, 255, 0.5);
        font-size: 0.8em;
        flex-direction: row;
        align-items: center;
        margin-top: 10px;
        gap: 5px;

        a, p { margin: 0; }

        .world {
            paint-order: stroke fill;
            -webkit-text-stroke: 4px black;
            &:hover {
                text-decoration: underline;
            }
        }
    }
</style>
