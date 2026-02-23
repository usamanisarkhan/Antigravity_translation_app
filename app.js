/**
 * Sointu Real-time Translator
 * Core logic for speech-to-text and translation
 */

class SointuTranslator {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.initElements();
        this.setupRecognition();
        this.setupEventListeners();
    }

    initElements() {
        this.startBtn = document.getElementById('start-btn');
        this.stopBtn = document.getElementById('stop-btn');
        this.toggleBtn = document.getElementById('toggle-btn');
        this.modeDisplay = document.getElementById('mode-display');
        this.originalText = document.getElementById('original-text');
        this.translatedText = document.getElementById('translated-text');
        this.statusIndicator = document.getElementById('status-indicator');
        this.statusText = document.getElementById('status-text');
        this.detectedLangTag = document.getElementById('detected-lang');
        this.targetLangTag = document.getElementById('target-lang');

        // Initial state
        this.currentMode = 'en-fi'; // 'en-fi' or 'fi-en'
    }

    setupRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            this.statusText.innerText = "Speech Recognition not supported in this browser.";
            this.startBtn.disabled = true;
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.updateRecognitionLang();

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUIStatus(true);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUIStatus(false);
            if (this.shouldRestart) {
                this.recognition.start();
            }
        };

        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                    this.processTranslation(finalTranscript);
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            this.originalText.innerText = finalTranscript || interimTranscript || "Listening...";
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.statusText.innerText = `Error: ${event.error}`;
            this.updateUIStatus(false);
        };
    }

    setupEventListeners() {
        this.startBtn.addEventListener('click', () => {
            this.shouldRestart = true;
            this.recognition.start();
        });

        this.stopBtn.addEventListener('click', () => {
            this.shouldRestart = false;
            this.recognition.stop();
        });

        this.toggleBtn.addEventListener('click', () => {
            this.toggleMode();
        });
    }

    toggleMode() {
        this.currentMode = this.currentMode === 'en-fi' ? 'fi-en' : 'en-fi';
        this.modeDisplay.innerText = this.currentMode === 'en-fi' ? 'EN ➔ FI' : 'FI ➔ EN';

        this.updateRecognitionLang();

        // If currently listening, restart to apply new language
        if (this.isListening) {
            this.shouldRestart = true;
            this.recognition.stop();
        }
    }

    updateRecognitionLang() {
        this.recognition.lang = this.currentMode === 'en-fi' ? 'en-US' : 'fi-FI';
        this.detectedLangTag.innerText = this.currentMode === 'en-fi' ? "Mode: English" : "Mode: Finnish";
        this.targetLangTag.innerText = this.currentMode === 'en-fi' ? "To: Finnish" : "To: English";
    }

    updateUIStatus(active) {
        if (active) {
            this.statusIndicator.classList.add('active');
            this.statusText.innerText = "Listening...";
            this.startBtn.disabled = true;
            this.stopBtn.disabled = false;
        } else {
            this.statusIndicator.classList.remove('active');
            this.statusText.innerText = "Ready to Translate";
            this.startBtn.disabled = false;
            this.stopBtn.disabled = true;
        }
    }

    /**
     * Logic to handle the translation.
     * Since we need "Zero Latency", we simulate or use a fast-responding mock/API approach.
     * For this demo, we'll use a basic pattern or a free public API logic.
     */
    async processTranslation(text) {
        if (!text.trim()) return;

        // Detect if text is Finnish or English (Simplified heuristic for demo)
        const isFinnish = this.detectFinnish(text);
        const sourceLang = isFinnish ? 'fi' : 'en';
        const targetLang = isFinnish ? 'en' : 'fi';

        this.detectedLangTag.innerText = isFinnish ? "Detected: Finnish" : "Detected: English";
        this.targetLangTag.innerText = isFinnish ? "To: English" : "To: Finnish";

        try {
            const translation = await this.translateText(text, sourceLang, targetLang);
            this.translatedText.innerText = translation;
        } catch (error) {
            console.error("Translation failed", error);
            this.translatedText.innerText = "Translation error...";
        }
    }

    detectFinnish(text) {
        // High-speed heuristic: look for unique Finnish character patterns or words
        const finnishCommon = ['on', 'ja', 'ei', 'en', 'ole', 'että', 'se', 'hän', 'minä', 'sinä', 'mutta', 'kun'];
        const words = text.toLowerCase().split(/\s+/);
        const matches = words.filter(w => finnishCommon.includes(w)).length;

        // Also check for specific vowels/suffixes
        const fiChars = /[ääööäö]/gi;
        const hasFiChars = fiChars.test(text);

        return matches > 0 || hasFiChars;
    }

    async translateText(text, from, to) {
        // Using MyMemory API as a fast, free fallback for local client-side demonstration
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.responseData.translatedText;
        } catch (e) {
            return "Translation service unavailable";
        }
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
    window.sointu = new SointuTranslator();
});
