<script>
	import Advertisement from "$lib/components/Advertisement.svelte";

  let users = [
    {
      pfp: '/img/pfps/trplnr.png',
      name: 'Trplnr',
      discord: '@trplnr',
      pronouns: '(he/him)',
      quote: 'im basically head of website, I HAVE TOO MANY SIDE PROJECTS HELP ME-'
    },
    {
      pfp: '/img/pfps/pilkey.png',
      name: 'PilkeySEK',
      discord: '@pilkeysek',
      pronouns: '(he/him)',
      quote: 'does stuff (sometimes)'
    },
    {
      pfp: '/img/pfps/omri.png',
      name: 'Omri',
      discord: '@omrih',
      pronouns: '(he/him)',
      quote: 'im gonna kill someone next time i have to configure nginx'
    },
    {
      pfp: '/img/pfps/hazel.png',
      name: 'Hazel',
      discord: '@xendyex',
      pronouns: '(she/her)',
      quote: "transed the gender too much i'm a female camera now (see pfp) (im at the bottom)"
    },
    {
      pfp: '/img/pfps/anjo.jpg',
      name: 'Anjo1920',
      discord: '@anjo1920_yt',
      pronouns: '(he/him)',
      quote: '*tf2 pyro speech*'
    },
    {
      pfp: '/img/pfps/nobleskye.png',
      name: 'NobleSkye',
      discord: '@prettyskye',
      pronouns: '(She/her)',
      quote: '*UwU... dont tell space.. >:3* - I also like host this...'
    },
    {
      pfp: '/img/pfps/spaceinvadder.png',
      name: 'Space',
      discord: '@spaceinvadeer ',
      pronouns: '(He/Him)',
      quote: '*u followed by w followed by u*'
    },

  ];
</script>

<div class="main-container">
  <div class="title-container">
    <h1>Meet the team!</h1>
  </div>
  <div class="users-container">
    {#each users as user}
      <div class="user-card">
        <img src={user.pfp} alt="{user.name}'s profile picture" class="pfp" />
        <h2>{user.name}</h2>
        <p>{user.discord} {user.pronouns}</p>
        <blockquote>{user.quote}</blockquote>
      </div>
    {/each}
  </div>
</div>

<style>
  .main-container {
    display: flex;
    flex-direction: column;
    background-color: light-dark(var(--main-light), var(--main-dark));
    min-height: 100vmin;
    max-width: 100vw;
    padding-bottom: 20px;
    align-items: center;
  }

  .title-container {
    display: flex;
    background-color: light-dark(var(--secondary-light), var(--secondary-dark));
    width: 100%;
    height: 300px;
    align-items: center;
    justify-content: center;
  }

  .users-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    padding: 20px;
    width: 80%;
  }

  .user-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 15px;
    background-color: light-dark(var(--card-light), var(--card-dark));
    border-radius: 10px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  }

  .pfp {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 10px;
  }

  h2 {
    margin: 5px 0;
    font-size: 1.2em;
  }

  p {
    margin: 5px 0;
    font-size: 1em;
  }

  blockquote {
    font-style: italic;
    color: var(--text-muted);
    margin-top: 10px;
  }
</style>
