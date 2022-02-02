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

	// Later usage in other components
	const cancelledOrdersLoaded = useSelector(
		(state) => state?.exchange?.cancelledOrders?.loaded
	);
	const cancelledOrders = useSelector(
		(state) => state?.exchange?.cancelledOrders?.data
	);

	const allOrdersLoaded = useSelector(
		(state) => state?.exchange?.allOrders?.loaded
	);
	const allOrders = useSelector((state) => state?.exchange?.allOrders?.data);
	const ordersBookLoaded = useSelector(
		({ exchange }) =>
			exchange?.allOrders?.loaded &&
			exchange?.filledOrders?.loaded &&
			exchange?.cancelledOrders?.loaded
	);
	const openOrders = useSelector(({ exchange }) => {
		const all = exchange?.allOrders || [];
		const filled = exchange?.filledOrders || [];
		const cancelled = exchange?.cancelledOrders || [];

		const open = all.filter((order) => {
			if (filled.some((filledOrder) => order.id === filledOrder.id))
				return false;
			if (cancelled.some((cancelledOrder) => order.id === cancelledOrder.id))
				return false;
			return true;
		});

		return open;
	});
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
