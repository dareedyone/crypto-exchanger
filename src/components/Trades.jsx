import React from "react";
import { useSelector } from "react-redux";
import { decorateFilledOrders } from "../helpers";
import Spinner from "./Spinner";

const Trades = () => {
	// redundant or unnecessary
	const filledOrdersLoaded = useSelector(
		(state) => state?.exchange?.filledOrders?.loaded
	);
	console.log("the filled loaded", filledOrdersLoaded);
	const filledOrders = useSelector((state) =>
		decorateFilledOrders(state?.exchange?.filledOrders?.data)
	);

	const showFilledOrders = () => (
		<tbody>
			{filledOrders.map((order) => (
				<tr className={`order-${order.id}`} key={order.id}>
					<td className="text-muted">{order.formattedTimestamp}</td>
					<td>{order.tokenAmount}</td>
					<td className={`text-${order.tokenPriceClass}`}>
						{order.tokenPrice}
					</td>
				</tr>
			))}
		</tbody>
	);

	return (
		<div className="vertical">
			<div className="card bg-dark text-white">
				<div className="card-header">Trades</div>
				<div className="card-body">
					<table className="table table-dark table-sm small">
						<thead>
							<tr>
								<th>Time</th>
								<th>DAPP</th>
								<th>DAPP/ETH</th>
							</tr>
						</thead>

						{filledOrdersLoaded ? showFilledOrders() : <Spinner type="table" />}
					</table>
				</div>
			</div>
		</div>
	);
};
export default Trades;
