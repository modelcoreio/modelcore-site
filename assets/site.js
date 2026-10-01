/* ModelCore — shared behaviour. Every page works without this file; it only adds polish. */
(function(){
  'use strict';

  /* mobile nav */
  var toggle=document.querySelector('.nav-toggle'), links=document.getElementById('nav-links');
  if(toggle&&links){
    toggle.addEventListener('click',function(){
      var open=links.classList.toggle('open');
      toggle.setAttribute('aria-expanded',open?'true':'false');
    });
    document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&links.classList.contains('open')){ links.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.focus(); } });
  }

  /* featured bar: dismiss and remember (per announcement id) */
  var promo=document.querySelector('.promo');
  if(promo){ var x=promo.querySelector('.promo-x'); if(x) x.addEventListener('click',function(){ try{ localStorage.setItem('mc-bar',promo.dataset.id); }catch(e){} document.documentElement.classList.add('bar-off'); var m=document.getElementById('main'); if(m) m.focus({preventScroll:true}); }); }

  /* footer year */
  var y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  /* forms -> pre-filled email (no third-party service needed) */
  function labelFor(form,el){
    if(el.type==='checkbox'){ var fs=el.closest('fieldset'); var lg=fs&&fs.querySelector('legend'); return lg?lg.textContent.trim():el.name; }
    var l=el.id&&form.querySelector('label[for="'+el.id+'"]'); return l?l.textContent.trim():el.name;
  }
  document.querySelectorAll('form[data-mailto]').forEach(function(form){
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      if(!form.checkValidity()){ form.reportValidity(); return; }
      var to=form.getAttribute('data-mailto');
      var router=form.querySelector('[data-route]');
      if(router){ var opt=router.options[router.selectedIndex]; if(opt&&opt.dataset.to) to=opt.dataset.to; }
      var lines=[], groups={}, order=[];
      Array.prototype.forEach.call(form.elements,function(el){
        if(!el.name||el.type==='submit') return;
        var key=labelFor(form,el);
        if(el.type==='checkbox'){ if(!groups[key]){groups[key]=[];order.push(key);} if(el.checked) groups[key].push(el.value); return; }
        if(el.tagName==='TEXTAREA') return;
        order.push(key); groups[key]=el.value.trim();
      });
      order.forEach(function(k){ var v=groups[k]; if(Array.isArray(v)) v=v.join(', '); if(v) lines.push(k+': '+v); });
      var msg=form.querySelector('textarea'); if(msg&&msg.value.trim()){ lines.push('', msg.value.trim()); }
      var subjBase=form.getAttribute('data-subject')||'ModelCore inquiry';
      var org=form.querySelector('[name=company],[name=organization]');
      var subject=subjBase+(org&&org.value.trim()?': '+org.value.trim():'');
      window.location.href='mailto:'+to+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\r\n'));
      var done=document.createElement('div'); done.className='form-done'; done.setAttribute('role','status');
      done.innerHTML='<h3>Your email is ready to send.</h3><p>We opened a pre-filled message to <a class="link" href="mailto:'+to+'">'+to+'</a> in your mail app. Press send and we reply within one business day. If nothing opened, email that address directly.</p>';
      form.replaceWith(done);
    });
  });

  /* catalogue filter + search (all cards are already in the HTML) */
  var grid=document.getElementById('catalogue');
  if(grid){
    var cards=[].slice.call(grid.querySelectorAll('.ds')), chips=[].slice.call(document.querySelectorAll('.chip[data-filter]'));
    var q=document.getElementById('ds-search'), count=document.getElementById('ds-count'), empty=document.getElementById('ds-empty');
    var active='all';
    function apply(){
      var term=(q&&q.value||'').toLowerCase().replace(/[^a-z0-9\s-]/g,' ').trim().split(/\s+/).filter(function(t){return t.length>1&&['the','and','for','with','data','dataset','datasets'].indexOf(t)<0;}).map(function(t){return t.length>5?t.slice(0,t.length-2):t;}), n=0;
      cards.forEach(function(c){
        var ok=(active==='all'||c.dataset.cat===active)&&term.every(function(t){return c.dataset.text.indexOf(t)>-1;});
        c.parentElement.hidden=!ok; if(ok) n++;
      });
      if(count) count.textContent=n+' dataset'+(n===1?'':'s');
      if(empty) empty.hidden=n>0;
    }
    function setCat(cat){ active=cat; chips.forEach(function(ch){ ch.setAttribute('aria-pressed', ch.dataset.filter===cat?'true':'false'); }); apply(); }
    chips.forEach(function(ch){ ch.addEventListener('click',function(){ setCat(ch.dataset.filter); history.replaceState(null,'',ch.dataset.filter==='all'?location.pathname:'#'+ch.dataset.filter); }); });
    if(q) q.addEventListener('input',apply);
    var h=location.hash.slice(1); if(h&&chips.some(function(c){return c.dataset.filter===h;})) setCat(h); else apply();
  }

  /* tabs (homepage data-type examples) */
  document.querySelectorAll('[role=tablist]').forEach(function(list){
    var tabs=[].slice.call(list.querySelectorAll('[role=tab]'));
    function select(t,focus){
      tabs.forEach(function(x){ var on=x===t; x.setAttribute('aria-selected',on?'true':'false'); x.tabIndex=on?0:-1; var pnl=document.getElementById(x.getAttribute('aria-controls')); if(pnl) pnl.hidden=!on; });
      if(focus) t.focus();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){select(t);});
      t.addEventListener('keydown',function(e){
        var j=e.key==='ArrowRight'?i+1:e.key==='ArrowLeft'?i-1:e.key==='Home'?0:e.key==='End'?tabs.length-1:null;
        if(j===null) return; e.preventDefault(); select(tabs[(j+tabs.length)%tabs.length],true);
      });
    });
  });

  /* hero orb: one quiet animated moment on the homepage */
  var c=document.getElementById('orb');
  if(c&&c.getContext&&getComputedStyle(c).display!=='none'){
    var x=c.getContext('2d'), W, H, N=420, pts=[], yaw=0, raf=null, dpr=Math.min(window.devicePixelRatio||1,2);
    var reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches, mx=0, tmx=0, my=0, tmy=0;
    function hx(v,f){ v=(getComputedStyle(document.documentElement).getPropertyValue(v).trim()||f).replace('#',''); var n=parseInt(v,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
    var stops=[hx('--viz-1','#7B61FF'),hx('--viz-2','#B14FF0'),hx('--viz-3','#FF6A45')];
    function col(v){v=v<0?0:v>1?1:v;var i=v<.5?0:1,f=v<.5?v/.5:(v-.5)/.5,a=stops[i],b=stops[i+1];return (a[0]+(b[0]-a[0])*f|0)+','+(a[1]+(b[1]-a[1])*f|0)+','+(a[2]+(b[2]-a[2])*f|0);}
    for(var i=0;i<N;i++){var yv=1-2*(i+.5)/N,r=Math.sqrt(1-yv*yv),ph=i*2.399963;pts.push([Math.cos(ph)*r,yv,Math.sin(ph)*r]);}
    function size(){var b=c.getBoundingClientRect();W=b.width;H=b.height;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);}
    function draw(){
      x.clearRect(0,0,W,H); mx+=(tmx-mx)*.05; my+=(tmy-my)*.05; yaw+=.003;
      var cx=W/2,cy=H/2,R=Math.min(W,H)*.4,f=2.3,Y=yaw+mx*.5,cyw=Math.cos(Y),syw=Math.sin(Y),p=my*.4,cp=Math.cos(p),sp=Math.sin(p);
      for(var i=0;i<N;i++){var P=pts[i],xr=P[0]*cyw-P[2]*syw,zr=P[0]*syw+P[2]*cyw,yr=P[1]*cp-zr*sp,z2=P[1]*sp+zr*cp,pe=f/(f-z2),a=(z2+1)/2;
        x.fillStyle='rgba('+col((xr+1)/2)+','+(.12+a*.65)+')';x.beginPath();x.arc(cx+xr*R*pe,cy+yr*R*pe,.7+a*1.9,0,6.2832);x.fill();}
      if(!reduced) raf=requestAnimationFrame(draw);
    }
    size(); draw();
    window.addEventListener('resize',function(){size(); if(reduced) draw();});
    window.addEventListener('mousemove',function(e){tmx=e.clientX/innerWidth-.5;tmy=e.clientY/innerHeight-.5;},{passive:true});
    document.addEventListener('visibilitychange',function(){ if(reduced) return; cancelAnimationFrame(raf); if(!document.hidden) draw(); });
  }
})();
