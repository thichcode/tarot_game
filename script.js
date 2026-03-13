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

class TarotApp {
  constructor() {
    this.currentScreen = 'welcome';
    this.question = '';
    this.selectedCards = [];
    this.deck = [];
    this.selectedPositions = [];
    
    this.init();
  }

  init() {
    this.loadSettings();
    this.bindEvents();
    this.updateSettingsUI();
  }

  // ========================================
  // Navigation
  // ========================================
  
  showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    this.currentScreen = screenId;
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
    
    // Close modal on outside click
    document.getElementById('settings-modal').addEventListener('click', (e) => {
      if (e.target.id === 'settings-modal') this.closeSettings();
    });
  }

  // ========================================
  // Settings Management
  // ========================================
  
  async loadSettings() {
    // Thử đọc từ API endpoint trước
    try {
      const response = await fetch('/api/config');
      if (response.ok) {
        const config = await response.json();
        window.ENV_OPENAI_API_KEY = config.openaiApiKey || '';
        window.ENV_GEMINI_API_KEY = config.geminiApiKey || '';
        console.log('✅ Loaded config from API');
      }
    } catch (e) {
      console.log('⚠️ Config API not available, trying env vars');
    }
    
    // Fallback: đọc từ inline vars
    const envOpenAIKey = window.ENV_OPENAI_API_KEY || '';
    const envGoogleKey = window.ENV_GEMINI_API_KEY || '';
    
    // Debug
    console.log('🔑 Available Env Keys:', {
      ENV_OPENAI: !!window.ENV_OPENAI_API_KEY,
      ENV_GEMINI: !!window.ENV_GEMINI_API_KEY,
      savedProvider: localStorage.getItem(STORAGE_KEYS.provider),
      hasApiKey: !!localStorage.getItem(STORAGE_KEYS.apiKey)
    });
    
    // Nếu có biến môi trường thì dùng, không thì dùng localStorage
    const savedProvider = localStorage.getItem(STORAGE_KEYS.provider) || 'local';
    const savedApiKey = localStorage.getItem(STORAGE_KEYS.apiKey) || '';
    
    // Ưu tiên dùng key từ env nếu có
    if (envGoogleKey) {
      this.aiProvider = 'google';
      this.apiKey = envGoogleKey;
      console.log('✅ Using Gemini from env');
    } else if (envOpenAIKey) {
      this.aiProvider = 'openai';
      this.apiKey = envOpenAIKey;
      console.log('✅ Using OpenAI from env');
    } else if (savedProvider !== 'local' && savedApiKey) {
      this.aiProvider = savedProvider;
      this.apiKey = savedApiKey;
    } else {
      this.aiProvider = savedProvider;
      this.apiKey = savedApiKey;
    }
    
    console.log('📌 Final provider:', this.aiProvider, '| Has API key:', !!this.apiKey);
  }

  updateSettingsUI() {
    const providerSelect = document.getElementById('ai-provider');
    const apiKeyGroup = document.getElementById('api-key-group');
    const currentProvider = document.getElementById('current-provider');
    const clearBtn = document.getElementById('clear-api-key');
    const apiKeyInput = document.getElementById('api-key');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    providerSelect.value = this.aiProvider;
    
    const provider = AI_PROVIDERS[this.aiProvider];
    if (provider && provider.needsKey) {
      apiKeyGroup.classList.remove('hidden');
    } else {
      apiKeyGroup.classList.add('hidden');
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
      if (this.aiProvider === 'openai') {
        analyzeBtn.textContent = '🤖 Phân Tích với OpenAI';
      } else if (this.aiProvider === 'google') {
        analyzeBtn.textContent = '🌐 Phân Tích với Gemini Flash';
      } else if (this.aiProvider === 'googlePro') {
        analyzeBtn.textContent = '🌟 Phân Tích với Gemini Pro 2.0';
      } else if (this.aiProvider === 'google15Pro') {
        analyzeBtn.textContent = '✨ Phân Tích với Gemini 1.5 Pro';
      } else if (this.aiProvider === 'google25Flash') {
        analyzeBtn.textContent = '🎯 Phân Tích với Gemini 2.5 Flash';
      } else {
        analyzeBtn.textContent = '🤖 Phân Tích AI (Local)';
      }
    }
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
    
    localStorage.setItem(STORAGE_KEYS.provider, provider);
    
    if (provider !== 'local' && apiKeyInput) {
      localStorage.setItem(STORAGE_KEYS.apiKey, apiKeyInput);
    }
    
    this.aiProvider = provider;
    this.apiKey = apiKeyInput || localStorage.getItem(STORAGE_KEYS.apiKey) || '';
    
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
  }

  newReading() {
    this.question = '';
    this.selectedCards = [];
    this.selectedPositions = [];
    document.getElementById('question-input').value = '';
    this.showScreen('welcome-screen');
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
                       this.aiProvider === 'googlePro' ? 'Google Gemini Pro 2.0' :
                       this.aiProvider === 'google15Pro' ? 'Google Gemini 1.5 Pro' :
                       this.aiProvider === 'google25Flash' ? 'Google Gemini 2.5 Flash' : 'Local';
    const aiEmoji = this.aiProvider === 'openai' ? '🤖' : 
                    this.aiProvider === 'google' ? '🌐' :
                    this.aiProvider === 'googlePro' ? '🌟' :
                    this.aiProvider === 'google15Pro' ? '✨' :
                    this.aiProvider === 'google25Flash' ? '🎯' : '🔮';
    
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = `${aiEmoji} Đang phân tích với ${aiModeText}...`;
    loadingEl.classList.remove('hidden');
    resultEl.classList.add('hidden');
    
    try {
      let result;
      
      if (this.aiProvider === 'local') {
        result = this.getLocalAnalysis();
      } else if (['openai', 'google', 'googlePro', 'google15Pro', 'google25Flash'].includes(this.aiProvider)) {
        result = await this.getAIAnalysis();
      } else {
        result = this.getLocalAnalysis();
      }
      
      // Add header showing which AI was used
      const headerHtml = `<div class="ai-mode-header">${aiEmoji} Phân tích bằng ${aiModeText}</div>`;
      result = headerHtml + result;
      
      // Security: Only allow safe HTML tags from AI
      resultEl.innerHTML = this.sanitizeAIResponse(result);
      resultEl.classList.remove('hidden');
    } catch (error) {
      console.error('AI Analysis Error:', error);
      // Security: Sanitize error message
      const errorHtml = `
        <div class="ai-mode-header">⚠️ Lỗi kết nối AI</div>
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
    analyzeBtn.textContent = `🔄 Phân Tích Lại với ${aiModeText}`;
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
    
    if (!provider.needsKey || !this.apiKey) {
      throw new Error('Vui lòng nhập API Key trong cài đặt');
    }
    
    const prompt = AI_PROMPT(
      this.selectedCards.map(c => c.name),
      this.question
    );
    
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
      return data.candidates[0].content.parts[0].text;
    }
  }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  window.tarotApp = new TarotApp();
});
