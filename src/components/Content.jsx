import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllOrders, subscribeToEvents } from "../store/interactions";
import Balance from "./Balance";
import MyTransactions from "./MyTransactions";
import OrderBook from "./OrderBook";
import PriceChart from "./PriceChart";
import Trades from "./Trades";
import { exchangeSelector } from "../store/selectors";
import NewOrder from "./NewOrder";

const Content = () => {
	const dispatch = useDispatch();
	const exchange = useSelector(exchangeSelector);
	useEffect(() => {
		(async function loadBlockchain() {
			try {
				await loadAllOrders(dispatch, exchange);
				await subscribeToEvents(exchange, dispatch);
			} catch (error) {
				console.log("error message from context".error);
				// window.alert(error.message);
			}
		})();
	}, [dispatch, exchange]);
	return (
		<div className="content">
			<div className="vertical-split">
				<div className="card bg-dark text-white">
					<Balance />
				</div>
				<NewOrder />
			</div>
			<OrderBook />
			<div className="vertical-split">
				<PriceChart />
				<MyTransactions />
			</div>
			<Trades />
		</div>
	);
};
export default Content;
