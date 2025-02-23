<script>
    const { img, options } = $props();
    let isOpen = $state(false);
</script>

<div class="dropdown">
    <button onclick={() => { isOpen = !isOpen }}>
        <img src={img} alt="Dropdown Icon">
    </button>
    {#if isOpen}
        <div class="options">
            {#each options as option}
                <a href={option.link} data-sveltekit-reload={option?.reload}>{option.label}</a>
            {/each}
        </div>
    {/if}
</div>

<style>
    button {
        border: none;
        outline: none;
        background: none;
        margin: 0;
        padding: 0;
    }

    img {
        height: auto;
        width: 100%;
    }

    .dropdown {
        position: relative;
    }

    .options {
        position: absolute;
        right: 0;
        display: flex;
        outline: var(--accent) 1px solid;
        padding-block: 10px;
        padding-inline: 15px;
        background-color: light-dark(var(--secondary-light), var(--secondary-dark));
        border-radius: 5px;
        min-width: 100px;
        flex-direction: column;
        align-items: end;
    }
</style>