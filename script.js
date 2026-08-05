// ---------------------------------------------------------------------
// Lamp pull-cord (day/night toggle). Only present on index.html, so
// everything here is guarded in case the .lamp-o element is missing.
// The chosen state is saved to localStorage so it carries over to the
// other pages (each page reads it back via a tiny inline snippet in
// its <head>, before paint, to avoid a flash of the wrong theme).
// ---------------------------------------------------------------------
(function () {
  var wrap = document.querySelector('.lamp-o');
  if (!wrap) return;
  var svg = wrap.querySelector('svg');

  var MAX_PULL  = 42; // px — how far the lamp can be dragged down
  var THRESHOLD = 24; // px — drag distance needed to trigger a toggle

  var dragging   = false;
  var startY   = 0;
  var pulled   = 0;
  var isOn     = document.documentElement.classList.contains('night');

  // ---- Hook for a future feature ----------------------------------
  // Replace / extend this function (or listen for the custom event
  // below) to connect the lamp to whatever it should control later.
  function onLampToggle(state) {
    // TODO: connect real feature here
    window.dispatchEvent(new CustomEvent('lamp:toggle', { detail: { on: state } }));
  }
  // -------------------------------------------------------------------

  function setOn(state) {
    isOn = state;
    wrap.classList.toggle('is-on', isOn);
    document.documentElement.classList.toggle('night', isOn);
    try { localStorage.setItem('night', isOn ? '1' : '0'); } catch (err) {}
    onLampToggle(isOn);
  }

  function getY(e) {
    return e.touches ? e.touches[0].clientY : e.clientY;
  }

  function onDown(e) {
    dragging = true;
    startY = getY(e);
    svg.classList.add('dragging');
    if (e.pointerId !== undefined) {
      try { svg.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function onMove(e) {
    if (!dragging) return;
    var dy = getY(e) - startY;
    pulled = Math.max(0, Math.min(MAX_PULL, dy));
    svg.style.transform = 'translateY(' + pulled + 'px)';
  }

  function onUp() {
    if (!dragging) return;
    dragging = false;
    svg.classList.remove('dragging');
    svg.style.transform = '';
    if (pulled >= THRESHOLD) {
      setOn(!isOn);
    }
    pulled = 0;
  }

  svg.addEventListener('pointerdown', onDown);
  svg.addEventListener('pointermove', onMove);
  svg.addEventListener('pointerup', onUp);
  svg.addEventListener('pointercancel', onUp);

  svg.addEventListener('touchstart', onDown, { passive: true });
  svg.addEventListener('touchmove', onMove, { passive: true });
  svg.addEventListener('touchend', onUp);
})();


(function () {
  var menuBtn = document.querySelector('.menu-btn');
  var overlay = document.getElementById('menuOverlay');
  if (!menuBtn || !overlay) return;
  var isOpen = false;

  function onMenuClick() {
    isOpen = !isOpen;
    overlay.classList.toggle('open', isOpen);
    overlay.setAttribute('aria-hidden', String(!isOpen));
    menuBtn.classList.toggle('open', isOpen);
    
    window.dispatchEvent(new CustomEvent('menu:click', { detail: { open: isOpen } }));
  }


  menuBtn.addEventListener('click', onMenuClick);
})();


(function () {
  var root = document.documentElement;
  if (!root.classList.contains('scroll-page')) return;

  var THRESHOLD = 60; // threshold scroll test later

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    root.classList.toggle('header-hidden', y > THRESHOLD);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


(function () {
  var stage = document.querySelector('.stage');
  var filmstrip = document.querySelector('.filmstrip');
  if (!stage || !filmstrip) return;

  function balanceFilmstrip() {
    var stageBottom = stage.getBoundingClientRect().bottom;
    var viewportH = window.innerHeight;
    var stripH = filmstrip.offsetHeight;
    var spaceBelowStage = viewportH - stageBottom;
    var gap = (spaceBelowStage - stripH) / 2;
    if (gap < 0) gap = 0;
    filmstrip.style.bottom = gap + 'px';
  }

  balanceFilmstrip();
  window.addEventListener('resize', balanceFilmstrip);
  window.addEventListener('load', balanceFilmstrip);
})();


(function () {
  var track = document.querySelector('.filmstrip-track');
  if (!track) return;

  var CLICK_TOLERANCE = 6; 

  var dragging = false;
  var startX = 0;
  var startOffset = 0;
  var currentOffset = 0;
  var pressedFrame = null; 

  function getX(e) {
    return e.touches ? e.touches[0].clientX : e.clientX;
  }

  function wrap(offset) {
    var halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 0) return offset;
    offset = offset % halfWidth;
    if (offset > 0) offset -= halfWidth;
    return offset;
  }

  function goToProject(frame) {
    var slug = frame && frame.getAttribute('data-slug');
    if (slug) window.location.href = 'project.html?p=' + encodeURIComponent(slug);
  }

  function onDown(e) {
    dragging = true;
    startX = getX(e);
    startOffset = currentOffset;
    pressedFrame = e.target.closest ? e.target.closest('.film-frame[data-slug]') : null;
    track.classList.add('dragging');
    if (e.pointerId !== undefined) {
      try { track.setPointerCapture(e.pointerId); } catch (err) {}
    }
  }

  function onMove(e) {
    if (!dragging) return;
    var dx = getX(e) - startX;
    currentOffset = wrap(startOffset + dx);
    track.style.transform = 'translateX(' + currentOffset + 'px)';
  }

  function onUp(e) {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');


    var dx = Math.abs(getX(e) - startX);
    if (dx < CLICK_TOLERANCE && pressedFrame) {
      goToProject(pressedFrame);
    }
    pressedFrame = null;
  }

  track.addEventListener('pointerdown', onDown);
  track.addEventListener('pointermove', onMove);
  track.addEventListener('pointerup', onUp);
  track.addEventListener('pointercancel', function () {
    dragging = false;
    pressedFrame = null;
    track.classList.remove('dragging');
  });


  track.addEventListener('touchstart', onDown, { passive: true });
  track.addEventListener('touchmove', onMove, { passive: true });
  track.addEventListener('touchend', onUp);

  function onWheel(e) {
    e.preventDefault();
    var delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    currentOffset = wrap(currentOffset - delta);
    track.style.transform = 'translateX(' + currentOffset + 'px)';
  }

  var filmstripEl = document.querySelector('.filmstrip');
  if (filmstripEl) filmstripEl.addEventListener('wheel', onWheel, { passive: false });
})();


(function () {
  var cursorEl = document.getElementById('project-cursor');
  var frames = document.querySelectorAll('.film-frame[data-project]');

  frames.forEach(function (frame) {
    var label = frame.getAttribute('data-project');

    frame.addEventListener('mouseenter', function () {
      cursorEl.textContent = label;
      cursorEl.classList.add('visible');
    });

    frame.addEventListener('mousemove', function (e) {
      cursorEl.style.left = e.clientX + 'px';
      cursorEl.style.top = e.clientY + 'px';
    });

    frame.addEventListener('mouseleave', function () {
      cursorEl.classList.remove('visible');
    });

    var hitBtn = frame.querySelector('.frame-hit');
    if (hitBtn) {
      hitBtn.addEventListener('click', function () {
        var slug = frame.getAttribute('data-slug');
        if (slug) window.location.href = 'project.html?p=' + encodeURIComponent(slug);
      });
    }
  });
})();

(function () {
  document.querySelectorAll('.polaroid[data-slug]').forEach(function (card) {
    card.addEventListener('click', function () {
      var slug = card.getAttribute('data-slug');
      if (slug) window.location.href = 'project.html?p=' + encodeURIComponent(slug);
    });
  });
})();