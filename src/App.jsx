import Navbar from "./_components/Navbar.jsx";
import Todo from "./_components/Todo.jsx";
import Home from "./_components/Home.jsx";
import { useDispatch, useSelector } from "react-redux";
// import { useLayoutEffect } from "react";
import { setValue } from "../store.js";
import { Toaster } from "sonner";

function App() {
  const log = useSelector((state) => state.value.value);
  const user = useSelector((state) => state.value.user);
  console.log(user); // For debugging purposes, ensure user data is being logged
  const id = sessionStorage.getItem("id");
  const dispatch = useDispatch();

  // useLayoutEffect(() => {
  //   if (id) {
  //     dispatch(setValue(true));
  //   }
  // }, []);

  id ? dispatch(setValue(true)) : dispatch(setValue(false));

  return (
    <>
      <Toaster richColors position="bottom-center" className="mt-[70px]" />
      <Navbar />
      {log ? <Todo log={log} /> : <Home log={log} />}
    </>
  );
}

export default App;
