<div class="main-container">
  <div class="title-container">
    <h1>Donate</h1>
  </div>
  <div class="line"></div>
  <div class="body-container">
    <div class="left">
      <div class="content-container">
        <p>This site runs on a VPS supplied by SkyeNet paid for by donations and advertisements.</p>
        <div class="line"></div>
        <p>Your <b>donations help us keep our API, website, and other services running smooth</b> without crashes, or downtime.</p>
        <div class="line"></div>
        <p>If you can donate, please do. Every contribution counts, whatever the size.</p>
        <div class="line"></div>
        <p class="secondary-stuff">Also, you might be able to get a rank on Skye Network!</p>
        <div class="line"></div>
        <p>Please use this template when donating:</p>
        <blockquote>
        [Your Message]<br>
        <br>
        Legitidevs<br>
        [Your Discord Username]<br>
        </blockquote>
      </div>
    </div>
    <div class="right">
      <a href="https://paypal.me/skyenetworkmc" target="_blank" class="donate-button">
        Donate here!
      </a>
    </div>
  </div>
</div>

<style>
  .main-container {
    display: flex;
    flex-direction: column;
    background-image: url('/img/lobby.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    min-height: 100vmin;
    max-width: 100vw;
    align-items: center;
  }

  .title-container {
    display: flex;
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 80%, rgba(0, 0, 0, 0));
    width: 100%;
    height: 200px;
    align-items: center;
    justify-content: center;
  }

  .body-container {
    display: flex;
    flex-direction: row;

    .left {
      display: flex;
      flex-direction: column;
      align-items: center; 
      width: 70%
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 30%;
    }
  }

  .donate-button {
    position: fixed;
    background-color: transparent;
    outline: 5px solid white;
    backdrop-filter: blur(10px);
    padding: 20px;
    padding-inline: 20px;
    padding-top: 5px;
    font-size: 3em;
    font-family: 'MinecraftDefault';
    font-weight: bold;
    text-decoration: none;
    color: white;
    top: 50%;
    transform: translateY(-50%);
    transition: all 0.2s ease;

    &:hover {
      scale: 1.1;
      background-color: white;
      outline: 5px solid var(--accent);
      color: var(--accent);
      backdrop-filter: none;
    }
  }

  .secondary-stuff {
    font-size: 0.6em;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    background-color: rgba(0,0,0,0.8);
    margin: 20px;
    backdrop-filter: blur(10px);
    font-size: 2em;
    text-align: left;
    padding: 20px;
  }

  p {
    margin: 5px 0;
    font-size: 1em;
  }
</style>
