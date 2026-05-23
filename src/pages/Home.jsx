import { Link, useParams } from "react-router-dom";
import { useGetProductsQuery } from "../redux/api/productApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Header from "../components/Header";
import Product from "./Products/Product";
import staticProducts from "../data/staticProducts";

const Home = () => {
  const { keyword } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery({ keyword });

  const productsToShow =
  data?.products?.length > 0 ? data.products : staticProducts;

  return (
    <>
      {!keyword ? <Header /> : null}
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <Message variant="danger">
          {isError?.data?.message || isError?.error || "Something went wrong"}
        </Message>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h1 className="ml-[20rem] mt-[10rem] text-[3rem]">
              Special Products
            </h1>

            <Link
              to="/shop"
              className="bg-pink-600 font-bold rounded-full py-2 px-10 mr-[18rem] mt-[10rem]"
            >
              Shop
            </Link>
          </div>

          <div>
            <div className="flex justify-center flex-wrap mt-[2rem]">
              {/* {data.products.map((product) => (
                <div key={product._id}>
                  <Product product={product} />
                </div>
              ))} */}

              {productsToShow.map((product) => (
  <div key={product._id}>
    <Product product={product} />
  </div>
))}
              
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
