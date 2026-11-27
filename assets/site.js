// Norma Games: picks the right call to action for the visitor's device, and runs the small
// interactions (copy link, screenshot viewer). No tracking, no third-party requests.
(() => {
  const body = document.body;
  const ua = navigator.userAgent;

  // Elements marked data-only="computer phone quest" are shown only on those devices.
  const setDevice = (d) => {
    body.dataset.device = d;
    document.querySelectorAll('[data-only]').forEach((el) => {
      el.hidden = !el.dataset.only.split(' ').includes(d);
    });
  };
  const isQuest = /OculusBrowser|Quest/i.test(ua);
  const isPhone = /iPhone|iPad|iPod|Android|Mobile/i.test(ua) && !isQuest;
  setDevice(isQuest ? 'quest' : isPhone ? 'phone' : 'computer');
  // A computer with a VR headset attached can play directly too.
  if (!isQuest && !isPhone && navigator.xr?.isSessionSupported) {
    navigator.xr.isSessionSupported('immersive-vr').then((ok) => { if (ok) setDevice('quest'); }).catch(() => {});
  }

  // Meta's Web Launch: sends an HTTPS link from a computer or phone to the visitor's Quest Browser.
  // https://developers.meta.com/horizon/documentation/web/web-launch/
  document.querySelectorAll('[data-send]').forEach((a) => {
    const target = new URL(a.dataset.send || '/', location.origin);
    target.protocol = 'https:';
    const launch = new URL('https://www.oculus.com/open_url/');
    launch.searchParams.set('url', target.href);
    a.href = launch.href;
  });

  // Copy the address; fall back to selecting it where the clipboard is refused.
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy);
      b.textContent = 'Copied';
    } catch {
      const r = document.createRange();
      r.selectNodeContents(b.previousElementSibling);
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(r);
      b.textContent = 'Selected';
    }
    setTimeout(() => { b.textContent = 'Copy'; }, 1800);
  }));

  // Screenshot viewer
  const lb = document.querySelector('dialog.lb');
  if (lb) {
    document.querySelectorAll('[data-full]').forEach((s) => s.addEventListener('click', () => {
      const cap = s.querySelector('span').textContent;
      lb.querySelector('img').src = s.dataset.full;
      lb.querySelector('img').alt = cap;
      lb.querySelector('p').textContent = cap;
      lb.showModal();
    }));
    lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); });
  }
})();
