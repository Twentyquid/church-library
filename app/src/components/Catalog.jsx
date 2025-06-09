import React from "react";
import { useEffect } from "react";
import api from "../api";

function Catalog() {
  useEffect(() => {
    const fetchData = async () => {
      const request = await api.get("/test");
      console.log(request.data);
    };
    fetchData();
  }, []);
  return <div>Catalog</div>;
}

export default Catalog;
