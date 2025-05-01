import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TouristHeading from './TouristHeading';
import TouristView from './TouristView';
 
 
 
   
const TouristMain = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn || role === "none") {
      navigate("/");
    }
  }, [isLoggedIn, role, navigate]);
  return (
    <div>
      <TouristHeading />
      <TouristView />
    </div>
  );
};

export default TouristMain;
