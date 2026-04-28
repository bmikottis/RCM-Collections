/**
 * IIFE string injected as a script in the same-origin HTML preview iframe.
 * Enables: (1) block / region picking, (2) text selection + in-frame "Add highlight",
 * and (3) apply / clear highlights + outlines for persisted annotation rows.
 * No external dependencies.
 */
export function getHtmlAnnotationBridgeIife() {
    return `(() => {
  var MODE = 'none';
  var floatEl = null;
  var lastRange = null;

  var H_MARK = 'rcm-html-mark';
  var C_BLOCK = 'rcm-html-block-outlined';
  var BLOCK_TAGS = { DIV: 1, SECTION: 1, ARTICLE: 1, MAIN: 1, P: 1, ASIDE: 1, BLOCKQUOTE: 1, LI: 1, TD: 1, TH: 1, HEADER: 1, FOOTER: 1, NAV: 1, FIGURE: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1 };

  function findBlockEl(target) {
    if (!target) return null;
    var n = target.nodeType === 3 ? target.parentNode : target;
    if (!n || n.nodeType !== 1) return null;
    while (n && n !== document.body) {
      if (n.nodeType === 1) {
        var t = n.tagName;
        if (BLOCK_TAGS[t]) return n;
      }
      n = n.parentNode;
    }
    return null;
  }

  function clearFloat() {
    if (floatEl && floatEl.parentNode) floatEl.parentNode.removeChild(floatEl);
    floatEl = null;
  }

  function showFloat(rect) {
    clearFloat();
    if (!rect || (rect.width === 0 && rect.height === 0)) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Add highlight';
    btn.setAttribute('aria-label', 'Add highlight to selected text');
    btn.className = 'rcm-html-float-btn';
    var left = rect.left;
    var top = rect.top - 40;
    if (top < 4) {
      top = rect.bottom + 4;
    }
    btn.style.position = 'fixed';
    btn.style.left = left + 'px';
    btn.style.top = top + 'px';
    btn.style.zIndex = '100000';
    btn.addEventListener('click', onFloatAdd);
    document.body.appendChild(btn);
    floatEl = btn;
  }

  function onFloatAdd(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!lastRange) {
      clearFloat();
      return;
    }
    var t = lastRange.toString() || '';
    if (!t || !t.trim().length) {
      clearFloat();
      return;
    }
    try {
      window.parent.postMessage(
        { type: 'rcm-html-annotation', kind: 'highlight', text: t, snippet: t.slice(0, 200) },
        '*'
      );
    } catch (e) {}
    clearFloat();
  }

  function clearAllRcm() {
    var marks = document.querySelectorAll('mark.' + H_MARK);
    for (var i = 0; i < marks.length; i++) {
      var el = marks[i];
      var p = el.parentNode;
      if (!p) continue;
      while (el.firstChild) p.insertBefore(el.firstChild, el);
      p.removeChild(el);
    }
    var outlined = document.querySelectorAll('.' + C_BLOCK + '[data-rcm-ann]');
    for (var j = 0; j < outlined.length; j++) {
      var b = outlined[j];
      b.classList.remove(C_BLOCK);
      b.removeAttribute('data-rcm-ann');
    }
  }

  function wrapFirstText(annId, text) {
    if (!text || !text.length) return;
    var body = document.body;
    if (!body) return;
    var search = String(text);
    if (!search.trim()) return;
    var w = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
        if (!node.parentNode) return NodeFilter.FILTER_REJECT;
        var t = (node.parentNode).tagName;
        if (t === 'SCRIPT' || t === 'STYLE') return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var node;
    while ((node = w.nextNode())) {
      var val = node.nodeValue;
      if (!val) continue;
      var idx = val.indexOf(search);
      if (idx < 0) continue;
      var r = document.createRange();
      r.setStart(node, idx);
      r.setEnd(node, idx + search.length);
      var mark = document.createElement('mark');
      mark.className = H_MARK;
      mark.setAttribute('data-rcm-ann', String(annId));
      r.surroundContents(mark);
      return;
    }
  }

  function outlineBlock(annId, tagName, textPrefix) {
    if (!annId) return;
    var tag = (tagName || 'div').toUpperCase();
    var pre = (textPrefix || '').replace(/\\s+/g, ' ').trim();
    if (!pre) return;
    var head = pre.length > 80 ? pre.substring(0, 80) : pre;
    var list = document.body.getElementsByTagName(tag);
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      if (el.closest('mark.' + H_MARK)) continue;
      var t = (el.textContent || '').replace(/\\s+/g, ' ').trim();
      if (t.indexOf(pre.substring(0, Math.min(40, pre.length))) === 0) {
        el.setAttribute('data-rcm-ann', String(annId));
        el.classList.add(C_BLOCK);
        return;
      }
    }
    for (var j = 0; j < list.length; j++) {
      var e2 = list[j];
      var t2 = (e2.textContent || '').replace(/\\s+/g, ' ').trim();
      if (t2.indexOf(head) >= 0 && t2.length > 0) {
        e2.setAttribute('data-rcm-ann', String(annId));
        e2.classList.add(C_BLOCK);
        return;
      }
    }
  }

  function applyOne(a) {
    if (!a || !a.id) return;
    if (a.kind === 'highlight' && a.text) {
      wrapFirstText(a.id, a.text);
    } else if (a.kind === 'block') {
      outlineBlock(a.id, a.blockTag, a.blockTextPrefix);
    }
  }

  function onDocClickBlock(ev) {
    if (MODE !== 'block') return;
    var t = findBlockEl(ev.target);
    if (!t) return;
    if (t.tagName === 'BUTTON' && t.classList && t.className.indexOf('rcm-html-float') >= 0) return;
    if (t.closest && t.closest('.' + H_MARK)) return;
    if (t.classList && t.classList.contains('rcm-html-float-btn')) return;
    ev.preventDefault();
    ev.stopPropagation();
    var pre = (t.textContent || '').replace(/\\s+/g, ' ').trim();
    window.parent.postMessage(
      {
        type: 'rcm-html-annotation',
        kind: 'block',
        tagName: t.tagName,
        textPrefix: pre,
        snippet: pre ? pre.substring(0, 200) : ''
      },
      '*'
    );
  }

  function onDocMouseUpHighlight() {
    if (MODE !== 'highlight') return;
    if (floatEl) return;
    setTimeout(function () {
      if (MODE !== 'highlight') return;
      var sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      var r0 = sel.getRangeAt(0);
      if (!r0) return;
      var txt = r0.toString() || '';
      if (txt.length < 1) return;
      if (!txt.trim().length) return;
      if (r0.startContainer && r0.startContainer.nodeType === 1) {
        var tn = (r0.startContainer).tagName;
        if (tn === 'BUTTON' || (r0.startContainer).closest && (r0.startContainer).closest('.rcm-html-float-btn')) return;
      }
      lastRange = r0.cloneRange();
      var rect = r0.getBoundingClientRect();
      showFloat(rect);
    }, 0);
  }

  window.addEventListener('message', function (e) {
    if (e.source !== window.parent) return;
    var d = e.data;
    if (!d) return;
    if (d.type === 'rcm-html-set-mode') {
      MODE = d.mode || 'none';
      clearFloat();
    }
    if (d.type === 'rcm-html-restore' && d.annotations) {
      clearAllRcm();
      for (var i = 0; i < d.annotations.length; i++) applyOne(d.annotations[i]);
    }
    if (d.type === 'rcm-html-scroll' && d.id) {
      var el = document.querySelector('[data-rcm-ann="' + String(d.id) + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, false);

  document.addEventListener('click', onDocClickBlock, true);
  document.addEventListener('mouseup', onDocMouseUpHighlight, false);
  document.addEventListener('scroll', clearFloat, true);
})();`;
}
