(function () {
  'use strict';

  const form = document.getElementById('urlForm');
  const urlInput = document.getElementById('urlInput');
  const submitBtn = document.getElementById('submitBtn');
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');
  const errorMessageEl = document.getElementById('errorMessage');
  const originalUrlEl = document.getElementById('originalUrl');
  const shortUrlEl = document.getElementById('shortUrl');
  const copyBtn = document.getElementById('copyBtn');

  if (!form || !urlInput) return;

  function hideFeedback() {
    if (resultDiv) resultDiv.classList.add('is-hidden');
    if (errorDiv) errorDiv.classList.add('is-hidden');
  }

  function showError(message) {
    if (errorMessageEl) errorMessageEl.textContent = message;
    if (errorDiv) {
      errorDiv.classList.remove('is-hidden');
      errorDiv.style.setProperty('display', 'flex');
    }
  }

  function showResult(data) {
    if (originalUrlEl) originalUrlEl.textContent = data.originalUrl;
    if (shortUrlEl) {
      shortUrlEl.textContent = data.shortUrl;
      shortUrlEl.href = data.shortUrl;
    }
    if (resultDiv) {
      resultDiv.classList.remove('is-hidden');
      resultDiv.style.removeProperty('display');
      resultDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function setLoading(loading) {
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.textContent = loading ? 'Encurtando…' : 'Encurtar';
    }
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    hideFeedback();

    const url = urlInput.value.trim();
    if (!url) {
      showError('Digite uma URL válida.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        showError(data.error || 'Erro ao encurtar URL.');
        return;
      }
      showResult(data);
    } catch (_err) {
      showError('Erro de conexão. Tente novamente.');
    } finally {
      setLoading(false);
    }
  });

  if (copyBtn && shortUrlEl) {
    copyBtn.addEventListener('click', function () {
      navigator.clipboard.writeText(shortUrlEl.href).then(function () {
        const oldText = copyBtn.textContent;
        copyBtn.textContent = 'Copiado!';
        copyBtn.classList.add('copied');
        setTimeout(function () {
          copyBtn.textContent = oldText;
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  }
})();
