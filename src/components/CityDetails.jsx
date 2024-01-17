import React, { useState, useEffect } from "react";
import { NavLink, useParams /*useNavigate*/ } from "react-router-dom";
import NavBar from "./NavBar";
import WeatherDetails from "./WeatherDetails";
import LoadingSpinner from "./Loading";
import WeatherForecast from "./WeatherForecast";
import Alert from "react-bootstrap/Alert";
import { Button } from "react-bootstrap";
import getBackgroundImage from "./BackGroundImg";

const CityDetails = () => {
	const { city } = useParams();
	const [weatherData, setWeatherData] = useState(null);
	const [forecastData, setForecastData] = useState(null);
	const [error, setError] = useState(null);
	const [showForecast, setShowForecast] = useState(false);
	// eslint-disable-next-line no-unused-vars
	const [backgroundImage, setBackgroundImage] = useState("");
	// const navigate = useNavigate();

	useEffect(() => {
		const apiKey = "079445cf5d0c05445f2d4777eb42f149";
		const fetchWeather = async () => {
			try {
				setError(null);

				let response = await fetch(
					`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
				);
				if (!response.ok) throw response;

				const weather = await response.json();
				setWeatherData(weather);

				response = await fetch(
					`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
				);
				if (!response.ok) throw response;

				const forecast = await response.json();
				setForecastData(forecast.list);
			} catch (response) {
				if (response instanceof Response) {
					switch (response.status) {
						case 401:
							setError("Unauthorized access - API key is invalid.");
							break;
						case 404:
							setError("City not found. Please try another search.");
							break;
						case 500:
							setError("Server error. Please try again later.");
							break;
						default:
							setError("An unknown error occurred. Please try again.");
							break;
					}
				} else {
					setError("There was a problem reaching the server. Please check your internet connection and try again.");
				}
			}
		};

		fetchWeather();
	}, [city]);

	useEffect(() => {
		if (weatherData && weatherData.weather && weatherData.weather.length > 0) {
			const weatherMain = weatherData.weather[0].main;
			const backgroundImage = getBackgroundImage(weatherMain);
			document.body.style.backgroundImage = backgroundImage;
			setBackgroundImage(backgroundImage);
		}
	}, [weatherData]);

	return (
		<>
			<NavBar selectedCity={city} />
			<h1 className="text-center my-4 fw-bold title">Weather details for {city}</h1>
			{error && (
				<Alert variant="danger" onClose={() => setError(null)} dismissible>
					{error}
				</Alert>
			)}
			{weatherData && !error && (
				<>
					<WeatherDetails weatherData={weatherData} />
					<div className="d-flex justify-content-center align-items-center">
						<Button onClick={() => setShowForecast(!showForecast)} className="my-4 btn-dark">
							{showForecast ? "Nascondi Previsioni" : "Mostra Previsioni"}
						</Button>
						{/* </div>
					<div className="d-flex align-items-end justify-content-end"> */}
						<NavLink role="button" to="/" className="btn btn-dark my-3 mx-2">
							Home
						</NavLink>
					</div>
					{showForecast && <WeatherForecast forecastData={forecastData} />}
				</>
			)}
			{!weatherData && !error && <LoadingSpinner />}
		</>
	);
};

export default CityDetails;
