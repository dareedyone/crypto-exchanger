import moment from "moment";
export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000",
	DECIMALS = 10 ** 18;
const RED = "danger";
const GREEN = "success";
// Shortcut to avoid passing around web3 connection
export const ether = (wei) => {
	if (wei) return wei / DECIMALS;
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
