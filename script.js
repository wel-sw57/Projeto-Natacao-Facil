/**
 * ====================================================
 * NATAÇÃO FÁCIL — SCRIPT OFICIAL & ARQUITETURA DE PRODUTO
 * Padrão Front-end Sênior • WCAG 2.2 AA • Lighthouse >= 95
 * ====================================================
 */

// ----------------------------------------------------
// 1. DADOS EDITÁVEIS PELO DONO (CONFIGURAÇÃO NO TOPO)
// ----------------------------------------------------

/**
 * CONDIÇÕES DO MAR (Atualizado manualmente pela equipe)
 * Altere os valores abaixo sempre que quiser atualizar o widget da praia.
 */
const CONDICOES_MAR = {
  praia: 'Porto da Barra',
  estado: 'calmo', // 'calmo' | 'moderado' | 'agitado'
  temperatura: '27°C',
  mare: 'Baixa às 08h30 (0.4m)',
  aviso: 'Águas calmas e límpidas. Excelente para alunos iniciantes e treinos do cardume!',
  atualizadoEm: 'Hoje às 06:00'
};

/**
 * CONFIGURAÇÃO DE ANALYTICS & CONVERSÃO
 * Insira seus IDs reais para ativar o rastreamento automático.
 */
const ANALYTICS_CONFIG = {
  ga4Id: '', // Exemplo: 'G-XXXXXXXXXX' <!-- [PREENCHER: ID GA4] -->
  metaPixelId: '' // Exemplo: '1234567890' <!-- [PREENCHER: ID META PIXEL] -->
};

/**
 * Função de Disparo de Eventos de Analytics (Desligada por padrão até preencher IDs)
 */
function trackEvent(eventName, params = {}) {
  // Disparo para Google Analytics 4 (GA4)
  if (typeof window.gtag === 'function' && ANALYTICS_CONFIG.ga4Id && ANALYTICS_CONFIG.ga4Id !== '') {
    window.gtag('event', eventName, params);
  }
  
  // Disparo para Meta Pixel (Facebook/Instagram)
  if (typeof window.fbq === 'function' && ANALYTICS_CONFIG.metaPixelId && ANALYTICS_CONFIG.metaPixelId !== '') {
    window.fbq('trackCustom', eventName, params);
  }
}

// ----------------------------------------------------
// 2. INICIALIZAÇÃO DA APLICAÇÃO QUANDO O DOM ESTIVER PRONTO
// ----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // --- Widget Condições do Mar ---
  initCondicoesMarWidget();

  // --- Efeitos de Header e Scroll ---
  initScrollEffects();

  // --- Acessibilidade: Modo Mar Calmo ---
  initMarCalmoToggle();

  // --- Drawer de Navegação Mobile (Trap Focus & ESC) ---
  initMobileDrawer();

  // --- Abas Porto da Barra × Itapuã ---
  initPraiasTabs();

  // --- Canvas Interativo do Cardume (Peixe Amarelo Líder) ---
  initCardumeCanvas();

  // --- Carrossel de Polaroids (Arrastar e Navegar) ---
  initPolaroidCarousel();

  // --- Contadores Animados do Projeto Social (50 / 3 / 1.500) ---
  initStatsCounters();

  // --- Quiz "Encontre sua Turma" (3 Passos Interativos) ---
  initQuizTurma();

  // --- FAQ Acordeão Acessível ---
  initFaqAccordion();

  // --- Carrossel de Depoimentos Acessível ---
  initDepoimentosCarousel();

  // --- Filtro de Planos por Praia ---
  initPlanosFilter();

  // --- Botão Voltar ao Topo ---
  initBackToTop();

  // --- Scroll Reveal Suave ---
  initScrollReveal();

  // --- Rastreamento de Cliques no WhatsApp ---
  initWhatsAppTracking();
});

// ----------------------------------------------------
// 3. MÓDULOS DE FUNCIONALIDADE
// ----------------------------------------------------

/**
 * 3.1. Widget "Condições do Mar Hoje"
 */
function initCondicoesMarWidget() {
  const praiaEl = document.getElementById('mar-widget-praia');
  const tempEl = document.getElementById('mar-widget-temp');
  const mareEl = document.getElementById('mar-widget-mare');
  const statusEl = document.getElementById('mar-widget-status');
  const avisoEl = document.getElementById('mar-widget-aviso');
  const dataEl = document.getElementById('mar-widget-data');

  if (praiaEl) praiaEl.textContent = CONDICOES_MAR.praia;
  if (tempEl) tempEl.textContent = CONDICOES_MAR.temperatura;
  if (mareEl) mareEl.textContent = CONDICOES_MAR.mare;
  if (dataEl) dataEl.textContent = CONDICOES_MAR.atualizadoEm;

  if (statusEl) {
    if (CONDICOES_MAR.estado === 'agitado') {
      statusEl.textContent = 'Mar Agitado / Mexido';
      statusEl.style.color = '#ef4444';
      if (avisoEl) {
        avisoEl.textContent = 'Hoje não teve nado por causa do mar mexido... Mas amanhã estamos de volta!';
      }
    } else if (CONDICOES_MAR.estado === 'moderado') {
      statusEl.textContent = 'Mar Moderado';
      statusEl.style.color = '#ffbe0b';
      if (avisoEl) avisoEl.textContent = CONDICOES_MAR.aviso;
    } else {
      statusEl.textContent = 'Mar Calmo e Propício';
      statusEl.style.color = '#10b981';
      if (avisoEl) avisoEl.textContent = CONDICOES_MAR.aviso;
    }
  }
}

/**
 * 3.2. Efeitos de Scroll & Barra de Leitura
 */
function initScrollEffects() {
  const header = document.getElementById('main-header');
  const progressBar = document.getElementById('reading-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Header scrolled state (transição suave 76px -> 68px)
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Reading progress width
    if (progressBar && docHeight > 0) {
      const progress = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      progressBar.style.width = `${progress}%`;
    }
  }, { passive: true });
}

/**
 * 3.3. Modo "Mar Calmo" (Acessibilidade Real & Reduced Motion)
 */
let toastTimeout = null;
function initMarCalmoToggle() {
  const switches = document.querySelectorAll('[role="switch"][data-switch="mar-calmo"]');
  const toast = document.getElementById('toast-notification');

  // Recupera preferência do localStorage ou prefers-reduced-motion
  const savedPref = localStorage.getItem('mar_calmo_ativo');
  const systemPrefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const initialActive = savedPref !== null ? savedPref === 'true' : systemPrefersReduced;

  applyMarCalmo(initialActive, false);

  switches.forEach(sw => {
    sw.addEventListener('click', () => {
      const currentState = sw.getAttribute('aria-checked') === 'true';
      const newState = !currentState;
      applyMarCalmo(newState, true);
    });

    sw.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        sw.click();
      }
    });
  });

  function applyMarCalmo(active, showFeedback) {
    document.body.classList.toggle('mar-calmo', active);
    document.documentElement.setAttribute('data-motion', active ? 'reduced' : 'normal');
    localStorage.setItem('mar_calmo_ativo', active ? 'true' : 'false');

    switches.forEach(sw => {
      sw.setAttribute('aria-checked', active ? 'true' : 'false');
    });

    if (showFeedback && toast) {
      const msg = active
        ? 'Modo Mar Calmo ativado (animações e movimentos pausados)'
        : 'Modo normal ativado (movimento das ondas restaurado)';
      
      const msgEl = toast.querySelector('.toast-message') || toast.querySelector('span');
      if (msgEl) msgEl.textContent = msg;

      toast.classList.add('active');

      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => {
        toast.classList.remove('active');
      }, 3500);
    }
  }
}

/**
 * 3.4. Menu Mobile Drawer com A11y (Teclado ESC e Trap Focus)
 */
function initMobileDrawer() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeBtn = document.getElementById('mobile-drawer-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');

  if (!menuBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    closeBtn?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
    document.body.style.overflow = '';
  }

  menuBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeDrawer();
    }
  });
}

/**
 * 3.5. Abas Acessíveis Porto da Barra × Itapuã (WAI-ARIA Tablist)
 */
function initPraiasTabs() {
  const tabs = document.querySelectorAll('[role="tab"][data-tab-praia]');
  const panels = document.querySelectorAll('[role="tabpanel"][data-panel-praia]');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      activateTab(tab);
    });

    tab.addEventListener('keydown', (e) => {
      let targetTab = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        targetTab = tab.nextElementSibling || tabs[0];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        targetTab = tab.previousElementSibling || tabs[tabs.length - 1];
      } else if (e.key === 'Home') {
        targetTab = tabs[0];
      } else if (e.key === 'End') {
        targetTab = tabs[tabs.length - 1];
      }

      if (targetTab) {
        e.preventDefault();
        targetTab.focus();
        activateTab(targetTab);
      }
    });
  });

  function activateTab(activeTab) {
    const praiaKey = activeTab.getAttribute('data-tab-praia');

    tabs.forEach(t => {
      t.setAttribute('aria-selected', 'false');
      t.setAttribute('tabindex', '-1');
    });

    activeTab.setAttribute('aria-selected', 'true');
    activeTab.setAttribute('tabindex', '0');

    panels.forEach(p => {
      if (p.getAttribute('data-panel-praia') === praiaKey) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    trackEvent('tab_praia_switch', { praia: praiaKey });
  }
}

/**
 * 3.6. Canvas Interativo: Cardume & Peixe Líder Amarelo
 */
function initCardumeCanvas() {
  const canvas = document.getElementById('cardume-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = document.getElementById('cardume');

  let width = 0;
  let height = 0;
  let animationId = null;
  let isSectionVisible = true;

  function resize() {
    if (!section) return;
    const rect = section.getBoundingClientRect();
    width = canvas.width = rect.width;
    height = canvas.height = rect.height;
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Posição alvo do cursor / toque
  const mouse = {
    x: width / 2,
    y: height / 2,
    active: false
  };

  // Peixe Líder Amarelo Sol (#ffbe0b)
  const yellowFish = {
    x: width / 2,
    y: height / 2,
    vx: 0,
    vy: 0,
    angle: 0,
    size: 26,
    color: '#ffbe0b',
    eyeColor: '#082d49',
    bellyColor: '#ffd166',
    speed: 4.8
  };

  // Seguidores do Cardume (Azul Claro e Branco)
  const followersCount = window.innerWidth < 768 ? 9 : 18;
  const followers = [];

  for (let i = 0; i < followersCount; i++) {
    followers.push({
      x: width / 2 + (Math.random() - 0.5) * 200,
      y: height / 2 + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      angle: Math.random() * Math.PI * 2,
      size: 13 + Math.random() * 7,
      color: i % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(165, 243, 252, 0.85)',
      speed: 3.2 + Math.random() * 1.6,
      targetDelay: 10 + i * 4,
      tailWag: Math.random() * Math.PI * 2
    });
  }

  // Ondulações de clique (Ripples)
  const ripples = [];

  function addRipple(rx, ry) {
    ripples.push({
      x: rx,
      y: ry,
      radius: 4,
      maxRadius: 75,
      alpha: 0.85
    });
  }

  // Eventos de Mouse e Toque
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;
    addRipple(cx, cy);
  });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.touches[0].clientX - rect.left;
      mouse.y = e.touches[0].clientY - rect.top;
      mouse.active = true;
    }
  }, { passive: true });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const cx = e.touches[0].clientX - rect.left;
      const cy = e.touches[0].clientY - rect.top;
      mouse.x = cx;
      mouse.y = cy;
      mouse.active = true;
      addRipple(cx, cy);
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.active = false;
  });

  let time = 0;

  // Loop de Renderização
  function renderLoop() {
    // Se "Mar Calmo" estiver ativado ou seção fora de tela, não processa loop
    if (document.body.classList.contains('mar-calmo') || document.documentElement.getAttribute('data-motion') === 'reduced') {
      animationId = null;
      return;
    }

    if (!isSectionVisible) {
      animationId = null;
      return;
    }

    time += 0.05;
    ctx.clearRect(0, 0, width, height);

    // 1. Atualiza e desenha Ripples
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rip = ripples[r];
      rip.radius += 2.2;
      rip.alpha -= 0.022;

      if (rip.alpha <= 0 || rip.radius >= rip.maxRadius) {
        ripples.splice(r, 1);
        continue;
      }

      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${rip.alpha})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();
    }

    // 2. Movimento do Peixe Líder Amarelo
    let targetX = mouse.active ? mouse.x : width / 2 + Math.cos(time * 0.7) * (width * 0.32);
    let targetY = mouse.active ? mouse.y : height / 2 + Math.sin(time * 1.1) * (height * 0.28);

    const dx = targetX - yellowFish.x;
    const dy = targetY - yellowFish.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 10) {
      const desiredAngle = Math.atan2(dy, dx);
      let diff = desiredAngle - yellowFish.angle;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      yellowFish.angle += diff * 0.18;

      const spd = Math.min(yellowFish.speed, dist * 0.08);
      yellowFish.vx = Math.cos(yellowFish.angle) * spd;
      yellowFish.vy = Math.sin(yellowFish.angle) * spd;

      yellowFish.x += yellowFish.vx;
      yellowFish.y += yellowFish.vy;
    }

    // Desenha o Peixe Amarelo
    drawFish(ctx, yellowFish.x, yellowFish.y, yellowFish.angle, yellowFish.size, yellowFish.color, true, time);

    // 3. Movimento dos Seguidores do Cardume
    let prevLeaderX = yellowFish.x;
    let prevLeaderY = yellowFish.y;

    followers.forEach((f, idx) => {
      f.tailWag += 0.25;

      // Posição de floco atrás do líder
      const leadDist = 45 + idx * 9;
      const angleOffset = (idx % 2 === 0 ? 1 : -1) * (0.35 + (idx * 0.04));
      const fTargetX = prevLeaderX - Math.cos(yellowFish.angle + angleOffset) * leadDist;
      const fTargetY = prevLeaderY - Math.sin(yellowFish.angle + angleOffset) * leadDist;

      const fdx = fTargetX - f.x;
      const fdy = fTargetY - f.y;
      const fdist = Math.hypot(fdx, fdy);

      if (fdist > 4) {
        const fAngle = Math.atan2(fdy, fdx);
        let fdiff = fAngle - f.angle;
        while (fdiff < -Math.PI) fdiff += Math.PI * 2;
        while (fdiff > Math.PI) fdiff -= Math.PI * 2; // FIX: corrigido fdiff
        f.angle += fdiff * 0.2;

        const fspd = Math.min(f.speed, fdist * 0.1);
        f.x += Math.cos(f.angle) * fspd;
        f.y += Math.sin(f.angle) * fspd;
      }

      // Desenha o seguidor
      drawFish(ctx, f.x, f.y, f.angle, f.size, f.color, false, f.tailWag);
    });

    animationId = requestAnimationFrame(renderLoop);
  }

  // Função para desenhar a anatomia do peixe
  function drawFish(c, x, y, angle, size, color, isLeader, wag) {
    c.save();
    c.translate(x, y);
    c.rotate(angle);

    const tailAngle = Math.sin(wag) * (isLeader ? 0.38 : 0.48);

    // Corpo do peixe
    c.fillStyle = color;
    c.beginPath();
    c.ellipse(0, 0, size, size * 0.44, 0, 0, Math.PI * 2);
    c.fill();

    // Cauda animada
    c.save();
    c.translate(-size * 0.85, 0);
    c.rotate(tailAngle);
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(-size * 0.65, -size * 0.45);
    c.lineTo(-size * 0.45, 0);
    c.lineTo(-size * 0.65, size * 0.45);
    c.closePath();
    c.fillStyle = color;
    c.fill();
    c.restore();

    // Barbatana dorsal
    c.beginPath();
    c.moveTo(-size * 0.2, -size * 0.4);
    c.quadraticCurveTo(0, -size * 0.75, size * 0.2, -size * 0.4);
    c.fillStyle = color;
    c.fill();

    // Detalhes extras do Peixe Líder Amarelo
    if (isLeader) {
      c.strokeStyle = '#ffffff';
      c.lineWidth = 1;
      c.stroke();

      c.fillStyle = '#082d49';
      c.beginPath();
      c.arc(size * 0.45, -size * 0.12, size * 0.13, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = '#ffffff';
      c.beginPath();
      c.arc(size * 0.5, -size * 0.15, size * 0.05, 0, Math.PI * 2);
      c.fill();
    }

    c.restore();
  }

  // IntersectionObserver: pausa render quando fora da tela
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      isSectionVisible = entries[0].isIntersecting;
      if (isSectionVisible && !animationId && !document.body.classList.contains('mar-calmo') && document.documentElement.getAttribute('data-motion') !== 'reduced') {
        animationId = requestAnimationFrame(renderLoop);
      }
    }, { threshold: 0.1 });
    observer.observe(section);
  } else {
    animationId = requestAnimationFrame(renderLoop);
  }
}

/**
 * 3.7. Carrossel de Polaroids com Suporte a Drag Desktop & Touch
 */
function initPolaroidCarousel() {
  const carousel = document.querySelector('.cardume-carousel');
  if (!carousel) return;

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('mouseleave', () => { isDown = false; });
  carousel.addEventListener('mouseup', () => { isDown = false; });

  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 2;
    carousel.scrollLeft = scrollLeft - walk;
  });
}

/**
 * 3.8. Contadores Animados do Projeto Social (50 / 3 / 1.500)
 */
function initStatsCounters() {
  const counterEls = document.querySelectorAll('.stat-number[data-target]');
  if (counterEls.length === 0) return;

  let hasAnimated = false;

  function runCounters() {
    if (hasAnimated) return;
    hasAnimated = true;

    counterEls.forEach(el => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      const isFormatted = el.getAttribute('data-formatted') === 'true';
      const duration = 1800; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing: easeOutExpo
        const easeVal = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = Math.floor(easeVal * target);

        el.textContent = isFormatted ? currentVal.toLocaleString('pt-BR') : currentVal;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = isFormatted ? target.toLocaleString('pt-BR') : target;
        }
      }

      requestAnimationFrame(update);
    });
  }

  const socialSection = document.getElementById('natacao-para-todos');
  if (socialSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        runCounters();
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    observer.observe(socialSection);
  } else {
    runCounters();
  }
}

/**
 * 3.9. Quiz "Encontre sua Turma" (3 Passos Interativos -> WhatsApp)
 */
function initQuizTurma() {
  // Estado inicial VAZIO obrigatório (sem pré-seleções)
  const quizState = {
    praia: null,
    nivel: null,
    turno: null
  };

  const steps = [
    document.getElementById('quiz-step-1'),
    document.getElementById('quiz-step-2'),
    document.getElementById('quiz-step-3'),
    document.getElementById('quiz-step-done')
  ];

  const progressBar = document.getElementById('quiz-progress-fill');
  const progressLabel = document.getElementById('quiz-progress-text');

  // Botões de Opção do Passo 1 (Praia)
  document.querySelectorAll('.quiz-opt-btn[data-step="1"]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectQuizOption(btn, '1');
      quizState.praia = btn.getAttribute('data-val');
      setTimeout(() => goToStep(2), 180);
    });
  });

  // Botões de Opção do Passo 2 (Nível)
  document.querySelectorAll('.quiz-opt-btn[data-step="2"]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectQuizOption(btn, '2');
      quizState.nivel = btn.getAttribute('data-val');
      setTimeout(() => goToStep(3), 180);
    });
  });

  // Botões de Opção do Passo 3 (Turno)
  document.querySelectorAll('.quiz-opt-btn[data-step="3"]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectQuizOption(btn, '3');
      quizState.turno = btn.getAttribute('data-val');
      setTimeout(() => finishQuiz(), 180);
    });
  });

  function selectQuizOption(selectedBtn, stepNum) {
    document.querySelectorAll(`.quiz-opt-btn[data-step="${stepNum}"]`).forEach(b => {
      b.classList.remove('selected');
    });
    selectedBtn.classList.add('selected');
  }

  // Botões Voltar
  const backTo1 = document.getElementById('quiz-back-to-1');
  const backTo2 = document.getElementById('quiz-back-to-2');
  if (backTo1) backTo1.addEventListener('click', () => goToStep(1));
  if (backTo2) backTo2.addEventListener('click', () => goToStep(2));

  // Botão Reiniciar
  const resetBtn = document.getElementById('quiz-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      quizState.praia = null;
      quizState.nivel = null;
      quizState.turno = null;
      document.querySelectorAll('.quiz-opt-btn').forEach(b => b.classList.remove('selected'));
      goToStep(1);
    });
  }

  // Navegação pelos badges no resumo final (resumo editável)
  const editPraia = document.getElementById('quiz-edit-praia');
  const editNivel = document.getElementById('quiz-edit-nivel');
  const editTurno = document.getElementById('quiz-edit-turno');
  if (editPraia) editPraia.addEventListener('click', () => goToStep(1));
  if (editNivel) editNivel.addEventListener('click', () => goToStep(2));
  if (editTurno) editTurno.addEventListener('click', () => goToStep(3));

  function goToStep(stepNum) {
    steps.forEach((s, idx) => {
      if (s) s.classList.toggle('active', idx === (stepNum - 1));
    });

    if (progressBar && progressLabel) {
      if (stepNum <= 3) {
        const pct = (stepNum / 3) * 100;
        progressBar.style.width = `${pct}%`;
        progressLabel.textContent = `Passo ${stepNum} de 3`;
        progressBar.parentElement.setAttribute('aria-valuenow', stepNum);
      } else {
        progressBar.style.width = '100%';
        progressLabel.textContent = 'Questionário Concluído!';
        progressBar.parentElement.setAttribute('aria-valuenow', 3);
      }
    }
  }

  function finishQuiz() {
    goToStep(4);

    const sumPraia = document.getElementById('quiz-sum-praia');
    const sumNivel = document.getElementById('quiz-sum-nivel');
    const sumTurno = document.getElementById('quiz-sum-turno');
    const whatsappBtn = document.getElementById('quiz-final-whatsapp');

    if (sumPraia) sumPraia.textContent = quizState.praia || 'A combinar';
    if (sumNivel) sumNivel.textContent = quizState.nivel || 'Iniciante';
    if (sumTurno) sumTurno.textContent = quizState.turno || 'A combinar';

    if (whatsappBtn) {
      const msg = `Olá! Fiz o questionário no site da Natação Fácil para encontrar minha turma:\n• Praia: ${quizState.praia || 'A combinar'}\n• Nível: ${quizState.nivel || 'Iniciante'}\n• Horário preferido: ${quizState.turno || 'A combinar'}\nGostaria de agendar minha aula experimental!`;
      whatsappBtn.href = `https://wa.me/5571984823681?text=${encodeURIComponent(msg)}`;
    }

    trackEvent('quiz_complete', {
      praia: quizState.praia,
      nivel: quizState.nivel,
      turno: quizState.turno
    });
  }
}

/**
 * 3.10. FAQ Acordeão Acessível
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer-panel');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Fecha todos os outros itens para manter o acordeão limpo
      faqItems.forEach(otherItem => {
        const otherTrigger = otherItem.querySelector('.faq-question-btn');
        const otherAnswer = otherItem.querySelector('.faq-answer-panel');
        if (otherTrigger && otherAnswer && otherItem !== item) {
          otherTrigger.setAttribute('aria-expanded', 'false');
          otherAnswer.style.maxHeight = '0px';
          otherItem.classList.remove('open');
        }
      });

      // Alterna o item atual
      if (isExpanded) {
        trigger.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0px';
        item.classList.remove('open');
      } else {
        trigger.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
        item.classList.add('open');
      }
    });
  });
}

/**
 * 3.11. Carrossel de Depoimentos Acessível
 */
function initDepoimentosCarousel() {
  const carousel = document.querySelector('.depoimentos-track');
  const prevBtn = document.getElementById('depoimentos-prev');
  const nextBtn = document.getElementById('depoimentos-next');
  const dots = document.querySelectorAll('.depoimento-dot');

  if (!carousel) return;

  let currentIndex = 0;
  const cards = carousel.querySelectorAll('.depoimento-card');
  const total = cards.length;

  if (total <= 1) return;

  function updateCarousel(index) {
    currentIndex = (index + total) % total;
    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
      dot.setAttribute('aria-selected', idx === currentIndex ? 'true' : 'false');
    });
  }

  if (prevBtn) prevBtn.addEventListener('click', () => updateCarousel(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateCarousel(currentIndex + 1));

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      updateCarousel(idx);
    });
  });
}

/**
 * 3.12. Filtro de Planos por Praia
 */
function initPlanosFilter() {
  const filterBtns = document.querySelectorAll('.planos-filter-btn');
  const planoCards = document.querySelectorAll('.plano-card');

  if (filterBtns.length === 0 || planoCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      planoCards.forEach(card => {
        const praia = card.getAttribute('data-praia');
        if (filter === 'todos' || praia === filter || praia === 'ambas') {
          card.style.display = 'flex';
          card.classList.add('fade-in');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 3.13. Botão Voltar ao Topo
 */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/**
 * 3.14. Scroll Reveal Suave
 */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal-on-scroll');
  if (reveals.length === 0) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }
}

/**
 * 3.15. Rastreamento Unificado de Conversões no WhatsApp
 */
function initWhatsAppTracking() {
  document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
      const label = link.getAttribute('data-track-label') || 'whatsapp_cta_click';
      trackEvent('contact_whatsapp', {
        link_url: link.href,
        button_label: label
      });
    });
  });
}
