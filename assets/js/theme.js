(() => {
  const key = "portfolio-theme";
  const valid = mode => mode === "light" || mode === "dark";
  // URL state carries the theme between file:// pages with separate storage.
  const requested = new URL(window.location.href).searchParams.get("theme");
  let saved;
  try { saved = localStorage.getItem(key); } catch {}
  const initial = valid(requested) ? requested : valid(saved) ? saved : "dark";
  // This script runs in the head to apply the theme before the first paint.
  document.documentElement.dataset.theme = initial;
  try { localStorage.setItem(key, initial); } catch {}

  function themedUrl(destination) {
    const url = new URL(destination, window.location.href);
    url.searchParams.set("theme", document.documentElement.dataset.theme);
    return url.href;
  }
  function updateLinks() {
    document.querySelectorAll("a[href]").forEach(link => {
      const href = link.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      const url = new URL(href, window.location.href);
      const localPage = url.protocol === window.location.protocol &&
        url.host === window.location.host &&
        url.pathname.slice(0, url.pathname.lastIndexOf("/")) ===
          window.location.pathname.slice(0, window.location.pathname.lastIndexOf("/")) &&
        /\/(index|projects|cv)\.html$/.test(url.pathname);
      if (localPage) link.href = themedUrl(url.href);
    });
  }
  window.portfolioTheme = {
    set(mode) {
      if (!valid(mode)) return;
      document.documentElement.dataset.theme = mode;
      try { localStorage.setItem(key, mode); } catch {}
      try { history.replaceState(null, "", themedUrl(window.location.href)); } catch {}
      updateLinks();
    },
    get() { return document.documentElement.dataset.theme; },
    url: themedUrl
  };
  document.addEventListener("DOMContentLoaded", updateLinks);
})();
