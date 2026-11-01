(function () {
  let kudosBtns = []
    , KUDOS_MIN_INTERVAL = 1000 // min interval in milliseconds
    , KUDOS_MAX_INTERVAL = 4000 // max interval in milliseconds
    , KUDOS_LOCKOUT = 100
    , KUDOS_STREAK_LENGTH = 12 // after this many kudos, take a longer pause
    , LONG_PAUSE_MIN = 4000 // min long pause in milliseconds
    , LONG_PAUSE_MAX = 10000 // max long pause in milliseconds
    , SKIP_KUDOS_CHANCE = 0.05 // 5% chance to skip a kudos
    , kudosGiven = 0 // counter for kudos given in current session
    , btn
    , panel
    , viewingAthleteId
    , els = '[data-testid=\'unfilled_kudos\']';

  // Helper function to get a random number between min and max
  const getRandomInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  // Helper function to determine if we should skip a kudos
  const shouldSkipKudos = () => {
    return Math.random() < SKIP_KUDOS_CHANCE;
  };

  // Helper function to determine if we should take a longer pause
  const shouldTakeLongPause = () => {
    return kudosGiven > 0 && kudosGiven % KUDOS_STREAK_LENGTH === 0;
  };

  const init = () => {
    const styles = document.createElement('style');
    styles.innerHTML = `
      #stravaKudosPanel {
        position: fixed;
        top: 70px;
        left: 15px;
        z-index: 49;
        font-family: 'Roboto', sans-serif;
      }

      #stravaKudosPanel.hidden {
        display: none !important;
        visibility: hidden !important;
      }

      #stravaKudos {
        display: flex;
        flex-direction: column;
        width: 100%;
        font-size: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
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

      #stravaKudosFeedback {
        margin-top: 6px;
        padding: 8px 12px;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        background: white;
        color: #444;
        font-size: 12px;
        line-height: 1.5;
        text-align: center;
      }

      #stravaKudosReview {
        display: block;
        color: #b33a00;
        font-weight: 600;
        text-decoration: underline;
      }

      #stravaKudosReview:hover {
        color: #812a00;
      }

      #stravaKudosReview:focus-visible {
        outline: 2px solid #b33a00;
        outline-offset: 2px;
        border-radius: 2px;
      }
    `;
    document.head.prepend(styles);

    panel = document.createElement('div');
    panel.id = 'stravaKudosPanel';
    panel.className = 'hidden';

    btn = document.createElement('button');
    btn.id = 'stravaKudos';
    btn.type = 'button';
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

    const feedback = document.createElement('div');
    feedback.id = 'stravaKudosFeedback';
    feedback.textContent = 'Enjoying Strava Kudos Plus? Share your feedback.';

    const reviewLink = document.createElement('a');
    reviewLink.id = 'stravaKudosReview';
    reviewLink.href = 'https://chromewebstore.google.com/detail/strava-kudos-plus/bpdnpccpbmdpdhfnnnfnokbaijbbcadm';
    reviewLink.target = '_blank';
    reviewLink.rel = 'noopener noreferrer';
    reviewLink.textContent = 'Leave a review on Chrome Web Store';
    reviewLink.setAttribute('aria-label', 'Leave a review on Chrome Web Store (opens in a new tab)');
    feedback.append(reviewLink);

    btn.addEventListener('click', startGivingKudos);
    panel.append(btn, feedback);
    document.body.prepend(panel);
    updateCountNum();
  };

  const mockFillKudo = btn => {
    btn.setAttribute('fill', '#FC5200');
    btn.dataset.testid = 'filled_kudos';
  };

  // Start the process of giving kudos
  const startGivingKudos = () => {
    kudosGiven = 0; // Reset the counter when starting a new session
    giveKudos();
  };

  // Close any open kudos modal/popup
  const handleKudosModal = () => {
    const closeBtn = document.querySelector('[data-testid="modal-close-button"]');
    if (closeBtn) {
      closeBtn.click();
    }
  };

  // Click the kudos button safely, handling group activity modals
  const clickKudoButton = (kudoBtn) => {
    kudoBtn.parentNode.click();

    // After a short delay, check if a modal opened (group activity behavior)
    setTimeout(() => {
      handleKudosModal();
    }, 300);

    // Always mark button as filled to prevent re-clicking in case Strava doesn't update the DOM
    mockFillKudo(kudoBtn);
  };

  // give kudos with more human-like behavior
  const giveKudos = () => {
    // Generate random delay for this kudos operation
    const delay = getRandomInterval(KUDOS_MIN_INTERVAL, KUDOS_MAX_INTERVAL);

    // We'll put everything in a setTimeout to ensure the delay happens BEFORE each action
    setTimeout(() => {
      const eligibleButtons = getEligibleKudoButtons();
      const kudoBtn = eligibleButtons?.[0];

      if (!kudoBtn) {
        console.log('No more kudos to give');
        return; // No more kudos to give
      }

      // Make sure we have a valid button with a parent before continuing
      if (!kudoBtn.parentNode) {
        console.log('Found a kudos button with no valid parent, skipping');
        giveKudos();
        return;
      }

      // Determine if we should skip this kudos
      if (shouldSkipKudos()) {
        console.log('Randomly skipping a kudos to appear more human-like');
        kudosGiven++; // Still count it as processed
        mockFillKudo(kudoBtn); // Mark as processed so we don't revisit

        // Move to the next kudos
        giveKudos();
        return;
      }

      // Determine if we should take a longer pause after a streak
      if (shouldTakeLongPause()) {
        const pauseTime = getRandomInterval(LONG_PAUSE_MIN, LONG_PAUSE_MAX);
        console.log(`Taking a longer pause (${pauseTime}ms) after ${KUDOS_STREAK_LENGTH} kudos`);

        setTimeout(() => {
          try {
            clickKudoButton(kudoBtn);
            kudosGiven++;
          } catch (error) {
            console.log('Error clicking button after pause, continuing to next');
            mockFillKudo(kudoBtn); // Mark as processed to avoid infinite loop
          }

          // Move to the next kudos
          giveKudos();
        }, pauseTime);

        return;
      }

      // Standard case: give kudos
      try {
        clickKudoButton(kudoBtn);
        kudosGiven++;
      } catch (error) {
        console.log('Error clicking button, continuing to next');
        mockFillKudo(kudoBtn); // Mark as processed to avoid infinite loop
      }

      // Move to the next kudos (which will have its own delay)
      giveKudos();
    }, delay);
  };

  // toggle box styles
  const toggleKudosBox = () => {
    const num = kudosBtns.length;
    if (num) {
      panel.classList.remove('hidden');
      btn.classList.remove('hidden');

      if (num < KUDOS_LOCKOUT) {
        btn.classList.add('lockout');
      } else {
        btn.classList.remove('lockout');
      }
    } else {
      panel.classList.add('hidden');
      btn.classList.add('hidden');
    }
  };

  const getEligibleKudoButtons = () => {
    const activityAvatars = document.querySelectorAll('[data-testid="owner-avatar"]');
    const buttons = [];

    for (const avatar of activityAvatars) {
      // activity card is not your own
      if (avatar && avatar.href && viewingAthleteId &&
          avatar.href.match(/\/athletes\/(\d+)(?:\/|[?#]|$)/)?.[1] !== viewingAthleteId) {
        // Skip group activities (child entries) to avoid triggering kudos modal popup
        if (avatar.closest('[class*="--child-entry"]')) {
          continue;
        }

        const activityCard = avatar.closest('[data-testid="web-feed-entry"]');

        if (activityCard && activityCard.querySelector(els)) {
          buttons.push(activityCard.querySelector(els));
        }
      }
    }

    return buttons;
  };

  // publish number of kudos
  const updateCountNum = () => {
    const count = document.getElementById('stravaKudosCount');

    if (count) {
      const refresh = () => {
        const profile = document.querySelector('a#athlete-menu[href*="/athletes/"]') ||
          document.querySelector('.user-menu > a');
        viewingAthleteId = profile?.href?.match(/\/athletes\/(\d+)(?:\/|[?#]|$)/)?.[1];
        kudosBtns = getEligibleKudoButtons();
        count.innerHTML = kudosBtns.length;
        toggleKudosBox();
        if (!viewingAthleteId) {
          btn.title = 'Waiting for your Strava profile. If this persists, reload the page and check extension access to Strava.';
        } else {
          btn.removeAttribute('title');
        }
      };
      refresh();
      setInterval(refresh, 1000); // Keep this interval at 1 second for UI updates
    }
  };

  init();
}());