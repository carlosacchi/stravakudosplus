(function(){let a=[],b=1000,c=4000,d=100,e=12,f=4000,g=10000,h=0.05,i=0,j,k,l,m='[data-testid=\'unfilled_kudos\']';var n=(min,max)=>~~Math.random()*(max-min+1)+min,o=()=>Math.random()<h,p=()=>i>0&&i%e===0,q=C=>{C.setAttribute('fill','#FC5200');C.dataset.testid='filled_kudos'},r=()=>{i=0;u()},s=()=>{const _a=document.querySelector('[data-testid="modal-close-button"]');_a?.click()},t=D=>{D.parentNode.click();setTimeout(()=>s(),300);q(D)},u=()=>{setTimeout(()=>{const _A=w(),_b=_A?.[0];if(!_b){console.log('No more kudos to give');return}if(!_b.parentNode){console.log('Found a kudos button with no valid parent, skipping');u();return}if(o()){console.log('Randomly skipping a kudos to appear more human-like');i++;q(_b);u();return}if(p()){const E=n(f,g);console.log(`Taking a longer pause (${E}ms) after ${e} kudos`);setTimeout(()=>{try{t(_b);i++}catch(aA){console.log('Error clicking button after pause, continuing to next');q(_b)}u()},E);return}try{t(_b);i++}catch(aB){console.log('Error clicking button, continuing to next');q(_b)}u()},n(b,c))},v=()=>{const aC=a.length;if(aC){k.classList.remove('hidden');j.classList.remove('hidden');aC<d?j.classList.add('lockout'):j.classList.remove('lockout')}else{k.classList.add('hidden');j.classList.add('hidden')}},w=()=>{const aD=document.querySelectorAll('[data-testid="owner-avatar"]'),_B=[];for(const aE of aD)if(aE?.href&&l&&aE.href.match(/\/athletes\/(\d+)(?:\/|[?#]|$)/)?.[1]!==l){if(aE.closest('[class*="--child-entry"]'))continue;const aF=aE.closest('[data-testid="web-feed-entry"]');aF?.querySelector(m)&&_B.push(aF.querySelector(m))}return _B},x=()=>{const aG=document.getElementById('stravaKudosCount');if(aG){const aH=()=>{const aI=document.querySelector('a#athlete-menu[href*="/athletes/"]')||document.querySelector('.user-menu > a');l=aI?.href?.match(/\/athletes\/(\d+)(?:\/|[?#]|$)/)?.[1];a=w();aG.innerHTML=a.length;v();!l?j.title='Waiting for your Strava profile. If this persists, reload the page and check extension access to Strava.':j.removeAttribute('title')};aH();setInterval(aH,1000)}};(()=>{var A=document.createElement('style'),B=document.createElement('a');A.innerHTML=`
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
    `;document.head.prepend(A);k=document.createElement('div');k.id='stravaKudosPanel';k.className='hidden';j=document.createElement('button');j.id='stravaKudos';j.type='button';j.innerHTML=`
      <div>
        <svg id="kudosIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        Give <span id="stravaKudosCount">0</span> Kudos
      </div>
      <p>Strava may throttle too many Kudos in one session</p>
    `;j.className='hidden';var _=document.createElement('div');_.id='stravaKudosFeedback';_.textContent='Enjoying Strava Kudos Plus? Share your feedback.';B.id='stravaKudosReview';B.href='https://chromewebstore.google.com/detail/strava-kudos-plus/bpdnpccpbmdpdhfnnnfnokbaijbbcadm';B.target='_blank';B.rel='noopener noreferrer';B.textContent='Leave a review on Chrome Web Store';B.setAttribute('aria-label','Leave a review on Chrome Web Store (opens in a new tab)');_.append(B);j.addEventListener('click',r);k.append(j,_);document.body.prepend(k);x()})()}());
