<script>
	import { fade } from "svelte/transition";

    let loadedStatus = $state(null);
    let loaded = $derived(loadedStatus === "filled");

    function observeAdStatusChange(node) {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.attributeName === 'data-ad-status') {
                    loadedStatus = node.getAttribute('data-ad-status');
                }
            }
        });

        observer.observe(node, { attributes: true });

        return {
          destroy() {
            observer.disconnect();
          }
        };
    }
</script>

<div class="ad">
    <p class="title">Advertisement</p>
    {#if loadedStatus === null || loadedStatus === "filled"}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2384425323311779"
             crossorigin="anonymous"></script>
        <!-- uwu-ad-uwu -->
        <ins class="adsbygoogle"
            use:observeAdStatusChange
            style="display:block"
            data-ad-client="ca-pub-2384425323311779"
            data-ad-slot="6967461504"
            data-ad-format="auto"
            data-full-width-responsive="true"
            out:fade={{duration:100}}
            ></ins>
        <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
        </script>
    {:else}
        <div class="substitute-ad-container" in:fade>
            <a class="substitute-ad" href="/donate">Donating helps us run LegitiDevs. Consider donating!</a>
        </div>
    {/if}
</div>

<style>
    .ad {
        display: flex;
        flex-direction: column;
        gap: 5px;
        padding: 10px;
        width: 320px;
        box-shadow: 0px 5px light-dark(#9FA0AD, #111113);
        background-color: light-dark(#f1f0f5, #2b2b2f);

        p, a {
            margin: 0;
        }
        
        > .title {
            text-align: center;
            font-size: 1.2em;
            color: light-dark(rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.5));
        }

        > .substitute-ad-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-inline: 10px;
            margin-bottom: 10px;
            > .substitute-ad {
                text-align: left;
                font-size: 1.3em;
                color: light-dark(var(--text-main-light), var(--text-main-dark));
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    } 
</style>