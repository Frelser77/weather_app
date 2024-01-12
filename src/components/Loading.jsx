import React from "react";
import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
	return (
		<div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
			<Spinner animation="border" role="status"></Spinner>
		</div>
	);
};

export default LoadingSpinner;
