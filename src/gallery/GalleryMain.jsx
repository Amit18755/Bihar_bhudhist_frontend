import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import GalleryHeading from "./GalleryHeading";
import GalleryView from "./GalleryView";

const GalleryMain = () => {
  const { username, role, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else if (role === "none") {
      navigate("/forbidden");
    }
  }, [isLoggedIn, role, navigate]);

  return (
    <div className="p-4 w-full">
      <GalleryHeading />
      <div className="mt-6">
        <GalleryView />
      </div>
    </div>
  );
};

export default GalleryMain;
