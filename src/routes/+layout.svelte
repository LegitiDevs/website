<script>
	import { page } from '$app/stores';
	import { afterNavigate } from "$app/navigation";
	import { lastPageURL, currentPageURL, alerts } from "$lib/stores.js";
	import { onMount } from 'svelte';
	import SITE_CONFIG from "$lib/config.json";
	import Dropdown from '$lib/components/Dropdown.svelte';
	import '$lib/global_style.css'
	import { rehyphenateUUID } from '$lib/utils.js';
	import { fly } from 'svelte/transition';

  	onMount(async () => {
  	  	await import('$lib/minecraft-text')
  	})

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
	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2384425323311779" crossorigin="anonymous"></script>
</svelte:head>

{#if isError || $page.data?.page?.navbar === "small"}
	<div class="small-navbar">
		<div class="left">
			<a href="/" data-sveltekit-reload={isError}>
				<img src="/img/legitimoose-api-mark.png" alt="Legitimoose API Mark" />
			</a>
			<a href="/" data-sveltekit-reload={isError}>Home</a>
		</div>
	</div>
{:else}
	<div class="navbar">
		<div class="left">
			<a href="/">
				<img src="/img/legitimoose-api-mark.png" alt="Legitimoose API Mark" />
			</a>
			<a href="/">Home</a>
			<a href="/api">API</a>
			<a href="/browse">World Browser</a>
			<a href="/stats">Stats</a>
			<a href="/status">Status</a>
			<a href="/team">Meet The Team</a>
			<a href="/donate">Donate</a>
		</div>
		<div class="right">
			{#if !data.cookies.profile}
				<a href="/api/profile/login">Log in</a>
			{:else}
				<div class="profile-dropdown">
					<Dropdown img={`https://mc-heads.net/head/${data.cookies.profile.uuid}/left`} options={[
						{
							label: "My Profile",
							link: `/profile/${data.cookies.profile.uuid}`
						},
						{
							label: "Log out",
							reload: true,
							link: `/api/profile/logout`
						}
					]} />
				</div>
			{/if}
		</div>
	</div>
{/if}

{@render children()}

<div class="alerts-container">
	{#each $alerts as alert}
		<p class={["alert", alert.level]} transition:fly={{y:-10}}>{alert.message}</p>
	{/each}
</div>

<div class="footer-container">
	<p>This is not an official Moose project and is made by the community.</p>
	<p>We have no affiliation with any real-world brands.</p>
	<p>Not affiliated with Mojang AB or Partners</p>
	<div class="links-container">
		<a href="https://store.skyenet.co.in">API Hosted by SkyeNetwork</a>
		<a href="https://github.com/LegitiDevs/">
			<img src="/svg/github-mark-white.svg" alt="Github Logo" />
		</a>
		<a href="https://discord.gg/FQUmnbgV5S">
			<img src="/svg/discord-mark-white.svg" alt="Discord Logo" />
		</a>
		<a href="https://store.legitimoose.com">store.legitimoose.com</a>
		<a href="/donate">
			<img src="/svg/heart.svg" alt="Support Legitimoose!" />
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
		background-color: light-dark(var(--secondary-light), var(--secondary-dark));
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

		.right {
			display: flex;
			flex-grow: 1;
			margin-right: 20px;
			justify-content: end;

			.profile-dropdown {
				max-width: 50px;
			}
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
		background-color: light-dark(var(--secondary-light), var(--secondary-dark));
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

	.alerts-container {
		position: fixed;
		top: 10vh;
		left: 50%;
		translate: -50%;
		display: flex;
		flex-direction: column;
		gap: 10px;

		> p {
			padding-block: 5px;
			padding-inline: 10px;
			border-radius: 10px;
			color: var(--text-main-light);
			margin: 0;

			&.info {
				background-color: #61a8f8;
				box-shadow: 0px 3px #4056e2;
			}

        	&.success {
        	    background-color: #70ff44;
				box-shadow: 0px 3px #1eaf2f;
        	}

        	&.error {
        	    background-color: #ff4444;
				box-shadow: 0px 3px #bb2222;
        	}

        	&.warning {
        	    background-color: #fdce34;
				box-shadow: 0px 3px #f2882a;
        	}
		}
	}

	.footer-container {
		display: flex;
		flex-direction: column;
		background-color: light-dark(var(--tertiary-light), var(--tertiary-dark));
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
