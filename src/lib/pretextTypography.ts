/**
 * Focused Pretext Typography & Interactive Engine
 * 
 * Strategically applies @chenglou/pretext to high-value visual & interactive scenes:
 * 1. Homepage Hero Slogan: Pixel-perfect typography with delicate cursor parallax floating.
 * 2. Interactive Showcase Posts: Canvas measurement & Gravity Orb attraction.
 * 3. 404 Page Easter Egg: Kinetic typography with elastic repulsive physics.
 * 4. Opt-in elements: Any element with [data-pretext].
 * 
 * Standard blog posts and long-form reading remain on pure zero-overhead native CSS.
 */

import { prepareWithSegments, layoutWithLines, type PreparedTextWithSegments } from '@chenglou/pretext';

// Cache for prepared text structures
const preparedCache = new WeakMap<HTMLElement, {
  text: string;
  font: string;
  prepared: PreparedTextWithSegments;
  originalHTML: string;
  lastWidth: number;
}>();

let globalResizeObserver: ResizeObserver | null = null;
let activeRafId = 0;
let activeCleanups: Array<() => void> = [];

/**
 * Native Range API slice to preserve nested DOM nodes
 */
function sliceDOMByRange(container: HTMLElement, startOffset: number, endOffset: number): DocumentFragment {
  const range = document.createRange();
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null);
  let currentOffset = 0;
  let startNode: Node | null = null;
  let startNodeOffset = 0;
  let endNode: Node | null = null;
  let endNodeOffset = 0;

  let node = walker.nextNode();
  while (node) {
    const textLen = node.textContent?.length || 0;
    const nextOffset = currentOffset + textLen;

    if (!startNode && startOffset >= currentOffset && startOffset <= nextOffset) {
      startNode = node;
      startNodeOffset = startOffset - currentOffset;
    }
    if (!endNode && endOffset >= currentOffset && endOffset <= nextOffset) {
      endNode = node;
      endNodeOffset = endOffset - currentOffset;
      break;
    }

    currentOffset = nextOffset;
    node = walker.nextNode();
  }

  if (startNode && endNode) {
    try {
      range.setStart(startNode, startNodeOffset);
      range.setEnd(endNode, endNodeOffset);
      return range.cloneContents();
    } catch {
      // Fallback
    }
  }

  return document.createDocumentFragment();
}

/**
 * Typesets a single DOM element using Pretext
 */
export function typesetWithPretext(element: HTMLElement, force = false): boolean {
  if (!element || !element.isConnected) return false;

  const currentWidth = Math.floor(element.clientWidth);
  if (currentWidth <= 0) return false;

  let cached = preparedCache.get(element);
  let originalHTML = '';

  if (!cached) {
    originalHTML = element.getAttribute('data-pretext-source') || element.innerHTML;
    element.setAttribute('data-pretext-source', originalHTML);
  } else {
    originalHTML = cached.originalHTML;
    if (!force && Math.abs(cached.lastWidth - currentWidth) < 2) {
      return true;
    }
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = originalHTML;
  const rawText = tempDiv.textContent || '';
  const trimmed = rawText.trim();
  if (!trimmed) return false;

  const styles = window.getComputedStyle(element);
  const fontSize = Number.parseFloat(styles.fontSize) || 16;
  const lineHeightVal = Number.parseFloat(styles.lineHeight);
  const lineHeight = Number.isNaN(lineHeightVal) ? fontSize * 1.6 : lineHeightVal;
  const fontWeight = styles.fontWeight || '400';
  const fontFamily = styles.fontFamily || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  try {
    let prepared = cached?.font === font && cached.text === rawText ? cached.prepared : null;
    if (!prepared) {
      prepared = prepareWithSegments(rawText, font);
    }

    const { lines } = layoutWithLines(prepared, currentWidth, lineHeight);
    if (!lines || lines.length === 0) return false;

    preparedCache.set(element, {
      text: rawText,
      font,
      prepared,
      originalHTML,
      lastWidth: currentWidth,
    });

    const isPureText = tempDiv.children.length === 0;

    element.innerHTML = '';
    let searchFrom = 0;

    lines.forEach((line, index) => {
      const span = document.createElement('span');
      span.className = 'pretext-line';
      span.dataset.lineIndex = String(index);
      span.style.display = 'block';
      span.style.lineHeight = `${lineHeight}px`;

      if (isPureText) {
        span.textContent = line.text;
      } else {
        const lineContent = line.text;
        let startIndex = rawText.indexOf(lineContent, searchFrom);
        if (startIndex === -1) {
          const trimmedLine = lineContent.trim();
          startIndex = trimmedLine ? rawText.indexOf(trimmedLine, searchFrom) : searchFrom;
        }

        if (startIndex !== -1) {
          const endIndex = startIndex + lineContent.length;
          searchFrom = endIndex;
          const fragment = sliceDOMByRange(tempDiv, startIndex, endIndex);
          if (fragment.hasChildNodes()) {
            span.appendChild(fragment);
          } else {
            span.textContent = lineContent;
          }
        } else {
          span.textContent = lineContent;
        }
      }

      element.appendChild(span);
    });

    element.dataset.pretextRendered = 'true';

    if (globalResizeObserver) {
      globalResizeObserver.observe(element);
    }

    return true;
  } catch (err) {
    console.warn('Pretext layout error:', err);
    return false;
  }
}

/**
 * 1. Homepage Hero Slogan: Pretext Typography + Subtle Interactive Parallax
 */
function setupHeroSloganInteraction(root: ParentNode = document): void {
  const heroIntro = root.querySelector<HTMLElement>('.hero-intro');
  if (!heroIntro) return;

  typesetWithPretext(heroIntro, true);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines = Array.from(heroIntro.querySelectorAll<HTMLElement>('.pretext-line'));
  if (!lines.length) return;

  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;

  const heroSection = heroIntro.closest('.hero-section') || heroIntro;

  const onMouseMove = (e: MouseEvent) => {
    const rect = heroSection.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX = (e.clientX - centerX) / (rect.width / 2);
    mouseY = (e.clientY - centerY) / (rect.height / 2);
  };

  const onMouseLeave = () => {
    mouseX = 0;
    mouseY = 0;
  };

  const update = () => {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    lines.forEach((line, i) => {
      const depth = (i + 1) * 3.5;
      const tx = (currentX * depth).toFixed(2);
      const ty = (currentY * (depth * 0.6)).toFixed(2);
      line.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
    });

    activeRafId = requestAnimationFrame(update);
  };

  activeRafId = requestAnimationFrame(update);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  document.addEventListener('mouseleave', onMouseLeave, { passive: true });

  activeCleanups.push(() => {
    window.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseleave', onMouseLeave);
  });
}

/**
 * 2. Interactive Showcase Posts: Pretext Typography + Gravity Orb Attraction
 */
function setupGravityShowcase(root: ParentNode = document): void {
  const container = root.querySelector<HTMLElement>('[data-pretext-attract="true"]');
  if (!container) return;

  const paragraphs = Array.from(container.querySelectorAll<HTMLElement>('article p:not(pre p):not(blockquote p):not(.ai-notice p)'));
  paragraphs.forEach((p) => typesetWithPretext(p, true));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines = Array.from(container.querySelectorAll<HTMLElement>('.pretext-line'));
  if (!lines.length) return;

  document.querySelectorAll('.gravity-orb').forEach((el) => el.remove());

  const orbEl = document.createElement('div');
  orbEl.className = 'gravity-orb';
  document.body.appendChild(orbEl);

  const orb = {
    x: window.innerWidth * 0.5,
    y: window.innerHeight * 0.45,
    tx: window.innerWidth * 0.5,
    ty: window.innerHeight * 0.45,
  };

  const models = lines.map((span) => ({
    span,
    offsetX: 0,
    offsetY: 0,
  }));

  const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

  const tick = () => {
    orb.x += (orb.tx - orb.x) * 0.18;
    orb.y += (orb.ty - orb.y) * 0.18;
    orbEl.style.left = `${orb.x}px`;
    orbEl.style.top = `${orb.y}px`;

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      const rect = model.span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = orb.x - cx;
      const dy = orb.y - cy;
      const distance = Math.hypot(dx, dy);
      const influence = Math.max(0, 1 - distance / 280);

      const targetX = clamp(dx * 0.16 * influence, -24, 24);
      const targetY = clamp(dy * 0.12 * influence, -14, 14);

      model.offsetX += (targetX - model.offsetX) * 0.2;
      model.offsetY += (targetY - model.offsetY) * 0.2;

      model.span.style.transform = `translate3d(${model.offsetX.toFixed(1)}px, ${model.offsetY.toFixed(1)}px, 0)`;
    }

    activeRafId = requestAnimationFrame(tick);
  };

  const onMove = (e: MouseEvent) => {
    orb.tx = e.clientX;
    orb.ty = e.clientY;
  };

  const onLeave = () => {
    orb.tx = window.innerWidth * 0.5;
    orb.ty = window.innerHeight * 0.45;
  };

  activeRafId = requestAnimationFrame(tick);
  window.addEventListener('mousemove', onMove, { passive: true });
  window.addEventListener('mouseleave', onLeave, { passive: true });
  window.addEventListener('blur', onLeave, { passive: true });

  activeCleanups.push(() => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseleave', onLeave);
    window.removeEventListener('blur', onLeave);
    orbEl.remove();
  });
}

/**
 * 3. 404 Page Easter Egg: Kinetic Elastic Repulsion & Spring Back
 */
function setup404ElasticInteraction(root: ParentNode = document): void {
  const card = root.querySelector<HTMLElement>('.not-found-card');
  if (!card) return;

  const targetElements = Array.from(card.querySelectorAll<HTMLElement>('.error-code, .error-title, .error-desc'));
  targetElements.forEach((el) => typesetWithPretext(el, true));

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const lines = Array.from(card.querySelectorAll<HTMLElement>('.pretext-line'));
  if (!lines.length) return;

  const physicsNodes = lines.map((span) => ({
    span,
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0,
  }));

  let mousePos = { x: -9999, y: -9999 };

  const onMouseMove = (e: MouseEvent) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
  };

  const onMouseLeave = () => {
    mousePos.x = -9999;
    mousePos.y = -9999;
  };

  const springK = 0.12; // Spring tension
  const damping = 0.76; // Spring damping

  const tickPhysics = () => {
    for (let i = 0; i < physicsNodes.length; i++) {
      const node = physicsNodes[i];
      const rect = node.span.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = cx - mousePos.x;
      const dy = cy - mousePos.y;
      const dist = Math.hypot(dx, dy);
      const repulsionRadius = 130;

      if (dist < repulsionRadius && dist > 0.1) {
        const force = (1 - dist / repulsionRadius) * 28;
        node.targetX = (dx / dist) * force;
        node.targetY = (dy / dist) * force;
      } else {
        node.targetX = 0;
        node.targetY = 0;
      }

      // Spring physics
      const ax = (node.targetX - node.x) * springK;
      const ay = (node.targetY - node.y) * springK;

      node.vx = (node.vx + ax) * damping;
      node.vy = (node.vy + ay) * damping;

      node.x += node.vx;
      node.y += node.vy;

      if (Math.abs(node.x) > 0.05 || Math.abs(node.y) > 0.05) {
        node.span.style.transform = `translate3d(${node.x.toFixed(1)}px, ${node.y.toFixed(1)}px, 0)`;
      } else {
        node.span.style.transform = 'translate3d(0, 0, 0)';
      }
    }

    activeRafId = requestAnimationFrame(tickPhysics);
  };

  activeRafId = requestAnimationFrame(tickPhysics);
  window.addEventListener('mousemove', onMouseMove, { passive: true });
  card.addEventListener('mouseleave', onMouseLeave, { passive: true });

  activeCleanups.push(() => {
    window.removeEventListener('mousemove', onMouseMove);
    card.removeEventListener('mouseleave', onMouseLeave);
  });
}

/**
 * 4. Generic Opt-in elements: [data-pretext]
 */
function setupOptInElements(root: ParentNode = document): void {
  const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-pretext]'));
  elements.forEach((el) => typesetWithPretext(el, true));
}

/**
 * Main entrance to initialize focused Pretext typography & interactions
 */
export function applyPretextTypography(root: ParentNode = document): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  cleanupPretextTypography();

  if (!globalResizeObserver && typeof ResizeObserver !== 'undefined') {
    let resizeTimer: number | null = null;
    globalResizeObserver = new ResizeObserver((entries) => {
      if (resizeTimer) cancelAnimationFrame(resizeTimer);
      resizeTimer = requestAnimationFrame(() => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (el && el.isConnected) {
            typesetWithPretext(el, false);
          }
        });
      });
    });
  }

  // 1. Homepage Hero Slogan
  setupHeroSloganInteraction(root);

  // 2. Interactive Showcase Posts (Gravity Orb)
  setupGravityShowcase(root);

  // 3. 404 Page Interactive Easter Egg
  setup404ElasticInteraction(root);

  // 4. Opt-in elements
  setupOptInElements(root);
}

/**
 * Cleanup function for view transitions
 */
export function cleanupPretextTypography(): void {
  if (activeRafId) {
    cancelAnimationFrame(activeRafId);
    activeRafId = 0;
  }
  activeCleanups.forEach((fn) => fn());
  activeCleanups = [];
  if (globalResizeObserver) {
    globalResizeObserver.disconnect();
  }
}
