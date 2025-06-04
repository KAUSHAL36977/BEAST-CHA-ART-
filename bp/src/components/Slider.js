// Slider Component
class Slider {
    constructor(id, label, color) {
        this.id = id;
        this.label = label;
        this.color = color;
        this.value = 50;
        this.initializeSlider();
    }

    initializeSlider() {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';
        sliderContainer.innerHTML = `
            <label for="${this.id}">${this.label}</label>
            <div class="slider-wrapper">
                <input type="range" id="${this.id}" min="0" max="100" value="${this.value}" 
                    style="--slider-color: ${this.color}">
                <span class="slider-value">${this.value}</span>
            </div>
        `;

        document.querySelector('.sliders-container').appendChild(sliderContainer);
        this.setupEventListeners();
    }

    setupEventListeners() {
        const slider = document.getElementById(this.id);
        const valueDisplay = slider.parentElement.querySelector('.slider-value');

        slider.addEventListener('input', (e) => {
            this.value = parseInt(e.target.value);
            valueDisplay.textContent = this.value;
            this.updateSliderStyle();
            this.onValueChange(this.value);
        });
    }

    updateSliderStyle() {
        const slider = document.getElementById(this.id);
        const percentage = (this.value - slider.min) / (slider.max - slider.min) * 100;
        slider.style.background = `linear-gradient(to right, ${this.color} 0%, ${this.color} ${percentage}%, #2a2a2a ${percentage}%, #2a2a2a 100%)`;
    }

    onValueChange(value) {
        // This will be overridden by the main application
        console.log(`${this.label} value changed to: ${value}`);
    }
}

export default Slider; 