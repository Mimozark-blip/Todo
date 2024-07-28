import { useLayoutEffect, useState } from "react";
import axios from "axios";
import { CgClose } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { setValue } from "../../store";
import { toast } from "sonner";

function Home() {
  const log = useSelector((state) => state.value.value);
  useLayoutEffect(() => {
    if (log === false) {
      toast.success("Logout Successfully");
    }
  }, []);

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

        setInput_2({
          email: "",
          password: "",
        });
        document.getElementById("SignIn").close();
      } else {
        // Handle wrong credentials scenario
        console.log("Wrong credentials provided.");
        toast.error("Wrong credentials provided.");
      }
    } catch (error) {
      document.getElementById("SignUp").close();
      toast.error("There was an error logging in");
    }
  };

  return (
    <section className="w-screen h-screen overflow-hidden fixed">
      <div className="mx-auto max-w-screen-xl h-screen px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 flex justify-center align-middle content-center items-center">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-16 mt-16">
          <div className="relative h-40 md:h-full w-52 overflow-hidden rounded-lg  lg:order-last  flex  justify-items-center">
            <img
              alt=""
              src="./src/_img/Checklist.png"
              className="absolute inset-0 h-full w-full md:w-96 md:h-full mx-auto  object-fill"
            />
          </div>

          <div className="lg:py-24 flex justify-center items-center align-middle flex-col">
            <h2 className="text-3xl font-bold sm:text-4xl">Make Life Easier</h2>

            <p className=" text-gray-600 text-center p-4">
              Welcome to your ultimate productivity hub! Our platform empowers
              you to take control of your day with intuitive to-do lists that
              streamline organization, boost productivity, and reduce stress. By
              clearly outlining tasks and priorities, you’ll manage your time
              more effectively, stay on top of important deadlines, and achieve
              your goals with ease.
            </p>

            <div className="flex justify-center items-center content-center gap-5">
              <a
                href="#"
                className=" inline-block rounded bg-black px-6 py-3 text-sm font-medium text-white transition hover:scale-110 focus:outline-none focus:ring focus:ring-slate-300  text-center"
                onClick={() => document.getElementById("SignUp").showModal()}
              >
                Sign Up
              </a>
              <a
                href="#"
                className=" inline-block rounded bg-black px-6 py-3 text-sm font-medium text-white transition hover:scale-110 focus:outline-none focus:ring focus:ring-slate-300  text-center"
                onClick={() => {
                  document.getElementById("SignIn").showModal();
                }}
              >
                Sign In
              </a>
            </div>
          </div>
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
    </section>
  );
}

export default Home;
