// import { Chart as ChartJS, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from '/node_modules/chart.js/dist/chart.umd.js';

// ChartJS.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// Chart Component
class Chart {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.chart = null;
        this.initializeChart();
    }

    initializeChart() {
        const data = {
            labels: ['Strength', 'Speed', 'Skill', 'Defense', 'Stamina', 'Power'],
            datasets: [{
                label: 'Attributes',
                data: [65, 59, 90, 81, 56, 55],
                fill: true,
                backgroundColor: 'rgba(98, 0, 234, 0.2)',
                borderColor: 'rgb(98, 0, 234)',
                pointBackgroundColor: 'rgb(98, 0, 234)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(98, 0, 234)'
            }]
        };

        const config = {
            type: 'radar',
            data: data,
            options: {
                elements: {
                    line: {
                        borderWidth: 3
                    }
                },
                scales: {
                    r: {
                        angleLines: {
                            display: true
                        },
                        suggestedMin: 0,
                        suggestedMax: 100
                    }
                }
            }
        };

        // Use the globally available Chart object from the CDN
        this.chart = new ChartJS(this.ctx, config);
    }

    updateData(newData) {
        this.chart.data.datasets[0].data = newData;
        this.chart.update();
    }
}

export default Chart; 