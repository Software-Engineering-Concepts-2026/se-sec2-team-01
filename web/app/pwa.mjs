if (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '[::1]') {
    window.addEventListener('load', function () {
      if ('serviceWorker' in navigator) navigator.serviceWorker.register('./service-worker.js').catch(function () {});
    });
  }
