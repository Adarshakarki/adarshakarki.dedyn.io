let zIndexCounter = 10;

// -----------------------------
// OPEN APP WINDOW (modular)
// -----------------------------
function openAppWindow(url, appName) {
  const win = document.getElementById('app-window');
  const content = win.querySelector('.content');
  const titleEl = win.querySelector('.title');

  // Set dynamic app name
  titleEl.textContent = appName || 'App';

  const appFolder = url.split('/')[1]; // "finder", "photos", etc.

  // Load app CSS if not already loaded
  if (!document.getElementById(`css-${appFolder}`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `apps/${appFolder}/${appFolder}.css`;
    link.id = `css-${appFolder}`;
    document.head.appendChild(link);
  }

  // Fetch HTML
  fetch(url)
    .then(res => res.text())
    .then(html => {
      content.innerHTML = html;
      win.classList.add('open');
      win.style.zIndex = ++zIndexCounter;

      // Center window
      win.style.top = `${window.innerHeight/2 - win.offsetHeight/2}px`;
      win.style.left = `${window.innerWidth/2 - win.offsetWidth/2}px`;

      // Load app JS dynamically if exists
      if (!document.getElementById(`js-${appFolder}`)) {
        const script = document.createElement('script');
        script.src = `apps/${appFolder}/${appFolder}.js`;
        script.id = `js-${appFolder}`;
        script.onload = () => {
          // Call app-specific init function if exists
          const initFn = window[`init${capitalize(appFolder)}`];
          if (typeof initFn === 'function') initFn();
        };
        document.body.appendChild(script);
      } else {
        const initFn = window[`init${capitalize(appFolder)}`];
        if (typeof initFn === 'function') initFn();
      }
    });
}

// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// -----------------------------
// CLOSE WINDOW
// -----------------------------
document.querySelectorAll('#app-window .btn.close').forEach(btn => {
  btn.addEventListener('click', () => {
    const win = document.getElementById('app-window');
    win.classList.remove('open');
  });
});

// -----------------------------
// DOCK MAGNIFICATION
// -----------------------------
const dock = document.querySelector('.dock');
const dockIcons = document.querySelectorAll('.dock img');

dockIcons.forEach(icon => icon.style.transition = 'transform 0.2s ease');

dock.addEventListener('mousemove', e => {
  dockIcons.forEach(icon => {
    const rect = icon.getBoundingClientRect();
    const iconX = rect.left + rect.width/2;
    const dist = Math.abs(e.clientX - iconX);
    const scale = Math.max(1, 1.5 - dist/200);
    icon.style.transform = `scale(${scale})`;
  });
});

dock.addEventListener('mouseleave', () => {
  dockIcons.forEach(icon => icon.style.transform = 'scale(1)');
});

// -----------------------------
// DOCK CLICK -> OPEN APP
// -----------------------------
dockIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    const app = icon.dataset.app;
    const appName = icon.dataset.name;
    if (app) openAppWindow(`apps/${app}/${app}.html`, appName);
  });
});

// -----------------------------
// DRAG APP WINDOW
// -----------------------------
const appWindow = document.getElementById('app-window');
const titleBar = appWindow.querySelector('.title-bar');

let isDragging = false, offsetX = 0, offsetY = 0;

titleBar.addEventListener('mousedown', e => {
  isDragging = true;
  offsetX = e.clientX - appWindow.offsetLeft;
  offsetY = e.clientY - appWindow.offsetTop;
  appWindow.style.zIndex = ++zIndexCounter;
});

document.addEventListener('mousemove', e => {
  if (!isDragging) return;
  let x = e.clientX - offsetX;
  let y = e.clientY - offsetY;

  x = Math.max(0, Math.min(window.innerWidth - appWindow.offsetWidth, x));
  y = Math.max(28, Math.min(window.innerHeight - appWindow.offsetHeight, y));

  appWindow.style.left = x + 'px';
  appWindow.style.top = y + 'px';
});

document.addEventListener('mouseup', () => isDragging = false);

// -----------------------------
// CLICK RIPPLE EFFECT
// -----------------------------
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.className = 'click-effect';
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
});

// -----------------------------
// DATE & TIME WITH AM/PM
// -----------------------------
function updateDateTime() {
  const dateEl = document.getElementById("date");
  const timeEl = document.getElementById("time");
  const now = new Date();

  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  dateEl.innerText = now.toLocaleDateString('en-US', options);

  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2,'0');
  timeEl.innerText = `${hours}:${minutes} ${ampm}`;
}

updateDateTime();
setInterval(updateDateTime, 1000);

// -----------------------------
// OPEN URL (e.g., GitHub links)
// -----------------------------
function openRepo(url) {
  window.open(url, '_blank');
}
