// Make switches visual-only (but still toggle)
document.querySelectorAll('.switch input').forEach(sw => {
  // Remove preventDefault to allow toggle animation
  // You can add a listener here if you want to log state
  sw.addEventListener('change', () => {
    console.log(sw.checked); // just to see toggle in console
  });
});
