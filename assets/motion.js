/* ModelCore — motion. Everything here is decorative; pages work without it.
   Colors come from CSS custom properties so a palette change updates the animations too. */
(function(){
  'use strict';
  var REDUCED=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root=document.documentElement;
  function tok(n,fb){ var v=getComputedStyle(root).getPropertyValue(n).trim(); return v||fb; }
  function rgb(hex){ hex=hex.replace('#',''); if(hex.length===3) hex=hex.replace(/./g,'$&$&'); var n=parseInt(hex,16); return [(n>>16)&255,(n>>8)&255,n&255]; }
  function rgba(hex,a){ var c=rgb(hex); return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'; }
  function pal(){ return { a:tok('--viz-1','#7B61FF'), b:tok('--viz-2','#B14FF0'), c:tok('--viz-3','#FF6A45'), sig:tok('--signal','#46E5C8'), faint:tok('--viz-faint','255,255,255'), mono:tok('--mono','monospace') }; }
  function rr(c,x,y,w,h,r){ r=Math.max(0,Math.min(r,Math.abs(w)/2,Math.abs(h)/2)); c.beginPath(); c.moveTo(x+r,y); c.arcTo(x+w,y,x+w,y+h,r); c.arcTo(x+w,y+h,x,y+h,r); c.arcTo(x,y+h,x,y,r); c.arcTo(x,y,x+w,y,r); c.closePath(); }

  /* shared canvas loop: only runs while on screen and the tab is visible */
  function loop(canvas, draw){
    var ctx=canvas.getContext('2d'), W=0, H=0, raf=null, vis=false, t=0, P=pal();
    function size(){ var d=Math.min(window.devicePixelRatio||1,2); W=canvas.clientWidth; H=canvas.clientHeight; canvas.width=W*d; canvas.height=H*d; ctx.setTransform(d,0,0,d,0,0); }
    function frame(){ raf=null; ctx.clearRect(0,0,W,H); draw(ctx,W,H,t,P); if(!REDUCED){ t++; if(vis&&!document.hidden) raf=requestAnimationFrame(frame); } }
    function kick(){ if(!raf) raf=requestAnimationFrame(frame); }
    size(); window.addEventListener('resize',function(){ size(); if(REDUCED) frame(); });
    if('IntersectionObserver' in window) new IntersectionObserver(function(es){ vis=es[0].isIntersecting; if(vis) kick(); }).observe(canvas); else { vis=true; }
    document.addEventListener('visibilitychange',function(){ if(!document.hidden&&vis) kick(); });
    frame();
    return { redraw:function(){ P=pal(); if(REDUCED) frame(); else kick(); }, setT:function(v){ t=v; } };
  }

  /* ---------------- signal -> structure (AI teams) ---------------- */
  document.querySelectorAll('[data-viz="signal"]').forEach(function(fig){
    var canvas=fig.querySelector('canvas'), meta=fig.querySelector('.viz-meta'), tabs=[].slice.call(fig.querySelectorAll('.viz-tabs button'));
    var ORDER=tabs.map(function(b){return b.dataset.mode;}), mode=ORDER[0], auto=!REDUCED, tick=0;
    var hover=false, mX=.5, mY=.5;
    function pt(x,y){ var r=canvas.getBoundingClientRect(); mX=Math.min(1,Math.max(0,(x-r.left)/r.width)); mY=Math.min(1,Math.max(0,(y-r.top)/r.height)); }
    canvas.addEventListener('mousemove',function(e){ hover=true; pt(e.clientX,e.clientY); });
    canvas.addEventListener('mouseleave',function(){ hover=false; });
    canvas.addEventListener('touchmove',function(e){ hover=true; if(e.touches[0]) pt(e.touches[0].clientX,e.touches[0].clientY); },{passive:true});
    canvas.addEventListener('touchend',function(){ hover=false; });
    function sync(){ tabs.forEach(function(b){ b.setAttribute('aria-pressed', b.dataset.mode===mode?'true':'false'); }); }
    tabs.forEach(function(b){ b.addEventListener('click',function(){ mode=b.dataset.mode; auto=false; sync(); L.redraw(); }); });
    sync();
    var LABEL={audio:'transcribing · diarizing',video:'segmenting · captioning',text:'structuring · deduplicating',code:'parsing · testing',business:'anonymizing · threading'};
    function grad(c,W,P){ var g=c.createLinearGradient(0,0,W,0); g.addColorStop(0,P.a); g.addColorStop(.5,P.b); g.addColorStop(1,P.c); return g; }

    function audio(c,W,H,ph,P){
      var bars=64,bw=W/bars,mid=H/2,cx=hover?mX*W:(Math.sin(ph*.4)*.5+.5)*W; c.fillStyle=grad(c,W,P);
      for(var i=0;i<bars;i++){ var env=Math.sin(i/bars*Math.PI), nz=Math.sin(i*.5+ph)*.5+Math.sin(i*.13-ph*.7)*.5, amp=(.25+.75*Math.abs(nz))*env;
        if(i>bars*.66) amp=.35+.25*Math.sin(i*.9); var bx=i*bw+bw/2, d=Math.abs(bx-cx)/(W*.16); amp+=Math.max(0,1-d)*.7*env;
        var h=Math.max(2,amp*H*.42); rr(c,i*bw+bw*.18,mid-h,bw*.64,h*2,bw*.32); c.fill(); }
      c.fillStyle=rgba(P.sig,hover?.5:.15); c.fillRect(cx-1,0,2,H);
    }
    function video(c,W,H,ph,P){
      var fw=W/5,off=(ph*16)%fw,top=H*.17,fh=H*.66,cx=hover?mX*W:(Math.sin(ph*.25)*.5+.5)*W;
      c.fillStyle='rgba('+P.faint+',.06)'; for(var x=-off;x<W;x+=fw/3){ c.fillRect(x,H*.05,fw*.06,H*.045); c.fillRect(x,H*.905,fw*.06,H*.045); }
      for(var i=-1;i<6;i++){ var fx=i*fw-off, b=.3+.55*Math.abs(Math.sin(i*.8+ph*.3)); if(cx>=fx&&cx<fx+fw) b=Math.min(1,b+.4);
        var g=c.createLinearGradient(fx,top,fx,top+fh); g.addColorStop(0,rgba(P.a,.2+b*.5)); g.addColorStop(1,rgba(P.c,.1+b*.42));
        c.fillStyle=g; rr(c,fx+5,top,fw-10,fh,7); c.fill(); c.fillStyle='rgba('+P.faint+','+(.06+b*.08)+')'; rr(c,fx+12,top+fh*.64,fw-24,fh*.11,3); c.fill(); }
      c.fillStyle=rgba(P.sig,.85); c.fillRect(cx-1,top-7,2,fh+14); c.beginPath(); c.arc(cx,top-7,3.2,0,6.283); c.fill();
    }
    function text(c,W,H,ph,P){
      var rows=5,rh=H/(rows+1),act=hover?Math.min(rows-1,Math.max(0,Math.floor(mY*rows))):-1, cols=[P.a,P.sig,P.c];
      for(var r=0;r<rows;r++){ var y=rh*(r+.62), head=(hover&&r===act)?mX*W*.9+W*.05:((ph*.066+r*.37)%1)*W*.9+W*.05, x=W*.05, ti=0;
        while(x<W*.93){ var tw=12+((ti*29+r*17)%52), on=x<head; c.fillStyle=on?cols[(ti+r)%5===0?2:((ti+r)%3===0?1:0)]:'rgba('+P.faint+',.08)'; c.globalAlpha=on?.85:1; rr(c,x,y,tw,rh*.3,3); c.fill(); c.globalAlpha=1; x+=tw+7; ti++; }
        if((hover&&r===act)||Math.sin(ph*.5)>0){ c.fillStyle=P.sig; c.fillRect(head,y-3,2,rh*.4); } }
    }
    var IND=[0,1,1,2,2,1,0];
    function code(c,W,H,ph,P){
      var rows=7,rh=H/(rows+1),cols=[P.a,P.c,P.sig,'rgba('+P.faint+',.25)'],act=hover?Math.min(rows-1,Math.max(0,Math.floor(mY*rows))):Math.floor((ph*.04)%rows);
      c.fillStyle='rgba('+P.faint+',.12)'; for(var r=0;r<rows;r++) c.fillRect(W*.025,rh*(r+.6)+rh*.1,9,2);
      for(r=0;r<rows;r++){ var y=rh*(r+.6), x=W*.06+IND[r]*W*.06, segs=2+((r*3)%3);
        for(var s=0;s<segs&&x<W*.92;s++){ var sw=24+((r*19+s*41)%88); c.fillStyle=cols[(s+r)%4]; c.globalAlpha=r===act?.96:.8; rr(c,x,y,sw,rh*.28,3); c.fill(); c.globalAlpha=1; x+=sw+8; }
        if(r===act&&(hover||Math.sin(ph*.5)>0)){ c.fillStyle=P.sig; c.fillRect(hover?Math.max(W*.06,mX*W):x,y-3,2,rh*.38); } }
    }
    function business(c,W,H,ph,P){
      var n=6, gap=H/n, scroll=(ph*6)%gap, scan=hover?mY*H:((ph*.05)%1.25)*H;
      for(var i=-1;i<n+1;i++){ var y=i*gap-scroll+gap*.2, left=(i+Math.floor(ph*6/gap))%2===0, bw=W*(.42+((i*37+Math.floor(ph*6/gap)*13)%30)/100), bx=left?W*.05:W*.95-bw, bh=gap*.62;
        if(y>H||y+bh<0) continue; var done=y+bh<scan;
        c.fillStyle='rgba('+P.faint+','+(done?.07:.05)+')'; rr(c,bx,y,bw,bh,10); c.fill();
        if(done){ c.strokeStyle=rgba(P.sig,.45); c.lineWidth=1; rr(c,bx+.5,y+.5,bw-1,bh-1,10); c.stroke(); }
        var nx=bx+12, ny=y+bh*.22, nw=Math.min(70,bw*.26);
        if(done){ c.fillStyle='rgba('+P.faint+',.22)'; for(var k=0;k<5;k++){ rr(c,nx+k*(nw/5),ny,nw/5-2,bh*.22,2); c.fill(); } }
        else { c.fillStyle=P.c; rr(c,nx,ny,nw,bh*.22,4); c.fill(); }
        c.fillStyle=done?rgba(P.a,.7):'rgba('+P.faint+',.18)'; rr(c,nx,y+bh*.58,bw-24,bh*.16,3); c.fill(); }
      c.fillStyle=rgba(P.sig,.8); c.fillRect(0,scan,W,1.5);
    }
    var DRAW={audio:audio,video:video,text:text,code:code,business:business};
    var L=loop(canvas,function(c,W,H,t,P){
      var ph=REDUCED?6:t*.05; (DRAW[mode]||audio)(c,W,H,ph,P);
      if(meta) meta.textContent=hover?'tracking pointer':LABEL[mode];
      if(auto&&!hover){ tick++; if(tick>420){ tick=0; mode=ORDER[(ORDER.indexOf(mode)+1)%ORDER.length]; sync(); } }
    });
  });

  /* ---------------- library -> licensed (data owners) ---------------- */
  document.querySelectorAll('[data-viz="library"]').forEach(function(fig){
    var canvas=fig.querySelector('canvas'), kind=fig.dataset.kind||'content', meta=fig.querySelector('.viz-meta');
    var COLS=6, ROWS=3, N=COLS*ROWS, CYCLE=640, ORDER=[], i;
    for(i=0;i<N;i++) ORDER.push(i); ORDER.sort(function(a,b){ return ((a*7919)%31)-((b*7919)%31); });
    var START={}; ORDER.forEach(function(id,k){ START[id]=200+k*20; });
    var TERMS=['non-exclusive','exclusive','non-exclusive','first look'];
    function glyph(c,x,y,w,h,type,state,P){
      var f='rgba('+P.faint+','+(state?.35:.2)+')';
      if(kind==='business'){
        if(type===0){ c.fillStyle=f; rr(c,x+w*.12,y+h*.18,w*.6,h*.22,5); c.fill(); rr(c,x+w*.3,y+h*.5,w*.58,h*.22,5); c.fill(); }
        else if(type===1){ for(var k=0;k<4;k++){ c.fillStyle=state&&k===1?rgba(P.sig,.6):f; c.fillRect(x+w*.18,y+h*(.2+k*.17),w*(k===3?.4:.64),2); } }
        else { c.fillStyle=f; rr(c,x+w*.15,y+h*.2,w*.7,h*.6,4); c.fill(); c.fillStyle=state?rgba(P.sig,.7):rgba(P.c,.8); c.beginPath(); c.arc(x+w*.3,y+h*.38,3,0,6.283); c.fill(); }
        if(state){ c.fillStyle='rgba('+P.faint+',.3)'; for(k=0;k<3;k++) c.fillRect(x+w*.18+k*7,y+h*.84,5,3); }
      } else {
        if(type===0){ c.fillStyle=f; rr(c,x+w*.14,y+h*.18,w*.72,h*.5,4); c.fill(); c.fillStyle='rgba('+P.faint+',.5)'; c.beginPath(); c.moveTo(x+w*.45,y+h*.32); c.lineTo(x+w*.45,y+h*.54); c.lineTo(x+w*.6,y+h*.43); c.fill(); }
        else if(type===1){ for(var b=0;b<9;b++){ var bh=h*(.12+.3*Math.abs(Math.sin(b*1.7+type))); c.fillStyle=f; c.fillRect(x+w*.16+b*w*.075,y+h*.45-bh/2,w*.04,bh); } }
        else { for(var l=0;l<4;l++){ c.fillStyle=f; c.fillRect(x+w*.2,y+h*(.2+l*.13),w*(l===3?.35:.6),2); } }
        if(state){ c.fillStyle=rgba(P.sig,.75); rr(c,x+w*.14,y+h*.76,w*.3,h*.1,2); c.fill(); c.fillStyle=rgba(P.a,.6); rr(c,x+w*.48,y+h*.76,w*.22,h*.1,2); c.fill(); }
      }
    }
    var L=loop(canvas,function(c,W,H,t,P){
      var f=REDUCED?470:t%CYCLE, gx=W*.04, gw=W*.62, gy=H*.1, gh=H*.8, tw=gw/COLS, th=gh/ROWS;
      var nodeX=W*.84, nodeY=H*.22, sweep=Math.min(1,f/170), arrivals=[];
      for(var id=0;id<N;id++){
        var col=id%COLS,row=Math.floor(id/COLS), x=gx+col*tw+4, y=gy+row*th+4, w=tw-8, h=th-8, type=(col+row*2)%3;
        var enriched=sweep>(col+.5)/COLS, s=START[id], lic=f>=s+40;
        c.fillStyle=lic?rgba(P.c,.14):'rgba('+P.faint+','+(enriched?.05:.035)+')'; rr(c,x,y,w,h,7); c.fill();
        c.strokeStyle=lic?rgba(P.c,.55):enriched?rgba(P.sig,.4):'rgba('+P.faint+',.08)'; c.lineWidth=1; rr(c,x+.5,y+.5,w-1,h-1,7); c.stroke();
        glyph(c,x,y,w,h,type,enriched,P);
        if(f>=s&&f<s+40){ var k=(f-s)/40, sx=x+w/2, sy=y+h/2, cx1=(sx+nodeX)/2, cy1=Math.min(sy,nodeY)-H*.18, e=1-k;
          var px=e*e*sx+2*e*k*cx1+k*k*nodeX, py=e*e*sy+2*e*k*cy1+k*k*nodeY;
          c.strokeStyle=rgba(P.c,.25); c.beginPath(); c.moveTo(sx,sy); c.quadraticCurveTo(cx1,cy1,nodeX,nodeY); c.stroke();
          c.fillStyle=P.c; c.beginPath(); c.arc(px,py,3.2,0,6.283); c.fill(); }
        if(lic) arrivals.push(s+40);
      }
      if(sweep<1){ var sx2=gx+sweep*gw; c.fillStyle=rgba(P.sig,.8); c.fillRect(sx2,gy-6,2,gh+12); }
      arrivals.sort(function(a,b){return b-a;});
      var pulse=arrivals.length&&f-arrivals[0]<18?1-(f-arrivals[0])/18:0;
      c.fillStyle=rgba(P.c,.15+pulse*.35); c.beginPath(); c.arc(nodeX,nodeY,16+pulse*8,0,6.283); c.fill();
      c.fillStyle=P.c; c.beginPath(); c.arc(nodeX,nodeY,7,0,6.283); c.fill();
      c.font=(W<420?'10px ':'11px ')+P.mono; c.textAlign='center'; c.fillStyle='rgba('+P.faint+',.55)'; c.fillText('AI buyers',nodeX,nodeY+36);
      c.textAlign='left'; for(var r=0;r<Math.min(5,arrivals.length);r++){ var ry=nodeY+62+r*20; c.fillStyle='rgba('+P.faint+','+(.5-r*.08)+')'; c.fillStyle=r===0&&pulse?rgba(P.c,.9):c.fillStyle; c.fillText('● '+TERMS[(arrivals.length-r)%TERMS.length],gx+gw+Math.max(14,(W-gx-gw-120)/2),ry); }
      if(meta) meta.textContent=f<170?(kind==='business'?'anonymizing records':'cataloguing and enriching'):arrivals.length<N?'licensing to vetted buyers':'all licensed · you keep ownership';
    });
  });

  /* ---------------- logo: assemble once per visit ---------------- */
  /* (class added in <head> before paint; see .first-visit in site.css) */

  /* ---------------- header state on scroll ---------------- */
  var header=document.querySelector('.site-header');
  function onScroll(){ if(header) header.classList.toggle('scrolled',window.scrollY>8); }
  window.addEventListener('scroll',onScroll,{passive:true}); onScroll();

  if(REDUCED) return;

  /* ---------------- process steps fill in as you read ---------------- */
  var steps=[].slice.call(document.querySelectorAll('.steps'));
  if(steps.length){
    steps.forEach(function(s){ s.classList.add('track'); });
    var tickS=false;
    function upd(){ tickS=false; var vh=window.innerHeight;
      steps.forEach(function(s){ [].forEach.call(s.children,function(li){ var r=li.getBoundingClientRect(); li.classList.toggle('on', r.top<vh*.78); }); }); }
    window.addEventListener('scroll',function(){ if(!tickS){ tickS=true; requestAnimationFrame(upd); } },{passive:true}); upd();
  }

  /* ---------------- code sample types in once, when first seen ---------------- */
  var codes=[].slice.call(document.querySelectorAll('.code pre')).filter(function(p){ return p.offsetParent!==null; });
  if(codes.length&&'IntersectionObserver' in window){
    codes.forEach(function(p){ p.classList.add('await'); });
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var p=e.target.__pre; p.classList.remove('await'); p.classList.add('typein'); io.unobserve(e.target); } }); },{threshold:.3});
    codes.forEach(function(p){ var box=p.closest('.code')||p.parentNode; box.__pre=p; io.observe(box); });
  }
})();
