import { useEffect, useLayoutEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Add from "./Add";
import { setRef } from "../../store";
import { toast } from "sonner";

const Todo = () => {
  const dispatch = useDispatch();
  const log = useSelector((state) => state.value.value);
  const id = sessionStorage.getItem("id");
  const ref = useSelector((state) => state.ref.ref);
  const [cardList, setCardList] = useState([]);
  const [editingCard, setEditingCard] = useState(null);
  const [formData, setFormData] = useState({ title: "", body: "", color: "" });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v2/gettask/${id}`
      );
      setCardList(response.data.list || []);
    } catch (error) {
      if (error.response) {
        console.error("Server responded with an error:", error.response.data);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
    } finally {
      null;
    }
  };
  useLayoutEffect(() => {
    if (log) {
      toast.success("Login Successfully");
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (ref) {
      fetchData().then(() => {
        dispatch(setRef(false));
      });
    }
  }, [ref, dispatch]);

  const handleDelete = async (cardId) => {
    try {
      await axios.delete(
        `${window.location.origin}/api/v2/deletetask/${cardId}`,
        {
          data: { id: id },
        }
      );
      fetchData();
      toast.success("Deleted Successfully ");
    } catch (error) {
      console.error("Failed to delete card:", error);
      toast.error("Failed to Delete");
    }
  };

  const handleEdit = (card) => {
    setEditingCard(card);
    setFormData({ title: card.title, body: card.body, color: card.color });
    document.getElementById("update").showModal();
  };

  const handleSaveEdit = async () => {
    console.log(formData);
    console.log(editingCard._id);
    try {
      await axios.put(
        `${window.location.origin}/v2/updatetask/${editingCard._id}`,
        formData
      );
      setCardList(
        cardList.map((card) =>
          card._id === editingCard._id ? { ...card, ...formData } : card
        )
      );
      setEditingCard(null);
      setFormData({ title: "", body: "", color: "" });
      toast.success("Updated Successfully ");
    } catch (error) {
      console.error("Failed to update card:", error);
      toast.error("Failed to Update");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleColorChange = (e) => {
    setFormData({ ...formData, color: e.target.value });
  };

  return (
    <div className="w-screen h-screen overflow-hidden fixed">
      <div className="pt-20 h-screen top-0 bottom-0 flex relative flex-col-reverse md:flex-row">
        <div className="flex justify-center items-center content-end flex-none p-4 h-10 md:h-full w-full md:w-10 bg-black">
          <Add />
        </div>
        <div className="flex-1 flex flex-col justify-center items-center p-8">
          <dialog id="update" className="modal">
            <div className={`modal-box ${formData.color}`}>
              <h3 className="font-bold text-lg py-5">What you want to do?</h3>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Title"
                className="input input-bordered w-full max-w-full my-2 truncate text-ellipsis line-clamp-1"
              />
              <textarea
                name="body"
                value={formData.body}
                onChange={handleChange}
                placeholder="Body"
                className="textarea textarea-bordered textarea-md w-full my-2 line-clamp-6 truncate break-words"
              ></textarea>

              <fieldset className="flex flex-wrap gap-3 py-2 justify-center">
                <legend className="sr-only">Color</legend>

                <label
                  htmlFor="ColorGreen"
                  className="block size-8 cursor-pointer rounded-full bg-green-300  shadow-sm has-[:checked]:ring-2 has-[:checked]:ring-black has-[:checked]:ring-offset-2"
                >
                  <input
                    type="radio"
                    name="color"
                    value="bg-green-300"
                    id="ColorGreen"
                    className="sr-only"
                    onChange={handleColorChange}
                    checked={formData.color === "bg-green-300"}
                  />

                  <span className="sr-only"> Green </span>
                </label>

                <label
                  htmlFor="ColorRed"
                  className="block size-8 cursor-pointer rounded-full bg-red-300  shadow-sm has-[:checked]:ring-2 has-[:checked]:ring-black has-[:checked]:ring-offset-2"
                >
                  <input
                    type="radio"
                    name="color"
                    value="bg-red-300"
                    id="ColorRed"
                    className="sr-only"
                    onChange={handleColorChange}
                    checked={formData.color === "bg-red-300"}
                  />

                  <span className="sr-only"> Red </span>
                </label>

                <label
                  htmlFor="ColorYellow"
                  className="block size-8 cursor-pointer rounded-full bg-yellow-300 shadow-sm has-[:checked]:ring-2 has-[:checked]:ring-black has-[:checked]:ring-offset-2"
                >
                  <input
                    type="radio"
                    name="color"
                    value="bg-yellow-300"
                    id="ColorYellow"
                    className="sr-only"
                    onChange={handleColorChange}
                    checked={formData.color === "bg-yellow-300"}
                  />

                  <span className="sr-only"> Yellow </span>
                </label>
              </fieldset>

              <div className="modal-action">
                <form method="dialog">
                  <button className="btn mr-2" onClick={handleSaveEdit}>
                    Update
                  </button>
                  <button className="btn" onClick={() => setEditingCard(null)}>
                    Close
                  </button>
                </form>
              </div>
            </div>
          </dialog>

          {cardList.length > 0 ? (
            <div className="overflow-y-auto h-[520px] w-full mt-7 mx-6 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardList.map((card, index) => (
                  <div
                    key={index}
                    className={`card ${card.color} shadow-lg rounded-lg p-6 min-w-60 w-full transition-transform duration-300 ease-in-out`}
                  >
                    <h2 className="text-2xl font-bold mb-4 truncate">
                      {card.title}
                    </h2>
                    <p className="text-gray-700 mb-6 truncate">{card.body}</p>
                    <div className="flex justify-center">
                      <span className="inline-flex overflow-hidden rounded-md border bg-white shadow-sm">
                        <button
                          className="inline-block border-e p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                          title="Edit"
                          onClick={() => handleEdit(card)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                            />
                          </svg>
                        </button>

                        <button
                          className="inline-block p-3 text-gray-700 hover:bg-gray-50 focus:relative"
                          title="Delete"
                          onClick={() => handleDelete(card._id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-4 w-4"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                            />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center p-8">
              <img
                alt="No cards"
                src="/src/_img/Busy 3.png"
                className=" h-auto w-60 md:w-80 md:h-80 mx-auto object-fill"
              />
              <p className="text-gray-500">
                No todo available. Please add some todo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Todo;
