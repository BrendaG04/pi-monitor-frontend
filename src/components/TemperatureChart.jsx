import React from 'react';

import { 
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
  	Title,
  	Tooltip,
  	Legend
} from 'chart.js';

import { Line } from 'react-chartjs-2';
import './TemperatureChart.css';

// Register Chart.js components
ChartJS.register(
	CategoryScale,
  	LinearScale,
 	PointElement,
  	LineElement,
 	Title,
 	Tooltip,
  	Legend
);

function TemperatureChart({ temperatureHistory }) {
	const options = {
    		responsive: true,
    		maintainAspectRatio: false,
    		plugins: {
      			legend: {
        			display: false
      			},
      			title: {
        			display: true,
        			text: 'CPU Temperature History',
       	 			color: 'white',
        			font: {
          				size: 16
        			}
      			}
    		},
    		scales: {
			y: {
				beginAtZero: false,
				min: 30,
				max: 80,
        			ticks: {
					color: 'rgba(255, 255, 255, 0.8)',
					callback: function(value) {
          					return value + '°C';
          				}
        			},
        			grid: {
          				color: 'rgba(255, 255, 255, 0.1)'
        			}
      			},
      			x: {
        			ticks: {
          				color: 'rgba(255, 255, 255, 0.8)',
          				maxRotation: 0
        			},
        		grid: {
          			color: 'rgba(255, 255, 255, 0.1)'
        		}
      		}
    	}
  	};

	const data = {
		labels: temperatureHistory.map((_, index) => {
			if (index === temperatureHistory.length - 1) return 'Now';
			return `-${(temperatureHistory.length - index - 1) * 2}s`;
		}),
	datasets: [
		{
			label: 'Temperature',
			data: temperatureHistory,
			borderColor: 'rgb(255, 99, 132)',
			backgroundColor: 'rgba(255, 99, 132, 0.5)',
			tension: 0.4
		}
	]
	};

	return (
		<div className="temperature-chart-container">
			<div className="chart-wrapper">
				<Line options={options} data={data} />
			</div>
		</div>
	);
}

export default TemperatureChart;
