import React from "react";

const Navbar = ({ account }) => (
	<nav className="navbar navbar-expand-lg navbar-dark bg-primary">
		<a className="navbar-brand" href="/#">
			Token Exchange [STaR Dapp]
		</a>
		<button
			className="navbar-toggler"
			type="button"
			data-toggle="collapse"
			data-target="#navbarNavDropdown"
			aria-controls="navbarNavDropdown"
			aria-expanded="false"
			aria-label="Toggle navigation"
		>
			<span className="navbar-toggler-icon"></span>
		</button>
		<div className="collapse navbar-collapse" id="navbarNavDropdown">
			<ul className="navbar-nav ml-auto">
				<li className="nav-item">
					<a
						className="nav-link small"
						href={`https://etherscan.io/address/${account}`}
						target="_blank"
						rel="noopener noreferrer"
					>
						{account}
					</a>
				</li>
			</ul>
		</div>
	</nav>
);

export default Navbar;
