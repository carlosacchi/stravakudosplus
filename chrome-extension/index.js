(function(){let a=[],b=1000,c=100,d,e,f='[data-testid=\'unfilled_kudos\']';var g=_=>{_.setAttribute('fill','#FC5200');_.dataset.testid='filled_kudos'},h=()=>setTimeout(()=>{const B=j()?.[0];B&&(B.parentNode.click(),h())},b),i=()=>{const C=a.length;if(C){d.classList.remove('hidden');C<c?d.classList.add('lockout'):d.classList.remove('lockout')}else d.classList.add('hidden')},j=()=>{const _a=document.querySelectorAll('[data-testid="owner-avatar"]'),_b=[];for(const D of _a)if(!D.href.includes(e)){const _A=D.closest('[class*="--child-entry"]')||D.closest('[data-testid="web-feed-entry"]');_A.querySelector(f)&&_b.push(_A.querySelector(f))}return _b},k=()=>{const E=document.getElementById('stravaKudosCount');e=document.querySelector('.user-menu > a')?.href?.match(/\d+/)?.[0];E&&setInterval(()=>{a=j();E.innerHTML=a.length;i()},b)};(()=>{var A=document.createElement('style');A.innerHTML=`
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
    `;document.head.prepend(A);d=document.createElement('button');d.id='stravaKudos';d.innerHTML=`
      <div>
        <svg id="kudosIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        Give <span id="stravaKudosCount">0</span> Kudos
      </div>
      <p>Strava may throttle too many Kudos in one session</p>
    `;d.className='hidden';d.addEventListener('click',h);document.body.prepend(d);k()})()}());
