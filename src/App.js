import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData } from './util';
import './App.css';

function App() {
	const [ countries, setCountries ] = useState([]);
	const [ country, setCountry ] = useState('worldwide');
	const [ countryInfo, setCountryInfo ] = useState({});
	const [ tableData, setTableData ] = useState([]);

	useEffect(() => {
		const loadCountries = async () => {
			await fetch('https://disease.sh/v3/covid-19/all').then((response) => response.json()).then((data) => {
				setCountryInfo(data);
			});
		};

		loadCountries();
	}, []);

	useEffect(() => {
		// async function => send a request, wait for it, do something with it

		const getCountries = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries').then((response) => response.json()).then((data) => {
				const countries = data.map((country) => ({
					name: country.country,
					value: country.countryInfo.iso2
				}));

				const sortedData = sortData(data);
				setTableData(sortedData);
				setCountries(countries);
			});
		};

		getCountries();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;

		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url).then((response) => response.json()).then((data) => {
			setCountry(countryCode);
			// all of the data..
			// from the country response
			setCountryInfo(data);
		});
	};
	return (
		<div className="app">
			<div className="app__left">
				{/* Header */}
				{/* Title + Selecte input dropdown */}
				<div className="app__header">
					<h1>Covid-19 Tracker</h1>
					<FormControl className="app-dropdown">
						<Select variant="outlined" onChange={onCountryChange} value={country}>
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country) => <MenuItem value={country.value}>{country.name}</MenuItem>)}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					<InfoBox title="CoronaVirus cases" cases={countryInfo.todayCases} total={countryInfo.cases} />
					<InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
					<InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
				</div>
				{/* Map */}
				<Map />
			</div>

			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>
					{/* table */}
					<Table countries={tableData} />
					<h3>Worldwide new cases</h3>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
