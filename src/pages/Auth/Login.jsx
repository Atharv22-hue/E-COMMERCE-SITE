import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { useLoginMutation } from "../../redux/api/usersApiSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);

  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        email,
        password,
      }).unwrap();

      dispatch(setCredentials({ ...res }));

      toast.success("Login Successful");

      navigate(redirect);
    } catch (err) {
      console.log("LOGIN ERROR:", err);

      const errorMessage =
        err?.data?.message ||
        err?.message ||
        err?.error ||
        "Login Failed";

      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <section className="pl-[10rem] flex flex-wrap">
        <div className="mr-[4rem] mt-[5rem]">
          <h1 className="text-2xl font-semibold mb-4 text-white">
            Sign In
          </h1>

          <form
            onSubmit={submitHandler}
            className="container w-[40rem]"
          >
            {/* Email */}
            <div className="my-[2rem]">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-white"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                className="mt-1 p-2 border rounded w-full text-black"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-white"
              >
                Password
              </label>

              <input
                type="password"
                id="password"
                className="mt-1 p-2 border rounded w-full text-black"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded cursor-pointer my-[1rem]"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>

            {isLoading && <Loader />}
          </form>

          {/* Register */}
          <div className="mt-4">
            <p className="text-white">
              New Customer?{" "}
              <Link
                to={
                  redirect
                    ? `/register?redirect=${redirect}`
                    : "/register"
                }
                className="text-pink-500 hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>

        {/* Image */}
        <img
          src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1964&q=80"
          alt="login"
          className="h-[65rem] w-[59%] xl:block md:hidden sm:hidden rounded-lg"
        />
      </section>
    </div>
  );
};

export default Login;