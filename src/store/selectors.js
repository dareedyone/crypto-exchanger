import {
	decorateMyFilledOrders,
	decorateMyOpenOrders,
	formatBalance,
	getOpenOrdersFromExchange,
} from "../helpers";

export const accountSelector = ({ web3 }) => web3?.account;
export const exchangeSelector = ({ exchange }) => {
	return exchange.contract;
};
export const tokenSelector = ({ token }) => token?.contract;
export const web3Selector = ({ web3 }) => web3?.connection;
export const orderBookLoadedSelector = ({ exchange }) =>
	exchange?.allOrders?.loaded &&
	exchange?.filledOrders?.loaded &&
	exchange?.cancelledOrders?.loaded;

export const myFilledOrderLoadedSelector = ({ exchange }) =>
	exchange?.filledOrders?.loaded;

export const myFilledOrderSelector = (account) => {
	const selector = ({ exchange }) => {
		let orders;
		orders = exchange?.filledOrders?.data;
		orders = orders?.filter(
			(o) => o.user === account || o.userFill === account
		);

		orders = orders?.sort((a, b) => a.timestamp - b.timestamp);
		orders = decorateMyFilledOrders(orders, account);
		return orders;
	};
	return selector;
};

export const myOpenOrdersSelector = (account) => {
	const selector = ({ exchange }) => {
		let orders;
		orders = getOpenOrdersFromExchange(exchange);

		// filter orders created by current account
		orders = orders?.filter((o) => o.user === account);

		// decorate orders -- add display attributes
		orders = decorateMyOpenOrders(orders);
		// sort orders date by asc
		orders = orders?.sort((a, b) => a.timestamp - b.timestamp);
		return orders;
	};
	return selector;
};
export const orderCancellingSelector = ({ exchange }) =>
	exchange?.orderCancelling;

export const orderFillingSelector = ({ exchange }) => exchange?.orderFilling;

// BALANCES
export const balancesLoadingSelector = ({ exchange }) =>
	exchange?.balancesLoading;
export const etherBalanceSelector = ({ web3 }) => formatBalance(web3?.balance);
export const tokenBalanceSelector = ({ token }) =>
	formatBalance(token?.balance);
export const exchangeEtherBalanceSelector = ({ exchange }) =>
	formatBalance(exchange?.etherBalance);
export const exchangeTokenBalanceSelector = ({ exchange }) =>
	formatBalance(exchange?.tokenBalance);
export const etherDepositAmountSelector = ({ exchange }) =>
	exchange?.etherDepositAmount;
export const etherWithdrawAmountSelector = ({ exchange }) =>
	exchange?.etherWithdrawAmount;
export const tokenDepositAmountSelector = ({ exchange }) =>
	exchange?.tokenDepositAmount;
export const tokenWithdrawAmountSelector = ({ exchange }) =>
	exchange?.tokenWithdrawAmount;
export const buyOrderSelector = ({ exchange }) => exchange?.buyOrder || {};
export const sellOrderSelector = ({ exchange }) => exchange?.sellOrder || {};
