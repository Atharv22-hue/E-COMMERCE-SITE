import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetFilteredProductsQuery } from "../redux/api/productApiSlice";
import { useFetchCategoriesQuery } from "../redux/api/categoryApiSlice";

import {
  setCategories,
  setProducts,
  setChecked,
} from "../redux/features/shop/shopSlice";

import Loader from "../components/Loader";
import ProductCard from "./Products/ProductCard";
import Message from "../components/Message";
import staticProducts from "../data/staticProducts";

const Shop = () => {
  const dispatch = useDispatch();

  const { categories, products, checked } = useSelector(
    (state) => state.shop
  );

  const [priceFilter, setPriceFilter] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");

  // API Calls
  const { data: categoriesData, isLoading: catLoading } =
    useFetchCategoriesQuery();

  const { data: productsData, isLoading: prodLoading } =
    useGetFilteredProductsQuery({ checked });

  // ✅ Use API data OR fallback to static
  const allProducts = productsData?.length
    ? productsData
    : staticProducts;

  // ✅ Set categories (optional fallback too)
  useEffect(() => {
    if (categoriesData) {
      dispatch(setCategories(categoriesData));
    }
  }, [categoriesData, dispatch]);

  // ✅ FILTER LOGIC (works on static + API)
  const filteredProducts = useMemo(() => {
    if (!allProducts) return [];

    return allProducts.filter((product) => {
      const matchCategory =
        checked.length === 0 ||
        checked.includes(product.category);

      const matchBrand =
        !selectedBrand || product.brand === selectedBrand;

      const matchPrice =
        !priceFilter || product.price <= Number(priceFilter);

      return matchCategory && matchBrand && matchPrice;
    });
  }, [allProducts, checked, selectedBrand, priceFilter]);

  // ✅ Update Redux
  useEffect(() => {
    dispatch(setProducts(filteredProducts));
  }, [filteredProducts, dispatch]);

  // CATEGORY CHECK
  const handleCheck = (value, id) => {
    const updatedChecked = value
      ? [...checked, id]
      : checked.filter((c) => c !== id);

    dispatch(setChecked(updatedChecked));
  };

  // UNIQUE BRANDS (from all products)
  const uniqueBrands = useMemo(() => {
    return [
      ...new Set(
        allProducts?.map((p) => p.brand).filter(Boolean)
      ),
    ];
  }, [allProducts]);

  // RESET
  const handleReset = () => {
    dispatch(setChecked([]));
    setSelectedBrand("");
    setPriceFilter("");
  };

  // LOADING STATE (only show if both empty)
  if (prodLoading && !staticProducts.length) return <Loader />;

  return (
    <div className="container mx-auto">
      <div className="flex md:flex-row">

        {/* FILTER PANEL */}
        <div className="bg-[#151515] p-3 mt-2 mb-2">

          {/* CATEGORY */}
          <h2 className="text-center py-2 bg-black rounded-full mb-2">
            Filter by Categories
          </h2>

          <div className="p-5 w-[15rem]">
            {categories?.map((c) => (
              <div key={c._id} className="mb-2 flex items-center">
                <input
                  type="checkbox"
                  onChange={(e) =>
                    handleCheck(e.target.checked, c._id)
                  }
                  className="mr-2"
                />
                <label className="text-white">{c.name}</label>
              </div>
            ))}
          </div>

          {/* BRAND */}
          <h2 className="text-center py-2 bg-black rounded-full mb-2">
            Filter by Brands
          </h2>

          <div className="p-5">
            <div className="mb-3">
              <input
                type="radio"
                name="brand"
                checked={!selectedBrand}
                onChange={() => setSelectedBrand("")}
              />
              <label className="ml-2 text-white">All</label>
            </div>

            {uniqueBrands.map((brand) => (
              <div key={brand} className="mb-3 flex items-center">
                <input
                  type="radio"
                  name="brand"
                  onChange={() => setSelectedBrand(brand)}
                />
                <label className="ml-2 text-white">{brand}</label>
              </div>
            ))}
          </div>

          {/* PRICE */}
          <h2 className="text-center py-2 bg-black rounded-full mb-2">
            Filter by Price
          </h2>

          <div className="p-5 w-[15rem]">
            <input
              type="number"
              placeholder="Max Price"
              value={priceFilter}
              onChange={(e) => setPriceFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {/* RESET */}
          <div className="p-5 pt-0">
            <button
              className="w-full border py-2 bg-pink-600"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* PRODUCTS */}
        <div className="p-3 w-full">
          <h2 className="text-center mb-4 text-xl">
            {products.length} Products
          </h2>

          <div className="flex flex-wrap">
            {products.length === 0 ? (
              <Message>No products found</Message>
            ) : (
              products.map((p) => (
                <div className="p-3" key={p._id}>
                  <ProductCard p={p} />
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Shop;