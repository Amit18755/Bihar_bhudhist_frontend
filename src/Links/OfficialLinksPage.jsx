import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import MainLinkContainer from "./MainLinkContainer";

const OfficialLinksPage = () => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn || role === "none") {
      navigate("/");
    }
  }, [isLoggedIn, role, navigate]);

  return (
    <div className="p-4">
      <Header />
      <MainLinkContainer />
    </div>
  );
};

export default OfficialLinksPage;
