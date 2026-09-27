(() => {
  const navigation = document.querySelector('.site-nav[data-current]');
  if (!navigation) return;

  const stories = [
    ['grumpy-finds-a-baby', 'Grumpy Finds a Baby', 'GrumpyFindsABaby/'],
    ['arlo-makes-room', 'Arlo Makes Room', 'Arlo-Makes-Room/'],
    ['dog-tired', 'Dog-Tired Day', 'DogTired/'],
    ['golden-egg', 'Goldie’s Egg', 'GoldenEgg/'],
    ['hungry-bird', 'Hungry Chickens', 'HungryBird/'],
    ['nose-work', 'Scent of Home', 'NoseWork/'],
    ['yard-boat', 'Yard Boat', 'YardBoat/'],
    ['grumpyland-and-the-bridge', 'GrumpyLand Bridge', 'GrumpyLand-and-the-Bridge/'],
    ['grumpy-keeps-snoring', 'Grumpy Keeps Snoring', 'GrumpyKeptSnoring/']
  ];

  const scriptUrl = document.currentScript?.src;
  const siteRoot = scriptUrl ? new URL('../../', scriptUrl) : new URL('../', window.location.href);

  const inner = document.createElement('div');
  inner.className = 'site-nav__inner';

  const home = document.createElement('a');
  home.href = new URL('./', siteRoot).href;
  home.textContent = '⌂ Home';
  inner.append(home);

  stories.forEach(([id, label, href]) => {
    const link = document.createElement('a');
    link.href = new URL(href, siteRoot).href;
    link.textContent = label;
    if (navigation.dataset.current === id) link.setAttribute('aria-current', 'page');
    inner.append(link);
  });

  navigation.append(inner);

  const current = inner.querySelector('[aria-current="page"]');
  if (current) {
    requestAnimationFrame(() => {
      inner.scrollLeft = Math.max(0, current.offsetLeft - (inner.clientWidth - current.clientWidth) / 2);
    });
  }
})();
