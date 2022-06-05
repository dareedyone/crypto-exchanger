import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Spinner from "./Spinner";
import { decorateOrderBookOrders, getOpenOrdersFromExchange } from "../helpers";
import { fillOrder } from "../store/interactions";

// import { fillOrder } from "../store/interactions";
import {
	orderBookLoadedSelector,
	orderFillingSelector,
} from "../store/selectors";

const Order = ({ order, fillOrder }) => {
	return (
		<OverlayTrigger
			key={order.id}
			placement="auto"
			overlay={
				<Tooltip id={order.id}>
					{`Click here to ${order.orderFillAction}`}
				</Tooltip>
			}
		>
			<tr key={order.id} className="order-book-order" onClick={fillOrder}>
				<td>{order.tokenAmount}</td>
				<td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
				<td>{order.etherAmount}</td>
			</tr>
		</OverlayTrigger>
	);
};

const DisplayOrderBook = ({ orderBook }) => {
	const dispatch = useDispatch();
	const account = useSelector(({ web3 }) => {
		return web3?.account;
	});
	const exchange = useSelector(({ exchange }) => {
		return exchange.contract;
	});

	return (
		<tbody>
			{orderBook?.sellOrders?.map((order) => (
				<Order
					fillOrder={() => fillOrder(dispatch, exchange, order, account)}
					order={order}
					key={order.id}
				/>
			))}
			<tr>
				<th>DAPP</th>
				<th>DAPP/ETH</th>
				<th>ETH</th>
			</tr>
			{orderBook?.buyOrders?.map((order) => (
				<Order
					fillOrder={() => fillOrder(dispatch, exchange, order, account)}
					order={order}
					key={order.id}
				/>
			))}
		</tbody>
	);
};

const OrderBook = () => {
	const orderBookLoaded = useSelector(orderBookLoadedSelector);
	const orderFilling = useSelector(orderFillingSelector);

	const orderBook = useSelector(({ exchange }) => {
		let orders;
		orders = getOpenOrdersFromExchange(exchange);
		// decorate orders
		orders = decorateOrderBookOrders(orders);

		// group orders
		orders = orders.reduce(
			(acc, curr) => ({
				...acc,
				[curr.orderType]: acc[curr.orderType]
					? [...acc[curr.orderType], curr]
					: [curr],
			}),
			{}
		);
		console.log("grouped", orders);
		// sort orders by token price
		orders = {
			...orders,
			buyOrders: orders?.buy?.sort((a, b) => b.tokenPrice - a.tokenPrice),
			sellOrders: orders?.sell?.sort((a, b) => b.tokenPrice - a.tokenPrice),
		};

		return orders;
	});
	const showOrderBook = orderBookLoaded && !orderFilling;

	return (
		<div className="vertical">
			<div className="card bg-dark text-white">
				<div className="card-header">Order Book</div>
				<div className="card-body order-book">
					<table className="table table-dark table-sm small">
						{showOrderBook ? (
							<DisplayOrderBook orderBook={orderBook} />
						) : (
							<Spinner type="table" />
						)}
					</table>
				</div>
			</div>
		</div>
	);
};

export default OrderBook;
