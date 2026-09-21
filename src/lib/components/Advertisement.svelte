<script>
	import { fade } from "svelte/transition";
</script>

<div class="ad">
    <p class="title">Advertisement</p>
    <div class="substitute-ad-container" in:fade>
        <a class="substitute-ad" href="https://pyro.host/?ref=GEYS1ZIJ">
            <img src="/img/pyro_ad.png" alt="Use code GEYS1ZIJ on Pyro to support us on your first payment."/>
        </a>
    </div>
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
            margin-bottom: 10px;
            
            img {
                width: 100%;
                height: auto;
                margin: 0;
            }
        }
    } 
</style>