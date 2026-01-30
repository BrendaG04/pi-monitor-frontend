import React, {useState, useEffect } from 'react' ;
import { AuthProvider, useAuth } from './AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import StatCard from './components/StatCard';
import ConnectionStatus from './components/ConnectionStatus';
import TemperatureChart from './components/TemperatureChart';
import './App.css';


function Dashboard() {


	//state will hold the systemstats from backend
	const [ stats, setStats ] = useState(null);
	const [ loading, setLoading ] = useState(true);
	const [ error, setError ] = useState(null);
	const [ lastUpdate, setLastUpdate ] = useState(null);
	const [ isConnected, setIsConnected] = useState(true);
	const [ temperatureHistory, setTemperatureHistory ] = useState([]);

	const { token, logout, username} = useAuth();

	//fetch the  stats from backend
	const fetchStats = async () => {
		try {
			const apiUrl = process.env.NODE_ENV === 'development'
				? 'http://localhost:8080/stats'
				: '/api/stats';

			const response = await fetch(apiUrl, {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			});
			if (response.status === 401 || response.status === 403) {
				logout();
				return;
			}

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
		if (token) {
			fetchStats();
			const interval = setInterval(fetchStats, 2000);
			return () => clearInterval(interval);
		}
	}, [token]);

	const handleLogout = () => {
		logout();
	};


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
				<div className = "header-center">
					<h1>Brenda's Raspberry Pi Monitor v2.0</h1>
					<p>Real-time system statistics</p>
				</div>
				<div className = "header-right">
					<span className = "username"> {username} </span>
					<button onClick = {handleLogout} className = "logout-button">
						Logout
					</button>
				</div>
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
				)}

			</div>

			<footer>
				<p>Updates every 2 seconds * Powered by Spring Boot & React</p>
			</footer>
		</div>
	);
}

function App() {
	return (
		<AuthProvider>
			<AuthenticatedApp />
		</AuthProvider>
	);
}

function AuthenticatedApp() {
	const { isAuthenticated } = useAuth();
	const [showSignup, setShowSignup] = useState(false);

	if (!isAuthenticated) {
		if (showSignup) {
			return <Signup onSwitchToLogin= { () => setShowSignup(false)} />;
		}
		return <Login onSwitchToSignup={() => setShowSignup(true)} />;
	}
	return <Dashboard />
}


export default App;
