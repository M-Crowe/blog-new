/**
 * Mermaid 客户端动态渲染与交互模块
 * 包含：按需动态加载、Nord 主题配色适配、图表/源码切换、复制代码、模态放大等功能
 */

let isMermaidInitialized = false;

export async function initMermaid() {
  // 查找文章中所有标注为 mermaid 的代码块
  const preElements = Array.from(
    document.querySelectorAll<HTMLPreElement>(
      'article pre[data-language="mermaid"], article pre.language-mermaid, article pre[data-lang="mermaid"], article pre:has(> code.language-mermaid), article pre:has(> code[data-language="mermaid"])'
    )
  );

  // 同时也检查未被属性标注但含有 mermaid 标志的 pre
  const allArticlePres = Array.from(document.querySelectorAll<HTMLPreElement>('article pre'));
  allArticlePres.forEach((pre) => {
    if (preElements.includes(pre)) return;
    const code = pre.querySelector('code');
    const lang =
      pre.getAttribute('data-language') ||
      pre.dataset.language ||
      (code ? code.getAttribute('data-language') || code.dataset.language : '') ||
      '';
    if (lang.toLowerCase() === 'mermaid') {
      preElements.push(pre);
    }
  });

  if (preElements.length === 0) {
    return;
  }

  // 动态导入 Mermaid 库（仅在页面含有 Mermaid 图表时加载）
  let mermaid: any;
  try {
    const mod = await import('mermaid');
    mermaid = mod.default || mod;
  } catch (err) {
    console.error('[Mermaid] 加载 Mermaid 失败:', err);
    return;
  }

  // 初始化 Mermaid 配置（适配博客 Nord 极简浅色主题）
  if (!isMermaidInitialized) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'loose',
      theme: 'base',
      themeVariables: {
        fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
        fontSize: '13.5px',
        darkMode: false,

        // 基础调色板 (Nord Palette)
        background: '#FFFFFF',
        primaryColor: '#ECEFF4',
        primaryTextColor: '#2E3440',
        primaryBorderColor: '#5E81AC',
        lineColor: '#5E81AC',
        secondaryColor: '#E5E9F0',
        secondaryTextColor: '#2E3440',
        secondaryBorderColor: '#81A1C1',
        tertiaryColor: '#F8FAFC',
        tertiaryTextColor: '#2E3440',
        tertiaryBorderColor: '#D8DEE9',

        // 提示与便签
        noteBkgColor: '#FFFBEB',
        noteTextColor: '#78350F',
        noteBorderColor: '#FCD34D',

        // 流程图
        nodeBorder: '#5E81AC',
        nodeTextColor: '#2E3440',
        mainBkg: '#ECEFF4',
        clusterBkg: '#F8FAFC',
        clusterBorder: '#D8DEE9',
        defaultLinkColor: '#5E81AC',
        titleColor: '#2E3440',
        edgeLabelBackground: '#FFFFFF',

        // 时序图
        actorBkg: '#ECEFF4',
        actorBorder: '#5E81AC',
        actorTextColor: '#2E3440',
        actorLineColor: '#81A1C1',
        signalColor: '#5E81AC',
        signalTextColor: '#2E3440',
        labelBoxBkgColor: '#ECEFF4',
        labelBoxBorderColor: '#5E81AC',
        labelTextColor: '#2E3440',
        loopTextColor: '#2E3440',
        activationBorderColor: '#5E81AC',
        activationBkgColor: '#E5E9F0',

        // 状态图
        labelColor: '#2E3440',
        altBackground: '#F4F6F9',

        // 类图与实体图
        classText: '#2E3440',
      },
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        useMaxWidth: true,
      },
      sequence: {
        useMaxWidth: true,
        showSequenceNumbers: false,
      },
      gantt: {
        useMaxWidth: true,
      },
    });
    isMermaidInitialized = true;
  }

  // 逐个解析并渲染 Mermaid 元素
  for (let i = 0; i < preElements.length; i++) {
    const pre = preElements[i];
    // 避免重复初始化
    if (pre.dataset.mermaidRendered === 'true' || pre.closest('.mermaid-wrapper')) {
      continue;
    }

    const codeEl = pre.querySelector('code');
    const rawCode = (codeEl ? codeEl.textContent : pre.textContent) || '';
    if (!rawCode.trim()) continue;

    pre.dataset.mermaidRendered = 'true';

    // 创建唯一渲染容器 ID
    const diagramId = `mermaid-svg-${Date.now()}-${i}`;

    try {
      // 渲染为 SVG
      const { svg, bindFunctions } = await mermaid.render(diagramId, rawCode.trim());

      // 构建外层包裹器与工具栏
      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-wrapper';
      wrapper.setAttribute('data-state', 'preview');

      // 顶部工具栏
      const toolbar = document.createElement('div');
      toolbar.className = 'mermaid-toolbar';

      // 语言徽标
      const badge = document.createElement('div');
      badge.className = 'mermaid-badge';
      badge.innerHTML = `
        <svg class="mermaid-badge-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
          <polyline points="2 17 12 22 22 17"></polyline>
          <polyline points="2 12 12 17 22 12"></polyline>
        </svg>
        <span>MERMAID</span>
      `;
      toolbar.appendChild(badge);

      // 操作按钮组
      const actions = document.createElement('div');
      actions.className = 'mermaid-actions';

      // 1. 切换视图按钮（图表/源码）
      const toggleBtn = document.createElement('button');
      toggleBtn.type = 'button';
      toggleBtn.className = 'mermaid-action-btn btn-toggle';
      toggleBtn.title = '切换源码与图表预览';
      toggleBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="16 18 22 12 16 6"></polyline>
          <polyline points="8 6 2 12 8 18"></polyline>
        </svg>
        <span class="btn-text">源码</span>
      `;

      // 2. 放大查看按钮（模态全屏）
      const zoomBtn = document.createElement('button');
      zoomBtn.type = 'button';
      zoomBtn.className = 'mermaid-action-btn btn-zoom';
      zoomBtn.title = '放大查看图表';
      zoomBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
        </svg>
        <span class="btn-text">放大</span>
      `;

      // 3. 复制代码按钮
      const copyBtn = document.createElement('button');
      copyBtn.type = 'button';
      copyBtn.className = 'mermaid-action-btn btn-copy';
      copyBtn.title = '复制 Mermaid 源码';
      copyBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span class="btn-text">复制</span>
      `;

      actions.appendChild(toggleBtn);
      actions.appendChild(zoomBtn);
      actions.appendChild(copyBtn);
      toolbar.appendChild(actions);

      // 图表容器
      const previewContainer = document.createElement('div');
      previewContainer.className = 'mermaid-preview';
      previewContainer.innerHTML = svg;

      // 源码容器
      const rawContainer = document.createElement('div');
      rawContainer.className = 'mermaid-raw';
      rawContainer.style.display = 'none';

      // 组装 DOM
      const parent = pre.parentNode;
      if (parent) {
        parent.insertBefore(wrapper, pre);
        wrapper.appendChild(toolbar);
        wrapper.appendChild(previewContainer);
        rawContainer.appendChild(pre);
        wrapper.appendChild(rawContainer);
      }

      // 绑定 Mermaid 交互函数（如果有超链接或点击回调）
      if (bindFunctions) {
        bindFunctions(previewContainer);
      }

      // 事件：切换源码 / 图表
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isPreview = rawContainer.style.display === 'none';
        if (isPreview) {
          rawContainer.style.display = 'block';
          previewContainer.style.display = 'none';
          zoomBtn.style.display = 'none';
          toggleBtn.querySelector('.btn-text')!.textContent = '图表';
          toggleBtn.classList.add('active');
        } else {
          rawContainer.style.display = 'none';
          previewContainer.style.display = 'flex';
          zoomBtn.style.display = 'inline-flex';
          toggleBtn.querySelector('.btn-text')!.textContent = '源码';
          toggleBtn.classList.remove('active');
        }
      });

      // 事件：复制源码
      copyBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(rawCode).then(() => {
            copyBtn.classList.add('copied');
            copyBtn.innerHTML = `
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span class="btn-text">已复制</span>
            `;
            setTimeout(() => {
              copyBtn.classList.remove('copied');
              copyBtn.innerHTML = `
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
                <span class="btn-text">复制</span>
              `;
            }, 2000);
          });
        }
      });

      // 事件：放大模态弹窗
      zoomBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openMermaidModal(svg);
      });
    } catch (renderError) {
      console.error('[Mermaid] 渲染图表语法错误:', renderError);
      // 语法错误时降级：保留代码块并显示轻量告警信息
      const notice = document.createElement('div');
      notice.className = 'mermaid-error-notice';
      notice.innerHTML = `
        <span class="mermaid-error-icon">⚠️</span>
        <span class="mermaid-error-text">Mermaid 图表解析错误，已保留源码显示</span>
      `;
      pre.parentElement?.insertBefore(notice, pre);
    }
  }
}

// 模态弹窗放大查看 Mermaid 图表
function openMermaidModal(svgContent: string) {
  const existingModal = document.getElementById('mermaid-zoom-modal');
  if (existingModal) {
    existingModal.remove();
  }

  const modal = document.createElement('div');
  modal.id = 'mermaid-zoom-modal';
  modal.className = 'mermaid-modal-overlay';
  modal.innerHTML = `
    <div class="mermaid-modal-dialog">
      <div class="mermaid-modal-header">
        <span class="mermaid-modal-title">图表全屏查看</span>
        <button class="mermaid-modal-close" type="button" aria-label="关闭">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <div class="mermaid-modal-body">
        <div class="mermaid-modal-svg-wrapper">
          ${svgContent}
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  // 阻止背景滚动
  const originalOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.classList.add('closing');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = originalOverflow;
    }, 200);
    document.removeEventListener('keydown', onKeyDown);
  };

  const closeBtn = modal.querySelector('.mermaid-modal-close');
  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', onKeyDown);

  // 动画渐入
  requestAnimationFrame(() => {
    modal.classList.add('visible');
  });
}
