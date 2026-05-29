<svelte:head>
  <script async src="https://js.stripe.com/v3/buy-button.js"></script>
</svelte:head> 

<div class="main-container">
  <div class="title-container">
    <h1>Donate</h1>
  </div>
  <div class="line"></div>
  <div class="body-container">
    <div class="left">
      <div class="content-container">
        <p>All of our projects (including this website) cost money to run & invest time in. You can help make it possible for us to host more things (maybe even outside Legitimoose)</p>
        <div class="line"></div>
        <p>Your <b>donations help us keep our API, website, and other services running smooth</b> without crashes, or downtime.</p>
        <div class="line"></div>
        <p>If you can donate, please do. Every contribution counts, whatever the size.</p>
        <div class="line"></div>
      </div>
    </div>
    <div class="right">
      <stripe-buy-button
        buy-button-id="buy_btn_1SAw0pLRpHOhXNRWdM0q4Fvu"
        publishable-key="pk_live_51RGrIELRpHOhXNRWOMvF04pYYklQD1obIUTyjB3wrwz1ug1MpTPD6zK8ZhClXTcVb1RXj6N0Ygqd5g955Cem25jz00ua8bNTSA"
      >
      </stripe-buy-button>
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
    background-image: linear-gradient(to bottom, rgb(43, 43, 43) 80%, rgba(0, 0, 0, 0));
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
      width: 100%
    }

    .right {
      display: flex;
      align-items: center;
      margin-left: 10%;
      width: 30%;
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
