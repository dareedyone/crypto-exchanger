import React from "react";
import { Tabs, Tab } from "react-bootstrap";
import Spinner from "./Spinner";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrder } from "../store/interactions";
import {
	accountSelector,
	orderBookLoadedSelector,
	exchangeSelector,
	myFilledOrderLoadedSelector,
	myFilledOrderSelector,
	myOpenOrdersSelector,
	orderCancellingSelector,
} from "../store/selectors";

const MyFilledOrders = ({ myFilledOrders }) => {
	return (
		<tbody>
			{myFilledOrders.map((order) => {
				return (
					<tr key={order.id}>
						<td className="text-muted">{order.formattedTimestamp}</td>
						<td className={`text-${order.orderTypeClass}`}>
							{order.orderSign}
							{order.tokenAmount}
						</td>
						<td className={`text-${order.orderTypeClass}`}>
							{order.tokenPrice}
						</td>
					</tr>
				);
			})}
		</tbody>
	);
};

const MyOpenOrders = ({ myOpenOrders = [], dispatch, exchange, account }) => {
	return (
		<tbody>
			{myOpenOrders.map((order) => {
				return (
					<tr key={order.id}>
						<td className={`text-${order.orderTypeClass}`}>
							{order.tokenAmount}
						</td>
						<td className={`text-${order.orderTypeClass}`}>
							{order.tokenPrice}
						</td>
						<td
							className="text-muted cancel-order"
							onClick={(e) => {
								cancelOrder(dispatch, exchange, order, account);
							}}
						>
							X
						</td>
					</tr>
				);
			})}
		</tbody>
	);
};

const MyTransactions = () => {
	const dispatch = useDispatch();
	const orderBookLoaded = useSelector(orderBookLoadedSelector);
	const account = useSelector(accountSelector);
	const exchange = useSelector(exchangeSelector);
	const myFilledOrdersLoaded = useSelector(myFilledOrderLoadedSelector);
	const myFilledOrders = useSelector(myFilledOrderSelector(account));
	const myOpenOrders = useSelector(myOpenOrdersSelector(account));
	const orderCancelling = useSelector(orderCancellingSelector);
	const showMyOpenOrders = orderBookLoaded && !orderCancelling;
	return (
		<div className="card bg-dark text-white">
			<div className="card-header">My Transactions</div>
			<div className="card-body">
				<Tabs defaultActiveKey="trades" className="bg-dark text-white">
					<Tab eventKey="trades" title="Trades" className="bg-dark">
						<table className="table table-dark table-sm small">
							<thead>
								<tr>
									<th>Time</th>
									<th>DAPP</th>
									<th>DAPP/ETH</th>
								</tr>
							</thead>
							{myFilledOrdersLoaded ? (
								<MyFilledOrders myFilledOrders={myFilledOrders} />
							) : (
								<Spinner type="table" />
							)}
						</table>
					</Tab>
					<Tab eventKey="orders" title="Orders">
						<table className="table table-dark table-sm small">
							<thead>
								<tr>
									<th>Amount</th>
									<th>DAPP/ETH</th>
									<th>Cancel</th>
								</tr>
							</thead>
							{showMyOpenOrders ? (
								<MyOpenOrders
									myOpenOrders={myOpenOrders}
									account={account}
									exchange={exchange}
									dispatch={dispatch}
								/>
							) : (
								<Spinner type="table" />
							)}
						</table>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
};

export default MyTransactions;
