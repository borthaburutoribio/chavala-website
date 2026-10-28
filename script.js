// Chavala: filtro de prendas, consultas por WhatsApp, horario en vivo y compartir.
(() => {
  const WA = '5492923698155';
  const wa = text => `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  /* ---------- WhatsApp con texto armado ---------- */
  document.querySelectorAll('[data-wa]').forEach(a => { a.href = wa('Hola Chavala! Les escribo desde la página.'); });
  document.querySelectorAll('[data-gift]').forEach(a => { a.href = wa('Hola Chavala! Quiero una gift card. ¿Cómo hago?'); });
  document.querySelectorAll('[data-ask]').forEach(a => {
    a.href = wa(`Hola Chavala! Vi en la página ${a.dataset.ask}. ¿Les queda en mi talle?`);
    a.target = '_blank';
    a.rel = 'noopener';
  });

  /* ---------- Filtro de prendas ---------- */
  const filters = document.querySelector('[data-filters]');
  const cards = document.querySelectorAll('[data-grid] .card');
  filters?.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    filters.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    const f = b.dataset.f;
    cards.forEach(c => { c.hidden = f !== 'todo' && c.dataset.cat !== f; });
  });

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
})();
