import React from "react";
import "../../../css/dashboards/others/OthersDashboard.css";


const OthersDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user")) || { name: "User" };

  return (
    <div className="others-dashboard">
      <h1>🌐 Welcome, {user.name}</h1>
      <p>This is your General Dashboard.</p>
    </div>
  );
};

export default OthersDashboard;
