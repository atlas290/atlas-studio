/* ============================================
   ATLAS STUDIO - Scripts
   ============================================ */

// --- Navbar : fond au scroll ---
(function () {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// --- Menu overlay ---
(function () {
  var menuBtn = document.getElementById('menuBtn');
  var menuClose = document.getElementById('menuClose');
  var overlay = document.getElementById('menuOverlay');

  if (!menuBtn || !overlay) return;

  menuBtn.addEventListener('click', function () {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });

  if (menuClose) {
    menuClose.addEventListener('click', function () {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  var links = overlay.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener('click', function () {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  }
})();

// --- Reveal au scroll ---
(function () {
  var elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.add('visible');
    }
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(function (el) {
    observer.observe(el);
  });
})();

// --- Pause video quand on quitte la page (iPhone) ---
(function () {
  function pauseVideos() {
    var videos = document.querySelectorAll('video');
    for (var i = 0; i < videos.length; i++) {
      try { videos[i].pause(); } catch (e) {}
    }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pauseVideos();
  });

  window.addEventListener('blur', pauseVideos);
  window.addEventListener('pagehide', pauseVideos);
})();

// --- Fade-in des videos quand elles sont pretes ---
(function () {
  var videos = document.querySelectorAll('video');
  if (!videos.length) return;

  for (var i = 0; i < videos.length; i++) {
    (function (v) {
      function showVideo() {
        v.classList.add('ready');
      }

      if (v.readyState >= 3) {
        showVideo();
      } else {
        v.addEventListener('canplay', showVideo);
        v.addEventListener('loadeddata', showVideo);
      }
    })(videos[i]);
  }
})();

// --- EFFET GOUTTE D'EAU (Canvas) ---
(function() {
    var canvas = document.getElementById('trail-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    
    var drops = [];
    var maxDrops = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function createDrop(x, y) {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

        drops.push({
            x: x,
            y: y,
            radius: 2, // On démarre avec un petit point
            life: 1.0,
            decay: 0.02 // La goutte s'efface un peu plus lentement
        });
        
        if (drops.length > maxDrops) {
            drops.shift();
        }
    }

    // Souris (PC)
    window.addEventListener('mousemove', function(e) {
        createDrop(e.clientX, e.clientY);
    });

    // Tactile (Mobile) - Au toucher
    window.addEventListener('touchstart', function(e) {
        var touch = e.touches[0];
        createDrop(touch.clientX, touch.clientY);
    }, { passive: true });

    // Tactile (Mobile) - Quand on glisse le doigt
    window.addEventListener('touchmove', function(e) {
        var touch = e.touches[0];
        createDrop(touch.clientX, touch.clientY);
    }, { passive: true });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < drops.length; i++) {
            var d = drops[i];
            d.radius += 2.5; // L'onde s'agrandit plus vite
            d.life -= d.decay;

            if (d.life > 0) {
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
                
                // Couleur or (201, 169, 97) BEAUCOUP plus visible
                ctx.strokeStyle = 'rgba(201, 169, 97, ' + d.life + ')';
                ctx.lineWidth = 2; // Trait plus épais
                ctx.stroke();
            }
        }

        drops = drops.filter(function(d) { return d.life > 0; });
        requestAnimationFrame(animate);
    }
    
    animate();
})();
