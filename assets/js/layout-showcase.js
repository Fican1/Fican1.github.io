(() => {
  'use strict';
  const zh = document.documentElement.lang.startsWith('zh');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const views = {
    '01-flow': ['Build sequence', '构建流程', 'Follow the layout build sequence, from the initial structure to the routed design.', '跟随版图构建顺序，查看初始结构到完成互连的过程。'],
    '02-stack': ['Process layers', '工艺层堆叠', 'Reveal the process layers one at a time and examine their contributions to the layout.', '逐层显示工艺层，查看各层在版图结构中的作用。'],
    '03-vias': ['Vias & connections', '过孔与互连', 'Inspect the via structures that connect routing layers.', '查看不同布线层之间的过孔结构与连接关系。'],
    '04-nets': ['Signal nets', '信号网络', 'Highlight individual nets to trace signal connectivity through the layout.', '逐一高亮信号网络，追踪版图中的连接路径。'],
    '05-stack3d': ['3D layer stack', '三维分层', 'Separate the process layers to see how the planar layout is organized in space.', '展开工艺层堆叠，查看版图从平面到空间的结构关系。'],
    '06-matching': ['Device matching', '器件匹配', 'Examine the placement and grouping of matched devices.', '查看匹配器件的排列方式及分组关系。'],
    '07-zoom': ['Local details', '局部细节', 'Move from the full layout into local geometry and routing details.', '从完整版图逐步放大，查看局部几何结构与布线细节。'],
    '08-power': ['Power network', '电源网络', 'Trace the power distribution paths across the layout.', '追踪电源在版图中的分布与连接路径。'],
  };
  const managed = new Map();
  let dialogOpen = false;
  const maybePlay = video => {
    const state = managed.get(video);
    if (!state || !state.visible || state.userPaused || reduceMotion.matches || document.hidden || dialogOpen) return;
    if (state.load) state.load();
    video.play().catch(() => { /* The play control remains available if autoplay is blocked. */ });
  };
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const state = managed.get(entry.target);
      state.visible = entry.isIntersecting;
      if (entry.isIntersecting) {
        if (state.load) state.load();
        maybePlay(entry.target);
      } else {
        entry.target.pause();
      }
    }
  }, { threshold: 0.12 });
  const manage = (video, load) => {
    managed.set(video, { visible: false, userPaused: false, load });
    video.muted = true;
    observer.observe(video);
  };
  const hero = document.querySelector('[data-hero-video]');
  const toggle = document.querySelector('[data-hero-toggle]');
  if (hero && toggle) {
    manage(hero);
    toggle.hidden = false;
    const label = toggle.querySelector('[data-toggle-label]');
    const icon = toggle.querySelector('[data-toggle-icon]');
    const updateToggle = () => {
      const paused = hero.paused;
      label.textContent = paused ? (zh ? '播放' : 'Play') : (zh ? '暂停' : 'Pause');
      icon.textContent = paused ? '▶' : 'Ⅱ';
      toggle.setAttribute('aria-label', paused ? (zh ? '播放版图动画' : 'Play layout animation') : (zh ? '暂停版图动画' : 'Pause layout animation'));
    };
    hero.addEventListener('play', updateToggle);
    hero.addEventListener('pause', updateToggle);
    toggle.addEventListener('click', () => {
      const state = managed.get(hero);
      if (hero.paused) {
        state.userPaused = false;
        hero.play().catch(() => {});
      } else {
        state.userPaused = true;
        hero.pause();
      }
    });
    updateToggle();
  }
  const explorer = document.querySelector('[data-layout-explorer]');
  if (explorer) {
    const video = explorer.querySelector('[data-layout-video]');
    const title = explorer.querySelector('[data-view-title]');
    const description = explorer.querySelector('[data-view-description]');
    const label = explorer.querySelector('[data-screen-label]');
    const base = explorer.dataset.mediaBase;
    let circuit = 'nmcnr';
    let view = '05-stack3d';
    let loaded = '';
    const load = () => {
      const key = `${view}-${circuit}`;
      if (loaded === key) return;
      loaded = key;
      video.src = `${base}${key}.webm`;
      video.load();
    };
    manage(video, load);
    const select = () => {
      explorer.querySelectorAll('[data-circuit]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.circuit === circuit)));
      explorer.querySelectorAll('[data-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.view === view)));
      title.textContent = views[view][zh ? 1 : 0];
      description.textContent = views[view][zh ? 3 : 2];
      label.textContent = `${circuit.toUpperCase()} / ${view.slice(0, 2)}`;
      video.setAttribute('aria-label', `${circuit.toUpperCase()} · ${title.textContent}`);
      video.poster = `${base}${view}-${circuit}.webp`;
      managed.get(video).userPaused = false;
      load();
      maybePlay(video);
    };
    explorer.querySelectorAll('[data-circuit]').forEach(button => button.addEventListener('click', () => { circuit = button.dataset.circuit; select(); }));
    explorer.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => { view = button.dataset.view; select(); }));
    video.addEventListener('error', () => {
      const fallback = document.createElement('a');
      fallback.href = video.src;
      fallback.textContent = zh ? '打开此视图的视频文件' : 'Open this view as a video';
      if (!explorer.querySelector('[data-media-error]')) {
        fallback.dataset.mediaError = '';
        description.append(' ', fallback);
      }
    });
  }
  const dialog = document.querySelector('[data-workflow-dialog]');
  const workflow = document.querySelector('[data-workflow-video]');
  if (dialog && workflow) {
    document.querySelectorAll('[data-open-workflow]').forEach(button => button.addEventListener('click', () => {
      dialogOpen = true;
      for (const video of managed.keys()) video.pause();
      if (!workflow.getAttribute('src')) workflow.src = workflow.dataset.src;
      dialog.showModal();
      workflow.play().catch(() => {});
    }));
    dialog.querySelector('[data-close-workflow]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      workflow.pause();
      dialogOpen = false;
      for (const video of managed.keys()) maybePlay(video);
    });
  }
  document.addEventListener('visibilitychange', () => {
    for (const video of managed.keys()) document.hidden ? video.pause() : maybePlay(video);
    if (document.hidden && workflow) workflow.pause();
  });
  reduceMotion.addEventListener('change', () => {
    for (const video of managed.keys()) reduceMotion.matches ? video.pause() : maybePlay(video);
  });
})();
