<script>
    import * as fs from "fs"
	import { onMount } from "svelte";
	import UptimeDisplay from "./UptimeDisplay.svelte";
	import { SITE_CONFIG } from "$lib/config";
	import Advertisement from "$lib/components/Advertisement.svelte";

    const { data } = $props();
    const scraperUptime = data.uptime.scraper_uptime
    let statusMessage = $state("Scraper is operational.")
    let statusMessageStatus = $state("good")

    if (scraperUptime[scraperUptime.length - 1]?.status ?? 0 == 1) { 
        statusMessage = "The scraper is having issues.";
        statusMessageStatus = "warning" 
    }
    if (scraperUptime[scraperUptime.length - 1]?.status ?? 0 == 2) { 
        statusMessage = "The scraper is down.";
        statusMessageStatus = "bad" 
    }
</script>

<div class="main-container">
    <div class="title-container">
        <img src="/img/legitimoose-api-logo.png" alt="Legitimoose API Logo">
    </div>
    <div class="uptime-container">
        <p class="status-message {statusMessageStatus}">{statusMessage}</p>
        <UptimeDisplay title="Scraper" description="Handles info gathering on the server, Discord2MC & MC2Discord chat, and the Discord Bot." uptime_data={scraperUptime}></UptimeDisplay>
    </div>
</div>

<style>
    .main-container {
        display: flex;
        flex-direction: column;
        gap: 20px;
		background-color: light-dark(var(--main-light), var(--main-dark));
		min-height: 100vmin;
        max-width: 100vw;
		align-items: center;
        padding-bottom: 20px;
    }

    .title-container {
        display: flex;
        background-color: light-dark(var(--secondary-light), var(--secondary-dark));
        width: 100%;
        height: 300px;
        align-items: center;
        justify-content: center;

        > img {
            height: auto;
            max-width: 50%;
        }
    }

    .status-message {
        color: var(--text-main-light);
        padding: 10px;
        width: 100%;
        &.good {
            background-color: #70ff44;
            box-shadow: 0px 5px #1eaf2f;
        }

        &.warning {
            background-color: #fdce34;
            box-shadow: 0px 5px #f2882a;
        }

        &.bad {
            background-color: #ff4444;
            box-shadow: 0px 5px #bb2222;
        }
    }

    .uptime-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        max-width: 60vw;
    }
</style>