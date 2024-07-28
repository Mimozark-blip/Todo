import { FaUserAlt } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { CgClose } from "react-icons/cg";
import { useDispatch } from "react-redux";
import { setValue } from "../../store";
import { useSelector } from "react-redux";
import { toast } from "sonner";
const Navbar = () => {
  // To change dropdown
  const log = useSelector((state) => state.value.value);

  const [user, setUser] = useState(sessionStorage.getItem("user"));

  const [input_1, setInput_1] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [input_2, setInput_2] = useState({
    email: "",
    password: "",
  });

  const change_1 = (e) => {
    const { name, value } = e.target;
    setInput_1({ ...input_1, [name]: value });
  };

  const change_2 = (e) => {
    const { name, value } = e.target;
    setInput_2({ ...input_2, [name]: value });
  };

  const submit_1 = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${window.location.origin}/api/v1/register`, input_1);
      toast.success("Register Successfully");
      setInput_1({
        email: "",
        username: "",
        password: "",
      });
      document.getElementById("SignUp").close();
    } catch (error) {
      document.getElementById("SignUp").close();
      toast.error("There was an error registering");
    }
  };

  const dispatch = useDispatch();

  const submit_2 = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${window.location.origin}/api/v1/login`,
        input_2
      );

      // Check if response contains _id in the data
      if (response.data.user && response.data.user._id) {
        console.log("Login Successful");
        console.log("Logged in user ID:", response.data.user._id);
        sessionStorage.setItem("id", response.data.user._id);
        sessionStorage.setItem("user", response.data.user.username);
        dispatch(setValue(true));

        setUser(sessionStorage.getItem("user"));

        setInput_2({
          email: "",
          password: "",
        });

        document.getElementById("SignIn").close();
      } else {
        // Handle wrong credentials scenario
        document.getElementById("SignUp").close();
        console.log("Wrong credentials provided.");
        toast.error("Wrong credentials provided.");
      }
    } catch (error) {
      document.getElementById("SignUp").close();
      toast.error("There was an error logging in");
    }
  };

  return (
    <div className="navbar bg-base-100 p-5 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="flex-1 p-0">
        <img
          src="./src/_img/Logo-new.png"
          alt="Logo"
          className="w-[125px] h-[40px] md:w-[150px] md:h-[50px]"
        />
      </div>
      <div className="flex-none gap-2">
        {/* {log && (
          <div className="form-control">
            <input
              type="text"
              placeholder="Search"
              className="input input-sm md:input-md border-black w-32 rounded-lg md:w-96"
            />
          </div>
        )} */}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-sm md:btn-md btn-circle rounded-full bg-black text-white hover:bg-black hover:scale-105 "
            title="Profile"
          >
            {log ? (
              user ? (
                user[0].toUpperCase()
              ) : (
                ""
              )
            ) : (
              <BsThreeDots className="w-3 h-3 md:w-5 md:h-5" />
            )}
          </div>
          {log ? (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1]  w-auto p-4 shadow-lg content-center flex flex-col items-center"
            >
              <div className="rounded-md w-full h-full flex flex-col justify-around items-center p-4 ">
                <div className="flex-1">
                  <FaUserAlt className="w-6 h-6" />
                </div>
                <h4 className="flex-none break-words py-4">{`Hi,${user}`}</h4>
                <li className="rounded-md flex-none bg-black text-white hover:bg-black hover:text-white hover:scale-110 transition-transform">
                  <a
                    onClick={() => {
                      dispatch(setValue(false));
                      setUser("");
                      sessionStorage.removeItem("id");
                      sessionStorage.removeItem("user");
                    }}
                  >
                    Logout
                  </a>
                </li>
              </div>
            </ul>
          ) : (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-24 p-2 shadow-lg content-center flex flex-col"
            >
              <li className="rounded-md">
                <a
                  onClick={() => document.getElementById("SignUp").showModal()}
                >
                  Sign Up
                </a>
              </li>
              <li className="rounded-md">
                <a
                  onClick={() => document.getElementById("SignIn").showModal()}
                >
                  Sign In
                </a>
              </li>
            </ul>
          )}
        </div>
      </div>
      {/* Sign Up Dialog */}
      <dialog id="SignUp" className="modal">
        <div className="modal-box p-4 min-w-40">
          <div className="modal-action flex justify-end mt-0">
            <button
              className="btn btn-square rounded-xs"
              onClick={() => document.getElementById("SignUp").close()}
            >
              <CgClose />
            </button>
          </div>
          <h3 className="font-bold text-2xl">Sign Up</h3>

          <form className="py-4" onSubmit={submit_1}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered"
                onChange={change_1}
                value={input_1.email}
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Username</span>
              </label>
              <input
                type="text"
                name="username"
                className="input input-bordered"
                onChange={change_1}
                value={input_1.username}
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered"
                onChange={change_1}
                value={input_1.password}
                required
              />
            </div>
            <div className="form-control mt-12 mb-0">
              <button
                type="submit"
                className="btn bg-black text-white rounded-md hover:bg-black"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </dialog>
      {/* Sign In Dialog */}
      <dialog id="SignIn" className="modal">
        <div className="modal-box">
          <div className="modal-action flex justify-end mt-0">
            <button
              className="btn btn-square rounded-xs"
              onClick={() => document.getElementById("SignIn").close()}
            >
              <CgClose />
            </button>
          </div>
          <h3 className="font-bold text-2xl">Sign In</h3>
          <form className="py-4" onSubmit={submit_2}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                name="email"
                className="input input-bordered"
                onChange={change_2}
                value={input_2.email}
                required
              />
            </div>
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                name="password"
                className="input input-bordered"
                onChange={change_2}
                value={input_2.password}
                required
              />
            </div>
            <div className="form-control mt-12">
              <button
                type="submit"
                className="btn bg-black text-white rounded-md hover:bg-black"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Navbar;
