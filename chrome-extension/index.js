(function(){let a=[],b=1000,c=100,d,e,f='[data-testid=\'unfilled_kudos\']';var g=_=>{_.setAttribute('fill','#FC5200');_.dataset.testid='filled_kudos'},h=()=>setTimeout(()=>{const B=j()?.[0];B&&(B.parentNode.click(),h())},b),i=()=>{const C=a.length;if(C){d.classList.remove('hidden');C<c?d.classList.add('lockout'):d.classList.remove('lockout')}else d.classList.add('hidden')},j=()=>{const _a=document.querySelectorAll('[data-testid="owner-avatar"]'),_b=[];for(const D of _a)if(!D.href.includes(e)){const _A=D.closest('[class*="--child-entry"]')||D.closest('[data-testid="web-feed-entry"]');_A.querySelector(f)&&_b.push(_A.querySelector(f))}return _b},k=()=>{const E=document.getElementById('skCount');e=document.querySelector('.user-menu > a')?.href?.match(/\d+/)?.[0];E&&setInterval(()=>{a=j();E.innerHTML=a.length;i()},b)};(()=>{var A=document.createElement('style');A.innerHTML=`
      #stravaKudos {
        display: flex;
        flex-direction: column;
        left: 5px;
        font-size: 20px;
        box-shadow: 0 2px 1px rgba(0, 0, 0, 0.2);
        z-index: 49;
        position: fixed;
        top: 61px
      }

      #stravaKudos div {
        margin: 0 auto
      }

      #stravaKudos p {
        margin: 0;
        font-size: 14px
      }

      #stravaKudos.hidden,
      #stravaKudos.lockout p {
        display: none !important;
        visibility: hidden !important
      }

      #stravaKudosCount {
        margin: 0 3px;
        font-weight: bold
      }
    `;document.head.prepend(A);d=document.createElement('button');d.id='stravaKudos';d.innerHTML=`
      <div>Give <span id="skCount"></span> Kudos</div>
      <p>Strava may throttle too<br/>many Kudos in one session</p>
    `;d.className='btn btn-sm btn-primary hidden';d.addEventListener('click',h);document.body.prepend(d);k()})()}());
