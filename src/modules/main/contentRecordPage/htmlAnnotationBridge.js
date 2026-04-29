/**
 * IIFE string injected as a script in the same-origin HTML preview iframe.
 * Enables: (1) block / region click, (2) text selection -> immediate highlight (no confirm UI),
 * and (3) apply / clear marks for persisted rows.
 * No external dependencies.
 */
export function getHtmlAnnotationBridgeIife() {
    return `(() => {
  var MODE = 'none';
  var lastAutoHighlightKey = '';
  var lastAutoHighlightAt = 0;

  var H_MARK = 'rcm-html-mark';
  var C_BLOCK = 'rcm-html-block-outlined';
  var C_HOVER = 'rcm-html-block-hover';
  var hoverBlockEl = null;
  var BLOCK_TAGS = { DIV: 1, SECTION: 1, ARTICLE: 1, MAIN: 1, P: 1, ASIDE: 1, BLOCKQUOTE: 1, LI: 1, TD: 1, TH: 1, HEADER: 1, FOOTER: 1, NAV: 1, FIGURE: 1, H1: 1, H2: 1, H3: 1, H4: 1, H5: 1, H6: 1 };

  function clearBlockHover() {
    if (hoverBlockEl) {
      hoverBlockEl.classList.remove(C_HOVER);
      hoverBlockEl = null;
    }
  }

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

  function clearAllRcm() {
    clearBlockHover();
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

  function isTextNodeVisibleForSearch(node) {
    if (!node || !node.parentNode) return false;
    if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') return false;
    if (node.parentNode.closest && node.parentNode.closest('mark.' + H_MARK)) return false;
    return true;
  }

  function collectTextNodesForSearch(body) {
    if (!body) return [];
    var w = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
        if (!isTextNodeVisibleForSearch(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var out = [];
    for (var n; (n = w.nextNode());) {
      out.push(n);
    }
    return out;
  }

  function normWs(s) {
    return String(s).replace(/\\s+/g, ' ').trim();
  }

  function wrapTextAcrossNodes(annId, text) {
    var s = normWs(text);
    if (!s.length) return;
    var nodes = collectTextNodesForSearch(document.body);
    var maxSpan = 36;
    for (var a = 0; a < nodes.length; a++) {
      for (var b = a; b < Math.min(nodes.length, a + maxSpan); b++) {
        var r = document.createRange();
        try {
          r.setStart(nodes[a], 0);
          r.setEnd(nodes[b], (nodes[b].nodeValue || '').length);
        } catch (e1) {
          continue;
        }
        if (normWs(r.toString() || '') !== s) {
          continue;
        }
        var mark = document.createElement('mark');
        mark.className = H_MARK;
        mark.setAttribute('data-rcm-ann', String(annId));
        try {
          r.surroundContents(mark);
        } catch (e2) {
          continue;
        }
        return;
      }
    }
  }

  function wrapFirstText(annId, text) {
    if (!text || !text.length) return;
    var body = document.body;
    if (!body) return;
    var search0 = String(text);
    if (!search0.trim()) return;
    var w = document.createTreeWalker(body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        if (!node || !node.nodeValue) return NodeFilter.FILTER_REJECT;
        if (!isTextNodeVisibleForSearch(node)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var attempts = [search0, normWs(search0), search0.replace(/\\u00a0/g, ' '), search0.split(/\\s+/).join(' ')];
    var node;
    while ((node = w.nextNode())) {
      var val = node.nodeValue;
      if (!val) continue;
      for (var ai = 0; ai < attempts.length; ai++) {
        var search = attempts[ai];
        if (!search) continue;
        var idx = val.indexOf(search);
        if (idx < 0) continue;
        var r = document.createRange();
        r.setStart(node, idx);
        r.setEnd(node, idx + search.length);
        var mark = document.createElement('mark');
        mark.className = H_MARK;
        mark.setAttribute('data-rcm-ann', String(annId));
        try {
          r.surroundContents(mark);
          return;
        } catch (e) {}
      }
    }
    wrapTextAcrossNodes(annId, text);
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
        el.classList.remove(C_HOVER);
        el.setAttribute('data-rcm-ann', String(annId));
        el.classList.add(C_BLOCK);
        return;
      }
    }
    for (var j = 0; j < list.length; j++) {
      var e2 = list[j];
      var t2 = (e2.textContent || '').replace(/\\s+/g, ' ').trim();
      if (t2.indexOf(head) >= 0 && t2.length > 0) {
        e2.classList.remove(C_HOVER);
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

  function onDocMouseMoveBlock(ev) {
    if (MODE !== 'block') {
      return;
    }
    var t = findBlockEl(ev.target);
    if (!t) {
      clearBlockHover();
      return;
    }
    if (t.closest && t.closest('mark.' + H_MARK)) {
      clearBlockHover();
      return;
    }
    if (t === hoverBlockEl) {
      return;
    }
    clearBlockHover();
    hoverBlockEl = t;
    hoverBlockEl.classList.add(C_HOVER);
  }

  function onDocClickBlock(ev) {
    if (MODE !== 'block') return;
    clearBlockHover();
    var t = findBlockEl(ev.target);
    if (!t) return;
    if (t.closest && t.closest('mark.' + H_MARK)) return;
    var blockAnn = t.getAttribute('data-rcm-ann');
    if (blockAnn) {
      ev.preventDefault();
      ev.stopPropagation();
      try {
        window.parent.postMessage(
          { type: 'rcm-html-ann-activate', id: String(blockAnn) },
          '*'
        );
      } catch (e) {}
      return;
    }
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

  function onDocClickJumpToAnnotation(ev) {
    var el = ev.target && ev.target.closest && ev.target.closest('[data-rcm-ann]');
    if (el) {
      var jid = el.getAttribute('data-rcm-ann');
      if (jid) {
        ev.preventDefault();
        ev.stopPropagation();
        try {
          window.parent.postMessage(
            { type: 'rcm-html-ann-activate', id: jid },
            '*'
          );
        } catch (e) {}
      }
      return;
    }
  }

  function onDocMouseUpHighlight() {
    if (MODE !== 'highlight') return;
    setTimeout(function () {
      if (MODE !== 'highlight') return;
      var sel = window.getSelection();
      if (!sel || !sel.rangeCount) return;
      var r0 = sel.getRangeAt(0);
      if (!r0 || r0.collapsed) return;
      if (r0.startContainer) {
        var p = r0.startContainer.nodeType === 3 ? r0.startContainer.parentNode : r0.startContainer;
        if (p && p.closest && p.closest('mark.' + H_MARK)) return;
      }
      var txt = (r0.toString() || '').trim();
      if (txt.length < 1) return;
      var now = Date.now();
      var key = txt.length > 200 ? txt.substring(0, 200) : txt;
      if (key === lastAutoHighlightKey && now - lastAutoHighlightAt < 500) {
        return;
      }
      lastAutoHighlightKey = key;
      lastAutoHighlightAt = now;
      var rSave = r0.cloneRange();
      var pendingId = 'p' + now + (Math.random() + '').slice(2, 7);
      var mark = document.createElement('mark');
      mark.className = H_MARK;
      mark.setAttribute('data-rcm-ann', pendingId);
      var wrapped = false;
      try {
        rSave.surroundContents(mark);
        wrapped = true;
      } catch (e) {
        try {
          var r2 = r0.cloneRange();
          var extracted = r2.extractContents();
          mark.appendChild(extracted);
          r2.insertNode(mark);
          wrapped = true;
        } catch (e2) {
          wrapped = false;
        }
      }
      var payload = {
        type: 'rcm-html-annotation',
        kind: 'highlight',
        text: txt,
        pendingId: wrapped ? pendingId : null,
        snippet: txt.length > 200 ? txt.substring(0, 200) : txt
      };
      try {
        window.parent.postMessage(payload, '*');
      } catch (e2) {}
    }, 0);
  }

  window.addEventListener('message', function (e) {
    if (e.source !== window.parent) return;
    var d = e.data;
    if (!d) return;
    if (d.type === 'rcm-html-set-mode') {
      MODE = d.mode || 'none';
      if (MODE !== 'block') {
        clearBlockHover();
      }
    }
    if (d.type === 'rcm-html-restore' && d.annotations) {
      clearAllRcm();
      for (var i = 0; i < d.annotations.length; i++) applyOne(d.annotations[i]);
    }
    if (d.type === 'rcm-html-resolve-pending' && d.pendingId && d.id) {
      var pending = String(d.pendingId);
      var newId = String(d.id);
      var hit = document.querySelector('[data-rcm-ann="' + pending + '"]');
      if (hit) {
        hit.setAttribute('data-rcm-ann', newId);
      }
    }
    if (d.type === 'rcm-html-undo-pending' && d.pendingId) {
      var rem = String(d.pendingId);
      var mpend = document.querySelector('mark.' + H_MARK + '[data-rcm-ann="' + rem + '"]');
      if (mpend && mpend.parentNode) {
        var par2 = mpend.parentNode;
        while (mpend.firstChild) par2.insertBefore(mpend.firstChild, mpend);
        par2.removeChild(mpend);
      }
    }
    if (d.type === 'rcm-html-scroll' && d.id) {
      var el = document.querySelector('[data-rcm-ann="' + String(d.id) + '"]');
      if (el && el.scrollIntoView) el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, false);

  document.addEventListener('click', onDocClickJumpToAnnotation, true);
  document.addEventListener('click', onDocClickBlock, true);
  document.addEventListener('mousemove', onDocMouseMoveBlock, true);
  document.addEventListener('mouseup', onDocMouseUpHighlight, false);
})();`;
}
