import React, {useState, useEffect } from 'react' ;
import StatCard from './components/StatCard';
import ConnectionStatus from './components/ConnectionStatus';
import TemperatureChart from './components/TemperatureChart';
import './App.css';

function App() {

	//state will hold the systemstats from backend
	const [ stats, setStats ] = useState(null);
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(null);
	const [ lastUpdate, setLastUpdate ] = useState(null);
	const [ isConnected, setIsConnected] = useState(true);
	const [ temperatureHistory, setTemperatureHistory ] = useState([]);

	//fetch the  stats from backend
	const fetchStats = async () => {
		try {
			const response = await fetch('http://localhost:8080/stats');
			if (!response.ok) {
				throw new Error('Failed to fetch system stats');
			}
			const data = await response.json();
			setStats(data);
			setError(null);
			setIsConnected(true);
			setLastUpdate(new Date().toLocaleTimeString());

			setTemperatureHistory(prev => {
				const newHistory = [...prev, data.cpuTemperature];
				if (newHistory.length > 30) {
					return newHistory.slice(-30);
				}
				return newHistory;
			});
		} catch (err) {
			setError(err.message);
			setIsConnected(false);
		} finally {
			setLoading(false);
		}
	};

	//runs when components mount
	useEffect(() => {
		fetchStats();

		const interval = setInterval(fetchStats, 2000);

		return () => clearInterval(interval);
	}, []);

	if (loading) {
		return ( 
			<div className = 'App'>
				<div className = 'loading'>
					<h1>Loading Pi Stats...</h1>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className = 'App'>
				<div className = 'error'>
					<h1>Error: {error}</h1>
					<p>Make sure your backend is RUNNING on PORT 8080</p>
					<button onClick= {() => window.location.reload()}>Retry</button>
				</div>
			</div>
		);
	}




	return (
		<div className = 'App'>
			<ConnectionStatus isConnected={isConnected} lastUpdate={lastUpdate} />

			<header>
				<h1>Brenda's Raspberry Pi Monitor</h1>
				<p>Real-time system statistics</p>
			</header>

			<div className = "stats-container">
				{/* CPU Temp Card */}
					<StatCard
						icon = "🌡️"
						title = "CPU Temperature"
						value = {`${stats.cpuTemperature}°C`}
					/>

				{/* Memory Card */}
					<StatCard
						icon = "🐏"
						title = "Memory"
						value = {`${stats.usedMemoryMB} / ${stats.totalMemoryMB} MB`}
						detail = {`${stats.memoryUsagePercent}% used`}
						percentage = {stats.memoryUsagePercent}
						showProgressBar = {true}
					/>

				{/* Disk Card */}
					<StatCard
						icon = "💿"
						title= "Disk Space"
						value = {`${stats.usedDiskGB} / ${stats.totalDiskGB} GB`}
						detail = {`${stats.diskUsagePercent}% used`}
						percentage = {stats.diskUsagePercent}
						showProgressBar = {true}
					/>

				{/* Uptime Card */}
					<StatCard
						icon = "⏰"
						title = "Uptime"
						value = {stats.uptime}
					/>

				{/* Temperature History Chart*/}
				{temperatureHistory.length > 0 && (
					<TemperatureChart temperatureHistory = {temperatureHistory} />
				)};

			</div>

			<footer>
				<p>Updates every 2 seconds * Powered by Spring Boot & React</p>
			</footer>
		</div>
	);
}

export default App;
