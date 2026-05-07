window.SkyTheme = (function () {
  var THEMES = {
    night: {
      cssVars: { '--bg': '#03060d', '--bg2': '#060b14', '--bg3': '#0a1020', '--accent': '#7eb8d4' },
      canvas: {
        starLayers: [
          { count: 70, rMin: .12, rMax: .4,  aMax: .4,  spd: .0008 },
          { count: 80, rMin: .28, rMax: .75, aMax: .62, spd: .0014 },
          { count: 40, rMin: .5,  rMax: 1.2, aMax: .82, spd: .0024 },
        ],
        particleCount: 0, particleColors: [],
        galaxyEnabled: true, shootEnabled: true,
      },
      orbStyle: 'radial-gradient(circle at 38% 38%,rgba(255,248,220,.17) 0%,rgba(232,201,122,.09) 32%,rgba(126,184,212,.035) 62%,transparent 80%)',
    },
    morning: {
      cssVars: { '--bg': '#071828', '--bg2': '#0d2540', '--bg3': '#1a3a5c', '--accent': '#7eb8d4' },
      canvas: {
        starLayers: [
          { count: 70, rMin: .12, rMax: .4, aMax: .2, spd: .0005 },
        ],
        particleCount: 22,
        particleColors: [[255, 255, 240], [200, 225, 255], [220, 240, 255]],
        galaxyEnabled: false, shootEnabled: false,
      },
      orbStyle: 'radial-gradient(circle at 60% 35%,rgba(230,245,255,.22) 0%,rgba(180,215,240,.12) 40%,rgba(100,170,210,.04) 70%,transparent 85%)',
    },
    afternoon: {
      cssVars: { '--bg': '#051510', '--bg2': '#0a2018', '--bg3': '#0f2d1e', '--accent': '#6dc98a' },
      canvas: {
        starLayers: [],
        particleCount: 18,
        particleColors: [[100, 200, 130], [140, 220, 160], [80, 180, 110]],
        galaxyEnabled: false, shootEnabled: false,
      },
      orbStyle: 'radial-gradient(circle at 55% 40%,rgba(220,240,180,.18) 0%,rgba(150,210,120,.10) 40%,rgba(80,160,80,.04) 70%,transparent 85%)',
    },
  };

  function getThemeName(h) {
    return h >= 20 || h < 7 ? 'night' : h < 12 ? 'morning' : 'afternoon';
  }

  function applyTheme(name) {
    var theme = THEMES[name];
    if (!theme) return;
    var root = document.documentElement;
    Object.keys(theme.cssVars).forEach(function (k) {
      root.style.setProperty(k, theme.cssVars[k]);
    });
    document.body.classList.remove('theme-night', 'theme-morning', 'theme-afternoon');
    document.body.classList.add('theme-' + name);
    var orb = document.getElementById('moon-orb');
    if (orb) orb.style.background = theme.orbStyle;
    SkyTheme.current = { name: name, canvas: theme.canvas };
  }

  function init() {
    var h = new Date().getHours();
    applyTheme(getThemeName(h));
    setInterval(function () {
      var newName = getThemeName(new Date().getHours());
      if (newName !== SkyTheme.current.name) {
        applyTheme(newName);
        if (window._starsReinit) window._starsReinit();
      }
    }, 5 * 60 * 1000);
  }

  var SkyTheme = { current: null, THEMES: THEMES, getThemeName: getThemeName, init: init };
  applyTheme(getThemeName(new Date().getHours()));
  return SkyTheme;
})();
