<svelte:head>
    <meta property="og:type" content="website"/>
    <meta property="og:title" content=""/>
    <meta property="og:description" content="See uptime info here."/>
    <meta property="og:image" content="/img/legitimoose-api-mark.png">
</svelte:head>

<script>
    import { onMount } from "svelte";
    import Error from "../+error.svelte";
    var APIisOk = true
    onMount (() => {
        const res = fetch("https://api.legitimoose.net")
        try {
            if (res.status >= 400) { Error("omg we screw up") }
        } catch {
            APIisOk = false
        }
        

        if (APIisOk) {
            document.getElementById("api").innerHTML = "API: 🟢 On";
        } else {
            document.getElementById("api").innerHTML = "API: 🔴 Off";
        }
    })

    

</script>


<style>
    .main-container {
        display: flex;
        flex-direction: column;
        background-color: light-dark(var(--main-light), var(--main-dark));
        align-items: center;
        height: 100vmin;
    }

    h1 {
        font-size: 3rem; 
    }

    h2 {
        font-size: 2rem;
    }
</style>
<div class="main-container">
    <h1>Bot & API Status</h1>
    <h2 id="api">API: Fetching...</h2>
    <h2 id="bot">Bot: Soon™</h2>
</div>