/* Malý runtime pro komponenty z návrhu (šablona + logika).
   Šablona používá {{výraz}}, <sc-if value>, <sc-for list as>. Překreslení přes morphdom,
   takže prvky zůstávají a CSS přechody / animace fungují. */
(function () {
  'use strict';

  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) {
      const p = typeof patch === 'function' ? patch(this.state) : patch;
      this.state = Object.assign({}, this.state, p);
      if (this.__app) this.__app.schedule();
    }
  }
  window.DCLogic = DCLogic;

  const BOOL_ATTRS = new Set(['disabled', 'checked', 'hidden', 'selected', 'readonly', 'required', 'novalidate', 'open']);
  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
  const EXPR = /\{\{([^}]*)\}\}/g;

  function lookup(scope, expr) {
    expr = expr.trim();
    if (expr === 'true') return true;
    if (expr === 'false') return false;
    if (expr === 'null' || expr === 'undefined' || expr === '') return undefined;
    if (/^-?\d+(\.\d+)?$/.test(expr)) return Number(expr);
    if (/^'.*'$|^".*"$/.test(expr)) return expr.slice(1, -1);
    let v = scope;
    for (const k of expr.split('.')) { if (v == null) return undefined; v = v[k]; }
    return v;
  }
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const interp = (str, scope) => str.replace(EXPR, (m, e) => { const v = lookup(scope, e); return v == null || v === false ? '' : String(v); });
  const single = (str) => { const m = /^\s*\{\{([^}]*)\}\}\s*$/.exec(str || ''); return m ? m[1] : null; };

  function renderChildren(node, scope, H) {
    let out = '';
    for (const c of node.childNodes) out += renderNode(c, scope, H);
    return out;
  }

  function renderNode(node, scope, H) {
    if (node.nodeType === 3) return esc(interp(node.nodeValue, scope));
    if (node.nodeType !== 1) return '';
    const tag = node.localName;
    if (tag === 'sc-if') {
      const e = single(node.getAttribute('value'));
      return (e ? lookup(scope, e) : false) ? renderChildren(node, scope, H) : '';
    }
    if (tag === 'sc-for') {
      const list = lookup(scope, single(node.getAttribute('list')) || '') || [];
      const as = node.getAttribute('as') || 'item';
      let out = '';
      list.forEach((it, i) => { const s = Object.create(scope); s[as] = it; s.$index = i; out += renderChildren(node, s, H); });
      return out;
    }
    let attrs = '';
    for (const a of node.attributes) {
      const name = a.name;
      if (name.startsWith('hint-')) continue;
      const e = single(a.value);
      if (e !== null) {
        const v = lookup(scope, e);
        if (/^on[a-z]+$/.test(name)) {
          if (typeof v === 'function') attrs += ' data-dc-' + name.slice(2) + '="' + (H.push(v) - 1) + '"';
          continue;
        }
        if (v == null || v === false) continue;
        if (v === true) { attrs += BOOL_ATTRS.has(name) ? ' ' + name : ' ' + name + '="true"'; continue; }
        attrs += ' ' + name + '="' + esc(v) + '"';
      } else {
        attrs += ' ' + name + '="' + esc(interp(a.value, scope)) + '"';
      }
    }
    if (VOID.has(tag)) return '<' + tag + attrs + '>';
    return '<' + tag + attrs + '>' + renderChildren(node, scope, H) + '</' + tag + '>';
  }

  const EVENTS = ['click', 'input', 'change', 'submit'];

  function mount(rootEl, def, props, hooks) {
    const tpl = document.createElement('template');
    tpl.innerHTML = def.template;
    const comp = new def.Component(Object.assign({}, def.defaults || {}, props || {}));
    let handlers = [];
    let queued = false;
    const app = {
      comp,
      render() {
        queued = false;
        const H = [];
        const vals = comp.renderVals();
        const html = renderChildren(tpl.content, vals, H);
        handlers = H;
        const next = document.createElement(rootEl.tagName);
        next.innerHTML = html;
        window.morphdom(rootEl, next, {
          childrenOnly: true,
          onBeforeElUpdated(from, to) {
            if ((from.tagName === 'INPUT' && from.type !== 'checkbox' && from.type !== 'radio') || from.tagName === 'TEXTAREA') to.value = from.value;
            return !from.isEqualNode(to);
          }
        });
        if (hooks && hooks.afterRender) hooks.afterRender(comp);
      },
      schedule() { if (!queued) { queued = true; requestAnimationFrame(() => app.render()); } },
      setProps(p) { comp.props = Object.assign({}, comp.props, p); app.schedule(); }
    };
    comp.__app = app;
    EVENTS.forEach((type) => {
      rootEl.addEventListener(type, (ev) => {
        const el = ev.target.closest('[data-dc-' + type + ']');
        if (!el || !rootEl.contains(el)) return;
        const fn = handlers[Number(el.getAttribute('data-dc-' + type))];
        if (typeof fn === 'function') fn(ev);
      });
    });
    app.render();
    return app;
  }

  window.DC = { mount };
})();
