<script>
	import { onMount } from 'svelte';
  	import '$lib/global_style.css'
	import { page } from '$app/stores';

  	onMount(async () => {
  	  await import('$lib/minecraft-text')
  	})

	let { children } = $props();
	const isError = $page.status >= 400;

</script>

<svelte:head>
	{#if isError}
		<title>{$page.status} {$page.error.message} | LegitiDevs</title>
	{:else}
		<title>{$page.data?.page?.title ?? "Unknown"} | LegitiDevs</title>
	{/if}
</svelte:head>

<div class="navbar">
	<a href="/">
		<img src="/img/legitimoose-api-mark.png" alt="Legitimoose API Mark" />
	</a>
	<a href="/">Home</a>
	<a href="/api">API</a>
	<a href="/browse">World Browser</a>
	<a href="/stats">Stats</a>
	<a href="/status">Status</a>
</div>

{@render children()}

{#if !isError}
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
		
			<a href="https://youtube.com/legitimoose">
				<img src="/img/youtube.png" alt="Legitimoose's Youtube" />
			</a>
			<a href="https://bsky.app/profile/legitidevs.bsky.social">
				<img src="/svg/bsky.svg" alt="LegitiDev BlueSky" />
			</a>
		</div>
	</div>
{/if}

<style>
	.navbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		background-color: light-dark(var(--secondary-light), var(--secondary-dark));
		color: light-dark(var(--text-main-light), -var(-text-main-dark));

		:first-child {
			margin-left: 10px;
		}

		a,
		a:visited,
		a:active {
			color: light-dark(var(--text-main-light), var(--text-main-dark));
			margin-block: 10px;
			margin-left: 50px;
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
