import { maxBy, minBy, groupBy } from "lodash";
import moment from "moment";
export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000",
	DECIMALS = 10 ** 18;
const RED = "danger";
const GREEN = "success";
// Shortcut to avoid passing around web3 connection
export const ether = (wei) => {
	if (wei) return wei / DECIMALS;
	return 0;
};
// Tokens and ether have same decimal resolution
export const token = ether;

const decorateOrder = (order) => {
	let etherAmount, tokenAmount;
	if (order.tokenGive === ETHER_ADDRESS) {
		etherAmount = order.amountGive;
		tokenAmount = order.amountGet;
	} else {
		etherAmount = order.amountGet;
		tokenAmount = order.amountGive;
	}
	// calculate token price to 5 decimal places
	const precision = 100000;
	let tokenPrice = etherAmount / tokenAmount;
	tokenPrice = Math.round(tokenPrice * precision) / precision;

	return {
		...order,
		etherAmount: ether(etherAmount),
		tokenAmount: token(tokenAmount),
		tokenPrice,
		formattedTimestamp: moment.unix(order.timestamp).format("h:m:ss a M/D"),
	};
};

export const decorateFilledOrders = (orders = []) => {
	// if (!orders) return null;
	// sort orders by ascending dates for price comparison in decorateFilledOrder(
	// refactor later
	orders = orders?.sort((a, b) => a - b);

	// Track previous order to compare history
	let previousOrder = orders[0];

	return orders
		?.map((order) => {
			order = decorateOrder(order);
			order = decorateFilledOrder(order, previousOrder);
			previousOrder = order;
			return order;
		})
		?.sort((a, b) => b.timestamp - a.timestamp);
};
const decorateFilledOrder = (order, previousOrder) => {
	return {
		...order,
		tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder),
	};
};

const tokenPriceClass = (tokenPrice, orderId, previousOrder) => {
	// Show green price if only one order exists
	if (previousOrder.id === orderId) return GREEN;
	// show green price if order price higher than previous order
	if (previousOrder.tokenPrice <= tokenPrice) return GREEN;
	// show red price if order price lower than previous order
	else return RED;
};
const decorateOrderBookOrder = (order) => {
	const orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell";
	return {
		...order,
		orderType,
		orderTypeClass: orderType === "buy" ? GREEN : RED,
		orderFillAction: orderType === "buy" ? "sell" : "buy",
	};
};
export const decorateOrderBookOrders = (orders) => {
	return orders.map((order) => {
		order = decorateOrder(order);
		order = decorateOrderBookOrder(order);
		return order;
	});
};

export const openOrdersSelector = ({ exchange }) => {
	const all = exchange?.allOrders || [];
	const filled = exchange?.filledOrders || [];
	const cancelled = exchange?.cancelledOrders || [];

	const open = all?.filter((order) => {
		if (filled.some((filledOrder) => order.id === filledOrder.id)) return false;
		if (cancelled.some((cancelledOrder) => order.id === cancelledOrder.id))
			return false;
		return true;
	});

	return decorateOrderBookOrders(open);
};

export const decorateMyFilledOrders = (orders, account) => {
	return orders?.map((order) => {
		order = decorateOrder(order);
		order = decorateMyFilledOrder(order, account);
		return order;
	});
};
const decorateMyFilledOrder = (order, account) => {
	const myOrder = order.user === account;
	let orderType;
	if (myOrder) {
		orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell";
	} else {
		orderType = order.tokenGive === ETHER_ADDRESS ? "sell" : "buy";
	}
	return {
		...order,
		orderType,
		orderTypeClass: orderType === "buy" ? GREEN : RED,
		orderSign: orderType === "buy" ? "+" : "-",
	};
};

export const decorateMyOpenOrders = (orders) => {
	return orders?.map((order) => {
		order = decorateOrder(order);
		order = decorateMyOpenOrder(order);
		return order;
	});
};
const decorateMyOpenOrder = (order) => {
	let orderType = order.tokenGive === ETHER_ADDRESS ? "buy" : "sell";

	return {
		...order,
		orderType,
		orderTypeClass: orderType === "buy" ? GREEN : RED,
	};
};

export const getOpenOrdersFromExchange = (exchange) => {
	const all = exchange?.allOrders?.data;
	const filled = exchange?.filledOrders?.data;
	const cancelled = exchange?.cancelledOrders?.data;

	const filledAndCancelled = filled?.concat(cancelled);
	// get open orders
	return (
		all?.filter(
			(order) => !filledAndCancelled.some((o) => o.id === order.id)
		) || []
	);
};
const buildGraphData = (orders) => {
	// Group the orders by hour for the graph
	orders = groupBy(orders, (o) =>
		moment.unix(o.timestamp).startOf("hour").format()
	);
	// Get each hour where data exists
	const hours = Object.keys(orders);
	// Build the graph series
	const graphData = hours.map((hour) => {
		// Fetch all the orders from current hour
		const group = orders[hour];
		// Calculate price values - open, high, low, close
		const open = group[0]; // first order
		const high = maxBy(group, "tokenPrice"); // high price
		const low = minBy(group, "tokenPrice"); // low price
		const close = group[group.length - 1]; // last order

		return {
			x: new Date(hour),
			y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice],
		};
	});

	return graphData;
};
export const priceChartSelector = (orders = []) => {
	// Sort orders by date ascending to compare history
	orders = orders.sort((a, b) => a.timestamp - b.timestamp);
	// Decorate orders - add display attributes
	orders = orders.map((o) => decorateOrder(o));
	// Get last 2 order for final price & price change
	let secondLastOrder, lastOrder;
	[secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length);
	// get last order price
	const lastPrice = lastOrder?.tokenPrice || 0;
	// get second last order price
	const secondLastPrice = secondLastOrder?.tokenPrice || 0;

	return {
		lastPrice,
		lastPriceChange: lastPrice >= secondLastPrice ? "+" : "-",
		series: [
			{
				data: buildGraphData(orders),
			},
		],
	};
};
export const formatBalance = (balance) => {
	const precision = 100; // 2 decimal places
	balance = ether(balance);
	balance = Math.round(balance * precision) / precision; // use 2 decimal places
	return balance;
};
