import React, { useEffect, useState } from "react";
import "../styles.css";
import Base from "./Base";
import Card from "./Card";
import { getProducts } from "./helper/coreapicalls";
import {
  deleteThisCategory,
  getCategories,
} from "../admin/helper/adminapicall";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);

  const loadAllProduct = () => {
    getProducts().then((data) => {
      if (data.error) {
        setError(data.error);
        setLoading(false);
      } else {
        setProducts(data);
        getCategories().then((data) => {
          if (data.error) {
            console.log(data.error);
          } else {
            setCategory(data);
          }
        });
        setLoading(false);
      }
    });
  };
  useEffect(() => {
    setLoading(true);
    loadAllProduct();
  }, []);

  const loadingComp = () => {
    return (
      loading && (
        <div class="d-flex align-items-center mb-3">
          <strong>Loading...</strong>
          <div
            class="spinner-border ml-auto"
            role="status"
            aria-hidden="true"
          ></div>
        </div>
      )
    );
  };
  const errorMessage = () => {
    return (
      <div className="row">
        <div className="col-md-6 offset-sm-3 text-left">
          <div
            className="alert alert-danger"
            style={{ display: error ? "" : "none" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  };
  const ParoductRow = ({ category, products }) => (
    <div className="row">
      {products.map((product, index) => {
        if (product.category && category === product.category.name) {
          return (
            <div key={index} className="col-4 mb-4">
              <Card product={product} />
            </div>
          );
        }
      })}
    </div>
  );
  return (
    <Base title="Home Page" description="Welcome to the E-Pharma Store">
      {loadingComp()}
      {errorMessage()}

      {category.map((v, indx) => {
        return (
          <>
            <h3>{v.name}:</h3>
            <div className="row text-center">
              <ParoductRow category={v.name} products={products} />
            </div>
          </>
        );
      })}
    </Base>
  );
};

export default Home;
