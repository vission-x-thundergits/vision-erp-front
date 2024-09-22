import React from "react";
import "../Css/Dashboard.css";
import { Link } from "react-router-dom";

export default function DashboardCard({ takeme, count, heading, subHeading }) {
  return (
    <div className="dashcard">
      <Link to={takeme}>
        <h2 style={{ fontSize: "55px" }}>{count ? count : "0"}</h2>
        <p style={{ fontSize: "20px" }}>{heading}</p>
        <p style={{ fontSize: "15px" }}>{subHeading}</p>
      </Link>
    </div>
  );
}
