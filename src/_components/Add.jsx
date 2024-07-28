import { Plus } from "lucide-react";
import { useState, useRef } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setRef } from "../../store.js";
import { toast } from "sonner";

const Add = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [color, setColor] = useState("");
  const [tasks, setTasks] = useState([]);
  const dialogRef = useRef(null);

  const dispatch = useDispatch();
  const id = sessionStorage.getItem("id");

  const addTask = async (e) => {
    e.preventDefault();
    if (title === "" || body === "") {
      toast.warning("Oops. please try again");
    } else {
      const newTask = {
        title,
        body,
        color,
        id,
      };
      console.log(newTask);

      try {
        if (id) {
          await axios.post(`${window.location.origin}/api/v2/addtask, newTask`);
        }
        setTasks([...tasks, newTask]);
        setTitle("");
        setBody("");
        setColor("");
        toast.success("Task Added Successfully");
        dispatch(setRef(true));

        dialogRef.current.close();
      } catch (error) {
        // console.error("Error adding task:", error);
        toast.error("Error adding task");
      }
    }
  };

  const openDialog = (color) => {
    setColor(color);
    dialogRef.current.showModal();
  };

  return (
    <div className="dropdown dropdown-hover dropdown-top md:dropdown-bottom flex-none gap-2 bottom-4 md:bottom-auto md:absolute md:left-2 rounded-l-md flex justify-center align-middle items-center">
      <div
        tabIndex={0}
        title="Add"
        role="button"
        className="btn btn-md border-2 border-black bg-white text-black hover:text-white hover:bg-black hover:scale-105 rounded-md mb-2 h-full"
      >
        <Plus />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-md z-[1] w-24 md:w-10 p-2 shadow-2xl"
      >
        <div className="grid grid-cols-3 md:grid-cols-1 gap-2 align-middle justify-center">
          <button
            className="btn btn-xs bg-green-200 hover:bg-green-300 hover:rounded-lg"
            onClick={() => openDialog("bg-green-300")}
          ></button>
          <button
            className="btn btn-xs bg-red-200 hover:bg-red-300 hover:rounded-lg"
            onClick={() => openDialog("bg-red-300")}
          ></button>
          <button
            className="btn btn-xs bg-yellow-200 hover:bg-yellow-300 hover:rounded-lg"
            onClick={() => openDialog("bg-yellow-300")}
          ></button>
        </div>
        <dialog id="my_modal_1" className="modal" ref={dialogRef}>
          <div className={`modal-box ${color}`}>
            <h3 className="font-bold text-lg py-5">What you want to do?</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="input input-bordered w-full max-w-full my-2 truncate text-ellipsis line-clamp-1"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Body"
              className="textarea textarea-bordered textarea-md w-full my-2 line-clamp-6 truncate break-words"
            ></textarea>
            <div className="modal-action">
              <button className="btn mr-2" onClick={addTask}>
                Add
              </button>
              <button className="btn" onClick={() => dialogRef.current.close()}>
                Close
              </button>
            </div>
          </div>
        </dialog>
      </ul>
    </div>
  );
};

export default Add;
