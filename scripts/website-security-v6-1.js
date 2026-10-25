(() => {
  'use strict';

  if (window.location.pathname !== '/pages/website-security-review') return;

  const boot = () => {
    const root = document.getElementById('ecz-review');
    const cfg = window.ECZ_REVIEW_CONFIG;
    const core = window.ECZCartCore;
    if (!root || !cfg || !core || root.dataset.v61Ready === 'true') return;
    root.dataset.v61Ready = 'true';

    const $ = (id) => document.getElementById(id);
    const q = (sel, parent = root) => parent.querySelector(sel);
    const qa = (sel, parent = root) => Array.from(parent.querySelectorAll(sel));
    const live = $('ecz-live');
    const announce = (message) => { if (live) live.textContent = message; };

    cfg.version = 'WEB-RESPONSE-2026-10-25-v6.1';

    const checkForm = $('instant-check');
    const checkInput = $('check-url');
    const checkError = $('check-error');
    const progress = $('plan-progress');
    const meter = $('plan-meter');
    const stage = $('plan-stage');
    const step = $('plan-step');
    const domainPreview = $('plan-domain');
    const skip = $('plan-skip');
    const results = $('instant-results');
    const resultsBox = $('instant-result-content');
    let planTimer = null;
    let planStart = 0;
    let pendingDomain = '';

    const escapeHtml = (value) => String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');

    const renderPlan = (domain) => {
      if (!results || !resultsBox) return;
      resultsBox.innerHTML = `
        <span class="eyebrow">YOUR WEBSITE ACTION PLAN</span>
        <h2>What do you need to prove next?</h2>
        <p class="result-domain">${escapeHtml(domain)}</p>
        <p class="lead muted">This instant guide has not scanned your website. PHP version, firewall setup and compromise status remain unverified.</p>
        <div class="result-grid">
          <article class="pricecard">
            <span class="eyebrow">ALREADY PATCHED?</span>
            <h3>Current-State Review</h3>
            <p class="price">£195</p>
            <p>Review supplied evidence, record unknowns and determine the next proof step.</p>
            <button type="button" class="btn" data-v61-result="security_review_only">Prove current state · £195</button>
          </article>
          <article class="pricecard featured">
            <span class="eyebrow">NEED REMEDIATION?</span>
            <h3>Patch &amp; Verify™</h3>
            <p class="price">£395</p>
            <p>Supported remediation, health checks, runtime evidence and a documented re-check.</p>
            <button type="button" class="btn" data-v61-result="patch_verify">Patch &amp; Verify · £395</button>
          </article>
        </div>
        <p class="scope">Missing evidence stays unknown. A public version string or patch statement is not treated as proof of the serving runtime.</p>`;

      qa('[data-v61-result]', resultsBox).forEach((button) => {
        button.addEventListener('click', () => {
          const key = button.dataset.v61Result;
          const target = q(`[data-offer="${key}"]`);
          if (target) target.click();
        });
      });

      results.hidden = false;
      if (progress) progress.hidden = true;
      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
      announce('Your website action plan is ready.');
    };

    const finishPlan = () => {
      if (!pendingDomain) return;
      if (planTimer) cancelAnimationFrame(planTimer);
      if (meter) meter.value = 100;
      if (stage) stage.textContent = 'Your action plan is ready';
      if (step) step.textContent = 'Routing you to the right next step';
      window.setTimeout(() => renderPlan(pendingDomain), 120);
    };

    const tickPlan = (timestamp) => {
      const elapsed = timestamp - planStart;
      const pct = Math.min(100, Math.round((elapsed / 3500) * 100));
      if (meter) meter.value = pct;
      if (stage) {
        stage.textContent = pct < 34
          ? 'Preparing your website action plan'
          : pct < 68
            ? 'Checking the evidence route you may need'
            : 'Preparing the next-step options';
      }
      if (step) {
        step.textContent = pct < 34
          ? 'Your website selected'
          : pct < 68
            ? 'Protection · updates · evidence'
            : 'Current-State Proof · remediation · continuity';
      }
      if (elapsed >= 3500) return finishPlan();
      planTimer = requestAnimationFrame(tickPlan);
    };

    if (checkForm && !checkForm.dataset.v61Bound) {
      checkForm.dataset.v61Bound = 'true';
      checkForm.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (checkError) checkError.textContent = '';
        try {
          pendingDomain = core.safeDomain(checkInput ? checkInput.value : '');
          const intakeDomain = $('intake-domain');
          if (intakeDomain) intakeDomain.value = pendingDomain;
          if (domainPreview) domainPreview.textContent = pendingDomain;
          if (results) results.hidden = true;
          if (progress) progress.hidden = false;
          if (meter) meter.value = 0;
          if (progress) progress.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          planStart = performance.now();
          if (planTimer) cancelAnimationFrame(planTimer);
          planTimer = requestAnimationFrame(tickPlan);
        } catch (error) {
          if (checkError) checkError.textContent = error instanceof Error ? error.message : 'Enter a public website homepage.';
        }
      }, true);
    }

    if (skip && !skip.dataset.v61Bound) {
      skip.dataset.v61Bound = 'true';
      skip.addEventListener('click', (event) => {
        event.preventDefault();
        finishPlan();
      });
    }

    qa('.audience [data-audience]').forEach((button) => {
      if (button.dataset.v61Bound) return;
      button.dataset.v61Bound = 'true';
      button.addEventListener('click', () => {
        const selected = button.dataset.audience || 'owner';
        qa('.audience [data-audience]').forEach((candidate) => {
          candidate.setAttribute('aria-pressed', candidate === button ? 'true' : 'false');
        });
        const target = selected === 'msp' ? $('msp') : $('owner-start');
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    let selectedOfferKey = null;

    root.addEventListener('click', (event) => {
      const button = event.target.closest && event.target.closest('[data-offer]');
      if (!button) return;
      const key = button.dataset.offer;
      if (!key || !cfg.offers[key]) return;
      selectedOfferKey = key;
      window.__ECZ_SELECTED_OFFER_KEY = key;

      const bundle = $('bundle-option');
      const checkbox = $('add-continuity');
      const note = $('bundle-note');
      const eligible = ['emergency_shield', 'patch_verify', 'security_review_only', 'legacy_recovery'].includes(key);
      if (bundle) bundle.hidden = !eligible;
      if (checkbox && !eligible) checkbox.checked = false;
      if (note) note.textContent = eligible
        ? 'Optional one-off 30-day pass. It is never preselected and does not renew automatically.'
        : '';
    }, true);

    if (window.location.hash.startsWith('#buy=')) {
      const key = decodeURIComponent(window.location.hash.slice(5));
      if (cfg.offers[key]) selectedOfferKey = key;
    }

    const intakeForm = $('ecz-intake-form');
    if (intakeForm && !intakeForm.dataset.v61SubmitBound) {
      intakeForm.dataset.v61SubmitBound = 'true';
      intakeForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();

        const errorBox = $('intake-error');
        if (errorBox) errorBox.textContent = '';
        if (!intakeForm.reportValidity()) return;

        let key = selectedOfferKey || window.__ECZ_SELECTED_OFFER_KEY || null;
        if (!key) {
          const title = ($('intake-title')?.textContent || '').toLowerCase();
          key = Object.keys(cfg.offers).find((candidate) => title.includes((cfg.offers[candidate].name || '').toLowerCase())) || null;
        }
        const offer = key ? cfg.offers[key] : null;
        if (!offer || !core.canBuy(offer)) {
          if (errorBox) errorBox.textContent = 'This service is not connected for purchase yet.';
          return;
        }

        const submit = $('intake-submit');
        if (submit) submit.disabled = true;

        try {
          const org = ($('intake-org')?.value || '').trim();
          const domain = ($('intake-domain')?.value || '').trim();
          const fields = {
            org,
            domain,
            eczid: ($('intake-eczid')?.value || '').trim().toUpperCase(),
            client: ($('intake-client')?.value || '').trim(),
            audience: offer.audience === 'msp' ? 'msp' : 'owner'
          };

          const cartResponse = await fetch('/cart.js', {
            credentials: 'same-origin',
            headers: { 'Accept': 'application/json' }
          });
          if (!cartResponse.ok) throw new Error('The store could not verify your cart. Please open the cart before retrying.');
          const cart = await cartResponse.json();
          const normalisedDomain = fields.domain ? core.safeDomain(fields.domain) : '';
          const conflictMessage = core.conflict(offer, cart, { ...fields, domain: normalisedDomain });
          if (conflictMessage) throw new Error(conflictMessage);

          const items = [core.makeItem(offer, fields, cfg)];
          const addContinuity = $('add-continuity');
          if (addContinuity?.checked && ['emergency_shield', 'patch_verify', 'security_review_only', 'legacy_recovery'].includes(key)) {
            const continuity = cfg.offers.website_continuity_monthly;
            if (!core.canBuy(continuity)) throw new Error('The optional Continuity pass is not connected for purchase right now.');
            const continuityConflict = core.conflict(continuity, cart, { ...fields, domain: normalisedDomain });
            if (continuityConflict) throw new Error(continuityConflict);
            items.push(core.makeItem(continuity, fields, cfg));
          }

          const addResponse = await fetch('/cart/add.js', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({ items })
          });
          if (!addResponse.ok) throw new Error('The store could not add this service. Check your cart before retrying.');
          window.location.assign('/checkout');
        } catch (error) {
          if (errorBox) errorBox.textContent = error instanceof Error ? error.message : 'Unable to prepare checkout.';
          if (submit) submit.disabled = false;
        }
      }, true);
    }

    const tour = $('tour');
    if (tour) {
      qa('.tour-arrow, .tour-play, .tour-controls', tour).forEach((element) => {
        element.hidden = true;
      });
      const counter = $('slide-counter');
      if (counter) counter.hidden = true;
      const kind = $('tour-kind');
      if (kind) kind.textContent = 'Live Resolver example';
      const title = $('tour-title');
      if (title) title.textContent = 'Open the current Resolver record';
      const description = $('tour-description');
      if (description) description.textContent = 'This screenshot is an example of the ECZ-ID Resolver. Use the live-record link above for the current public record.';
    }

    const agentDetails = $('agent-catalog');
    if (agentDetails) {
      const firstParagraph = q('p', agentDetails);
      if (firstParagraph && !firstParagraph.textContent.includes('headline subset')) {
        firstParagraph.insertAdjacentText('beforeend', ' The inline JSON below is a headline subset; use Products JSON above for the full machine-readable catalogue.');
      }
    }

    announce('Website Security V6.1 interaction hardening loaded.');
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
