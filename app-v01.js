(function () {
  document.documentElement.classList.add('jo-fonts-loading');
  // FAILSAFE: registered first, so text can never stay hidden even if later
  // code errors or the script parses slowly on mobile.
  setTimeout(function () {
    document.documentElement.classList.remove('jo-fonts-loading');
  }, 1200);

  try {


  function joReplaceNewsCvFromData() {
    if (!window.JO_NEWS_CV) return;

    var temp = document.createElement('div');
    temp.innerHTML = window.JO_NEWS_CV;

    var newNews = temp.querySelector('#joNewsPage');
    var newCv = temp.querySelector('#joCvPage');
    var oldNews = document.getElementById('joNewsPage');
    var oldCv = document.getElementById('joCvPage');

    if (newNews && oldNews) {
      oldNews.replaceWith(newNews);
    } else if (newNews) {
      document.body.appendChild(newNews);
    }

    if (newCv && oldCv) {
      oldCv.replaceWith(newCv);
    } else if (newCv) {
      document.body.appendChild(newCv);
    }
  }

  function joEscapeAttr(value) {
    return String(value || '').replace(/"/g, '&quot;');
  }

  function joNormalizeDocs(project) {
    var docs = [];

    if (project.pr) {
      docs.push({
        id: project.pr.id,
        label: 'Press Release',
        dark: project.pr.dark,
        text: project.pr.text,
        imgs: project.pr.imgs,
        noimg: project.pr.noimg,
        wide: project.pr.wide
      });
    }

    if (project.docs && project.docs.length) {
      project.docs.forEach(function(doc) {
        docs.push(doc);
      });
    }

    return docs;
  }

  function joRenderProjectDocumentLinks(project, reserveOnly) {
    var docs = joNormalizeDocs(project);

    if (!docs.length && reserveOnly) {
      return '<span class="jo-document-link">&nbsp;</span>';
    }

    return docs.map(function(doc) {
      return '<a class="jo-document-link" href="#" data-pr="' + doc.id + '">' + doc.label + '</a>';
    }).join('');
  }

  function joRenderProject(project) {
    var darkClass = project.dark ? ' jo-dark' : '';
    var modeClass = 'jo-mode-full';

    if (project.mode === 'right') modeClass = 'jo-mode-right';
    if (project.mode === 'protected') modeClass = 'jo-mode-protected';

    var title = (project.title || []).map(function(line, index) {
      if (index === 0) return '<p class="jo-section-title">' + line + '</p>';
      return '<p class="jo-meta-line">' + line + '</p>';
    }).join('');

    var meta = (project.meta || []).map(function(line) {
      return '<p class="jo-meta-line">' + line + '</p>';
    }).join('');

    var documentLinks = joRenderProjectDocumentLinks(project, false);
    var documentLinksHtml = documentLinks
      ? '<div class="jo-document-links">' + documentLinks + '</div>'
      : '';

    var slides = (project.slides || []).map(function(slide, index) {
      var active = index === 0 ? ' active' : '';
      var cls = slide.cls ? ' ' + slide.cls : '';
      var tone = slide.tone ? ' data-text-tone="' + slide.tone + '"' : '';
      var cap = slide.cap ? joEscapeAttr(slide.cap) : '';
      var lazy = index === 0 ? '' : ' loading="lazy"';

      if (slide.video) {
        return '<div class="jo-slide' + active + cls + '" data-slide data-caption="' + cap + '"' + tone + '><iframe data-src="' + slide.url + '" allow="autoplay; fullscreen; picture-in-picture" frameborder="0"></iframe></div>';
      }

      return '<div class="jo-slide' + active + cls + '" data-slide data-caption="' + cap + '"' + tone + '><img src="' + slide.url + '" alt="" decoding="async"' + lazy + '></div>';
    }).join('');

    return (
      '<section class="jo-section ' + modeClass + darkClass + '" data-search="' + joEscapeAttr(project.search || '') + '">' +
        '<div class="jo-gallery" data-gallery="' + project.gallery + '">' +
          slides +
        '</div>' +
        '<div class="jo-meta">' +
          title +
          '<div class="jo-spacer"></div>' +
          meta +
          documentLinksHtml +
        '</div>' +
        '<div class="jo-caption"></div>' +
      '</section>'
    );
  }

  function joRenderDocumentImage(image) {
    if (typeof image === 'string') {
      return '<figure><img src="' + image + '" alt="" loading="lazy" decoding="async"></figure>';
    }

    var caption = image.caption
      ? '<figcaption>' + image.caption + '</figcaption>'
      : '';

    return '<figure><img src="' + image.url + '" alt="" loading="lazy" decoding="async">' + caption + '</figure>';
  }

  function joRenderProjectDoc(project, doc) {
    var darkClass = doc.dark ? ' jo-dark' : '';
    var noImageClass = doc.noimg ? ' jo-pr-no-image' : '';
    var wideClass = doc.wide ? ' jo-pr-wide' : '';
    var typeClass = (doc.label === 'Press Release') ? ' jo-doc-pr' : ' jo-doc-article';
    var imgs = '';

    if (!doc.noimg && doc.imgs && doc.imgs.length) {
      imgs = '<div class="jo-pr-image">' + doc.imgs.map(joRenderDocumentImage).join('') + '</div>';
    }

    var title = (project.title || []).map(function(line, index) {
      if (index === 0) return '<p class="jo-section-title">' + line + '</p>';
      return '<p class="jo-meta-line">' + line + '</p>';
    }).join('');

    var meta = (project.meta || []).map(function(line) {
      return '<p class="jo-meta-line">' + line + '</p>';
    }).join('');

    return (
      '<section class="jo-pr jo-pr-document' + darkClass + noImageClass + typeClass + '" id="' + doc.id + '">' +
        '<button class="jo-pr-back-zone" type="button" aria-label="Back"></button>' +
        '<div class="jo-pr-document-wrap">' +
          '<div class="jo-pr-meta">' +
            title +
            '<div class="jo-spacer"></div>' +
            meta +
            '<a class="jo-pr-mobile-back" href="#" data-pr-back aria-label="Back">‹</a>' +
            '<div class="jo-document-links jo-pr-meta-reserve">' + joRenderProjectDocumentLinks(project, true) + '</div>' +
          '</div>' +
          '<div class="jo-pr-text' + wideClass + '">' + (doc.text || '') + '</div>' +
          imgs +
        '</div>' +
      '</section>'
    );
  }

  function joReplaceProjectsFromData() {
    if (!window.JO_PROJECTS || !window.JO_PROJECTS.length) return;

    var stage = document.getElementById('joStage');
    if (!stage) return;

    stage.innerHTML = window.JO_PROJECTS.map(joRenderProject).join('');

    document.querySelectorAll('.jo-pr').forEach(function(item) {
      item.remove();
    });

    var allDocs = window.JO_PROJECTS.map(function(project) {
      return joNormalizeDocs(project).map(function(doc) {
        return joRenderProjectDoc(project, doc);
      }).join('');
    }).join('');

    document.body.insertAdjacentHTML('beforeend', allDocs);
  }

  joReplaceNewsCvFromData();
  joReplaceProjectsFromData();

  // ---------- REBUILD NAV: Archive / Office / News / CV ----------
  (function joBuildNav() {
    var nav = document.querySelector('.jo-nav');
    if (!nav) return;
    nav.innerHTML =
      '<div class="jo-title" data-splash>Jed Ochmanek Studio</div>' +
      '<div class="jo-spacer"></div>' +
      '<a href="#" data-archive>Archive</a>' +
      '<a href="#" data-office-open>Office</a>' +
      '<a href="#" data-news-open>News</a>' +
      '<a href="#" data-cv-open>CV</a>' +
      '<div class="jo-archive-toggle" data-index-toggle role="button" aria-label="Index"><i></i><i></i><i></i></div>';
  })();

  // ---------- SPLASH (front page) ----------
  (function joBuildSplash() {
    if (document.getElementById('joSplash')) return;
    var projects = window.JO_PROJECTS || [];
    function firstImg(p) {
      var s = p.slides || [];
      for (var i = 0; i < s.length; i++) { if (!s[i].video) return s[i].url; }
      return '';
    }
    var splashList = (isMobile() && window.JO_SPLASH_MOBILE && window.JO_SPLASH_MOBILE.length)
      ? window.JO_SPLASH_MOBILE
      : window.JO_SPLASH;
    var heroes = [];
    if (splashList && splashList.length) {
      heroes = splashList.map(function(h) {
        return { url: h.url, dark: !!h.dark, darkMobile: (h.darkMobile == null ? null : !!h.darkMobile) };
      });
    } else {
      projects.forEach(function(p) { var u = firstImg(p); if (u) heroes.push({ url: u, dark: !!p.dark }); });
      heroes = heroes.slice(0, 6);
    }
    if (!heroes.length) return;

    var splash = document.createElement('div');
    splash.id = 'joSplash';
    splash.innerHTML =
      heroes.map(function(h, i) {
        return '<div class="jo-splash-pane' + (i === 0 ? ' active' : '') + '" style="background-image:url(\'' + h.url + '\')"></div>';
      }).join('') +
      '<a class="jo-splash-title" href="#" data-splash-enter>Jed Ochmanek Studio</a>' +
      '<div class="jo-splash-z l" data-splash-prev></div>' +
      '<div class="jo-splash-z r" data-splash-next></div>';
    document.body.appendChild(splash);
    document.body.classList.add('is-splash');

    var sidx = 0;
    var panes = splash.querySelectorAll('.jo-splash-pane');
    function applyDark() {
      var h = heroes[sidx];
      var dark = (isMobile() && h.darkMobile != null) ? h.darkMobile : h.dark;
      splash.classList.toggle('jo-splash-dark', !!dark);
    }
    applyDark();
    function show(n) {
      panes[sidx].classList.remove('active');
      sidx = (n + panes.length) % panes.length;
      panes[sidx].classList.add('active');
      applyDark();
    }
    splash.querySelector('[data-splash-prev]').addEventListener('click', function() { show(sidx - 1); });
    splash.querySelector('[data-splash-next]').addEventListener('click', function() { show(sidx + 1); });
    splash.querySelector('[data-splash-enter]').addEventListener('click', function(e) {
      e.preventDefault();
      document.body.classList.remove('is-splash');
      go(0);
    });
  })();

  // ---------- OFFICE PAGE ----------
  (function joBuildOffice() {
    if (document.getElementById('joOfficePage')) return;
    var page = document.createElement('section');
    page.className = 'jo-office-page';
    page.id = 'joOfficePage';
    page.innerHTML =
      '<div class="jo-office-content">' +
        '<div class="jo-office-row"><a href="mailto:jedochmanekstudio@gmail.com">Contact</a></div>' +
        '<div class="jo-office-row"><a href="https://www.instagram.com/jed_ochmanek_studio/" target="_blank" rel="noopener">Instagram</a></div>' +
        '<form class="jo-office-row" data-subscribe-form><input class="jo-office-field" data-subscribe-input type="email" placeholder="Subscribe" autocomplete="email" aria-label="Subscribe"></form>' +
        '<form class="jo-office-row" data-office-search-form><input class="jo-office-field" data-office-search type="text" placeholder="Search" autocomplete="off" aria-label="Search"></form>' +
        '<div class="jo-office-results" data-office-results></div>' +
      '</div>';
    document.body.appendChild(page);
  })();

  // ---------- ARCHIVE INDEX (hamburger list view) ----------
  function joFirstImg(project) {
    var s = project.slides || [];
    for (var i = 0; i < s.length; i++) { if (!s[i].video) return s[i].url; }
    var d = (project.docs && project.docs[0]) || project.pr;
    if (d && d.imgs && d.imgs.length) {
      return typeof d.imgs[0] === 'string' ? d.imgs[0] : d.imgs[0].url;
    }
    return '';
  }

  (function joBuildIndexPage() {
    if (document.getElementById('joIndexPage')) return;
    var projects = window.JO_PROJECTS || [];
    if (!projects.length) return;

    function yearOf(project) {
      var m = (project.meta && project.meta.length) ? String(project.meta[project.meta.length - 1]) : '';
      var first = m.split('-')[0].trim();
      var parts = first.split('.');
      var yy = parts[parts.length - 1];
      return (yy && yy.length === 2) ? ('20' + yy) : (yy || '');
    }

    var page = document.createElement('section');
    page.className = 'jo-index-page';
    page.id = 'joIndexPage';
    page.innerHTML =
      '<div class="jo-index-list">' +
        projects.map(function(project, i) {
          var lines = project.indexLines || project.title || [];
          var metaLines = project.meta || [];
          var venue = metaLines.length > 1 ? metaLines[0] : '';   /* venue only, no city */
          var html = '<span class="jo-index-line"><span class="jo-index-year">' + yearOf(project) + '</span>' + (lines[0] || '') + '</span>';
          lines.slice(1).forEach(function(line) {
            html += '<span class="jo-index-venue">' + line + '</span>';
          });
          if (venue) html += '<span class="jo-index-venue">' + venue + '</span>';
          return '<a href="#" class="jo-index-row" data-index-go="' + i + '">' + html + '</a>';
        }).join('') +
      '</div>' +
      '<div class="jo-index-image" data-index-image><img src="" alt=""></div>';
    document.body.appendChild(page);
  })();

  function joAlignIndex() {
    var nav = document.querySelector('.jo-nav');
    var archive = nav && nav.querySelector('[data-archive]');
    if (!archive) return;
    if (window.matchMedia('(max-width: 900px)').matches) return;
    var top = archive.getBoundingClientRect().top + 'px';
    var list = document.querySelector('.jo-index-list');
    var image = document.querySelector('.jo-index-image');
    if (list) list.style.top = top;
    if (image) image.style.top = top;
  }

  var joIndexCurrent = 0;
  function joIndexPreview(i) {
    var projects = window.JO_PROJECTS || [];
    var img = document.querySelector('.jo-index-image img');
    if (!img || !projects[i]) return;
    joIndexCurrent = i;
    var url = joFirstImg(projects[i]);
    if (url && img.getAttribute('src') !== url) img.setAttribute('src', url);
  }

  function joOpenIndex() {
    closeLightbox();
    closePR(false);
    document.body.classList.remove('is-news-open', 'is-cv-open', 'is-office-open', 'is-search-open', 'is-dark', 'is-pr-dark', 'is-slide-meta-white', 'is-slide-all-white');
    document.body.classList.add('is-index-open');
    joAlignIndex();
    joIndexPreview(typeof activeIndex === 'number' ? activeIndex : 0);
    var page = document.getElementById('joIndexPage');
    if (page) page.scrollTop = 0;
  }

  function joCloseIndex() {
    document.body.classList.remove('is-index-open');
    setTone(sections[activeIndex]);
  }

  (function joWireIndex() {
    var toggle = document.querySelector('[data-index-toggle]');
    var page = document.getElementById('joIndexPage');
    if (!toggle || !page) return;
    toggle.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      if (document.body.classList.contains('is-index-open')) joCloseIndex();
      else joOpenIndex();
    });
    page.addEventListener('mouseover', function(event) {
      var row = event.target.closest('[data-index-go]');
      if (row) joIndexPreview(+row.dataset.indexGo);
    });
    page.addEventListener('click', function(event) {
      if (event.target.closest('[data-index-image]')) {
        document.body.classList.remove('is-index-open');
        go(joIndexCurrent);
        return;
      }
      var row = event.target.closest('[data-index-go]');
      if (!row) return;
      event.preventDefault();
      document.body.classList.remove('is-index-open');
      go(+row.dataset.indexGo);
    });
    window.addEventListener('resize', function() {
      if (document.body.classList.contains('is-index-open')) joAlignIndex();
    });
  })();

  function joAlignOffice() {
    var nav = document.querySelector('.jo-nav');
    var archive = nav && nav.querySelector('[data-archive]');
    var content = document.querySelector('.jo-office-content');
    if (!archive || !content) return;
    if (window.matchMedia('(max-width: 900px)').matches) { content.style.top = ''; return; }
    content.style.top = archive.getBoundingClientRect().top + 'px';
  }

  function joOpenOffice() {
    closeLightbox();
    closePR(false);
    document.body.classList.remove('is-news-open', 'is-cv-open', 'is-index-open', 'is-search-open', 'is-dark', 'is-pr-dark', 'is-slide-meta-white', 'is-slide-all-white');
    document.body.classList.add('is-office-open');
    joAlignOffice();
    var page = document.getElementById('joOfficePage');
    if (page) page.scrollTop = 0;
  }

  // News / CV opened through the same proven path as Office.
  function joOpenUtility(which) {
    closeLightbox();
    closePR(false);
    document.body.classList.remove('is-office-open', 'is-index-open', 'is-search-open', 'is-splash', 'is-dark', 'is-pr-dark', 'is-slide-meta-white', 'is-slide-all-white');
    if (which === 'cv') {
      document.body.classList.remove('is-news-open');
      document.body.classList.add('is-cv-open');
      var cv = document.getElementById('joCvPage');
      if (cv) cv.scrollTop = 0;
    } else {
      document.body.classList.remove('is-cv-open');
      document.body.classList.add('is-news-open');
      var news = document.getElementById('joNewsPage');
      if (news) news.scrollTop = 0;
    }
  }

  // ---------- NAV CLICK ROUTING (Archive / Office / Splash) ----------
  (function joWireNav() {
    var nav = document.querySelector('.jo-nav');
    if (!nav) return;
    nav.addEventListener('click', function(event) {
      var link = event.target.closest('[data-splash],[data-archive],[data-office-open],[data-news-open],[data-cv-open]');
      if (!link) return;

      document.body.classList.remove('is-index-open');

      if (link.hasAttribute('data-office-open')) {
        event.preventDefault();
        document.body.classList.remove('is-splash');
        joOpenOffice();
        return;
      }

      // any other menu action leaves the office page
      document.body.classList.remove('is-office-open');

      if (link.hasAttribute('data-splash')) {
        event.preventDefault();
        closeLightbox();
        closePR(false);
        document.body.classList.add('is-splash');
        return;
      }

      if (link.hasAttribute('data-archive')) {
        event.preventDefault();
        document.body.classList.remove('is-splash');
        closePR(false);
        closeUtility();
        go(0);
        return;
      }

      if (link.hasAttribute('data-news-open')) {
        event.preventDefault();
        joOpenUtility('news');
        return;
      }

      if (link.hasAttribute('data-cv-open')) {
        event.preventDefault();
        joOpenUtility('cv');
        return;
      }

      document.body.classList.remove('is-splash');
    });
  })();

  // office search: live results underneath, in the menu's type
  (function joWireOfficeSearch() {
    var form = document.querySelector('[data-office-search-form]');
    var input = document.querySelector('[data-office-search]');
    var results = document.querySelector('[data-office-results]');
    if (!form || !input || !results) return;

    function matches(query) {
      var needle = normalizeSearchText(query);
      if (!needle) return [];
      var projects = window.JO_PROJECTS || [];
      var out = [];
      projects.forEach(function(p, i) {
        var caps = (p.slides || []).map(function(s) { return s.cap || ''; }).join(' ');
        var hay = normalizeSearchText(
          (p.search || '') + ' ' + (p.title || []).join(' ') + ' ' + (p.meta || []).join(' ') + ' ' + caps
        );
        if (hay.indexOf(needle) === -1) return;
        var slideIndex = -1;
        (p.slides || []).some(function(s, si) {
          if (normalizeSearchText(s.cap || '').indexOf(needle) !== -1) { slideIndex = si; return true; }
          return false;
        });
        out.push({ i: i, title: (p.title || []).join(' '), slide: slideIndex });
      });
      return out;
    }

    function render() {
      var hits = matches(input.value);
      results.innerHTML = hits.map(function(h) {
        return '<a href="#" class="jo-office-result" data-go-section="' + h.i + '" data-go-slide="' + h.slide + '">' + h.title + '</a>';
      }).join('');
    }

    function goToSection(i, slide) {
      document.body.classList.remove('is-office-open');
      input.value = '';
      results.innerHTML = '';
      go(i);
      if (typeof slide === 'number' && slide >= 0) {
        window.setTimeout(function() {
          var section = sections[i];
          var galleryEl = section && section.querySelector('[data-gallery]');
          if (galleryEl) showSlide(galleryEl.dataset.gallery, slide);
        }, 0);
      }
    }

    input.addEventListener('input', render);
    results.addEventListener('click', function(event) {
      var hit = event.target.closest('[data-go-section]');
      if (!hit) return;
      event.preventDefault();
      goToSection(+hit.dataset.goSection, +hit.dataset.goSlide);
    });
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var first = results.querySelector('[data-go-section]');
      if (first) { goToSection(+first.dataset.goSection, +first.dataset.goSlide); return; }
      // fall back to the full search routing (handles "news" / "cv")
      var value = input.value;
      document.body.classList.remove('is-office-open');
      searchAndGo(value);
      input.value = '';
      results.innerHTML = '';
    });
  })();

  window.addEventListener('resize', function() {
    if (document.body.classList.contains('is-office-open')) joAlignOffice();
  });

  const stage = document.getElementById('joStage');
  const sections = Array.from(document.querySelectorAll('.jo-stage .jo-section'));
  const galleries = {};
  let activeIndex = 0;
  let locked = false;
  let touchStartY = null;
  let touchStartX = null;

  // section height in whole pixels — keeps the snap transform pixel-aligned
  // so a project's fixed meta doesn't shift a hair when a PR opens over it.
  function joSecH() {
    var s = stage && stage.querySelector('.jo-section');
    return s ? s.clientHeight : window.innerHeight;
  }
  function joStageTransform() {
    return 'translate3d(0,' + (-Math.round(activeIndex * joSecH())) + 'px,0)';
  }

  function joActivateVideo(slide) {
    if (!slide) return;
    var f = slide.querySelector('iframe[data-src]');
    if (f && !f.getAttribute('src')) f.setAttribute('src', f.getAttribute('data-src'));
  }

  function joToggleSound(slide) {
    var f = slide.querySelector('iframe');
    if (!f) return;
    var base = f.getAttribute('data-src') || f.getAttribute('src') || '';
    if (slide.getAttribute('data-unmuted') === '1') {
      slide.setAttribute('data-unmuted', '0');
      f.setAttribute('src', base);
    } else {
      slide.setAttribute('data-unmuted', '1');
      f.setAttribute('src', base
        .replace('background=1', 'background=0')
        .replace('muted=1', 'muted=0')
        .replace('mute=1', 'mute=0'));
    }
  }

  function joMuteAllVideos() {
    document.querySelectorAll('[data-slide][data-unmuted="1"]').forEach(function(slide) {
      var f = slide.querySelector('iframe');
      var base = f && f.getAttribute('data-src');
      if (f && base) f.setAttribute('src', base);
      slide.setAttribute('data-unmuted', '0');
    });
  }

  document.querySelectorAll('[data-gallery]').forEach(function(gallery) {
    const name = gallery.dataset.gallery;
    const slides = Array.from(gallery.querySelectorAll('[data-slide]'));
    galleries[name] = { slides: slides, index: 0 };

    if (slides.length <= 1) {
      gallery.classList.add('is-single-slide');
    }

    slides.forEach(function(slide, index) {
      slide.classList.toggle('active', index === 0);
      slide.style.display = index === 0 ? 'block' : 'none';
    });

    joActivateVideo(slides[0]);
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
      document.body.classList.contains('is-splash') ||
      document.body.classList.contains('is-office-open') ||
      document.body.classList.contains('is-index-open') ||
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

    if (tone === 'meta-white') {
      document.body.classList.add('is-slide-meta-white');
    }

    if (tone === 'all-white') {
      document.body.classList.add('is-slide-all-white');
    }
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
    document.body.classList.remove('is-news-open', 'is-cv-open', 'is-search-open', 'is-office-open', 'is-index-open');
    setTone(sections[activeIndex]);
  }

  function updateCaption(galleryName) {
    const gallery = galleries[galleryName];
    if (!gallery || !gallery.slides.length) return;

    const activeSlide = gallery.slides[gallery.index];
    const section = activeSlide.closest('.jo-section');
    const capText = activeSlide.dataset.caption || '';
    if (section) section.classList.toggle('jo-no-cap', !capText.trim());

    const caption = section ? section.querySelector('.jo-caption') : null;
    if (!caption) return;

    // mobile: Title, year / Materials (flows, may wrap) / Dimensions —
    // three lines, never sharing. Middle breaks inside the materials
    // collapse so they fill the column evenly.
    if (isMobile()) {
      var capParts = capText.split(/<br\s*\/?>/i);
      if (capParts.length >= 3) {
        capText = capParts[0] + '<br>' + capParts.slice(1, -1).join(' ') + '<br>' + capParts[capParts.length - 1];
      }
    }
    caption.innerHTML = capText;
  }

  function go(index) {
    if (!sections.length || !stage) return;

    joMuteAllVideos();
    closeLightbox();
    closePR(false);
    closeUtility();

    activeIndex = Math.max(0, Math.min(sections.length - 1, index));
    locked = true;

    stage.style.transform = joStageTransform();
    setTone(sections[activeIndex]);
    joUpdateVertZones();

    setTimeout(function() {
      locked = false;
    }, 680);
  }

  function showSlide(galleryName, nextIndex) {
    const gallery = galleries[galleryName];
    if (!gallery) return;
    if (gallery.slides.length <= 1) return;

    joMuteAllVideos();

    if (nextIndex < 0) nextIndex = gallery.slides.length - 1;
    if (nextIndex >= gallery.slides.length) nextIndex = 0;

    gallery.index = nextIndex;

    gallery.slides.forEach(function(slide, index) {
      slide.classList.toggle('active', index === nextIndex);
      slide.style.display = index === nextIndex ? 'block' : 'none';
    });

    joActivateVideo(gallery.slides[nextIndex]);
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

  var joHScrollLock = false;
  window.addEventListener('wheel', function(event) {
    if (
      document.body.classList.contains('is-splash') ||
      document.body.classList.contains('is-office-open') ||
      document.body.classList.contains('is-index-open') ||
      document.body.classList.contains('is-pr-open') ||
      document.body.classList.contains('is-news-open') ||
      document.body.classList.contains('is-cv-open') ||
      document.body.classList.contains('is-lightbox-open')
    ) return;

    event.preventDefault();

    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      if (Math.abs(event.deltaX) < 18) return;
      if (joHScrollLock) return;
      joHScrollLock = true;
      setTimeout(function() { joHScrollLock = false; }, 420);

      var section = sections[activeIndex];
      var galleryEl = section ? section.querySelector('[data-gallery]') : null;
      if (galleryEl) {
        var data = galleries[galleryEl.dataset.gallery];
        if (data && data.slides.length > 1) {
          showSlide(galleryEl.dataset.gallery, data.index + (event.deltaX > 0 ? 1 : -1));
        }
      }
      return;
    }

    if (Math.abs(event.deltaY) < 8) return;
    snapByDirection(event.deltaY > 0 ? 1 : -1);
  }, { passive: false });

  window.addEventListener('keydown', function(event) {
    if (document.body.classList.contains('is-splash') || document.body.classList.contains('is-office-open') || document.body.classList.contains('is-index-open')) {
      if (event.key === 'Escape') {
        document.body.classList.remove('is-office-open');
        if (document.body.classList.contains('is-index-open')) joCloseIndex();
      }
      return;
    }

    if (document.body.classList.contains('is-lightbox-open')) {
      if (event.key === 'Escape') closeLightbox();
      return;
    }

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
      document.body.classList.contains('is-splash') ||
      document.body.classList.contains('is-office-open') ||
      document.body.classList.contains('is-index-open') ||
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
      document.body.classList.contains('is-splash') ||
      document.body.classList.contains('is-office-open') ||
      document.body.classList.contains('is-index-open') ||
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
        if (data && data.slides.length > 1) showSlide(gallery.dataset.gallery, data.index + (dx > 0 ? 1 : -1));
      }
      return;
    }

    if (Math.abs(dy) > 48 && Math.abs(dy) > Math.abs(dx)) {
      snapByDirection(dy > 0 ? 1 : -1);
    }
  }, { passive: true });

  document.addEventListener('mousemove', function(event) {
    document.querySelectorAll('[data-gallery]').forEach(function(gallery) {
      gallery.classList.remove('cursor-prev', 'cursor-next', 'cursor-sound');
    });

    if (isMobile()) return;

    const gallery = event.target.closest('[data-gallery]');
    if (!gallery) return;

    const data = galleries[gallery.dataset.gallery];
    if (!data) return;

    const activeSlide = data.slides[data.index];
    const isVideo = !!(activeSlide && activeSlide.querySelector('iframe'));
    const rect = gallery.getBoundingClientRect();
    const r = (event.clientX - rect.left) / rect.width;

    if (isVideo) {
      if (data.slides.length > 1 && r < 0.34) gallery.classList.add('cursor-prev');
      else if (data.slides.length > 1 && r > 0.66) gallery.classList.add('cursor-next');
      else gallery.classList.add('cursor-sound');
      return;
    }

    if (data.slides.length <= 1) return;
    gallery.classList.add(r < 0.5 ? 'cursor-prev' : 'cursor-next');
  });

  document.addEventListener('click', function(event) {
    if (clickIsBlocked(event.target)) return;

    const gallery = event.target.closest('[data-gallery]');
    if (!gallery) return;

    const data = galleries[gallery.dataset.gallery];
    if (!data) return;

    const activeSlide = data.slides[data.index];
    const isVideo = !!(activeSlide && activeSlide.querySelector('iframe'));
    const rect = gallery.getBoundingClientRect();
    const r = (event.clientX - rect.left) / rect.width;

    if (isVideo) {
      event.preventDefault();
      if (data.slides.length > 1 && r < 0.34) showSlide(gallery.dataset.gallery, data.index - 1);
      else if (data.slides.length > 1 && r > 0.66) showSlide(gallery.dataset.gallery, data.index + 1);
      else joToggleSound(activeSlide);
      return;
    }

    if (data.slides.length <= 1) return;
    event.preventDefault();
    showSlide(gallery.dataset.gallery, data.index + (r < 0.5 ? -1 : 1));
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
    closeLightbox();
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
      closeLightbox();
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
      closeLightbox();
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

    closeLightbox();

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

  document.querySelectorAll('[data-pr-back]').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      closePR(true);
    });
  });

  window.addEventListener('resize', function() {
    if (!stage) return;
    stage.style.transform = joStageTransform();
  });

  // ---------- IMAGE LIGHTBOX + DOCUMENT GALLERIES ----------
  var joLightbox = document.createElement('div');
  joLightbox.className = 'jo-lightbox';
  joLightbox.id = 'joLightbox';
  joLightbox.innerHTML = '<div class="jo-lightbox-frame"><img src="" alt=""></div>';
  document.body.appendChild(joLightbox);
  var joLightboxImg = joLightbox.querySelector('img');
  var joLightboxFrame = joLightbox.querySelector('.jo-lightbox-frame');
  var joLB = { imgs: [], idx: 0 };

  function joZone(el, clientX) {
    var rect = el.getBoundingClientRect();
    if (!rect.width) return 'mid';
    var r = (clientX - rect.left) / rect.width;
    if (r < 0.34) return 'left';
    if (r > 0.66) return 'right';
    return 'mid';
  }

  function joShowLB() {
    joLightboxImg.setAttribute('src', joLB.imgs[joLB.idx] || '');
    joLightbox.classList.toggle('jo-lb-multi', joLB.imgs.length > 1);
  }

  function openLightboxSet(imgs, idx, dark, isDoc) {
    if (isMobile()) return;
    if (!imgs || !imgs.length) return;
    joLB.imgs = imgs;
    joLB.idx = idx || 0;
    joLightbox.classList.toggle('jo-dark', !!dark);
    joLightbox.classList.toggle('jo-lb-doc', !!isDoc);
    joShowLB();
    document.body.classList.add('is-lightbox-open');
  }

  function closeLightbox() {
    if (!document.body.classList.contains('is-lightbox-open')) return;
    document.body.classList.remove('is-lightbox-open');
    joLightboxImg.setAttribute('src', '');
    joLightboxFrame.classList.remove('cursor-prev', 'cursor-next', 'cursor-close');
  }

  function joLBnav(dir) {
    if (joLB.imgs.length < 2) return;
    joLB.idx = (joLB.idx + dir + joLB.imgs.length) % joLB.imgs.length;
    joShowLB();
  }

  joLightboxFrame.addEventListener('mousemove', function(event) {
    joLightboxFrame.classList.remove('cursor-prev', 'cursor-next', 'cursor-close');
    var multi = joLB.imgs.length > 1;
    var z = joZone(joLightboxFrame, event.clientX);
    if (multi && z === 'left') joLightboxFrame.classList.add('cursor-prev');
    else if (multi && z === 'right') joLightboxFrame.classList.add('cursor-next');
    else joLightboxFrame.classList.add('cursor-close');
  });

  joLightbox.addEventListener('click', function(event) {
    event.preventDefault();
    var rect = joLightboxFrame.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right) { closeLightbox(); return; }
    var multi = joLB.imgs.length > 1;
    var z = joZone(joLightboxFrame, event.clientX);
    if (multi && z === 'left') joLBnav(-1);
    else if (multi && z === 'right') joLBnav(1);
    else closeLightbox();
  });

  // inline document galleries: one image at a time, < > to page, + to expand
  function joSetupDocGalleries() {
    if (isMobile()) return;
    document.querySelectorAll('.jo-pr-document .jo-pr-image').forEach(function(wrap) {
      if (wrap.joReady) return;
      var figs = Array.prototype.slice.call(wrap.querySelectorAll('figure'));
      if (!figs.length) return;
      wrap.joReady = true;
      wrap.joFigs = figs;
      wrap.joIdx = 0;
      figs.forEach(function(f, i) { f.classList.toggle('active', i === 0); });
      if (figs.length > 1) wrap.classList.add('jo-doc-multi');
    });
  }
  joSetupDocGalleries();

  function joDocNav(wrap, dir) {
    var figs = wrap.joFigs;
    if (!figs || figs.length < 2) return;
    wrap.joIdx = (wrap.joIdx + dir + figs.length) % figs.length;
    figs.forEach(function(f, i) { f.classList.toggle('active', i === wrap.joIdx); });
  }

  document.addEventListener('mousemove', function(event) {
    document.querySelectorAll('.jo-pr-image').forEach(function(w) {
      w.classList.remove('cursor-prev', 'cursor-next', 'cursor-zoom');
    });
    if (isMobile() || document.body.classList.contains('is-lightbox-open')) return;
    var wrap = event.target.closest('.jo-pr-document .jo-pr-image');
    if (!wrap || !wrap.joFigs) return;
    var multi = wrap.classList.contains('jo-doc-multi');
    var z = joZone(wrap, event.clientX);
    if (multi && z === 'left') wrap.classList.add('cursor-prev');
    else if (multi && z === 'right') wrap.classList.add('cursor-next');
    else wrap.classList.add('cursor-zoom');
  });

  document.addEventListener('click', function(event) {
    if (isMobile()) return;
    if (document.body.classList.contains('is-lightbox-open')) return;

    var wrap = event.target.closest('.jo-pr-document .jo-pr-image');
    if (wrap && wrap.joFigs) {
      event.preventDefault();
      var multi = wrap.classList.contains('jo-doc-multi');
      var z = joZone(wrap, event.clientX);
      if (multi && z === 'left') { joDocNav(wrap, -1); return; }
      if (multi && z === 'right') { joDocNav(wrap, 1); return; }
      var darkDoc = !!wrap.closest('.jo-pr.jo-dark');
      var srcs = wrap.joFigs.map(function(f) {
        var im = f.querySelector('img');
        return im ? (im.currentSrc || im.getAttribute('src')) : '';
      });
      openLightboxSet(srcs, wrap.joIdx, darkDoc, true);
      return;
    }

    var newsImg = event.target.closest('.jo-news-image');
    if (newsImg) {
      event.preventDefault();
      openLightboxSet([newsImg.currentSrc || newsImg.getAttribute('src')], 0, false, false);
    }
  });

  // ---------- HOMEPAGE UP / DOWN SNAP ZONES ----------
  var joNavUp = document.createElement('div');
  joNavUp.className = 'jo-nav-vert jo-nav-up';
  var joNavDown = document.createElement('div');
  joNavDown.className = 'jo-nav-vert jo-nav-down';
  document.body.appendChild(joNavUp);
  document.body.appendChild(joNavDown);

  joNavUp.addEventListener('click', function() { snapByDirection(-1); });
  joNavDown.addEventListener('click', function() { snapByDirection(1); });

  function joUpdateVertZones() {
    if (!joNavUp || !joNavDown) return;
    joNavUp.classList.toggle('jo-hidden', activeIndex <= 0);
    joNavDown.classList.toggle('jo-hidden', activeIndex >= sections.length - 1);
  }
  joUpdateVertZones();

  // ---------- NEWS / CV BACK ZONE ----------
  var joUtilBack = document.createElement('div');
  joUtilBack.className = 'jo-utility-back';
  document.body.appendChild(joUtilBack);
  joUtilBack.addEventListener('click', function() { closeUtility(); });

  // ---------- SUBSCRIBE (below the contact icons, behaves like Search) ----------
  var JO_SUBSCRIBE_ENDPOINT = ''; // set to your mailing-list form-action URL to capture addresses
  // Subscribe now lives inside the Office page (built above); the handlers below bind to it.

  document.querySelectorAll('[data-subscribe-open]').forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();
      var contact = link.closest('.jo-subscribe-row');
      if (!contact) return;
      contact.classList.add('is-subscribe-open');
      var input = contact.querySelector('[data-subscribe-input]');
      if (input) input.focus();
    });
  });

  document.querySelectorAll('[data-subscribe-form]').forEach(function(form) {
    form.addEventListener('submit', function(event) {
      event.preventDefault();
      var input = form.querySelector('[data-subscribe-input]');
      var email = input ? input.value.trim() : '';
      if (!email) return;
      var contact = form.closest('.jo-subscribe-row');
      var link = contact ? contact.querySelector('.jo-subscribe-link') : null;

      function done() {
        if (input) input.value = '';
        if (contact) contact.classList.remove('is-subscribe-open');
        if (link) {
          link.textContent = 'Thank you';
          setTimeout(function() { link.textContent = 'Subscribe'; }, 2500);
        }
      }

      if (JO_SUBSCRIBE_ENDPOINT) {
        fetch(JO_SUBSCRIBE_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'email=' + encodeURIComponent(email)
        }).then(done).catch(done);
      } else {
        done();
      }
    });
  });

  document.querySelectorAll('[data-subscribe-input]').forEach(function(input) {
    input.addEventListener('keydown', function(event) {
      if (event.key === 'Escape') {
        event.preventDefault();
        var contact = input.closest('.jo-subscribe-row');
        if (contact) contact.classList.remove('is-subscribe-open');
        input.value = '';
        input.blur();
      }
    });
    // Click out with no text: collapse back to the "Subscribe" link.
    input.addEventListener('blur', function() {
      if (input.value.trim()) return;
      var contact = input.closest('.jo-subscribe-row');
      if (contact) contact.classList.remove('is-subscribe-open');
    });
  });

  // ---------- MOBILE DOCUMENT LAYOUT ----------
  // No columns on mobile. Press releases: one image on top, text below.
  // Interviews / reviews: images interleaved through the text.
  function joMobileInterleaveDocs() {
    if (!isMobile()) return;
    document.querySelectorAll('.jo-pr-document').forEach(function(doc) {
      if (doc.getAttribute('data-mobile-done')) return;
      var imgWrap = doc.querySelector('.jo-pr-image');
      var textEl = doc.querySelector('.jo-pr-text');
      if (!textEl) return;
      doc.setAttribute('data-mobile-done', '1');
      if (!imgWrap) return;
      var figures = Array.prototype.slice.call(imgWrap.children);
      if (!figures.length) { if (imgWrap.parentNode) imgWrap.parentNode.removeChild(imgWrap); return; }
      var paras = Array.prototype.slice.call(textEl.children);

      if (doc.classList.contains('jo-doc-pr')) {
        textEl.insertBefore(figures[0], paras[0] || null);
        for (var i = 1; i < figures.length; i++) {
          if (figures[i].parentNode) figures[i].parentNode.removeChild(figures[i]);
        }
      } else {
        var step = Math.max(1, Math.floor(paras.length / figures.length));
        for (var j = 0; j < figures.length; j++) {
          var ref = paras[j * step] || null;
          textEl.insertBefore(figures[j], ref);
        }
      }
      if (imgWrap.parentNode) imgWrap.parentNode.removeChild(imgWrap);
    });
  }
  joMobileInterleaveDocs();
  window.addEventListener('resize', joMobileInterleaveDocs);

  // ---------- FONT-READY REVEAL ----------
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function() {
      document.documentElement.classList.remove('jo-fonts-loading');
    });
  }
  setTimeout(function() {
    document.documentElement.classList.remove('jo-fonts-loading');
  }, 1500);

  setTone(sections[0]);
  } catch (e) {
    // TEMP DIAGNOSTIC: prints the real error (blue bar). Remove once fixed.
    var bar = document.getElementById('joErrBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'joErrBar';
      bar.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#06c;color:#fff;font:12px/1.4 monospace;padding:8px;white-space:pre-wrap;';
      (document.body || document.documentElement).appendChild(bar);
    }
    var stk = (e && e.stack) ? String(e.stack).split('\n').slice(0, 3).join('  ||  ') : '';
    bar.textContent = 'JO CAUGHT: ' + (e && e.message ? e.message : e) + '  ||  ' + stk;
  }
})();
