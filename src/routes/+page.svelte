<svelte:head>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content="LegitiDevs"/>
    <meta property="og:description" content="The legitimoose community website made by the LegitiDevs!"/>
    <meta property="og:image" content="/img/legitimoose-api-mark.png">
</svelte:head>

<div class="main-container">
    <div class="title-container">
        <img
            src="/img/legitimoose-api-logo.png"
            alt="Legitimoose API Logo"
        />
        <p>
            The unofficial API made by the community to get world data from the hit Minecraft server 'legitimoose.com'!
        </p>
    </div>
    <div class="button-container">
        <a href="/browse">World Browser -&gt;</a>
        <a href="/api">Usage & Docs -&gt;</a>
        <a href="https://legitimoose.miraheze.org">Legitimoose Wiki -&gt;</a>
        <a href="/donate">Donate -&gt;</a>
    </div>
</div>

<style>
    .main-container {
    display: flex;
    flex-direction: row;
    background-color: light-dark(var(--main-light), var(--main-dark));
    justify-content: center;
    align-items: center;
    height: 100vmin;

    @media screen and (max-width: 1060px){
        flex-direction: column;
    }

    > * {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-inline: 80px;
    }

    .title-container {
        text-align: center;

        > p {
            width: 500px;
        }

        > img {
            height: auto;
            width: 750px;
        }
        
        @media screen and (max-width: 1060px){
            > p {
                width: 80vw;
            }

            > img {
                height: auto;
                width: 80vw;
            }
        }
    }

    .button-container {
        display: flex;
        flex-direction: column;
        gap: 10px;

        > a, a:visited, a:active {
            width: 100%;
            text-align: center;
            text-decoration: none;
            background-color: var(--accent);
            color: var(--text-main-dark);
            padding-block: 5px;
            padding-inline: 15px;
            border: 5px solid var(--outline);
            border-radius: 10px;
            box-shadow: 0 5px rgb(0, 0, 0, 0.5);
        }
    }
}
</style>
