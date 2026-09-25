(() => {
  const pages = [...document.querySelectorAll('.page')];
  const count = document.querySelector('.count');
  const previous = document.getElementById('prev');
  const next = document.getElementById('next');
  const readAll = document.getElementById('all');
  let current = 0;

  if (!pages.length || !count || !previous || !next || !readAll) return;

  document.querySelectorAll('.scene img').forEach((image) => {
    const markBroken = () => image.closest('.scene')?.classList.add('broken');
    image.addEventListener('error', markBroken);
    if (image.complete && image.naturalWidth === 0) markBroken();
  });

  function show(pageNumber) {
    current = Math.max(0, Math.min(pageNumber, pages.length - 1));
    pages.forEach((page, index) => page.classList.toggle('active', index === current));
    count.textContent = `Page ${current + 1} of ${pages.length}`;
    previous.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  readAll.addEventListener('click', () => {
    document.body.classList.toggle('read-all');
    const showingAll = document.body.classList.contains('read-all');
    readAll.textContent = showingAll ? 'Page-turn view' : 'Read all pages';
    if (!showingAll) show(current);
  });

  document.addEventListener('keydown', (event) => {
    if (document.body.classList.contains('read-all')) return;
    if (event.key === 'ArrowRight') show(current + 1);
    if (event.key === 'ArrowLeft') show(current - 1);
  });

  show(0);
})();
