(function () {
  let kudosBtns = []
    , KUDOS_INTERVAL = 1000 // in millisecondi
    , KUDOS_LOCKOUT = 100
    , btn
    , viewingAthleteId
    , els = '[data-testid=\'unfilled_kudos\']';

  const init = () => {
    const styles = document.createElement('style');
    styles.innerHTML = `
      #stravaKudos {
        display: flex;
        flex-direction: column;
        left: 15px;
        font-size: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        z-index: 49;
        position: fixed;
        top: 70px;
        background: linear-gradient(135deg, #FC5200, #FF7D4D);
        color: white;
        border: none;
        padding: 10px 15px;
        transition: all 0.3s ease;
        font-family: 'Roboto', sans-serif;
        cursor: pointer;
        overflow: hidden;
      }

      #stravaKudos:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(252, 82, 0, 0.2);
      }

      #stravaKudos:active {
        transform: translateY(1px);
      }

      #stravaKudos div {
        margin: 0 auto;
        font-weight: 600;
        display: flex;
        align-items: center;
      }

      #stravaKudos p {
        margin: 5px 0 0;
        font-size: 12px;
        opacity: 0.9;
        text-align: center;
      }

      #stravaKudos.hidden,
      #stravaKudos.lockout p {
        display: none !important;
        visibility: hidden !important;
      }

      #stravaKudosCount {
        margin: 0 5px;
        font-weight: bold;
        background: rgba(255, 255, 255, 0.2);
        padding: 2px 6px;
        border-radius: 10px;
        min-width: 20px;
        text-align: center;
      }

      #kudosIcon {
        margin-right: 5px;
        width: 16px;
        height: 16px;
      }
    `;
    document.head.prepend(styles);

    btn = document.createElement('button');
    btn.id = 'stravaKudos';
    btn.innerHTML = `
      <div>
        <svg id="kudosIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        Give <span id="stravaKudosCount">0</span> Kudos
      </div>
      <p>Strava may throttle too many Kudos in one session</p>
    `;
    btn.className = 'hidden';

    btn.addEventListener('click', giveKudos);
    document.body.prepend(btn);
    updateCountNum();
  };

  const mockFillKudo = btn => {
    btn.setAttribute('fill', '#FC5200');
    btn.dataset.testid = 'filled_kudos';
  };

  // give ALL the kudos
  const giveKudos = () => {
    setTimeout(() => {
      const kudoBtn = getEligibleKudoButtons()?.[0];
      if (kudoBtn) {
        // mockFillKudo(kudoBtn); /* for testing purposes only */
        kudoBtn.parentNode.click();
        giveKudos();
      }
    }, KUDOS_INTERVAL);
  };

  // toggle box styles
  const toggleKudosBox = () => {
    const num = kudosBtns.length;
    if (num) {
      btn.classList.remove('hidden');

      if (num < KUDOS_LOCKOUT) {
        btn.classList.add('lockout');
      } else {
        btn.classList.remove('lockout');
      }
    } else {
      btn.classList.add('hidden');
    }
  };

  const getEligibleKudoButtons = () => {
    const activityAvatars = document.querySelectorAll('[data-testid="owner-avatar"]');
    const buttons = [];

    activityAvatars.forEach(avatar => {
      // activity card is not your own
      if (!avatar.href.includes(viewingAthleteId)) {
        const activityCard = avatar.closest('[class*="--child-entry"]') /* group activity */ ||
          avatar.closest('[data-testid="web-feed-entry"]') /* solo activity */;

        activityCard.querySelector(els) && buttons.push(activityCard.querySelector(els));
      }
    });

    return buttons;
  };

  // publish number of kudos
  const updateCountNum = () => {
    const count = document.getElementById('stravaKudosCount');
    viewingAthleteId = document.querySelector('.user-menu > a')?.href?.match(/\d+/)?.[0]; // store viewing athlete id

    if (count) {
      setInterval(() => {
        kudosBtns = getEligibleKudoButtons();
        count.innerHTML = kudosBtns.length;
        toggleKudosBox();
      }, KUDOS_INTERVAL);
    }
  };

  init();
}());