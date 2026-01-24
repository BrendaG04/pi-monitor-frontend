import React from 'react';
import './StatCard.css';

function StatCard({ icon, title, value, detail, percentage, showProgressBar }) {
	 return (
		 <div className="stat-card">
			 <h2>{icon} {title}</h2>
			 <div className="stat-value">{value}</div>
      
			 {detail && (
				 <div className="stat-detail">{detail}</div>
			 )}
      
		 {showProgressBar && percentage !== undefined && (
			<div className="progress-bar">
				<div 
					className="progress-fill" 
					style={{ width: `${percentage}%` }}
				></div>
			</div>
		)}
		</div>
	);
}

export default StatCard;
