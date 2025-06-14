<script>
	import SITE_CONFIG from "$lib/config.json";
	import { PUBLIC_API_ROOT } from '$env/static/public'
	import { codeToHtml } from "shiki";

	let inputValue = $state("");
	let result = $state("");
	let fetching = $state(false);

	async function fetchData() {
		try {
			const response = await fetch(`${PUBLIC_API_ROOT}${inputValue}`);
			const json = await response.json();
			fetching = true;
			result = await codeToHtml(JSON.stringify(json, null, 2), {
				lang: "json",
				theme: "dark-plus",
			});
			fetching = false;
		} catch (err) {
			result = `There was an error while trying to call '${PUBLIC_API_ROOT}${inputValue}':\\n  ${err}`;
		}
	}
</script>

<svelte:head>
	<meta property="og:type" content="website" />
	<meta property="og:title" content="API Usage & Docs" />
	<meta
		property="og:description"
		content="Find out how to use the LegitimooseAPI here."
	/>
	<meta property="og:image" content="/img/legitimoose-api-mark.png" />
</svelte:head>

<div class="main-container">
	<h1>API Usage & Docs</h1>
	<p>
		This page will guide you on how to properly use the API and what data it
		provides you.
	</p>

	<div class="line"></div>
	<div class="section">
		<h2>
			<a id="fetching-the-api" href="#fetching-the-api">Fetching the API</a>
		</h2>
		<div class="text-block">
			<p>
				The API currently has six endpoints:
				<code>{`/world/<world_uuid>`}</code>,
				<code>{`/world/random`}</code>,
				<code>{`/page/<index>`}</code>,
				<code>{`/top/<number>`}</code>,
				<code>{`/owner/<player_uuid>`}</code>,
				<code>{`/search/<query>`}</code>, and <code>/all</code>
			</p>
		</div>

		<div class="text-block">
			<p>
				<code>{`/world/<world_uuid>`}</code> retrieves the data for the world with the
				specified UUID.
			</p>
			<p>
				<code>{`/world/random`}</code> retrieves the data for a random world
			</p>
			<p>
				<code>{`/page/<index>`}</code> retrieves the data for the 27 worlds in the
				specified page index. (Imagine a chest with 27 items)
			</p>
			<p>
				<code>{`/top/<number>`}</code> retrieves the data for the top
				<code>&lt;number&gt;</code> worlds.
			</p>
			<p>
				<code>{`/search/<query>`}</code> retrieves the data for the worlds that their
				name closely matches the query.
			</p>
			<p>
				<code>/top/0</code> retrieves the data for all worlds, sorted from the top-ranked
				to the lowest-ranked.
			</p>
			<p>
				<code>{`/owner/<player_uuid>`}</code> retrieves the data for each world made by the specified owner.
			</p>
			<p>
				<code>/all</code> retrieves the data for all worlds, sorted by the most recently
				updated.
			</p>
		</div>

		<div class="text-block">
			<p>
				There are also 2 optional arguments for the <code>/all</code>,
				<code>{`/search/<query>`}</code>, <code>{`/page/<index>`}</code>, and <code>{`/owner/<player_uuid>`}</code> endpoints.
			</p>
			<br>
			<p>These are:</p>
			<p>
				<code>{`?sort`}</code> - Sorts the world list depending on the value given.
			</p>
			<p>
				Options:
				<code>default|votes|visits|recently_scraped|recently_created</code>.
				Defaults to <code>default</code> (Online worlds, then player count, then
				votes)
			</p>
			<br />
			<p>
				<code>{`?sortDirection`}</code> - Sorts the direction of the world list depending
				on the value given.
			</p>
			<p>
				Options: <code>ascending|descending</code>.
			</p>
			<p>
				Defaults to <code>ascending</code>
			</p>
		</div>

		<div class="text-block">
			<p>
				You can use <code>{PUBLIC_API_ROOT}</code> to call the API
			</p>
		</div>

		<div class="text-block">
			<p>Demo:</p>
			<div class="demo-container">
				<div class="input-field">
					<input
						type="text"
						id="demo-input"
						placeholder="/world/uuid or etc..."
						bind:value={inputValue}
					/>
					<button id="demo-fetch" onclick={fetchData}>Fetch!</button>
				</div>
				<div class="code-container">
					<code id="demo-result" class="language-js code-block">
						{#if fetching}
							Fetching...
						{:else}
							{@html result}
						{/if}
						{#if !result}
							Waiting for input...
						{/if}
					</code>
				</div>
			</div>
		</div>
	</div>

	<div class="line"></div>
	<div class="section">
		<h2>
			<a id="reading-the-data" href="#reading-the-data">Reading the data</a>
		</h2>
		<div class="text-block">
			<p>
				The data is structured differently depending on what endpoint you
				called, but the world data will always stay the same structure.
			</p>
		</div>

		<div class="text-block">
			<p>
				Calling <code>/world/&lt;uuid&gt;</code> returns a single object containing
				the world's data, while calling any of the other three will return an array
				of worlds.
			</p>
		</div>

		<div class="text-block">
			<p>Each world is structured like this:</p>
			<div class="code-container">
				<code class="language-js code-block">
					{#await codeToHtml( `
	{
		"world_uuid": "3253a682-3a74-413d-8917-0edd92a792db",
		"name": "BLOCKS 'N PROPS v2",
		"description": "Chicken Volleyball out now!",
		"raw_name": "{\\"text\\":\\"\\",\\"extra\\":[{\\"text\\":\\"B\\",\\"color\\":\\"#00FBFF\\"},{\\"text\\":\\"L\\",\\"color\\":\\"#0CF8FC\\"},{\\"text\\":\\"O\\",\\"color\\":\\"#18F5F9\\"},{\\"text\\":\\"C\\",\\"color\\":\\"#24F3F6\\"},{\\"text\\":\\"K\\",\\"color\\":\\"#30F0F3\\"},{\\"text\\":\\"S\\",\\"color\\":\\"#3CEDF0\\"},{\\"text\\":\\" \\",\\"color\\":\\"#48EAED\\"},{\\"text\\":\\"'\\",\\"color\\":\\"#54E8EA\\"},{\\"text\\":\\"N\\",\\"color\\":\\"#60E5E7\\"},{\\"text\\":\\" \\",\\"color\\":\\"#6CE2E4\\"},{\\"text\\":\\"P\\",\\"color\\":\\"#78DFE1\\"},{\\"text\\":\\"R\\",\\"color\\":\\"#84DDDE\\"},{\\"text\\":\\"O\\",\\"color\\":\\"#90DADB\\"},{\\"text\\":\\"P\\",\\"color\\":\\"#9CD7D8\\"},{\\"text\\":\\"S\\",\\"color\\":\\"#A8D4D5\\"},{\\"text\\":\\" \\",\\"color\\":\\"#B4D2D2\\"},{\\"text\\":\\"v\\",\\"color\\":\\"#C0CFCF\\"},{\\"text\\":\\"2\\",\\"color\\":\\"#CCCCCC\\"}],\\"italic\\":false,\\"bold\\":true}",
		"raw_description": "{\\"text\\":\\"\\",\\"extra\\":[{\\"text\\":\\"Chicken Volleyball\\",\\"color\\":\\"green\\"},\\" out now!\\"],\\"italic\\":false,\\"color\\":\\"gray\\"}",
		"icon": "minecraft:recovery_compass",
		"votes": 353,
		"visits": 3889,
		"owner_uuid": "79ffd566-c9db-4159-8bd6-97c18ffd3c66",
		"player_count": 0,
		"creation_date": "Dec 24, 2023, 10:26 AM",
		"creation_date_unix_seconds": "	1703384760",
		"resource_pack_url": "https://download.mc-packs.net/pack/2e9d8315ec8df8bd81dc5a924deb5ff26b402cb0.zip",
		"locked": false,
		"version": "1.21.1",
		"enforce_whitelist": false,
		"whitelist_on_version_change": false,
		"last_scraped": 1734160015,
	}
					`, { lang: "json", theme: "dark-plus" } )}
						Higlighting syntax...
					{:then code}
						{@html code}
					{/await}
				</code>
			</div>
			<ul>
				<li><p><code>"world_uuid"</code> - The world's UUID.</p></li>
				<li><p><code>"name"</code> - The world's name in plaintext.</p></li>
				<li>
					<p>
						<code>"description"</code> - The world's description in plaintext.
					</p>
				</li>
				<li>
					<p>
						<code>"raw_name"</code> - The world's name in Raw JSON Text Component
						format, preserving styling.
					</p>
				</li>
				<li>
					<p>
						<code>"raw_description"</code> - The world's description in Raw JSON
						Text Component format, preserving styling.
					</p>
				</li>
				<li>
					<p>
						<code>"icon"</code> - The world's item icon in item ID form, including
						the namespace.
					</p>
				</li>
				<li><p><code>"votes"</code> - The world's vote count.</p></li>
				<li><p><code>"visits"</code> - The world's visit count.</p></li>
				<li>
					<p>
						<code>"player_count"</code> - The current player count in the world.
					</p>
				</li>
				<li>
					<p><code>"owner_uuid"</code> - The UUID of the world's owner.</p>
				</li>
				<li>
					<p>
						<code>"creation_date"</code> - The creation date of the world as a string
						(PST timezone)
					</p>
				</li>
				<li>
					<p>
						<code>"creation_date_unix_seconds"</code> - The creation date of the
						world in UNIX seconds
					</p>
				</li>
				<li>
					<p>
						<code>"resource_pack_url"</code> - The download URL for the world's
						resource pack from <code>https://mc-packs.net/</code>. An empty
						string if the world has no resource pack.
					</p>
				</li>
				<li>
					<p>
						<code>"version"</code> - The world's version (for warning purposes only;
						does not affect the actual version).
					</p>
				</li>
				<li>
					<p>
						<code>"locked"</code> - Indicates whether the world is online and running.
					</p>
				</li>
				<li>
					<p>
						<code>"enforce_whitelist"</code> - Indicates whether the world has a
						whitelist enforced.
					</p>
				</li>
				<li>
					<p>
						<code>"whitelist_on_version_change"</code> - Indicates whether the whitelist-on-version-change
						setting is enabled.
					</p>
				</li>
				<li>
					<p>
						<code>"last_scraped"</code> - The unix timestamp of the world's last
						scrape by our bot.
					</p>
				</li>
			</ul>
		</div>
	</div>
</div>

<style>
	.main-container {
		display: flex;
		flex-direction: column;
		background-color: light-dark(var(--main-light), var(--main-dark));
		min-height: 100vmin;
		align-items: center;
		padding: 20px;

		div.section {
			display: flex;
			flex-direction: column;
			width: 100%;
			max-width: 600px;
			margin-block: 5px;
		}

		div.text-block {
			max-width: 100%;
			margin-block: 30px;

			p {
				margin: 0;
			}
		}

		div.demo-container {
			display: flex;
			flex-direction: column;

			div.input-field {
				width: 100%;
			}

			#demo-input,
			#demo-fetch {
				all: unset;
				color: black;
				background-color: #e8f0fe;
				padding-block: 10px;
				padding-inline: 15px;
				outline: var(--accent) 2px solid;
				border-radius: 2px;
			}

			#demo-input::placeholder {
				color: rgb(100, 100, 100);
			}
		}
	}

	.code-container {
		display: flex;
	}
</style>
