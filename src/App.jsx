import { useEffect, useState } from "react";
import { TbEdit } from "react-icons/tb";
import { v4 as uuidv4 } from "uuid";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineModeEdit } from "react-icons/md";
import { GrAddCircle } from "react-icons/gr";

function App() {
  const [todo, settodo] = useState("");
  const [todos, settodos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showFinished, setshowFinished] = useState(true);

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const TodosFromLocalStorage = localStorage.getItem("todos");
    if (TodosFromLocalStorage) {
      settodos(JSON.parse(TodosFromLocalStorage));
    }
  }, []);

  // Save todos to localStorage whenever todos state changes
  useEffect(() => {
    if (todos.length > 0) {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  }, [todos]);

  const handleAdd = () => {
    if (isEditing) {
      // Update an existing todo
      const updatedTodos = todos.map((item) =>
        item.id === editId ? { ...item, todo } : item
      );
      settodos(updatedTodos);
      setIsEditing(false);
      setEditId(null);
    } else {
      // Add a new todo
      settodos([...todos, { id: uuidv4(), todo, isCompleted: false }]);
    }
    settodo(""); // Clear the input field
  };

  const handleEdit = (id) => {
    const itemToEdit = todos.find((item) => item.id === id);
    settodo(itemToEdit.todo); // Set the current todo text in input
    setIsEditing(true);
    setEditId(id);
  };

  const handleDelete = (id) => {
    const newTodos = todos.filter((item) => item.id !== id);
    settodos(newTodos);
  };

  const handleCheckbox = (id) => {
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    settodos(updatedTodos);
  };

  const handleChange = (e) => {
    settodo(e.target.value);
  };

  const toggleFinished = () => {
    setshowFinished(!showFinished);
  };
  useEffect(() => {
    console.log("Show finished is now:", showFinished);
  }, [showFinished]);

  return (
    <>
      <div className="container mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[70vh]">
        <h1 className="text-center text-xl font-bold">
          Turn To-Dos into Dones!
        </h1>
        <div className="addTodo">
          <h2 className="text-xl my-5 font-bold text-center">
            {isEditing ? "Edit Todo" : "Add Todo"}
          </h2>
          <div className="inputTodoContainer flex justify-center ">
            <input
              onChange={handleChange}
              value={todo}
              type="text"
              className="py-3 px-4  w-2/3 border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            />
            <button
              onClick={handleAdd}
              disabled={todo.length <= 3}
              className=" mx-2 focus:outline-none disabled:bg-slate-500 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            >
              {isEditing ? (
                <MdOutlineModeEdit className="text-xl" />
              ) : (
                <GrAddCircle className="text-xl" />
              )}
            </button>
          </div>
          <br />
          <input
            onChange={toggleFinished}
            type="checkbox"
            name=""
            checked={showFinished}
            id=""
          />{" "}
          show Finished
        </div>
        <h1 className="text-xl font-bold">Your Todos</h1>
        <div className="todos">
          {todos.length === 0 && <div>No Todos to Display!!!</div>}
          {todos.map((item) => {
            return (
              (showFinished || !item.isCompleted) && (
                <div
                  className="todo rounded-md items-center p-2 flex w-full bg-slate-200 justify-between my-3"
                  key={item.id}
                >
                  <input
                    type="checkbox"
                    checked={item.isCompleted}
                    onChange={() => handleCheckbox(item.id)}
                    name={item.id}
                    className="rounded-xl"
                  />
                  <div className={item.isCompleted ? "line-through" : ""}>
                    {item.todo}
                  </div>
                  <div className="buttons items-center">
                    <button className="mx-2 focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">
                      <TbEdit
                        className="text-xl"
                        onClick={() => handleEdit(item.id)}
                      />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="mx-2 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                    >
                      <RiDeleteBinLine className="text-xl" />
                    </button>
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
