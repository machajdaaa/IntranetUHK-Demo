/* Společné chování dema: uložení režimu, fakulty a menu, odkazy mimo demo, přepnutí stránek. */
(function () {
  'use strict';
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* bez úložiště demo funguje, jen si nic nepamatuje */ } }
  };
  function applyTheme(t) { document.documentElement.classList.toggle('dark', t === 'dark'); }

  function toast(text) {
    let el = document.querySelector('.demo-toast');
    if (!el) { el = document.createElement('div'); el.className = 'demo-toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 2400);
  }

  document.addEventListener('click', (ev) => {
    if (ev.defaultPrevented) return;
    const off = ev.target.closest('[data-demo-off]');
    if (off) { ev.preventDefault(); toast('Tato část není součástí dema.'); return; }
    const go = ev.target.closest('[data-href]');
    if (go) { ev.preventDefault(); location.href = go.getAttribute('data-href'); return; }
    const a = ev.target.closest('a[href="#"]');
    if (a && !a.hasAttribute('data-dc-click')) ev.preventDefault();
  });

  window.UHKDemo = {
    store, applyTheme, toast,
    mountMain(page) {
      const theme = store.get('uhk-theme', 'light');
      applyTheme(theme);
      const first = (function () { try { return !sessionStorage.getItem('uhk-loaded'); } catch (e) { return false; } })();
      const app = DC.mount(document.getElementById('app'), window.UHK_MAIN, {
        page: page,
        theme: theme,
        faculty: store.get('uhk-faculty', 'uhk'),
        sidebarCollapsed: store.get('uhk-sb-col', '0') === '1',
        loading: page === 'prehled' && first
      }, {
        afterRender(comp) {
          const S = comp.state || {};
          if (S.theme) { store.set('uhk-theme', S.theme); applyTheme(S.theme); }
          if (S.fac) store.set('uhk-faculty', S.fac);
          if (S.sbCol !== undefined) store.set('uhk-sb-col', S.sbCol ? '1' : '0');
        }
      });
      if (page === 'prehled' && first) {
        try { sessionStorage.setItem('uhk-loaded', '1'); } catch (e) { /* nic */ }
        setTimeout(() => app.setProps({ loading: false }), 1100);
      }
      return app;
    },
    mountLogin() {
      const theme = store.get('uhk-theme', 'light');
      applyTheme(theme);
      const root = document.getElementById('app');
      root.className = 'pf-theme' + (theme === 'dark' ? ' theme-dark' : '');
      try { sessionStorage.removeItem('uhk-loaded'); } catch (e) { /* nic */ }
      return DC.mount(root, window.UHK_LOGIN, {});
    }
  };
})();
