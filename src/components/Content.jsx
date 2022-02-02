import React from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllOrders } from "../store/interactions";
import Trades from "./Trades";

const Content = () => {
	const dispatch = useDispatch();
	const exchange = useSelector((state) => state.exchange.contract);
	useEffect(() => {
		(async function loadBlockchain() {
			try {
				await loadAllOrders(dispatch, exchange);
			} catch (error) {
				window.alert(error.message);
			}
		})();
	}, [dispatch, exchange]);
	return (
		<div className="content">
			<div className="vertical-split">
				<div className="card bg-dark text-white">
					<div className="card-header">Card Title</div>
					<div className="card-body">
						<p className="card-text">
							Some quick example text to build on the card title and make up the
							bulk of the card's content.
						</p>
						<a href="/#" className="card-link">
							Card link
						</a>
					</div>
				</div>
				<div className="card bg-dark text-white">
					<div className="card-header">Card Title</div>
					<div className="card-body">
						<p className="card-text">
							Some quick example text to build on the card title and make up the
							bulk of the card's content.
						</p>
						<a href="/#" className="card-link">
							Card link
						</a>
					</div>
				</div>
			</div>
			<div className="vertical">
				<div className="card bg-dark text-white">
					<div className="card-header">Card Title</div>
					<div className="card-body">
						<p className="card-text">
							Some quick example text to build on the card title and make up the
							bulk of the card's content.
						</p>
						<a href="/#" className="card-link">
							Card link
						</a>
					</div>
				</div>
			</div>
			<div className="vertical-split">
				<div className="card bg-dark text-white">
					<div className="card-header">Card Title</div>
					<div className="card-body">
						<p className="card-text">
							Some quick example text to build on the card title and make up the
							bulk of the card's content.
						</p>
						<a href="/#" className="card-link">
							Card link
						</a>
					</div>
				</div>
				<div className="card bg-dark text-white">
					<div className="card-header">Card Title</div>
					<div className="card-body">
						<p className="card-text">
							Some quick example text to build on the card title and make up the
							bulk of the card's content.
						</p>
						<a href="/#" className="card-link">
							Card link
						</a>
					</div>
				</div>
			</div>
			<Trades />
		</div>
	);
};
export default Content;
