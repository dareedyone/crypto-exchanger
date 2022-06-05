import React from "react";
import Chart from "react-apexcharts";
import Spinner from "./Spinner";
import { chartOptions } from "./PriceChart.config";
import { priceChartSelector } from "../helpers";
import { useSelector } from "react-redux";

const priceSymbol = (lastPriceChange) => {
	let output;
	if (lastPriceChange === "+") {
		output = <span className="text-success">&#9650;</span>; // Green up tiangle
	} else {
		output = <span className="text-danger">&#9660;</span>; // Red down triangle
	}
	return output;
};

const showPriceChart = (priceChart) => {
	return (
		<div className="price-chart">
			<div className="price">
				<h4>
					DAPP/ETH &nbsp; {priceSymbol(priceChart.lastPriceChange)} &nbsp;{" "}
					{priceChart.lastPrice}
				</h4>
			</div>
			<Chart
				options={chartOptions}
				series={priceChart.series}
				type="candlestick"
				width="100%"
				height="100%"
			/>
		</div>
	);
};

const PriceChart = () => {
	const priceChartLoaded = useSelector(
		({ exchange }) => exchange?.filledOrders?.loaded
	);
	const priceChart = useSelector(({ exchange }) => {
		let orders = exchange?.filledOrders?.data;
		orders = priceChartSelector(orders);
		return orders;
	});
	console.log("prcice chart", priceChart);
	return (
		<div className="card bg-dark text-white">
			<div className="card-header">Price Chart</div>
			<div className="card-body">
				{priceChartLoaded ? showPriceChart(priceChart) : <Spinner />}
			</div>
		</div>
	);
};

export default PriceChart;
