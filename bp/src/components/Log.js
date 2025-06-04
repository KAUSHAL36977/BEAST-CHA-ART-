import { gsap } from '/node_modules/gsap/index.js';

// Log Component
class Log {
    constructor() {
        this.logContainer = document.querySelector('.log-container');
        this.entries = [];
        this.initializeLog();
    }

    initializeLog() {
        // Load saved entries from localStorage
        const savedEntries = localStorage.getItem('logEntries');
        if (savedEntries) {
            this.entries = JSON.parse(savedEntries);
            this.entries.forEach(entry => this.addEntry(entry, false));
        }
    }

    addEntry(text, save = true) {
        const entry = {
            id: Date.now(),
            text,
            timestamp: new Date().toLocaleString()
        };

        if (save) {
            this.entries.push(entry);
            localStorage.setItem('logEntries', JSON.stringify(this.entries));
        }

        const entryElement = document.createElement('div');
        entryElement.className = 'log-entry';
        entryElement.innerHTML = `
            <div class="log-content">
                <span class="log-text">${text}</span>
                <span class="log-time">${entry.timestamp}</span>
            </div>
        `;

        this.logContainer.insertBefore(entryElement, this.logContainer.firstChild);
        
        // Animate entry
        gsap.from(entryElement, {
            opacity: 0,
            y: 20,
            duration: 0.5,
            ease: 'power2.out'
        });
    }

    clearLog() {
        this.entries = [];
        localStorage.removeItem('logEntries');
        this.logContainer.innerHTML = '';
    }
}

export default Log; 