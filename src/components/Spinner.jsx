import React from "react";

const Spinner = ({ type = "div" }) => {
	if (type === "table")
		return <tbody className="spinner-border text-light text-center"></tbody>;
	return <div className="spinner-border text-light text-center"></div>;
};
export default Spinner;
