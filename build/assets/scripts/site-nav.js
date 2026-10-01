(async () => {
  const navigation = document.querySelector('.site-nav[data-current]');
  if (!navigation) return;

  const scriptUrl = document.currentScript?.src;
  const siteRoot = scriptUrl ? new URL('../../', scriptUrl) : new URL('../', window.location.href);

  try {
    const response = await fetch(new URL('assets/data/stories.json', siteRoot));
    if (!response.ok) throw new Error(`Story navigation returned ${response.status}`);

    const { stories } = await response.json();
    if (!Array.isArray(stories)) throw new Error('Story navigation data is invalid');

    const inner = document.createElement('div');
    inner.className = 'site-nav__inner';

    const home = document.createElement('a');
    home.href = new URL('./', siteRoot).href;
    home.textContent = '⌂ Home';
    inner.append(home);

    stories.forEach((story) => {
      const link = document.createElement('a');
      link.href = new URL(story.href, siteRoot).href;
      link.textContent = story.navLabel;
      if (navigation.dataset.current === story.id) link.setAttribute('aria-current', 'page');
      inner.append(link);
    });

    navigation.append(inner);

    const current = inner.querySelector('[aria-current="page"]');
    if (current) {
      requestAnimationFrame(() => {
        inner.scrollLeft = Math.max(0, current.offsetLeft - (inner.clientWidth - current.clientWidth) / 2);
      });
    }
  } catch (error) {
    console.error('Could not load the story navigation.', error);
    navigation.hidden = true;
  }
})();
