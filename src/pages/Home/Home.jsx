import React from "react";
import { Link } from "react-router-dom";

import "./Home.css";

import bg from "../../assets/bg-grad.png";
import Footer from "../../components/Footer/Footer";
import { useTheme } from "../../contexts/theme";

function Home() {
  const { theme } = useTheme();
  return (
    <div id="home" className={`home-${theme}`}>
      <div className="hero">
        <img className="bg" src={bg} alt="" />
        <h1>
          Your Story <br /> Your Platform
        </h1>
        <p>
          Create your own blog and connect with readers worldwide. <br /> Start
          writing today and share your unique perspective.
        </p>
        <Link to={"/signup"} className="start-link">
          Get Started
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
