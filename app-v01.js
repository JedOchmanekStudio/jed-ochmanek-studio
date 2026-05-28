(function () {
  function injectFinalRuntimeCss() {
    if (document.getElementById('joRuntimeFinalCss')) return;

    var style = document.createElement('style');
    style.id = 'joRuntimeFinalCss';
    style.textContent = `
      body .jo-news-page {
        background: #fff !important;
        color: #000 !important;
      }

      body .jo-news-page .jo-news-wrap {
        width: calc(100vw - var(--content-left) - var(--gutter)) !important;
        min-width: 0 !important;
        max-width: none !important;
        margin-left: var(--content-left) !important;
        margin-right: var(--gutter) !important;
        padding-top: 42px !important;
        padding-bottom: 180px !important;
      }

      body .jo-news-page .jo-news-entry,
      body .jo-news-page .jo-news-minor {
        display: grid !important;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
        grid-template-areas:
          "date image"
          "info image" !important;
        column-gap: var(--gutter) !important;
        row-gap: 0 !important;
        align-items: start !important;
        margin: 0 0 120px 0 !important;
        padding: 0 !important;
      }

      body .jo-news-page .jo-news-date {
        grid-area: date !important;
        width: auto !important;
        margin: 0 0 4em 0 !important;
        padding: 0 !important;
        color: rgba(0,0,0,.45) !important;
      }

      body .jo-news-page .jo-news-info {
        grid-area: info !important;
        width: auto !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
      }

      body .jo-news-page .jo-news-image-wrap,
      body .jo-news-page .jo-news-slideshow {
        grid-area: image !important;
        width: 100% !important;
        max-width: none !important;
        margin: 0 !important;
        padding: 0 !important;
        display: block !important;
      }

      body .jo-news-page .jo-news-image-button {
        display: block !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border: 0 !important;
        background: transparent !important;
      }

      body .jo-news-page .jo-news-image {
        display: block !important;
        width: 100% !important;
        height: auto !important;
        max-height: calc(100svh - 84px) !important;
        object-fit: contain !important;
        object-position: left top !important;
      }

      body .jo-news-page .jo-news-title,
      body .jo-news-page .jo-news-meta,
      body .jo-news-page .jo-news-body {
        margin: 0 0 1em 0 !important;
        padding: 0 !important;
      }

      body .jo-news-page a,
      body .jo-news-page a:link,
      body .jo-news-page a:visited {
        color: rgba(0,0,0,.45) !important;
        text-decoration: none !important;
        border: 0 !important;
        box-shadow: none !important;
      }

      body .jo-news-page a:hover {
        color: #000 !important;
        text-decoration: none !important;
      }

      body .jo-news-page .jo-news-separator {
        display: none !important;
      }

      body .jo-news-page .jo-news-entry.no-image,
      body .jo-news-page .jo-news-minor {
        grid-template-areas:
          "date ."
          "info ." !important;
      }

      body .jo-news-page .jo-news-entry.no-image .jo-news-image-wrap,
      body .jo-news-page .jo-news-minor .jo-news-image-wrap {
        display: none !important;
      }

      @media (max-width: 900px) {
        body .jo-news-page {
          background: #fff !important;
        }

        body .jo-news-page .jo-news-wrap {
          width: calc(100vw - 56px) !important;
          min-width: 0 !important;
          max-width: none !important;
          margin-left: var(--gutter) !important;
          margin-right: var(--gutter) !important;
          padding-top: 195px !important;
          padding-bottom: 120px !important;
        }

        body .jo-news-page .jo-news-entry,
        body .jo-news-page .jo-news-minor {
          display: block !important;
          margin: 0 0 72px 0 !important;
          padding: 0 !important;
        }

        body .jo-news-page .jo-news-date {
          margin: 0 0 2em 0 !important;
        }

        body .jo-news-page .jo-news-image-wrap,
        body .jo-news-page .jo-news-slideshow {
          width: 100% !important;
          margin: 2em 0 0 0 !important;
          display: block !important;
        }

        body .jo-news-page .jo-news-image {
          width: 100% !important;
          height: auto !important;
          max-height: none !important;
          object-fit: contain !important;
          object-position: center top !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function safeClass(value) {
    return value ? ' ' + String(value).trim() : '';
  }

  function renderSlides(project) {
    return (project.slides || []).map(function (slide, index) {
      var cls = 'jo-slide' + safeClass(slide.cls) + (index === 0 ? ' active' : '');
      var caption = esc(slide.cap || '');
      var tone = slide.tone ? ' data-text-tone="' + esc(slide.tone) + '"' : '';
      var media = slide.video
        ? '<iframe src="' + esc(slide.url) + '" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>'
        : '<img src="' + esc(slide.url) + '" alt="">';

      return '<div class="' + cls + '" data-slide data-caption="' + caption + '"' + tone + '>' + media + '</div>';
    }).join('');
  }

  function renderMeta(project) {
    var title = (project.title || []).map(function (line, index) {
      var tag = index === 0 ? 'jo-section-title' : 'jo-meta-line';
      return '<p class="' + tag + '">' + esc(line) + '</p>';
    }).join('');

    var meta = (project.meta || []).map(function (line) {
      return '<p class="jo-meta-line">' + esc(line) + '</p>';
    }).join('');

    var links = project.pr
      ? '<br><div class="jo-document-links"><a class="jo-document-link" href="#" data-pr="' + esc(project.pr.id) + '">Press Release</a></div>'
      : '';

    return '<div class="jo-meta">' + title + '<br>' + meta + links + '</div>';
  }

  function sectionMode(project) {
    var slides = project.slides || [];
    var first = slides[0] || {};
    if (first.cls && first.cls.indexOf('jo-fit-right') !== -1) return 'jo-mode-right';
    if (first.cls && first.cls.indexOf('jo-protect-left') !== -1) return 'jo-mode-full';
    return 'jo-mode-full';
  }

  function renderProject(project) {
    var darkClass = project.dark ? ' jo-dark' : '';
    var modeClass = ' ' + sectionMode(project);
    var search = esc(project.search || '');

    return '<section class="jo-section' + modeClass + darkClass + '" data-search="' + search + '">' +
      '<div class="jo-gallery" data-gallery="' + esc(project.gallery || project.id) + '">' + renderSlides(project) + '</div>' +
      renderMeta(project) +
      '<div class="jo-caption"></div>' +
      '</section>';
  }

  function renderPrMeta(project) {
    var title = (project.title || []).map(function (line, index) {
      var tag = index === 0 ? 'jo-section-title' : 'jo-meta-line';
      return '<p class="' + tag + '">' + esc(line) + '</p>';
    }).join('');

    var meta = (project.meta || []).map(function (line) {
      return '<p class="jo-meta-line">' + esc(line) + '</p>';
    }).join('');

    return '<div class="jo-pr-meta">' + title + '<br>' + meta + '<div class="jo-pr-meta-reserve"><a class="jo-document-link">Press Release</a></div></div>';
  }

  function renderPr(project) {
    if (!project.pr) return '';

    var pr = project.pr;
    var dark = pr.dark ? ' jo-dark' : '';
    var noImage = pr.noimg ? ' jo-pr-no-image' : '';
    var imgs = pr.imgs || [];
    var imageHtml = imgs.length
      ? '<div class="jo-pr-image">' + imgs.map(function (url) {
          return '<img src="' + esc(url) + '" alt="">';
        }).join('') + '</div>'
      : '';

    return '<section class="jo-pr jo-pr-document' + dark + noImage + '" id="' + esc(pr.id) + '">' +
      '<button class="jo-pr-back-zone" type="button" aria-label="Back"></button>' +
      '<div class="jo-pr-document-wrap">' +
        renderPrMeta(project) +
        '<div class="jo-pr-text jo-pr-wide">' + (pr.text || '') + '</div>' +
        imageHtml +
      '</div>' +
      '</section>';
  }

  function replaceNewsCvFromData() {
    if (!window.JO_NEWS_CV) return;

    var temp = document.createElement('div');
    temp.innerHTML = window.JO_NEWS_CV;

    var newNews = temp.querySelector('#joNewsPage');
    var newCv = temp.querySelector('#joCvPage');
    var oldNews = document.getElementById('joNewsPage');
    var oldCv = document.getElementById('joCvPage');

    if (newNews && oldNews) oldNews.replaceWith(newNews);
    else if (newNews) document.body.appendChild(newNews);

    if (newCv && oldCv) oldCv.replaceWith(newCv);
    else if (newCv) document.body.appendChild(newCv);
  }

  function rebuildStageFromData() {
    if (!window.JO_PROJECTS || !window.JO_PROJECTS.length) return;

    var stage = document.getElementById('joStage');
    if (!stage) return;

    stage.innerHTML = window.JO_PROJECTS.map(renderProject).join('');

    document.querySelectorAll('.jo-pr').forEach(function (item) {
      item.remove();
    });

    document.body.insertAdjacentHTML('beforeend', window.JO_PROJECTS.map(renderPr).join(''));
  }

  function normalizeNewsMarkup() {
    document.querySelectorAll('.jo-news-entry').forEach(function (entry) {
      var img = entry.querySelector('.jo-news-image-wrap, .jo-news-slideshow');
      if (!img) entry.classList.add('no-image');
    });
  }

  injectFinalRuntimeCss();
  replaceNewsCvFromData();
  rebuildStageFromData();
  normalizeNewsMarkup();

  const stage = document.getElementById('joStage');
  const sections = Array.from(document.querySelectorAll('.jo-stage .jo-section'));
  const galleries = {};
  let activeIndex = 0;
  let locked = false;
  let touchStartY = null;
  let touchStartX = null;

  document.querySelectorAll('[data-gallery]').forEach(function(gallery) {
    const name = gallery.dataset.gallery;
    const slides = Array.from(gallery.querySelectorAll('[data-slide]'));
    galleries[name] = { slides: slides, index: 0 };

    slides.forEach(function(slide, index) {
      slide.classList.toggle('active', index === 0);
      slide.style.display = index === 0 ? 'block' : 'none';
    });

    updateCaption(name);
  });

  function isMobile() {
    return window.matchMedia('(max-width: 900px)').matches;
  }

  function clearSlideTone() {
    document.body.classList.remove('is-slide-meta-white', 'is-slide-all-white');
  }

  function applySlideTone(section) {
    clearSlideTone();

    if (isMobile()) return;
    if (!section) return;
    if (
      document.body.classList.contains('is-pr-open') ||
      document.body.classList.contains('is-news-open') ||
      document.body.classList.contains('is-cv-open')
    ) return;

    const galleryEl = section.querySelector('[data-gallery]');
    if (!galleryEl) return;

    const gallery = galleries[galleryEl.dataset.gallery];
    if (!gallery || !gallery.slides.length) return;

    const activeSlide = gallery.slides[gallery.index];
    const tone = activeSlide ? activeSlide.dataset.textTone : '';

    if (tone === 'meta-white') document.body.classList.add('is-slide-meta-white');
    if (tone === 'all-white') document.body.classList.add('is-slide-all-white');
  }

  function setTone(section) {
    if (isMobile()) {
      document.body.classList.remove('is-dark');
      clearSlideTone();
      return;
    }

    const dark = !!(section && section.classList.contains('jo-dark'));
    document.body.classList.toggle('is-dark', dark);
    applySlideTone(section);
  }

  function closeUtility() {
    document.body.classList.remove('is-news-open', 'is-cv-open', 'is-search-open');
    setTone(sections[activeIndex]);
  }

  function updateCaption(galleryName) {
    const gallery = galleries[galleryName];
    if (!gallery || !gallery.slides.length) return;

    const activeSlide = gallery.slides[gallery.index];
    const section = activeSlide.closest('.jo-section');
    const caption = section ? section.querySelector('.jo-caption') : null;

    if (!caption) return;
    caption.innerHTML = activeSlide.dataset.caption || '';
  }

  function go(index) {
    if (!sections.length || !stage) return;

    closePR(false);
    closeUtility();

    activeIndex = Math.max(0, Math.min(sections.length - 1, index));
    locked = true;

    stage.style.transform = 'translate3d(0,' + (-activeIndex * 100) + 'svh,0)';
    setTone(sections[activeIndex]);

    setTimeout(function() {
      locked = false;
    }, 680);
  }

  function showSlide(galleryName, nextIndex) {
    const gallery = galleries[galleryName];
    if (!gallery) return;

    if (nextIndex < 0) nextIndex = gallery.slides.length - 1;
    if (nextIndex >= gallery.slides.length) nextIndex = 0;

    gallery.index = nextIndex;

    gallery.slides.forEach(function(slide, index) {
      slide.classList.toggle('active', index === nextIndex);
      slide.style.display = index === nextIndex ? 'block' : 'none';
    });

    updateCaption(galleryName);
    setTone(sections[activeIndex]);
  }

  function clickIsBlocked(target) {
    return !!(
      target.closest('.jo-nav') ||
      target.closest('.jo-meta') ||
      target.closest('.jo-caption') ||
      target.closest('[data-pr]') ||
      target.closest('.jo-pr') ||
      target.closest('.jo-news-page') ||
      target.closest('.jo-cv-page')
    );
  }

  function snapByDirection(direction) {
    if (locked) return;
    go(activeIndex + direction);
  }

  window.addEventListener('wheel', function(event) {
    if (
      document.body.classList.contains('is-pr-open') ||
      document.body.classList.contains('is-news-open') ||
      document.body.classList.contains('is-cv-open')
    ) return;

    event.preventDefault();

    if (Math.abs(event.deltaY) < 8) return;
    snapByDirection(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  window.addEventListener('keydown', function(event) {
    if (document.body.classList.contains('is-search-open')) {
      if (event.key === 'Escape') closeSearch();
      return;
    }

    if (document.body.classList.contains('is-pr-open')) {
      if (event.key === 'Escape') closePR();
      return;
    }

    if (document.body.classList.contains('is-news-open') || document.body.classList.contains('is-cv-open')) {
      if (event.key === 'Escape') closeUtility();
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      snapByDirection(1);
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      snapByDirection(-1);
    }
  });

  document.addEventListener('touchstart', function(event) {
    if (
      document.body.classList.contains('is-pr-open') ||
      document.body.classList.contains('is-news-open') ||
      document.body.classList.contains('is-cv-open')
    ) return;

    if (!event.touches || !event.touches.length) return;

    touchStartY = event.touches[0].clientY;
    touchStartX = event.touches[0].clientX;
  }, { passive: true });

  document.addEventListener('touchend', function(event) {
    if (
      document.body.classList.contains('is-pr-open') ||
      document.body.classList.contains('is-news-open') ||
      document.body.classList.contains('is-cv-open')
    ) return;

    if (touchStartY === null || touchStartX === null) return;
    if (!event.changedTouches || !event.changedTouches.length) return;

    const dy = touchStartY - event.changedTouches[0].clientY;
    const dx = touchStartX - event.changedTouches[0].clientX;

    touchStartY = null;
    touchStartX = null;

    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      const gallery = sections[activeIndex].querySelector('[data-gallery]');
      if (gallery) {
        const data = galleries[gallery.dataset.gallery];
        if (data) showSlide(gallery.dataset.gallery, data.index + (dx > 0 ? 1 : -1));
      }
      return;
    }

    if (Math.abs(dy) > 48 && Math.abs(dy) > Math.abs(dx)) {
      snapByDirection(dy > 0 ? 1 : -1);
    }
  }, { passive: true });

  document.addEventListener('mousemove', function(event) {
    document.querySelectorAll('[data-gallery]').forEach(function(gallery) {
      gallery.classList.remove('cursor-prev', 'cursor-next');
    });

    if (isMobile()) return;

    const gallery = event.target.closest('[data-gallery]');
    if (!gallery) return;

    const rect = gallery.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;

    gallery.classList.add(event.clientX < midpoint ? 'cursor-prev' : 'cursor-next');
  });

  document.addEventListener('click', function(event) {
    if (isMobile()) return;
    if (clickIsBlocked(event.target)) return;

    const gallery = event.target.closest('[data-gallery]');
    if (!gallery) return;

    event.preventDefault();

    const data = galleries[gallery.dataset.gallery];
    if (!data) return;

    const rect = gallery.getBoundingClientRect();
    const midpoint = rect.left + rect.width / 2;
    const direction = event.clientX < midpoint ? -1 : 1;

    showSlide(gallery.dataset.gallery, data.index + direction);
  });

  function normalizeSearchText(value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  function openSearch() {
    closePR(false);
    closeUtility();
    document.body.classList.add('is-search-open');
    const input = document.querySelector('[data-search-input]');
    if (input) {
      input.value = '';
      input.placeholder = '';
      input.focus();
    }
  }

  function closeSearch() {
    document.body.classList.remove('is-search-open');
    const input = document.querySelector('[data-search-input]');
    if (input) input.value = '';
  }

  function sectionSearchText(section) {
    const slideText = Array.from(section.querySelectorAll('[data-slide]')).map(function(slide) {
      return slide.dataset.caption || '';
    }).join(' ');

    return normalizeSearchText(
      (section.dataset.search || '') + ' ' + section.textContent + ' ' + slideText
    );
  }

  function findSlideMatch(section, needle) {
    const galleryEl = section.querySelector('[data-gallery]');
    if (!galleryEl) return null;

    const slides = Array.from(galleryEl.querySelectorAll('[data-slide]'));
    const slideIndex = slides.findIndex(function(slide) {
      return normalizeSearchText(slide.dataset.caption || '').indexOf(needle) !== -1;
    });

    if (slideIndex < 0) return null;
    return { galleryName: galleryEl.dataset.gallery, slideIndex: slideIndex };
  }

  function searchAndGo(query) {
    const needle = normalizeSearchText(query);
    if (!needle) return;

    if (needle === 'cv' || needle === 'curriculum vitae') {
      closeSearch();
      closePR(false);
      document.body.classList.remove('is-news-open', 'is-dark', 'is-pr-dark', 'is-slide-meta-white', 'is-slide-all-white');
      document.body.classList.add('is-cv-open');
      const cvPage = document.getElementById('joCvPage');
      if (cvPage) cvPage.scrollTop = 0;
      return;
    }

    if (needle === 'news') {
      closeSearch();
      closePR(false);
      document.body.classList.remove('is-cv-open', 'is-dark', 'is-pr-dark', 'is-slide-meta-white', 'is-slide-all-white');
      document.body.classList.add('is-news-open');
      const newsPage = document.getElementById('joNewsPage');
      if (newsPage) newsPage.scrollTop = 0;
      return;
    }

    let matchIndex = -1;
    let slideMatch = null;

    sections.some(function(section, index) {
      const directSlideMatch = findSlideMatch(section, needle);
      if (directSlideMatch) {
        matchIndex = index;
        slideMatch = directSlideMatch;
        return true;
      }

      if (sectionSearchText(section).indexOf(needle) !== -1) {
        matchIndex = index;
        return true;
      }

      return false;
    });

    if (matchIndex >= 0) {
      closeSearch();
      go(matchIndex);

      if (slideMatch) {
        window.setTimeout(function() {
          showSlide(slideMatch.galleryName, slideMatch.slideIndex);
          updateCaption(slideMatch.galleryName);
          applySlideTone(sections[matchIndex]);
        }, 0);
      }
    } else {
      const input = document.querySelector('[data-search-input]');
      if (input) {
        input.value = '';
        input.placeholder = '';
      }
    }
  }

  document.querySelectorAll('[data-search-open]').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      openSearch();
    });
  });

  document.querySelectorAll('[data-search-form]').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      const input = form.querySelector('[data-search-input]');
      searchAndGo(input ? input.value : '');
    });
  });

  document.querySelectorAll('[data-search-input]').forEach(function(input) {
    input.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeSearch();
      }
    });
  });

  document.querySelectorAll('[data-home]').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      go(0);
    });
  });

  document.querySelectorAll('[data-news-open]').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      closePR(false);
      document.body.classList.remove('is-cv-open', 'is-dark', 'is-pr-dark', 'is-slide-meta-white', 'is-slide-all-white', 'is-search-open');
      document.body.classList.add('is-news-open');
      const newsPage = document.getElementById('joNewsPage');
      if (newsPage) newsPage.scrollTop = 0;
    });
  });

  document.querySelectorAll('[data-cv-open]').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      closePR(false);
      document.body.classList.remove('is-news-open', 'is-dark', 'is-pr-dark', 'is-slide-meta-white', 'is-slide-all-white', 'is-search-open');
      document.body.classList.add('is-cv-open');
      const cvPage = document.getElementById('joCvPage');
      if (cvPage) cvPage.scrollTop = 0;
    });
  });

  function openPR(id) {
    const pr = document.getElementById(id);
    if (!pr) return;

    document.querySelectorAll('.jo-pr').forEach(function(item) {
      item.classList.remove('open');
    });

    document.body.classList.remove('is-news-open', 'is-cv-open', 'is-slide-meta-white', 'is-slide-all-white');
    document.body.classList.add('is-pr-open');
    document.body.classList.toggle('is-pr-dark', pr.classList.contains('jo-dark'));
    document.body.classList.toggle('is-dark', pr.classList.contains('jo-dark'));
    pr.classList.add('open');
    pr.scrollTop = 0;
  }

  function closePR(restoreTone) {
    document.querySelectorAll('.jo-pr').forEach(function(item) {
      item.classList.remove('open');
    });

    document.body.classList.remove('is-pr-open');
    document.body.classList.remove('is-pr-dark');

    if (restoreTone !== false) {
      setTone(sections[activeIndex]);
    }
  }

  document.querySelectorAll('[data-pr]').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      openPR(link.dataset.pr);
    });
  });

  document.querySelectorAll('.jo-pr-back-zone').forEach(function(button) {
    button.addEventListener('click', function() {
      closePR(true);
    });
  });

  window.addEventListener('resize', function() {
    if (!stage) return;
    stage.style.transform = 'translate3d(0,' + (-activeIndex * 100) + 'svh,0)';
  });

  setTone(sections[0]);
})();
