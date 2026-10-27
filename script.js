// Chavala: el perchero del hero, lo que llegó, la gift card, el horario en vivo y los WhatsApp armados.
(() => {
  const doc = document.documentElement;
  doc.classList.add('js');
  // A CONFIRMAR: número de WhatsApp del local. Mientras esté vacío, wa.me abre WhatsApp para elegir el contacto.
  const WA = '';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wa = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  /* ---------- El perchero: mismo pantalón, otra parte de arriba ---------- */
  const LOOKS = {
    blanco: {
      label: 'pantalón blanco',
      tops: [
        ['camisa-rayada-celeste', 'Camisa rayada celeste'],
        ['blusa-floreada-azul', 'Blusa floreada azul'],
        ['polo-fucsia', 'Polo fucsia'],
        ['camisa-azul-marino', 'Camisa azul marino'],
        ['remera-rayada-beige', 'Remera rayada beige'],
        ['remera-rayada-marron', 'Remera rayada marrón'],
        ['remera-marinera', 'Remera marinera'],
        ['remera-rayada-gris', 'Remera rayada gris'],
        ['campera-de-jean', 'Campera de jean'],
        ['saco-largo-negro', 'Saco largo negro']
      ],
      src: s => `assets/img/look-pantalon-blanco-${s}.jpg`
    },
    jean: {
      label: 'jean claro',
      tops: [
        ['chaleco-de-jean', 'Chaleco de jean'],
        ['remera-animal-print', 'Remera animal print'],
        ['musculosa-verde-oliva', 'Musculosa verde oliva'],
        ['remera-cebra', 'Remera cebra'],
        ['remera-negra-estampada', 'Remera negra estampada'],
        ['remera-metalizada', 'Remera metalizada'],
        ['camisa-blanca', 'Camisa blanca']
      ],
      src: s => `assets/img/look-jean-claro-${s}.jpg`
    }
  };

  const looks = document.querySelector('[data-looks]');
  const topsEl = document.querySelector('[data-tops]');
  const imgs = [...document.querySelectorAll('.tile-img')];
  const countEl = document.querySelector('[data-count]');
  const nameEl = document.querySelector('[data-name]');
  const lookWa = document.querySelector('[data-look-wa]');
  let pant = 'blanco', idx = 0, front = 0, auto = null, touched = false;

  const show = (p, i) => {
    const set = LOOKS[p];
    const [slug, name] = set.tops[i];
    pant = p; idx = i;
    const back = imgs[1 - front];
    const url = set.src(slug);
    const swap = () => {
      back.classList.add('is-on');
      imgs[front].classList.remove('is-on');
      front = 1 - front;
    };
    if (imgs[front].getAttribute('src') !== url) {
      back.alt = `${name} colgada al lado del ${set.label} en el perchero de madera de Chavala`;
      back.onload = swap;
      back.src = url;
      if (back.complete && back.naturalWidth) { back.onload = null; swap(); }
    }
    countEl.textContent = `Mismo ${set.label}, look ${i + 1} de ${set.tops.length}.`;
    nameEl.textContent = name;
    lookWa.href = wa(`Hola Chavala! Vi en la web el look ${name.toLowerCase()} con ${set.label}. ¿Lo tienen en mi talle? Uso talle: `);
    topsEl.querySelectorAll('button').forEach((b, n) => b.setAttribute('aria-pressed', String(n === i)));
    // precarga la siguiente
    const nx = set.tops[(i + 1) % set.tops.length];
    if (nx) { const im = new Image(); im.src = set.src(nx[0]); }
  };

  const renderTops = () => {
    topsEl.innerHTML = LOOKS[pant].tops.map(([, n], i) => `<li><button type="button" aria-pressed="${i === 0}">${n}</button></li>`).join('');
    looks.querySelectorAll('[data-pant]').forEach(b => b.setAttribute('aria-selected', String(b.dataset.pant === pant)));
  };

  topsEl.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    touched = true; stopAuto();
    const i = [...topsEl.querySelectorAll('button')].indexOf(b);
    show(pant, i);
    if (matchMedia('(max-width: 760px)').matches) b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
  });
  looks.querySelectorAll('[data-pant]').forEach(b => b.addEventListener('click', () => {
    touched = true; stopAuto();
    pant = b.dataset.pant; renderTops(); show(pant, 0);
    topsEl.scrollLeft = 0;
  }));

  // Fundido lento: si nadie toca, el perchero va cambiando solo
  const tick = () => { if (!document.hidden && !touched) show(pant, (idx + 1) % LOOKS[pant].tops.length); };
  const startAuto = () => { if (!reduce && !auto) auto = setInterval(tick, 5600); };
  const stopAuto = () => { clearInterval(auto); auto = null; };
  renderTops(); show('blanco', 0); startAuto();

  /* ---------- Lo que llegó ---------- */
  const llego = document.querySelector('[data-llego]');
  const llegoImgs = document.querySelectorAll('.llego-img');
  const disc = document.querySelector('[data-disc]');
  const factEl = document.querySelector('[data-llego-fact]');
  const discColors = ['var(--accent)', 'var(--oak)', '#c9d9d4', 'var(--accent)', 'var(--surface)'];
  llego.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const i = +b.dataset.i;
    llego.querySelectorAll('button').forEach(x => x.setAttribute('aria-selected', String(x === b)));
    llegoImgs.forEach((im, n) => im.classList.toggle('is-on', n === i));
    disc.style.backgroundColor = discColors[i];
    factEl.textContent = b.dataset.fact;
  });

  /* ---------- Consultar una prenda ---------- */
  document.querySelectorAll('[data-ask]').forEach(a => {
    a.href = wa(`Hola Chavala! Vi en la web ${a.dataset.ask}. ¿Queda en mi talle? Uso talle: `);
    a.target = '_blank'; a.rel = 'noopener';
  });
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = wa('Hola Chavala! Vi la web y quería consultar: '); });

  /* ---------- Gift card ---------- */
  const gform = document.querySelector('[data-gform]');
  const g = k => gform.elements[k].value.trim();
  const gAmount = document.querySelector('[data-g-amount]');
  const gPara = document.querySelector('[data-g-para]');
  const gDe = document.querySelector('[data-g-de]');
  const gMsg = document.querySelector('[data-g-msg]');
  const gSend = document.querySelector('[data-g-send]');
  const money = v => v ? '$ ' + Number(v).toLocaleString('es-AR') : '$ —';
  const renderGift = () => {
    const m = g('monto').replace(/\D/g, '');
    gform.elements.monto.value = m ? Number(m).toLocaleString('es-AR') : '';
    gAmount.textContent = money(m);
    gPara.textContent = g('para') || 'alguien lindo';
    gDe.textContent = g('de') || 'vos';
    gMsg.textContent = g('msg') ? `“${g('msg')}”` : '';
    let t = 'Hola Chavala! Quiero una gift card';
    t += m ? ` de ${money(m)}` : ' (todavía no sé el monto, ¿me ayudan?)';
    if (g('para')) t += ` para ${g('para')}`;
    if (g('de')) t += `, de parte de ${g('de')}`;
    t += '.';
    if (g('msg')) t += ` Mensaje para la tarjeta: "${g('msg')}".`;
    t += ' ¿Cómo la pago y cuándo la retiro?';
    gSend.href = wa(t);
  };
  gform.addEventListener('input', renderGift);
  gform.addEventListener('submit', e => e.preventDefault());
  renderGift();

  /* ---------- Horario en vivo (hora de Argentina) ---------- */
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Argentina/Buenos_Aires' }));
  const mins = now.getHours() * 60 + now.getMinutes();
  const day = now.getDay();
  const ranges = [[540, 750], [960, 1200]];
  const fmt = m => `${Math.floor(m / 60)}${m % 60 ? ':' + String(m % 60).padStart(2, '0') : ''}`;
  let msg;
  const open = day !== 0 && ranges.find(([a, b]) => mins >= a && mins < b);
  if (open) msg = `<b>Abierto ahora</b>, hasta las ${fmt(open[1])}.`;
  else {
    const next = day !== 0 && ranges.find(([a]) => mins < a);
    if (next) msg = `<b>Cerrado ahora.</b> Abrimos a las ${fmt(next[0])}.`;
    else msg = `<b>Cerrado ahora.</b> Abrimos ${day === 6 ? 'el lunes' : 'mañana'} a las 9.`;
  }
  document.querySelectorAll('[data-status]').forEach(s => { s.innerHTML = msg; });

  /* ---------- Compartir ---------- */
  const share = document.querySelector('[data-share]');
  share?.addEventListener('click', async () => {
    const data = { title: 'Chavala · Coronel Pringles', text: 'Mirá Chavala, en Rivadavia 1047', url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(location.href); share.textContent = 'Link copiado'; }
    } catch (e) {}
  });

  /* ---------- Entradas escalonadas ---------- */
  const groups = document.querySelectorAll('.corto, .llego-list, .perchero > h2, .perchero > p, .cat, .nosotras .panel, .gift-form, .gift-card-wrap, .faq, .visita .card, .postal');
  groups.forEach(gr => {
    const kids = gr.matches('.gift-card-wrap') ? [gr] :
      gr.querySelectorAll(':scope > h2, :scope > h3, :scope > p, :scope > ul, :scope > dl > div, :scope > .cat-head, :scope > .items > li, :scope > div, :scope > a, :scope > form, :scope > table, :scope > details');
    (kids.length ? kids : [gr]).forEach((k, i) => { k.classList.add('r'); k.style.setProperty('--d', Math.min(i, 8) * 75 + 'ms'); });
  });
  document.querySelectorAll('.hero > *').forEach((k, i) => { k.classList.add('r'); k.style.setProperty('--d', i * 90 + 'ms'); });
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.r, .seq-frame').forEach(el => io.observe(el));
})();
