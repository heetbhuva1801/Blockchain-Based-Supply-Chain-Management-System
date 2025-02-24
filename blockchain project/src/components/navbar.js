import React from "react";

const Navbar = ({ account }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <a href="/" className="navbar-brand">
          Supply Chain DApp
        </a>
        <div className="navbar-account">
          <span>
            Account: {account ? account : "Not connected"}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
