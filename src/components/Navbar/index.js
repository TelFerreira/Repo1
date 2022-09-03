import React from "react";
import "./index.css";

function isUser(user) {
  if (user && user.primeironome && user.sobrenome) return user.primeironome + " " + user.sobrenome;
  return "";
}

const Navbar = (props) => {
  return (
    <div className="navbar">
      <div className="wrapper">
        <div className="nav-title">{props.title}</div>
        <div className="items">
          <div className="item">
            {isUser(props.user)}
            <img src="https://www.iriset.in/tms/uploads/profile/profile.png" alt="user" className="avatar" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
