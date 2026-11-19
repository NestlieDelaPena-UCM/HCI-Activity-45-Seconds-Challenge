const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
$('#year').textContent = new Date().getFullYear();
const phrases = ['web development', 'creative problem-solving', 'thoughtful UI/UX', 'learning Python'];
let phraseIndex = 0,
  charIndex = phrases[0].length,
  deleting = false;
const typing = $('#typing');

function typeLoop() {
  const phrase = phrases[phraseIndex];
  if (!deleting) {
    charIndex++;
    typing.textContent = phrase.slice(0, charIndex);
    if (charIndex >= phrase.length) {
      deleting = true;
      setTimeout(typeLoop, 1250);
      return
    }
  } else {
    charIndex--;
    typing.textContent = phrase.slice(0, charIndex);
    if (charIndex <= 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length
    }
  }
  setTimeout(typeLoop, deleting ? 42 : 75)
}
setTimeout(typeLoop, 1700);
const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) {
    e.target.classList.add('visible');
    observer.unobserve(e.target)
  }
}), {
  threshold: .12
});
$$('.reveal').forEach(el => observer.observe(el));
let toastTimer;

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600)
}
$('#funBtn').addEventListener('click', () => {
  const facts = ['Tiny steps still count. ✨', 'Every expert was once a beginner. 🌱', 'Curiosity is a superpower. 🧠', 'You made it this far—thanks for exploring! 💜'];
  toast(facts[Math.floor(Math.random() * facts.length)])
});
$$('.choice').forEach(btn => btn.addEventListener('click', () => {
  $$('.choice').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  $('#choiceResult').textContent = 'Your pick: ' + btn.dataset.choice + '. Challenge accepted—make it useful, make it accessible, and make it fun!';
}));
$('#helloBtn').addEventListener('click', () => toast('Thanks for visiting! May your day be full of good ideas. 💜'));;
(() => {
  const r = document.documentElement,
    s = document.getElementById('themeBtn');
  s.addEventListener('click', () => {
    const d = r.dataset.theme === 'dark';
    r.dataset.theme = d ? 'light' : 'dark';
    s.setAttribute('aria-checked', String(!d))
  })
})();;
(() => {
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const touch = matchMedia('(hover:none)').matches;
  const add = (tag, attrs = {}, html = '') => {
    const e = document.createElement(tag);
    Object.assign(e, attrs);
    e.innerHTML = html;
    document.body.appendChild(e);
    return e
  };
  const bar = add('div', {
    id: 'progress'
  });
  const glow = add('div', {
    id: 'glow'
  });
  const cv = add('canvas', {
    id: 'bgfx'
  });
  const cx = cv.getContext('2d');
  let W, H, pts = [],
    mx = -999,
    my = -999;
  const resize = () => {
    W = cv.width = innerWidth;
    H = cv.height = innerHeight;
    pts = Array.from({
      length: Math.min(48, Math.floor(W / 28))
    }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .35,
      vy: (Math.random() - .5) * .35
    }))
  };
  resize();
  addEventListener('resize', resize);

  function draw() {
    cx.clearRect(0, 0, W, H);
    for (const p of pts) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      const dx = p.x - mx,
        dy = p.y - my,
        d = Math.hypot(dx, dy);
      if (d < 130) {
        p.x += dx / d * 1.6;
        p.y += dy / d * 1.6
      }
      cx.fillStyle = 'rgba(139,124,255,.7)';
      cx.beginPath();
      cx.arc(p.x, p.y, 1.6, 0, 6.3);
      cx.fill()
    }
    for (let i = 0; i < pts.length; i++)
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i],
          b = pts[j],
          d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 120) {
          cx.strokeStyle = `rgba(72,224,193,${.22*(1-d/120)})`;
          cx.beginPath();
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.stroke()
        }
      }
    requestAnimationFrame(draw)
  }
  if (!reduce) draw();
  addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    glow.style.transform = `translate(${mx}px,${my}px)`
  });
  addEventListener('scroll', () => {
    const h = document.documentElement;
    bar.style.transform = `scaleX(${scrollY/(h.scrollHeight-innerHeight||1)})`;
    $('#toTop').classList.toggle('show', scrollY > 500);
    spy()
  }, {
    passive: true
  });

  function burst(x, y, n = 14, colors = ['#8b7cff', '#48e0c1', '#ff85b3', '#ffd36e']) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28,
        r = 40 + Math.random() * 70,
        s = 4 + Math.random() * 6;
      const e = add('i', {
        className: 'burst'
      });
      e.style.cssText += `left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${colors[i%colors.length]};--x:${Math.cos(a)*r}px;--y:${Math.sin(a)*r}px;--d:${.5+Math.random()*.5}s`;
      setTimeout(() => e.remove(), 1100)
    }
  }
  addEventListener('click', e => burst(e.clientX, e.clientY, 10));
  window.__burst = burst;
  $('#funBtn')?.addEventListener('click', () => {
    for (let i = 0; i < 6; i++) setTimeout(() => burst(Math.random() * innerWidth, Math.random() * innerHeight * .6, 26), i * 120)
  });
  $('#helloBtn')?.addEventListener('click', e => {
    const r = e.target.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top, 40, ['#ff85b3', '#ffd36e', '#8b7cff'])
  });
  if (!touch && !reduce) {
    $$('.panel,.skill,.photo-card,.float-card,.stat').forEach(el => {
      el.classList.add('tilt');
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect(),
          x = (e.clientX - r.left) / r.width - .5,
          y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(700px) rotateX(${-y*7}deg) rotateY(${x*9}deg) translateY(-3px)`
      });
      el.addEventListener('mouseleave', () => el.style.transform = '')
    });
    const vis = $('.visual');
    addEventListener('mousemove', e => {
      if (!vis) return;
      const x = e.clientX / innerWidth - .5,
        y = e.clientY / innerHeight - .5;
      ($('.hero-photo', vis) || {
        style: {}
      }).style.transform = `translate(${x*14}px,${y*14}px)`;
      $$('.float-card', vis).forEach((c, i) => c.style.translate = `${x*(i?-26:26)}px ${y*(i?-20:20)}px`)
    })
  }
  const links = $$('.navlinks a'),
    secs = links.map(a => $(a.getAttribute('href')));

  function spy() {
    let cur = -1;
    secs.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top < innerHeight * .4) cur = i
    });
    links.forEach((a, i) => a.classList.toggle('active', i === cur))
  }
  const cards = $$('.photo-card');
  let idx = 0;
  const lb = add('div', {
    id: 'lb'
  }, `<button class="x" aria-label="Close">\u2715</button><button class="p" aria-label="Previous">\u2039</button><img alt=""><div class="cap"></div><button class="n" aria-label="Next">\u203A</button>`);
  const step = d => {
    let i = idx,
      t = 0;
    do {
      i += d;
      t++
    } while (cards[((i % cards.length) + cards.length) % cards.length].offsetParent === null && t < cards.length * 2);
    show(i)
  };
  const show = i => {
    idx = (i + cards.length) % cards.length;
    const im = $('img', cards[idx]);
    $('img', lb).src = im.src;
    $('img', lb).alt = im.alt;
    $('.cap', lb).textContent = `${idx+1} / ${cards.length} \u00B7 ` + $('figcaption', cards[idx]).textContent;
    lb.classList.add('open')
  };
  cards.forEach((c, i) => c.addEventListener('click', () => show(i)));
  $('.x', lb).onclick = () => lb.classList.remove('open');
  $('.p', lb).onclick = e => {
    e.stopPropagation();
    step(-1)
  };
  $('.n', lb).onclick = e => {
    e.stopPropagation();
    step(1)
  };
  lb.addEventListener('click', e => {
    if (e.target === lb) lb.classList.remove('open')
  });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowRight') step(1);
    if (e.key === 'ArrowLeft') step(-1)
  });
  add('div', {
    className: 'dock'
  }, `<button id="toTop" title="Back to top" aria-label="Back to top">\u2191</button>`);
  $('#toTop').onclick = () => scrollTo({
    top: 0,
    behavior: 'smooth'
  });
  spy();
})();;
(() => {
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const store = {
    get(k) {
      try {
        return localStorage.getItem(k)
      } catch (e) {
        return null
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v)
      } catch (e) {}
    }
  };
  const say = m => {
    if (typeof toast === 'function') toast(m)
  };
  const pop = (x, y, n, c) => {
    if (window.__burst) window.__burst(x, y, n, c)
  };
  const esc = s => s.replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  } [c]));
  const sw = $('#themeBtn');
  const accents = {
    light: {
      blue: null,
      purple: ['#7a5cf0', '#9a82ff'],
      teal: ['#0f9d8a', '#2cc4ae'],
      pink: ['#d6478a', '#ef6ea6']
    },
    dark: {
      blue: null,
      purple: ['#a99bff', '#c0b6ff'],
      teal: ['#48e0c1', '#7af0d8'],
      pink: ['#ff85b3', '#ffa6c8']
    }
  };
  let accent = store.get('nd-accent') || 'blue';

  function applyAccent() {
    const set = (accents[root.dataset.theme] || accents.light)[accent];
    if (set) {
      root.style.setProperty('--accent', set[0]);
      root.style.setProperty('--accent2', set[1])
    } else {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent2')
    }
    $$('.sw').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.c === accent)));
  }

  function setAccent(name) {
    if (!(name in accents.light)) return false;
    accent = name;
    store.set('nd-accent', name);
    applyAccent();
    return true
  }

  function setTheme(t) {
    root.dataset.theme = t;
    sw.setAttribute('aria-checked', String(t === 'dark'));
    store.set('nd-theme', t);
    applyAccent()
  }
  const savedTheme = store.get('nd-theme');
  if (savedTheme === 'dark' || savedTheme === 'light') setTheme(savedTheme);
  sw.addEventListener('click', () => setTimeout(() => {
    store.set('nd-theme', root.dataset.theme);
    applyAccent()
  }, 0));
  applyAccent();
  const dock = $('.dock');
  if (dock) {
    const wrap = document.createElement('div');
    wrap.className = 'pal-wrap';
    wrap.innerHTML = `<button id="palBtn" title="Pick an accent color" aria-label="Pick an accent color" aria-expanded="false">\uD83C\uDFA8</button>
  <div class="palette" id="palette" role="group" aria-label="Accent colors">
    <button class="sw" data-c="blue" style="background:#2b78e4" aria-label="Blue" aria-pressed="false"></button>
    <button class="sw" data-c="purple" style="background:#7a5cf0" aria-label="Purple" aria-pressed="false"></button>
    <button class="sw" data-c="teal" style="background:#0f9d8a" aria-label="Teal" aria-pressed="false"></button>
    <button class="sw" data-c="pink" style="background:#d6478a" aria-label="Pink" aria-pressed="false"></button>
  </div>`;
    dock.insertBefore(wrap, dock.firstChild);
    const pal = $('#palette'),
      pb = $('#palBtn');
    pb.addEventListener('click', e => {
      e.stopPropagation();
      const o = pal.classList.toggle('open');
      pb.setAttribute('aria-expanded', String(o))
    });
    pal.addEventListener('click', e => {
      const b = e.target.closest('.sw');
      if (!b) return;
      e.stopPropagation();
      setAccent(b.dataset.c);
      const r = b.getBoundingClientRect();
      pop(r.left + r.width / 2, r.top, 14, ['#2b78e4', '#7a5cf0', '#0f9d8a', '#d6478a'])
    });
    document.addEventListener('click', e => {
      if (!e.target.closest('.pal-wrap')) {
        pal.classList.remove('open');
        pb.setAttribute('aria-expanded', 'false')
      }
    });
    applyAccent();
  }
  if (fine && !reduce) {
    const ring = document.createElement('div');
    ring.id = 'ring';
    document.body.appendChild(ring);
    let rx = 0,
      ry = 0,
      tx = 0,
      ty = 0;
    addEventListener('mousemove', e => {
      tx = e.clientX;
      ty = e.clientY;
      ring.classList.add('on');
      ring.classList.toggle('big', !!e.target.closest('a,button,summary,input,textarea,.photo-card,.hero-photo,.skill'))
    });
    document.addEventListener('mouseleave', () => ring.classList.remove('on'));
    (function loop() {
      rx += (tx - rx) * .18;
      ry += (ty - ry) * .18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop)
    })();
  }
  const hp = $('.hero-photo');
  if (hp) {
    const greets = ['Hi there! \uD83D\uDC4B', 'Kumusta! \uD83D\uDC99', 'Maayong adlaw! \u2728', 'Thanks for stopping by! \uD83C\uDF31', 'Keep building, keep serving. \uD83D\uDCAA'];
    let gi = 0;
    hp.addEventListener('click', e => {
      hp.classList.remove('wiggle');
      void hp.offsetWidth;
      hp.classList.add('wiggle');
      say(greets[gi++ % greets.length]);
      pop(e.clientX, e.clientY, 18)
    });
  }
  const spots = [
    ['top', 'Home'],
    ['leadership', 'Leadership'],
    ['about', 'About'],
    ['skills', 'Skills'],
    ['projects', 'Projects'],
    ['experience', 'Experience'],
    ['interests', 'Highlights'],
    ['service', 'Service'],
    ['journey', 'My journey'],
    ['ask', 'Ask me'],
    ['kindness', 'Kindness'],
    ['contact', 'Contact']
  ].filter(s => $('#' + s[0]));
  const dots = document.createElement('nav');
  dots.className = 'dots';
  dots.setAttribute('aria-label', 'Section navigation');
  dots.innerHTML = spots.map(s => `<a href="#${s[0]}" data-l="${s[1]}" aria-label="${s[1]}"></a>`).join('');
  document.body.appendChild(dots);
  let ticking = false;

  function spy() {
    ticking = false;
    let cur = 0;
    spots.forEach((s, i) => {
      if ($('#' + s[0]).getBoundingClientRect().top < innerHeight * .45) cur = i
    });
    $$('a', dots).forEach((a, i) => a.classList.toggle('on', i === cur))
  }
  addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(spy)
    }
  }, {
    passive: true
  });
  spy();
  const catMap = {
    'HTML & CSS': 'web',
    'JavaScript': 'web',
    'UI / UX thinking': 'web',
    'Java': 'code',
    'C# / C++ / C': 'code',
    'Python': 'code',
    'Debugging': 'code',
    'Databases': 'data'
  };

  function makeFilters(grid, list, items, withCount) {
    const bar = document.createElement('div');
    bar.className = 'filters';
    bar.setAttribute('role', 'group');
    bar.innerHTML = list.map((f, i) => `<button type="button" data-f="${f[0]}" class="${i?'':'on'}" aria-pressed="${i?'false':'true'}">${f[1]}</button>`).join('') + (withCount ? '<span class="count" aria-live="polite"></span>' : '');
    grid.parentNode.insertBefore(bar, grid);
    const count = $('.count', bar);
    const upd = n => {
      if (count) count.textContent = `Showing ${n} of ${items.length}`
    };
    upd(items.length);
    bar.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('button', bar).forEach(x => {
        x.classList.toggle('on', x === b);
        x.setAttribute('aria-pressed', String(x === b))
      });
      let n = 0;
      items.forEach(it => {
        const ok = b.dataset.f === 'all' || it.dataset.cat === b.dataset.f;
        it.classList.toggle('is-hidden', !ok);
        if (ok) {
          n++;
          it.classList.remove('pop');
          void it.offsetWidth;
          it.classList.add('pop')
        }
      });
      upd(n);
    });
  }
  const skills = $$('.skill');
  skills.forEach(s => {
    const b = $('b', s),
      name = b.textContent.trim();
    s.dataset.cat = catMap[name] || 'web';
    const lvl = parseInt($('i', s).style.getPropertyValue('--level')) || 0;
    const p = document.createElement('em');
    p.className = 'pct';
    p.dataset.to = lvl;
    p.textContent = '0%';
    b.appendChild(p);
  });
  if (skills.length) makeFilters($('.skills-grid'), [
    ['all', 'All'],
    ['web', 'Web'],
    ['code', 'Programming'],
    ['data', 'Data']
  ], skills, true);

  function countUp(el, to) {
    if (reduce) {
      el.textContent = to + '%';
      return
    }
    const t0 = performance.now();
    const f = t => {
      const k = Math.min(1, (t - t0) / 1100);
      el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + '%';
      if (k < 1) requestAnimationFrame(f)
    };
    requestAnimationFrame(f);
  }
  const skillSec = $('#skills');
  if (skillSec) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) {
        $$('.pct', skillSec).forEach(p => countUp(p, +p.dataset.to));
        io.disconnect()
      }
    }), {
      threshold: .25
    });
    io.observe(skillSec);
  }
  const photos = $$('.gallery .photo-card');
  const photoCats = ['service', 'team', 'awareness', 'awareness', 'community', 'community', 'campus', 'team', 'service'];
  photos.forEach((p, i) => p.dataset.cat = photoCats[i] || 'campus');
  if (photos.length) makeFilters($('.gallery'), [
    ['all', 'All'],
    ['service', 'Service'],
    ['team', 'Teamwork'],
    ['awareness', 'Awareness'],
    ['community', 'Community'],
    ['campus', 'Campus life']
  ], photos, true);
  const PROJ = {
    'A personal productivity dashboard': {
      stack: ['HTML', 'CSS', 'JavaScript', 'Chart.js'],
      steps: ['Sketch the layout: tasks, goals, and a weekly view', 'Build the cards with HTML and CSS grid', 'Use JavaScript to add, check off, and filter tasks', 'Save progress in the browser and add a simple chart']
    },
    'A playful interactive quiz': {
      stack: ['HTML', 'CSS', 'JavaScript'],
      steps: ['Write 5 questions with 4 choices each', 'Show one question at a time with a progress bar', 'Score answers and explain the correct one', 'End with a result screen and a replay button']
    },
    'A student community hub': {
      stack: ['HTML', 'CSS', 'JavaScript', 'A small database'],
      steps: ['List what students need: events, announcements, help', 'Design a clear, friendly home page', 'Add search and category filters', 'Store posts in a database and add a simple admin view']
    }
  };
  const BONUS = ['dark mode', 'keyboard shortcuts', 'a progress bar', 'confetti on success', 'an accessibility check', 'a printable summary'];
  let curIdea = '',
    curBonus = '';
  const result = $('#choiceResult');

  function renderIdea() {
    const p = PROJ[curIdea];
    if (!p || !result) return;
    result.innerHTML = `<div class="idea"><h4>${esc(curIdea)}</h4><div class="tags">${p.stack.map(t=>`<span>${esc(t)}</span>`).join('')}</div><ol>${p.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol><div>Bonus feature: <b style="color:var(--accent)">${esc(curBonus)}</b></div><div class="acts"><button class="btn btn-ghost" type="button" id="bonusBtn">Another bonus \u2726</button><button class="btn btn-primary" type="button" id="copyIdea">Copy as a prompt</button></div></div>`;
    $('#bonusBtn').onclick = () => {
      let b;
      do {
        b = BONUS[Math.floor(Math.random() * BONUS.length)]
      } while (b === curBonus);
      curBonus = b;
      renderIdea()
    };
    $('#copyIdea').onclick = async () => {
      const text = `Mini-project: ${curIdea}\nStack: ${p.stack.join(', ')}\nSteps:\n${p.steps.map((s,i)=>`${i+1}. ${s}`).join('\n')}\nBonus: ${curBonus}`;
      try {
        await navigator.clipboard.writeText(text);
        say('Project prompt copied! \uD83D\uDCCB')
      } catch (e) {
        say('Copy is blocked here, but you can select the text.')
      }
    };
  }
  $$('.choice').forEach(b => b.addEventListener('click', () => {
    curIdea = b.dataset.choice;
    curBonus = BONUS[Math.floor(Math.random() * BONUS.length)];
    renderIdea();
    const r = b.getBoundingClientRect();
    pop(r.left + r.width / 2, r.top, 10)
  }));
  const tb = $('#termBody'),
    ti = $('#termInput'),
    tf = $('#termForm');
  if (tb && ti && tf) {
    const history = [];
    let hIdx = 0;
    const print = (html, cls = '') => {
      const d = document.createElement('div');
      d.className = 'ln ' + cls;
      d.innerHTML = html;
      tb.appendChild(d);
      tb.scrollTop = tb.scrollHeight
    };
    const IDEAS = ['A personal productivity dashboard', 'A playful interactive quiz', 'A student community hub', 'A campus event countdown board', 'A study-session planner', 'A mini guide for new students'];
    const GO = {
      top: 'top',
      home: 'top',
      leadership: 'leadership',
      about: 'about',
      skills: 'skills',
      projects: 'projects',
      experience: 'experience',
      highlights: 'interests',
      service: 'service',
      gallery: 'service',
      journey: 'journey',
      ask: 'ask',
      kindness: 'kindness',
      contact: 'contact'
    };
    const HIDDEN = ['sudo'];
    const C = {
      help: () => `Commands: ${Object.keys(C).filter(k=>!HIDDEN.includes(k)).map(k=>`<b>${k}</b>`).join(' \u00B7 ')}<br><span class="dim">Tip: Tab autocompletes, \u2191 \u2193 recalls history.</span>`,
      about: () => 'I\u2019m Nestlie, a BSIT student at the University of Cebu Main Campus who loves turning ideas into useful, thoughtful digital experiences.',
      whoami: () => 'Nestlie Dela Pe\u00F1a \u00B7 BSIT student \u00B7 Student Affairs Office \u2013 Student Core Group.',
      role: () => 'Chief Representative with the Student Affairs Office \u2013 Student Core Group (SAO-SCG).',
      skills: () => 'HTML &amp; CSS \u00B7 JavaScript \u00B7 Java \u00B7 C# / C++ / C \u00B7 Python (learning) \u00B7 Databases \u00B7 UI/UX thinking \u00B7 Debugging',
      projects: () => 'SAO-SCG OMIS capstone (React + Laravel) \u00B7 Python student records menu \u00B7 This portfolio. Try <b>goto projects</b>.',
      experience: () => 'Office Assistant (real estate) \u00B7 Chief Representative at SAO-SCG \u00B7 BSIT student. Try <b>goto experience</b>.',
      languages: () => 'English \u00B7 Filipino \u00B7 Cebuano',
      motto: () => '\u201CStay curious. Build with purpose.\u201D',
      contact: () => 'Email: <a href="mailto:nestlierocaldelapena@gmail.com">nestlierocaldelapena@gmail.com</a><br>GitHub: <a href="https://github.com/NestlieDelaPena-UCM" target="_blank" rel="noopener noreferrer">github.com/NestlieDelaPena-UCM</a><br>LinkedIn: <a href="https://www.linkedin.com/in/nestlie-dela-pe%C3%B1a-758179413/" target="_blank" rel="noopener noreferrer">linkedin.com/in/nestlie-dela-peña</a><br>Facebook: <a href="https://www.facebook.com/nestliedp" target="_blank" rel="noopener noreferrer">facebook.com/nestliedp</a>',
      idea: () => {
        const i = IDEAS[Math.floor(Math.random() * IDEAS.length)];
        return `Mini-project idea: <b>${esc(i)}</b><br><span class="dim">Run <b>idea</b> again for another one.</span>`
      },
      theme: a => {
        const v = (a[0] || 'toggle').toLowerCase();
        const t = v === 'toggle' ? (root.dataset.theme === 'dark' ? 'light' : 'dark') : v;
        if (t !== 'light' && t !== 'dark') return 'Usage: <b>theme light</b> | <b>theme dark</b> | <b>theme toggle</b>';
        setTheme(t);
        return `Theme set to <b>${t}</b>.`
      },
      accent: a => {
        const v = (a[0] || '').toLowerCase();
        return setAccent(v) ? `Accent set to <b>${v}</b>.` : 'Usage: <b>accent blue</b> | <b>purple</b> | <b>teal</b> | <b>pink</b>'
      },
      goto: a => {
        const id = GO[(a[0] || '').toLowerCase()];
        if (!id) return `Where to? Try: ${Object.keys(GO).map(k=>`<b>${k}</b>`).join(' \u00B7 ')}`;
        setTimeout(() => {
          const el = $('#' + id);
          if (el) el.scrollIntoView({
            behavior: reduce ? 'auto' : 'smooth',
            block: 'start'
          })
        }, 250);
        return `Heading to <b>${esc(a[0].toLowerCase())}</b>\u2026`
      },
      confetti: () => {
        for (let i = 0; i < 7; i++) setTimeout(() => pop(Math.random() * innerWidth, Math.random() * innerHeight * .7, 26), i * 110);
        return 'Pop pop! \uD83C\uDF89'
      },
      intro: () => {
        if (window.__intro) window.__intro(true);
        return 'Replaying the intro…';
      },
      date: () => new Date().toLocaleString(),
      clear: () => {
        tb.innerHTML = '';
        return null
      },
      sudo: a => a.join(' ').toLowerCase() === 'hire nestlie' ? 'Permission granted \uD83D\uDE04 Please email <a href="mailto:nestlierocaldelapena@gmail.com">nestlierocaldelapena@gmail.com</a> to continue.' : 'Nice try. Only <b>sudo hire nestlie</b> works here.'
    };

    function run(line) {
      const t = line.trim();
      if (!t) return;
      print(`<span class="pr">\u276F</span> ${esc(t)}`);
      history.push(t);
      hIdx = history.length;
      const parts = t.split(/\s+/),
        cmd = parts[0].toLowerCase(),
        args = parts.slice(1);
      if (!Object.prototype.hasOwnProperty.call(C, cmd)) {
        print(`Command not found: <b>${esc(cmd)}</b>. Try <b>help</b>.`);
        return
      }
      const out = C[cmd](args);
      if (out) print(out);
    }
    tf.addEventListener('submit', e => {
      e.preventDefault();
      run(ti.value);
      ti.value = ''
    });
    ti.addEventListener('keydown', e => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (hIdx > 0) ti.value = history[--hIdx] || ''
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        hIdx = Math.min(history.length, hIdx + 1);
        ti.value = history[hIdx] || ''
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const v = ti.value.trim().toLowerCase();
        if (v && !v.includes(' ')) {
          const m = Object.keys(C).filter(k => k.startsWith(v) && !HIDDEN.includes(k));
          if (m.length === 1) ti.value = m[0]
        }
      }
    });
    $$('.term-chips button').forEach(b => b.addEventListener('click', () => run(b.dataset.cmd)));
    print('Hi! I\u2019m Nestlie\u2019s little terminal. Type <b>help</b> to see what I can do.', 'dim');
    window.__focusTerm = () => {
      const s = $('#ask');
      if (s) s.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'center'
      });
      setTimeout(() => ti.focus({
        preventScroll: true
      }), 450)
    };
  }
  const form = $('#mailForm');
  if (form) {
    const n = $('#mName'),
      m = $('#mEmail'),
      g = $('#mMsg'),
      c = $('#mCount'),
      err = $('#mErr');
    g.addEventListener('input', () => {
      c.textContent = `${g.value.length} / 500`
    });
    [n, m, g].forEach(el => el.addEventListener('input', () => {
      el.classList.remove('bad');
      err.textContent = ''
    }));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const bad = [];
      if (n.value.trim().length < 2) bad.push(n);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim())) bad.push(m);
      if (g.value.trim().length < 10) bad.push(g);
      [n, m, g].forEach(el => el.classList.toggle('bad', bad.includes(el)));
      if (bad.length) {
        err.textContent = bad[0] === n ? 'Please tell me your name.' : bad[0] === m ? 'That email doesn\u2019t look right.' : 'Please write at least a short message (10+ characters).';
        bad[0].focus();
        return
      }
      const subject = encodeURIComponent(`Portfolio message from ${n.value.trim()}`);
      const body = encodeURIComponent(`${g.value.trim()}\n\n\u2014 ${n.value.trim()} (${m.value.trim()})`);
      say('Opening your email app\u2026 \u2709\uFE0F');
      const r = form.getBoundingClientRect();
      pop(r.left + r.width / 2, r.top + r.height / 2, 30);
      setTimeout(() => {
        location.href = `mailto:nestlierocaldelapena@gmail.com?subject=${subject}&body=${body}`
      }, 600);
    });
  }
  const KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kpos = 0;
  addEventListener('keydown', e => {
    if (/^(input|textarea|select)$/i.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kpos = (k === KON[kpos]) ? kpos + 1 : (k === KON[0] ? 1 : 0);
    if (kpos === KON.length) {
      kpos = 0;
      say('Konami unlocked! You found the secret \u2728');
      for (let i = 0; i < 10; i++) setTimeout(() => pop(Math.random() * innerWidth, Math.random() * innerHeight * .6, 30), i * 140)
    }
    if ($('#lb.open')) return;
    if (k === 't') {
      setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
      say(`Theme: ${root.dataset.theme}`)
    } else if (k === '/') {
      e.preventDefault();
      window.__focusTerm && window.__focusTerm()
    } else if (k === '?') say('Shortcuts: T theme \u00B7 / terminal \u00B7 \u2191\u2191\u2193\u2193\u2190\u2192\u2190\u2192 B A ???')
  });
  setTimeout(() => say('Psst\u2026 press ? for shortcuts, or click my photo! \uD83D\uDC4B'), 2800);
})();;
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const say = m => {
    if (typeof toast === 'function') toast(m);
  };
  const pop = (x, y, n, c) => {
    if (window.__burst) window.__burst(x, y, n, c);
  };
  let template = '';

  function runIntro(force) {
    let el = $('#intro');
    if (!template && el) template = el.outerHTML;
    if (force) {
      if (el) el.remove();
      if (!template) return;
      document.body.insertAdjacentHTML('afterbegin', template);
      el = $('#intro');
      el.classList.remove('out');
      document.documentElement.classList.remove('intro-skip');
    }
    if (!el) return;
    try {
      sessionStorage.setItem('nd-intro', '1');
    } catch (e) {}
    let done = false;
    const close = () => {
      if (done) return;
      done = true;
      el.classList.add('out');
      setTimeout(() => el.remove(), 1000);
    };
    el.addEventListener('click', close);
    el.addEventListener('wheel', e => e.preventDefault(), {
      passive: false
    });
    const onKey = e => {
      if (e.key === 'Escape' || e.key === 'Enter') {
        close();
        removeEventListener('keydown', onKey);
      }
    };
    addEventListener('keydown', onKey);
    setTimeout(close, 2600);
  }
  window.__intro = runIntro;
  runIntro(false);
  const lead = $('.lead-photo');
  const leadImg = lead && $('img', lead);
  if (leadImg) {
    const wrap = document.createElement('div');
    wrap.className = 'spot-wrap';
    leadImg.parentNode.insertBefore(wrap, leadImg);
    wrap.appendChild(leadImg);
    wrap.insertAdjacentHTML('beforeend', '<div class="spot"></div><div class="spot-ring"></div><span class="spot-hint">\u2726 Move to spotlight</span>');
    const move = e => {
      const r = wrap.getBoundingClientRect();
      wrap.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      wrap.style.setProperty('--sy', (e.clientY - r.top) + 'px');
      wrap.classList.add('lit');
    };
    wrap.addEventListener('pointermove', move);
    wrap.addEventListener('pointerdown', move);
    wrap.addEventListener('pointerleave', () => wrap.classList.remove('lit'));
    wrap.addEventListener('pointerup', e => {
      if (e.pointerType !== 'mouse') wrap.classList.remove('lit');
    });
  }
  $$('.timeline').forEach(tl => {
    const items = $$('.time-item', tl);
    tl.insertAdjacentHTML('afterbegin', '<span class="tl-track" aria-hidden="true"><i class="tl-fill"></i></span>');
    const fill = $('.tl-fill', tl);
    let queued = false;
    const update = () => {
      queued = false;
      const r = tl.getBoundingClientRect();
      const line = innerHeight * .68;
      const p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      fill.style.transform = `scaleY(${p})`;
      items.forEach(it => it.classList.toggle('on', it.getBoundingClientRect().top < line));
    };
    const schedule = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    addEventListener('scroll', schedule, {
      passive: true
    });
    addEventListener('resize', schedule);
    update();
  });
  const wall = $('#wall');
  const form = $('#kindForm');
  if (wall && form) {
    const KEY = 'nd-notes';
    const COLORS = {
      yellow: '#fff3b0',
      pink: '#ffd6e7',
      blue: '#cfe6ff',
      mint: '#d3f5e6'
    };
    const seed = {
      id: 'seed',
      name: 'Nestlie',
      text: 'Stay curious. Build with purpose.',
      color: 'blue',
      rot: -2,
      seed: true
    };
    let notes = null;
    try {
      notes = JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch (e) {
      notes = null;
    }
    if (!Array.isArray(notes) || !notes.length) notes = [seed];
    const save = () => {
      try {
        localStorage.setItem(KEY, JSON.stringify(notes));
      } catch (e) {}
    };
    const render = newId => {
      wall.innerHTML = '';
      if (!notes.length) {
        wall.innerHTML = '<p class="wall-empty">The board is empty. Be the first to pin a note!</p>';
        return;
      }
      notes.forEach(n => {
        const a = document.createElement('article');
        a.className = 'note' + (n.id === newId ? ' drop' : '');
        a.style.background = COLORS[n.color] || COLORS.yellow;
        a.style.setProperty('--r', (n.rot || 0) + 'deg');
        const p = document.createElement('p');
        p.textContent = n.text;
        const f = document.createElement('footer');
        f.textContent = '\u2014 ' + n.name;
        a.append(p, f);
        if (!n.seed) {
          const d = document.createElement('button');
          d.type = 'button';
          d.className = 'del';
          d.setAttribute('aria-label', 'Remove this note');
          d.textContent = '\u2715';
          d.addEventListener('click', () => {
            notes = notes.filter(x => x.id !== n.id);
            save();
            render();
          });
          a.appendChild(d);
        }
        wall.appendChild(a);
      });
    };
    render();
    let color = 'yellow';
    const swatches = $$('.kind-colors button', form);
    swatches.forEach(b => b.addEventListener('click', () => {
      color = b.dataset.c;
      swatches.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    }));
    const text = $('#kText'),
      name = $('#kName'),
      count = $('#kCount'),
      err = $('#kErr');
    text.addEventListener('input', () => {
      count.textContent = text.value.length + ' / 120';
      err.textContent = '';
      text.classList.remove('bad');
    });
    form.addEventListener('submit', e => {
      e.preventDefault();
      const t = text.value.trim();
      if (t.length < 3) {
        err.textContent = 'Write a short note first (3+ characters).';
        text.classList.add('bad');
        text.focus();
        return;
      }
      const note = {
        id: 'n' + Date.now(),
        name: name.value.trim().slice(0, 24) || 'Anonymous',
        text: t.slice(0, 120),
        color,
        rot: Math.round((Math.random() * 8 - 4) * 10) / 10
      };
      notes.unshift(note);
      notes = notes.slice(0, 24);
      save();
      render(note.id);
      text.value = '';
      count.textContent = '0 / 120';
      const r = wall.getBoundingClientRect();
      pop(r.left + 120, r.top + 60, 26, ['#ff85b3', '#ffd36e', '#8b7cff', '#48e0c1']);
      say('Note pinned! Thank you for the kindness \uD83D\uDC99');
    });
    const hello = $('#helloBtn');
    if (hello) hello.addEventListener('click', () => {
      const s = $('#kindness');
      if (s) s.scrollIntoView({
        behavior: reduce ? 'auto' : 'smooth',
        block: 'center'
      });
      setTimeout(() => text.focus({
        preventScroll: true
      }), 600);
    });
  }
})();;
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  $$('.proj').forEach(card => {
    const btn = $('.proj-toggle', card);
    const more = $('.proj-more', card);
    btn.addEventListener('click', () => {
      const open = card.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      more.style.maxHeight = open ? more.scrollHeight + 'px' : '0px';
    });
  });
})();