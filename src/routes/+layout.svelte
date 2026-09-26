<script>
    import { page } from "$app/stores";
    import { afterNavigate, beforeNavigate } from "$app/navigation";
    import { browser } from "$app/environment";
    import { lastPageURL, currentPageURL, alerts } from "$lib/stores.js";
    import { onMount } from "svelte";
    import SITE_CONFIG from "$lib/config.json";
    import "$lib/global_style.css";
    import { rehyphenateUUID } from "$lib/utils.js";
    import { fly } from "svelte/transition";

    onMount(async () => {
        await import("$lib/minecraft-text");
    });

    let { children, data } = $props();
    const isError = $page.status >= 400;

    // Set the initial page URL
    afterNavigate((nav) => {
        lastPageURL.set($currentPageURL); // Store the previous page
        currentPageURL.set(nav.to?.url || window.location.href); // Update current page
    });
</script>

<svelte:head>
    {#if isError}
        <title>{$page.status} {$page.error.message} | LegitiDevs</title>
    {:else}
        <title>{$page.data?.page?.title ?? "Unknown"} | LegitiDevs</title>
    {/if}
</svelte:head>

{#if isError || $page.data?.page?.navbar === "small"}
    <div class="small-navbar">
        <div class="left">
            <a href="/" data-sveltekit-reload={isError}>
                <img
                    src="/img/legitimoose-api-mark.webp"
                    alt="Legitimoose API Mark"
                />
            </a>
            <a href="/" data-sveltekit-reload={isError}>Home</a>
        </div>
    </div>
{:else}
    <div class="navbar">
        <div class="left">
            <a href="/">
                <img
                    src="/img/legitimoose-api-mark.webp"
                    alt="Legitimoose API Mark"
                />
            </a>
            <a href="/">Home</a>
            <a href="/browse"
                >World Browser</a
            >
            <a href="https://docs.legiti.dev">API</a>
            <a href="https://legitimoose.wiki">Legitimoose Wiki</a>
            <a
                href="https://status.legiti.dev/">Status</a
            >
            <a href="/donate">Donate</a
            >
            <a href="/team"
                >Meet The Team</a
            >
        </div>
    </div>
{/if}

<amp-auto-ads type="adsense" data-ad-client="ca-pub-2384425323311779">
</amp-auto-ads>

{@render children()}

<div class="footer-container">
    <p>This is not an official Moose project and is made by the community.</p>
    <p>We have no affiliation with any real-world brands.</p>
    <p>Not affiliated with Mojang AB or Partners</p>

    <p>
        <a href="https://store.skyemc.net">API Hosted by SkyeNetwork</a>
        <span>|</span>
        <a href="https://store.legitimoose.com">store.legitimoose.com</a>
        <span>|</span>
        <a href="/donate">Support Legitimoose!</a>
        <span>|</span>
        <a href="/privacy">Privacy Policy</a>
    </p>

    <div class="links-container">
        <a href="https://github.com/LegitiDevs/">
            <img src="/svg/github-mark-white.svg" alt="Github Logo" />
        </a>
        <a href="https://discord.gg/gnk7ZtBSjZ">
            <img src="/svg/discord-mark-white.svg" alt="Discord Logo" />
        </a>
        <a href="https://youtube.com/legitimoose">
            <img src="/svg/youtube.svg" alt="Legitimoose's Youtube" />
        </a>
        <a href="https://bsky.app/profile/legitimoose.net">
            <img src="/svg/bsky.svg" alt="LegitiDevs BlueSky" />
        </a>
    </div>
</div>

<style>
    .navbar {
        display: flex;
        flex-wrap: wrap;
        margin: 0;
        background-color: light-dark(
            var(--secondary-light),
            var(--secondary-dark)
        );
        color: light-dark(var(--text-main-light), -var(-text-main-dark));

        div {
            display: flex;
            align-items: center;
            margin: 0;
            margin-block: 5px;
        }

        .left {
            display: flex;
            flex-direction: row;
            gap: 40px;
            margin-left: 20px;
        }

        a,
        a:visited,
        a:active {
            color: light-dark(var(--text-main-light), var(--text-main-dark));
            text-decoration: none;
        }

        a > img {
            height: auto;
            width: 50px;
            border-radius: 5px;
        }
    }

    .small-navbar {
        display: flex;
        position: fixed;
        flex-wrap: wrap;
        margin: 0;
        padding-block: 10px;
        padding-inline: 20px;
        border-radius: 0px 0px 20px 0px;
        background-color: light-dark(
            var(--secondary-light),
            var(--secondary-dark)
        );
        color: light-dark(var(--text-main-light), -var(-text-main-dark));

        div {
            display: flex;
            align-items: center;
            margin: 0;
            margin-block: 5px;
        }

        .left {
            display: flex;
            flex-direction: row;
            gap: 40px;
        }

        a,
        a:visited,
        a:active {
            color: light-dark(var(--text-main-light), var(--text-main-dark));
            text-decoration: none;
        }

        a > img {
            height: auto;
            width: 50px;
            border-radius: 5px;
        }
    }

    .footer-container {
        display: flex;
        flex-direction: column;
        background-color: light-dark(
            var(--tertiary-light),
            var(--tertiary-dark)
        );
        color: var(--text-main-dark);
        min-height: 30vmin;
        padding: 25px 25px 50px 25px;

        p {
            margin-bottom: 0;
        }

        a,
        a:visited,
        a:active {
            color: var(--text-main-dark);
            margin-top: 30px;
            text-decoration: none;
        }

        .links-container {
            display: flex;
            flex-wrap: wrap;
            align-items: center;

            > * {
                margin-right: 30px;
            }
        }

        .links-container > a > img {
            height: auto;
            width: 50px;
        }
    }
</style>
