(function() {
  'use strict';

  const burgerLinks = document.querySelectorAll('.burger-menu a');
  const burgerMenuToggle = document.querySelector('#menu__toggle');

  const keys = {37: 1, 38: 1, 39: 1, 40: 1};

  function preventDefault(e) {
    e.preventDefault();
  }

  function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
      preventDefault(e);
      return false;
    }
  }

  let supportsPassive = false;

  try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
      get: function () { supportsPassive = true; }
    }));
  } catch(e) {}

  const wheelOpt = supportsPassive ? { passive: false } : false;
  const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

  function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false);
    window.addEventListener(wheelEvent, preventDefault, wheelOpt);
    window.addEventListener('touchmove', preventDefault, wheelOpt);
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
  }

  function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  }

  burgerMenuToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
      disableScroll();
    } else {
      enableScroll();
    }
  });

  burgerLinks.forEach((el) => {
    el.addEventListener('click', (e) => {
      burgerMenuToggle.checked = false;
      enableScroll();
    });
  });
})();
