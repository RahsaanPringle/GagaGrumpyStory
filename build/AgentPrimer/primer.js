$(function () {
  const $root = $(document.documentElement);
  const savedTheme = localStorage.getItem('agent-primer-theme');
  if (savedTheme) $root.attr('data-bs-theme', savedTheme);

  function syncThemeButton() {
    const dark = $root.attr('data-bs-theme') === 'dark';
    $('#themeToggle')
      .attr('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme')
      .html(`<i class="bi bi-${dark ? 'sun' : 'moon-stars'}"></i>`);
  }
  syncThemeButton();

  $('#themeToggle').on('click', function () {
    const theme = $root.attr('data-bs-theme') === 'dark' ? 'light' : 'dark';
    $root.attr('data-bs-theme', theme);
    localStorage.setItem('agent-primer-theme', theme);
    syncThemeButton();
  });

  $(window).on('scroll resize', function () {
    const scrollable = $(document).height() - $(window).height();
    const progress = scrollable > 0 ? ($(window).scrollTop() / scrollable) * 100 : 0;
    $('#readingProgress').css('width', `${Math.min(100, progress)}%`);
  }).trigger('scroll');

  $('.anatomy-item').on('click', function () {
    $('.anatomy-item').removeClass('active');
    $(this).addClass('active');
  });

  $('.filter-chip').on('click', function () {
    const filter = $(this).data('filter');
    $('.filter-chip').removeClass('active').attr('aria-pressed', 'false');
    $(this).addClass('active').attr('aria-pressed', 'true');
    $('.option-wrap').each(function () {
      const matches = filter === 'all' || String($(this).data('tags')).split(' ').includes(filter);
      $(this).toggleClass('filtered-out', !matches);
    });
  });

  const recommendations = {
    observer: {
      kicker: 'Read-only observer',
      title: 'A scheduled briefing agent',
      body: 'Let a platform wake the agent on a schedule, read a fixed list of sources, and deliver a private, cited summary. It cannot change anything.',
      autonomy: 'Level 2 — supervised',
      trigger: 'Daily or weekly schedule',
      control: 'Read-only connections',
      measure: 'Coverage + citation accuracy',
      example: 'Every weekday at 7:00 AM, compare my calendar, project board, and five saved sources. Send a one-page brief and flag conflicts.'
    },
    workflow: {
      kicker: 'Structured workflow',
      title: 'Automation with AI judgment in the middle',
      body: 'Use a visual workflow for the predictable steps and call the model only where language or judgment is needed. Keep the final action as a draft or approval.',
      autonomy: 'Level 2–3',
      trigger: 'New item or status change',
      control: 'Approval before external action',
      measure: 'Correct routing + time saved',
      example: 'When a support email arrives, extract the request, classify urgency, draft a response, and route uncertain cases to me.'
    },
    workspace: {
      kicker: 'Workspace agent',
      title: 'A supervised project or coding agent',
      body: 'Give an agent an isolated workspace, a concrete finish line, and tools to inspect and change files. Require tests and a human review before merging or publishing.',
      autonomy: 'Level 2 — supervised',
      trigger: 'Manual task or issue',
      control: 'Isolated branch / folder',
      measure: 'Accepted changes + defects',
      example: 'Investigate this issue, reproduce it, prepare the smallest fix, run the test suite, and show me the change for review.'
    },
    researcher: {
      kicker: 'Research copilot',
      title: 'An on-demand research agent',
      body: 'Use an agent that can search, open sources, compare evidence, and cite claims. Start manually because the task is open-ended and benefits from steering.',
      autonomy: 'Level 1–2',
      trigger: 'Manual request',
      control: 'Read-only + source rules',
      measure: 'Evidence quality + omissions',
      example: 'Compare these three options against my criteria. Use primary sources, note uncertainty, and give me a decision memo—not a purchase.'
    },
    bounded: {
      kicker: 'Bounded operator',
      title: 'A fenced workflow with reversible actions',
      body: 'Combine a deterministic workflow with an agent for exceptions. Limit which records it may touch, cap each run, keep a full log, and make changes easy to undo.',
      autonomy: 'Level 3 — bounded',
      trigger: 'Schedule or system event',
      control: 'Scope + budget + rollback',
      measure: 'Successful runs + exceptions',
      example: 'Review new documents, extract fields, move valid files into staging, and quarantine anything uncertain. Never delete or publish.'
    }
  };

  function chooseRecommendation() {
    const work = $('input[name="work"]:checked').val();
    const predictability = $('input[name="predictability"]:checked').val();
    const authority = $('input[name="authority"]:checked').val();
    if (work === 'systems') return authority === 'act' ? recommendations.bounded : recommendations.workspace;
    if (predictability === 'low') return recommendations.researcher;
    if (work === 'communication' || authority === 'draft') return recommendations.workflow;
    if (authority === 'act') return recommendations.bounded;
    return recommendations.observer;
  }

  function renderRecommendation() {
    const rec = chooseRecommendation();
    $('#recommendationContent').html(`
      <p class="rec-kicker">${rec.kicker}</p>
      <h3>${rec.title}</h3>
      <p>${rec.body}</p>
      <div class="rec-specs">
        <div><small>Autonomy</small><b>${rec.autonomy}</b></div>
        <div><small>Trigger</small><b>${rec.trigger}</b></div>
        <div><small>Primary control</small><b>${rec.control}</b></div>
        <div><small>Measure first</small><b>${rec.measure}</b></div>
      </div>
      <p class="rec-example"><i class="bi bi-chat-left-quote"></i><span>${rec.example}</span></p>
    `);
  }
  $('#agentFinder input').on('change', renderRecommendation);
  renderRecommendation();

  $('#copyBrief').on('click', async function () {
    const text = $('#briefTemplate pre').text().trim();
    try {
      await navigator.clipboard.writeText(text);
      $('#copyStatus').text('Copied to your clipboard.');
    } catch (error) {
      const $temp = $('<textarea>').val(text).appendTo('body').select();
      document.execCommand('copy');
      $temp.remove();
      $('#copyStatus').text('Copied to your clipboard.');
    }
    setTimeout(() => $('#copyStatus').text(''), 2500);
  });

  $('.navbar-collapse a').on('click', function () {
    const nav = bootstrap.Collapse.getInstance(document.getElementById('primerNav'));
    if (nav) nav.hide();
  });
});
