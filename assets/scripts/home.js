(async () => {
  const shelf = document.querySelector('.shelf');
  const count = document.querySelector('.book-count');
  if (!shelf || !count) return;

  const scriptUrl = document.currentScript?.src;
  const siteRoot = scriptUrl ? new URL('../../', scriptUrl) : new URL('./', window.location.href);

  try {
    const response = await fetch(new URL('assets/data/stories.json', siteRoot));
    if (!response.ok) throw new Error(`Story shelf returned ${response.status}`);

    const { stories } = await response.json();
    if (!Array.isArray(stories)) throw new Error('Story shelf data is invalid');

    const cards = document.createDocumentFragment();

    stories.forEach((story) => {
      const link = document.createElement('a');
      link.className = 'book-card';
      link.href = new URL(story.href, siteRoot).href;

      const article = document.createElement('article');
      article.className = 'card-inner';

      const cover = document.createElement('div');
      cover.className = 'cover';

      const image = document.createElement('img');
      image.src = new URL(story.cover, siteRoot).href;
      image.alt = story.alt;
      cover.append(image);

      const copy = document.createElement('div');
      copy.className = 'card-copy';

      const title = document.createElement('h3');
      title.textContent = story.title;

      const description = document.createElement('p');
      description.textContent = story.description;

      const read = document.createElement('span');
      read.className = 'read';
      read.append(document.createTextNode('Read this story '));

      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      read.append(arrow);

      copy.append(title, description, read);
      article.append(cover, copy);
      link.append(article);
      cards.append(link);
    });

    shelf.replaceChildren(cards);
    count.textContent = `${stories.length} ${stories.length === 1 ? 'book' : 'books'} to read`;
  } catch (error) {
    console.error('Could not load the story shelf.', error);
    count.textContent = 'Stories unavailable';
    shelf.textContent = 'The story shelf could not be loaded. Please refresh the page.';
  }
})();
