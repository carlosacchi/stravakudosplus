(function(){let a=[],b=1000,c=4000,d=100,e=12,f=4000,g=10000,h=0.05,i=0,j=new Set,k,l,m='[data-testid=\'unfilled_kudos\']';var n=(min,max)=>~~Math.random()*(max-min+1)+min,o=()=>Math.random()<h,p=()=>i>0&&i%e===0,q=_=>{_.setAttribute('fill','#FC5200');_.dataset.testid='filled_kudos'},r=()=>{i=0;j.clear();s()},s=()=>{setTimeout(()=>{const B=u(),C=B?.[0],D=_c?.querySelector('[data-testid="owner-avatar"]'),E=_c?.dataset?.id||D?.href?.match(/\/(\d+)$/)?.[1]||D?.href||'';if(!C){console.log('No more kudos to give');return}if(!C.parentNode){console.log('Found a kudos button with no valid parent, skipping');s();return}const _c=C.closest('[class*="--child-entry"]')||C.closest('[data-testid="web-feed-entry"]');if(o()){console.log('Randomly skipping a kudos to appear more human-like');i++;s();return}if(p()){const _a=n(f,g);console.log(`Taking a longer pause (${_a}ms) after ${e} kudos`);setTimeout(()=>{try{C.parentNode.click();i++;E&&j.add(E)}catch(_A){console.log('Error clicking button after pause, continuing to next')}s()},_a);return}try{C.parentNode.click();i++;E&&j.add(E)}catch(aA){console.log('Error clicking button, continuing to next')}s()},n(b,c))},t=()=>{const aB=a.length;if(aB){k.classList.remove('hidden');aB<d?k.classList.add('lockout'):k.classList.remove('lockout')}else k.classList.add('hidden')},u=()=>{const aC=document.querySelectorAll('[data-testid="owner-avatar"]'),_b=[];for(const aD of aC)if(aD?.href&&l&&!aD.href.includes(l)){const aE=aD.closest('[class*="--child-entry"]')||aD.closest('[data-testid="web-feed-entry"]');if(aE?.querySelector(m)){if(j.has(aE.dataset.id||aD.href.match(/\/(\d+)$/)?.[1]||aD.href))continue;_b.push(aE.querySelector(m))}}return _b},v=()=>{const aF=document.getElementById('stravaKudosCount');l=document.querySelector('.user-menu > a')?.href?.match(/\d+/)?.[0];aF&&setInterval(()=>{a=u();aF.innerHTML=a.length;t()},1000)};(()=>{var A=document.createElement('style');A.innerHTML=`
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
    `;document.head.prepend(A);k=document.createElement('button');k.id='stravaKudos';k.innerHTML=`
      <div>
        <svg id="kudosIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        Give <span id="stravaKudosCount">0</span> Kudos
      </div>
      <p>Strava may throttle too many Kudos in one session</p>
    `;k.className='hidden';k.addEventListener('click',r);document.body.prepend(k);v()})()}());
