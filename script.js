// ========================================
// TAROT - Main JavaScript
// ========================================

// Security: Basic HTML sanitization to prevent XSS
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Security: Mask API key for display
function maskApiKey(key) {
  if (!key || key.length < 8) return '****';
  return key.substring(0, 4) + '****' + key.substring(key.length - 4);
}

const UNIVERSE_PROMPT = '✨ Vũ trụ nói gì?';
const UNIVERSE_RETRY = '🔄 Hỏi lại vũ trụ';
const UNIVERSE_HEADER_PREFIX = '✨ Vũ trụ nói gì qua';

class TarotApp {
  constructor() {
    this.currentScreen = 'welcome';
    this.question = '';
    this.selectedCards = [];
    this.deck = [];
    this.selectedPositions = [];

    // OpenRouter model cache (for dropdown)
    this.openRouterFreeModels = null;
    this.history = null;
    this.onboardingTimer = null;
    this.screenOrder = SCREEN_SEQUENCE;
    this.lastScreenIndex = this.screenOrder.indexOf('welcome-screen');

    this.init();
  }

  init() {
    this.loadSettings();
    this.loadHistory();
    this.bindEvents();
    this.updateSettingsUI();
    this.renderHistory();
    this.setupOnboarding();
    this.showScreen(this.currentScreen);
  }

  // ========================================
  // Navigation
  // ========================================

  showScreen(screenId) {
    const target = document.getElementById(screenId);
    if (!target) return;
    const newIndex = this.screenOrder.indexOf(screenId);
    const prevIndex = typeof this.lastScreenIndex === 'number' ? this.lastScreenIndex : 0;
    const resolvedIndex = newIndex === -1 ? prevIndex : newIndex;
    const direction = resolvedIndex > prevIndex ? 'next' : resolvedIndex < prevIndex ? 'prev' : (document.body.getAttribute('data-page-direction') || 'next');
    document.body.setAttribute('data-page-direction', direction);
    document.body.setAttribute('data-current-screen', screenId);
    this.lastScreenIndex = resolvedIndex;
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    target.classList.add('active');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    document.querySelectorAll('.screen-tab').forEach(tab => tab.classList.remove('active'));
    const targetTab = document.querySelector(`.screen-tab[data-target="${screenId}"]`);
    if (targetTab) targetTab.classList.add('active');
    this.currentScreen = screenId;
    this.trackTabSwitch(screenId);
  }


  trackTabSwitch(screenId) {
    window.dataLayer = window.dataLayer || [];
    window.analytics = window.analytics || [];
    window.dataLayer.push({ event: 'tarot_tab_switch', tab: screenId });
    window.analytics.push({ event: 'tarot_tab_switch', tab: screenId });
    console.log('[Analytics] Tab switched to', screenId);
  }

  // ========================================
  // Event Bindings
  // ========================================

  bindEvents() {
    // Welcome Screen
    document.getElementById('start-btn').addEventListener('click', () => this.showScreen('question-screen'));
    document.getElementById('settings-btn').addEventListener('click', () => this.openSettings());

    // Question Screen
    document.getElementById('shuffle-btn').addEventListener('click', () => this.startCardSelection());

    // Cards Screen
    document.getElementById('read-btn').addEventListener('click', () => this.showResults());
    document.getElementById('reset-btn').addEventListener('click', () => this.resetSelection());

    // Result Screen
    document.getElementById('analyze-btn').addEventListener('click', () => this.analyzeWithAI());
    document.getElementById('new-reading-btn').addEventListener('click', () => this.newReading());
    document.getElementById('back-to-cards-btn').addEventListener('click', () => this.showScreen('cards-screen'));

    // Settings Modal
    document.getElementById('close-settings').addEventListener('click', () => this.closeSettings());
    document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
    document.getElementById('ai-provider').addEventListener('change', (e) => this.onProviderChange(e));
    document.getElementById('clear-api-key').addEventListener('click', () => this.clearApiKey());

    // Model select near Analyze button (OpenRouter)
    const modelSelect = document.getElementById('ai-model-select');
    if (modelSelect) {
      modelSelect.addEventListener('change', (e) => {
        const model = e.target.value;
        if (model) {
          localStorage.setItem(STORAGE_KEYS.openRouterModel, model);
        } else {
          localStorage.removeItem(STORAGE_KEYS.openRouterModel);
        }
      });
    }

    // Close modal on outside click
    document.getElementById('settings-modal').addEventListener('click', (e) => {
      if (e.target.id === 'settings-modal') this.closeSettings();
    });

    const howToBtn = document.getElementById('how-to-btn');
    if (howToBtn) {
      howToBtn.addEventListener('click', () => this.openOnboarding());
    }

    const onboardingModal = document.getElementById('onboarding-modal');
    if (onboardingModal) {
      onboardingModal.addEventListener('click', (e) => {
        if (e.target === onboardingModal) {
          this.closeOnboarding();
        }
      });
    }

    const closeOnboardingBtn = document.getElementById('close-onboarding');
    if (closeOnboardingBtn) {
      closeOnboardingBtn.addEventListener('click', () => this.closeOnboarding());
    }

    const historyClearBtn = document.getElementById('history-clear-btn');
    if (historyClearBtn) {
      historyClearBtn.addEventListener('click', () => this.clearHistory());
    }
    const screenTabs = document.querySelectorAll('.screen-tab');
    screenTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.getAttribute('data-target');
        if (target) this.showScreen(target);
      });
    });
  }

  // ========================================
  // Settings Management
  // ========================================

  loadSettings() {
    const storedProvider = localStorage.getItem(STORAGE_KEYS.provider);
    this.aiProvider = storedProvider || 'openrouter';
    this.apiKey = localStorage.getItem(STORAGE_KEYS.apiKey) || '';

    // Persist default provider if none was set
    if (!storedProvider) {
      localStorage.setItem(STORAGE_KEYS.provider, this.aiProvider);
    }

    console.log('📌 Loaded settings - Provider:', this.aiProvider, '| Has API key:', !!this.apiKey);
  }

  loadHistory() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.history);
      this.history = stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Unable to parse history:', error);
      this.history = null;
    }
  }

  updateSettingsUI() {
    const providerSelect = document.getElementById('ai-provider');
    const apiKeyGroup = document.getElementById('api-key-group');
    const currentProvider = document.getElementById('current-provider');
    const clearBtn = document.getElementById('clear-api-key');
    const apiKeyInput = document.getElementById('api-key');
    const openRouterModelGroup = document.getElementById('openrouter-model-group');
    const openRouterModelInput = document.getElementById('openrouter-model');
    const analyzeBtn = document.getElementById('analyze-btn');
    const aiModelSelect = document.getElementById('ai-model-select');
    
    providerSelect.value = this.aiProvider;
    
    const provider = AI_PROVIDERS[this.aiProvider];
    if (provider && provider.needsKey) {
      apiKeyGroup.classList.remove('hidden');
    } else {
      apiKeyGroup.classList.add('hidden');
    }

    // OpenRouter: show model input (optional)
    if (openRouterModelGroup && openRouterModelInput) {
      if (this.aiProvider === 'openrouter') {
        openRouterModelGroup.classList.remove('hidden');
        openRouterModelInput.value = localStorage.getItem(STORAGE_KEYS.openRouterModel) || AI_PROVIDERS.openrouter.model;
      } else {
        openRouterModelGroup.classList.add('hidden');
      }
    }

    // OpenRouter: show model dropdown near Analyze button
    if (aiModelSelect) {
      if (this.aiProvider === 'openrouter') {
        aiModelSelect.classList.remove('hidden');
        // Ensure models are loaded/populated (non-blocking)
        this.ensureOpenRouterFreeModelsLoaded();
        // Keep selection in sync with localStorage
        const selected = localStorage.getItem(STORAGE_KEYS.openRouterModel) || '';
        if (aiModelSelect.value !== selected) {
          aiModelSelect.value = selected;
        }
      } else {
        aiModelSelect.classList.add('hidden');
      }
    }

    currentProvider.textContent = `Provider: ${provider ? provider.name : 'Local'}`;

    if (this.apiKey) {
      clearBtn.classList.remove('hidden');
      // Security: Show masked key, don't expose actual key
      apiKeyInput.value = maskApiKey(this.apiKey);
    } else {
      clearBtn.classList.add('hidden');
      apiKeyInput.value = '';
    }

    // Update analyze button to show which AI is being used
    if (analyzeBtn) {
      const providerName = provider ? provider.name : 'Local';
      analyzeBtn.textContent = this.getUniverseButtonLabel(providerName);
    }

    this.updateProviderBadge();
  }

  updateProviderBadge() {
    const chip = document.getElementById('provider-chip');
    if (!chip) return;
    const provider = AI_PROVIDERS[this.aiProvider];
    chip.textContent = provider ? `Provider: ${provider.name}` : 'Provider: Local';
  }

  onProviderChange(e) {
    const provider = AI_PROVIDERS[e.target.value];
    const apiKeyGroup = document.getElementById('api-key-group');

    if (provider && provider.needsKey) {
      apiKeyGroup.classList.remove('hidden');
    } else {
      apiKeyGroup.classList.add('hidden');
    }
  }

  saveSettings() {
    const provider = document.getElementById('ai-provider').value;
    const apiKeyInput = document.getElementById('api-key').value.trim();
    const openRouterModelInput = document.getElementById('openrouter-model');
    // If the user didn't actually change the key (input is masked), keep the stored real key.
    const isMaskedKey = apiKeyInput.includes('****');
    const effectiveApiKey = isMaskedKey ? (localStorage.getItem(STORAGE_KEYS.apiKey) || '') : apiKeyInput;

    localStorage.setItem(STORAGE_KEYS.provider, provider);

    if (provider !== 'local' && effectiveApiKey) {
      localStorage.setItem(STORAGE_KEYS.apiKey, effectiveApiKey);
    }

    // Persist OpenRouter model override (if provided)
    if (provider === 'openrouter' && openRouterModelInput) {
      const model = openRouterModelInput.value.trim();
      if (model) {
        localStorage.setItem(STORAGE_KEYS.openRouterModel, model);
      } else {
        localStorage.removeItem(STORAGE_KEYS.openRouterModel);
      }
    }

    this.aiProvider = provider;
    this.apiKey = effectiveApiKey || localStorage.getItem(STORAGE_KEYS.apiKey) || '';

    this.updateSettingsUI();
    this.closeSettings();
  }

  clearApiKey() {
    localStorage.removeItem(STORAGE_KEYS.apiKey);
    this.apiKey = '';
    this.updateSettingsUI();
  }

  openSettings() {
    this.updateSettingsUI();
    document.getElementById('settings-modal').classList.remove('hidden');
  }

  closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
  }

  // ========================================
  // Card Logic
  // ========================================

  shuffleDeck() {
    const shuffled = [...TAROT_CARDS];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  startCardSelection() {
    this.question = document.getElementById('question-input').value.trim();
    this.selectedCards = [];
    this.selectedPositions = [];
    this.deck = this.shuffleDeck();

    this.renderDeck();
    this.showScreen('cards-screen');
    this.updateSelectionCounter();

    document.getElementById('read-btn').disabled = true;
  }

  renderDeck() {
    const deckEl = document.getElementById('deck');
    deckEl.innerHTML = '';

    // Add shuffle animation
    deckEl.classList.add('shuffling');
    setTimeout(() => deckEl.classList.remove('shuffling'), 500);

    // Render cards with slight random offset for natural look
    this.deck.forEach((card, index) => {
      const cardEl = this.createCardElement(card, index);
      deckEl.appendChild(cardEl);
    });
  }

  createCardElement(card, index) {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.dataset.index = index;
    cardEl.dataset.cardId = card.id;

    // Get card colors
    const gradientColors = card.gradient || ['#2d1f1f', '#1a0f0f'];
    const symbolColor = card.color || '#d4af37';

    // Add slight random rotation and offset for natural look
    const randomRotation = (Math.random() - 0.5) * 6;
    const randomOffsetX = (Math.random() - 0.5) * 10;
    const randomOffsetY = (Math.random() - 0.5) * 8;

    cardEl.style.transform = `rotate(${randomRotation}deg) translate(${randomOffsetX}px, ${randomOffsetY}px)`;

    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-back"></div>
        <div class="card-face card-front" style="background: linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%);">
          <span class="card-number" style="color: ${symbolColor};">${card.number}</span>
          <div class="card-art" style="color: ${symbolColor};">
            <span class="card-symbol" style="font-size: 3.5rem; filter: drop-shadow(0 0 10px ${symbolColor}40);">${card.symbol}</span>
          </div>
          <span class="card-name" style="color: #f5f0e6;">${card.name}</span>
          <span class="card-name-vn" style="color: ${symbolColor}; opacity: 0.9;">${card.nameVn}</span>
        </div>
      </div>
    `;

    cardEl.addEventListener('click', () => this.selectCard(cardEl, card));

    return cardEl;
  }

  selectCard(cardEl, card) {
    // Check if already selected
    if (cardEl.classList.contains('selected')) return;

    // Check if max selection reached
    if (this.selectedCards.length >= 3) {
      return;
    }

    // Mark as selected and flip the card first
    cardEl.classList.add('selected');
    cardEl.classList.add('flipping');

    // Store the card
    this.selectedCards.push(card);
    this.selectedPositions.push(this.selectedCards.length - 1);

    this.updateSelectionCounter();

    // Enable read button if 3 cards selected
    if (this.selectedCards.length === 3) {
      document.getElementById('read-btn').disabled = false;
    }

    // Flip animation - show the front of card, then hide after
    setTimeout(() => {
      cardEl.classList.add('flipped');
    }, 100);

    // Hide the card after flip animation completes
    setTimeout(() => {
      cardEl.style.opacity = '0';
      cardEl.style.pointerEvents = 'none';
      cardEl.style.transform = 'translateY(-100px) scale(0.8)';
    }, 1200);
  }

  updateSelectionCounter() {
    document.getElementById('selected-count').textContent = this.selectedCards.length;
  }

  resetSelection() {
    this.selectedCards = [];
    this.selectedPositions = [];
    this.renderDeck();
    this.updateSelectionCounter();
    document.getElementById('read-btn').disabled = true;
  }

  // ========================================
  // Results
  // ========================================

  showResults() {
    const resultQuestion = document.getElementById('result-question');
    const selectedCardsEl = document.getElementById('selected-cards');

    // Show question
    resultQuestion.textContent = this.question || 'Không có câu hỏi cụ thể';

    // Render selected cards
    selectedCardsEl.innerHTML = '';

    POSITIONS.forEach((position, index) => {
      const card = this.selectedCards[index];
      if (!card) return;

      const cardEl = document.createElement('div');
      cardEl.className = 'result-card flipped';

      let meaning = '';
      if (position.id === 'past') meaning = card.meaningPast;
      else if (position.id === 'present') meaning = card.meaningPresent;
      else if (position.id === 'future') meaning = card.meaningFuture;

      const gradientColors = card.gradient || ['#2d1f1f', '#1a0f0f'];
      const symbolColor = card.color || '#d4af37';

      cardEl.innerHTML = `
        <div class="card">
          <div class="card-inner">
            <div class="card-face card-back"></div>
            <div class="card-face card-front" style="background: linear-gradient(135deg, ${gradientColors[0]} 0%, ${gradientColors[1]} 100%);">
              <span class="card-number" style="color: ${symbolColor};">${card.number}</span>
              <div class="card-art" style="color: ${symbolColor};">
                <span class="card-symbol" style="font-size: 4rem; filter: drop-shadow(0 0 15px ${symbolColor}50);">${card.symbol}</span>
              </div>
              <span class="card-name" style="color: #f5f0e6;">${card.name}</span>
              <span class="card-name-vn" style="color: ${symbolColor};">${card.nameVn}</span>
            </div>
          </div>
        </div>
        <div class="card-position">${position.name}</div>
        <div class="card-meaning">${meaning}</div>
      `;

      selectedCardsEl.appendChild(cardEl);
    });

    // Reset AI result
    document.getElementById('ai-result').classList.add('hidden');
    document.getElementById('ai-loading').classList.add('hidden');
    document.getElementById('analyze-btn').disabled = false;
    document.getElementById('analyze-btn').textContent = '🤖 Phân Tích AI';

    this.showScreen('result-screen');
    this.saveHistory();
  }

  newReading() {
    this.question = '';
    this.selectedCards = [];
    this.selectedPositions = [];
    document.getElementById('question-input').value = '';
    this.showScreen('welcome-screen');
  }

  saveHistory() {
    if (this.selectedCards.length < 3) return;
    const cards = POSITIONS.map((position, index) => {
      const card = this.selectedCards[index];
      if (!card) return null;
      return {
        position: position.name,
        name: card.name,
        nameVn: card.nameVn
      };
    }).filter(Boolean);

    if (!cards.length) return;

    const historyEntry = {
      timestamp: Date.now(),
      question: this.question,
      provider: this.aiProvider,
      cards
    };

    localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(historyEntry));
    this.history = historyEntry;
    this.renderHistory();
  }

  renderHistory() {
    const panel = document.getElementById('history-panel');
    const dateEl = document.getElementById('history-date');
    const questionEl = document.getElementById('history-question');
    const cardsEl = document.getElementById('history-cards');

    if (!panel || !this.history || !Array.isArray(this.history.cards) || !cardsEl) {
      if (panel) panel.classList.add('hidden');
      return;
    }

    panel.classList.remove('hidden');

    const date = new Date(this.history.timestamp);
    const providerLabel = AI_PROVIDERS[this.history.provider]?.name || '🔮 Local';
    if (dateEl) {
      dateEl.textContent = `Lần bói lúc ${date.toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })} (${providerLabel})`;
    }

    if (questionEl) {
      questionEl.textContent = this.history.question ? `"${this.history.question}"` : 'Đã bỏ trống câu hỏi.';
    }

    cardsEl.innerHTML = '';
    this.history.cards.forEach(card => {
      const badge = document.createElement('span');
      badge.className = 'history-card';
      badge.textContent = `${card.position}: ${card.nameVn}`;
      cardsEl.appendChild(badge);
    });
  }

  clearHistory() {
    localStorage.removeItem(STORAGE_KEYS.history);
    this.history = null;
    this.renderHistory();
  }

  setupOnboarding() {
    const seen = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    if (seen) return;
    this.onboardingTimer = setTimeout(() => {
      this.openOnboarding(true);
    }, 1200);
  }

  openOnboarding(auto = false) {
    const modal = document.getElementById('onboarding-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    document.body.classList.add('modal-open');
    if (!auto) {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    }
  }

  closeOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    document.body.classList.remove('modal-open');
    localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    if (this.onboardingTimer) {
      clearTimeout(this.onboardingTimer);
      this.onboardingTimer = null;
    }
  }

  getUniverseButtonLabel(providerName) {
    const suffix = providerName ? ` (${providerName})` : '';
    return `${UNIVERSE_PROMPT}${suffix}`;
  }

  getUniverseAnalyzingLabel(modeText) {
    const suffix = modeText ? ` (${modeText})` : '';
    return `${UNIVERSE_PROMPT}${suffix} đang lắng nghe...`;
  }

  getUniverseRetryLabel(modeText) {
    const suffix = modeText ? ` (${modeText})` : '';
    return `${UNIVERSE_RETRY}${suffix}`;
  }

  // ========================================
  // AI Analysis
  // ========================================

  async analyzeWithAI() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const loadingEl = document.getElementById('ai-loading');
    const resultEl = document.getElementById('ai-result');

    // Get AI mode text for display
    const aiModeText = this.aiProvider === 'openai' ? 'OpenAI' :
                       this.aiProvider === 'google' ? 'Google Gemini Flash' :
                       this.aiProvider === 'openrouter' ? 'OpenRouter' :
                       this.aiProvider === 'googlePro' ? 'Google Gemini Pro 2.0' :
                       this.aiProvider === 'google15Pro' ? 'Google Gemini 1.5 Pro' :
                       this.aiProvider === 'google25Flash' ? 'Google Gemini 2.5 Flash' : 'Local';
    const aiEmoji = this.aiProvider === 'openai' ? '🤖' :
                    this.aiProvider === 'google' ? '🌐' :
                    this.aiProvider === 'openrouter' ? '🧩' :
                    this.aiProvider === 'googlePro' ? '🌟' :
                    this.aiProvider === 'google15Pro' ? '✨' :
                    this.aiProvider === 'google25Flash' ? '🎯' : '🔮';

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = this.getUniverseAnalyzingLabel(aiModeText);
    loadingEl.classList.remove('hidden');
    resultEl.classList.add('hidden');

    try {
      let result;

      if (this.aiProvider === 'local') {
        result = this.getLocalAnalysis();
      } else if (['openai', 'google', 'openrouter', 'googlePro', 'google15Pro', 'google25Flash'].includes(this.aiProvider)) {
        result = await this.getAIAnalysis();
      } else {
        result = this.getLocalAnalysis();
      }

      // Add header showing which AI was used
      const headerHtml = `<div class="ai-mode-header">${UNIVERSE_HEADER_PREFIX} ${aiModeText}</div>`;
      result = headerHtml + result;

      // Security: Only allow safe HTML tags from AI
      resultEl.innerHTML = this.sanitizeAIResponse(result);
      resultEl.classList.remove('hidden');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      // Security: Sanitize error message
      const errorHtml = `
        <div class="ai-mode-header">⚠️ Lỗi kết nối vũ trụ</div>
        <h3>❌ Lỗi</h3>
        <p>${sanitizeHTML(error.message)}</p>
        <p><strong>Giải pháp:</strong></p>
        <ul>
          <li>Nếu dùng OpenAI/Gemini: Kiểm tra API key trong ⚙️ Cài Đặt AI</li>
          <li>Hoặc chọn "🔮 Local (Miễn phí)" để sử dụng phân tích cơ bản</li>
        </ul>
      `;
      resultEl.innerHTML = errorHtml;
      resultEl.classList.remove('hidden');
    }

    loadingEl.classList.add('hidden');
    analyzeBtn.textContent = this.getUniverseRetryLabel(aiModeText);
    analyzeBtn.disabled = false;
  }

  // Security: Sanitize AI response to prevent XSS
  sanitizeAIResponse(html) {
    const allowedTags = ['h1','h2','h3','h4','h5','h6','p','br','hr','ul','ol','li','blockquote','table','tr','td','th','strong','em','span','a'];
    const allowedAttrs = { 'a': ['href'], 'span': ['class'] };

    const temp = document.createElement('div');
    temp.innerHTML = html;

    // Remove script tags
    const scripts = temp.querySelectorAll('script');
    scripts.forEach(s => s.remove());

    // Remove event handlers
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      Array.from(el.attributes).forEach(attr => {
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      });
    });

    return temp.innerHTML;
  }

  getLocalAnalysis() {
    const cards = this.selectedCards.map(c => c.name);
    return LOCAL_INTERPRETATION_PROMPT(cards, this.question);
  }

  async getAIAnalysis() {
    const provider = AI_PROVIDERS[this.aiProvider];

    // If no client-side key, use secure serverless proxy on Vercel (/api/analyze)
    const hasClientKey = !!this.apiKey;
    const canUseProxy = ['openai', 'google', 'openrouter'].includes(this.aiProvider);
    if (provider.needsKey && !hasClientKey && !canUseProxy) {
      throw new Error('Vui lòng nhập API Key trong cài đặt');
    }

    const prompt = AI_PROMPT(
      this.selectedCards.map(c => c.name),
      this.question
    );

    if (provider.needsKey && !hasClientKey && canUseProxy) {
      const model = this.aiProvider === 'openrouter'
        ? (localStorage.getItem(STORAGE_KEYS.openRouterModel) || AI_PROVIDERS.openrouter.model)
        : undefined;

      const proxyResp = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: this.aiProvider, prompt, model })
      });

      const data = await proxyResp.json().catch(() => ({}));
      if (!proxyResp.ok) {
        throw new Error(data?.error?.message || 'Proxy API Error');
      }
      if (!data?.text) {
        throw new Error('Proxy trả về dữ liệu trống');
      }
      return data.text;
    }

    let response;

    if (this.aiProvider === 'openai') {
      response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: provider.headers(this.apiKey),
        body: JSON.stringify(provider.body(prompt))
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'OpenAI API Error');
      }

      const data = await response.json();
      return data.choices[0].message.content;

    } else if (this.aiProvider === 'openrouter') {
      const model = localStorage.getItem(STORAGE_KEYS.openRouterModel) || provider.model;
      response = await fetch(provider.endpoint, {
        method: 'POST',
        headers: provider.headers(this.apiKey),
        body: JSON.stringify(provider.body(model, prompt))
      });

      if (!response.ok) {
        let errText = '';
        try {
          const errJson = await response.json();
          errText = errJson?.error?.message || errJson?.message || JSON.stringify(errJson);
        } catch (_) {
          errText = await response.text();
        }
        throw new Error(errText || 'OpenRouter API Error');
      }

      const data = await response.json();
      const text = data?.choices?.[0]?.message?.content || '';
      if (!text) {
        console.warn('Empty/unknown OpenRouter response shape:', data);
        throw new Error('OpenRouter trả về dữ liệu trống (không có content). Vui lòng thử lại.');
      }
      return text;

    } else if (this.aiProvider === 'google') {
      const url = `${provider.endpoint}?key=${this.apiKey}`;

      response = await fetch(url, {
        method: 'POST',
        headers: provider.headers(this.apiKey),
        body: JSON.stringify(provider.body(prompt))
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Google Gemini API Error');
      }

      const data = await response.json();

      // Gemini responses can vary slightly; join any returned text parts safely.
      const parts = data?.candidates?.[0]?.content?.parts;
      const textFromParts = Array.isArray(parts)
        ? parts.map(p => p?.text).filter(Boolean).join('')
        : '';
      const text = textFromParts
        || data?.candidates?.[0]?.content?.text
        || data?.candidates?.[0]?.text
        || '';

      if (!text) {
        console.warn('Empty/unknown Gemini response shape:', data);
        throw new Error('Gemini trả về dữ liệu trống (không có text). Vui lòng thử lại.');
      }

      return text;
    }
  }

  // ========================================
  // OpenRouter Models
  // ========================================

  async ensureOpenRouterFreeModelsLoaded() {
    try {
      // Already loaded
      if (Array.isArray(this.openRouterFreeModels)) {
        this.populateOpenRouterModelSelect(this.openRouterFreeModels);
        return;
      }

      const aiModelSelect = document.getElementById('ai-model-select');
      if (!aiModelSelect || this.aiProvider !== 'openrouter') return;

      // Temporary loading option
      if (aiModelSelect.options.length <= 1) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = 'Đang tải model free...';
        aiModelSelect.appendChild(opt);
      }

      // Use serverless proxy so the browser does not need any key.
      const resp = await fetch('/api/openrouter-models');
      if (!resp.ok) {
        // Don't throw hard; just keep dropdown usable.
        console.warn('OpenRouter models fetch failed:', resp.status, await resp.text());
        return;
      }
      const data = await resp.json();
      const freeModels = Array.isArray(data?.models) ? data.models : [];

      this.openRouterFreeModels = freeModels;
      this.populateOpenRouterModelSelect(freeModels);
    } catch (err) {
      console.warn('OpenRouter models load error:', err);
    }
  }

  populateOpenRouterModelSelect(modelIds) {
    const aiModelSelect = document.getElementById('ai-model-select');
    if (!aiModelSelect) return;
    if (!Array.isArray(modelIds) || modelIds.length === 0) return;

    let current = localStorage.getItem(STORAGE_KEYS.openRouterModel) || '';

    // Preserve the first option (auto)
    aiModelSelect.innerHTML = '';
    const autoOpt = document.createElement('option');
    autoOpt.value = '';
    autoOpt.textContent = 'Model: (auto)';
    aiModelSelect.appendChild(autoOpt);

    modelIds.forEach(id => {
      const opt = document.createElement('option');
      opt.value = id;
      opt.textContent = id;
      aiModelSelect.appendChild(opt);
    });

    if (!current || !modelIds.includes(current)) {
      current = modelIds[0];
      localStorage.setItem(STORAGE_KEYS.openRouterModel, current);
    }

    aiModelSelect.value = current || '';

    const openRouterModelInput = document.getElementById('openrouter-model');
    if (openRouterModelInput && this.aiProvider === 'openrouter') {
      openRouterModelInput.value = current || AI_PROVIDERS.openrouter.model;
    }
  }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  window.tarotApp = new TarotApp();
});
