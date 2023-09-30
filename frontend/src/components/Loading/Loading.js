import React from "react";
import "./Loading.css";

const Loading = () => (
  <>
    <div className="loading-box">
      <div className="spin-wrapper">
        <div className="spinner"></div>
      </div>
      <p className="loading">Loading...</p>
    </div>
  </>
);

export default Loading;
