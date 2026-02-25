import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");
  const [num, setNum] = useState(0);
  const [todoArray, setTodoArray] = useState([]);

  const changeInput = (e) => {
    setTodo(e.target.value);
  };

  const fetchTodo = async () => {
    const response = await fetch("http://localhost:3000/todos");
    const data = await response.json();

    const todoData = data.todos.filter((item) => item.completed === false);
    console.log(todoData);
    setTodoArray(todoData);
  };

  useEffect(() => {
    fetchTodo();
  }, []);

  const submitItem = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          id: num,
          title: todo,
        }),
      });

      if (!response.ok) {
        throw new Error("Network is not OK");
      }
    } catch (error) {
      console.log(error);
    }

    if (todo != "") {
      setTodoArray([...todoArray, { id: num, title: todo }]);
      setNum(num + 1);
    }
    setTodo("");

    // if (todo != "") {
    //   setTodoArray([...todoArray, { id: num, value: todo }]);
    //   setNum(num + 1);
    // }
    // setTodo("");
  };

  const deteleTodo = async (item) => {
    const deleteId: number = item.id;

    try {
      const response = await fetch(`http://localhost:3000/todos/${deleteId}`, {
        method: "PUT",
        headers: {
          "content-Type": "application/json",
        },
        body: JSON.stringify({
          id: deleteId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network is not OK");
      }
    } catch (error) {
      console.log(error);
    }

    console.log(deleteId);

    setTodoArray(todoArray.filter((elem) => elem.id != deleteId));
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold">ToDoリスト</h1>
        <div>
          <form className="flex gap-4 mt-6" onSubmit={submitItem}>
            <input type="text" className="border rounded-sm border-neutral-400 px-2" value={todo} onChange={changeInput} />
            <input type="submit" className="cursor-pointer px-4 py-2 bg-neutral-200 rounded-md cursor-pointer" value="送信" />
          </form>
        </div>
        <div className="mt-6">
          <p className="text-xl font-bold">課題内容</p>
          <ul className="mt-4 flex flex-col gap-3">
            {todoArray.map((item) => {
              return (
                <li key={item.id} className="flex items-center gap-12 justify-between">
                  <p>{item.title}</p>
                  <button className="px-4 py-2 bg-neutral-200 rounded-md cursor-pointer" onClick={() => deteleTodo(item)}>
                    削除
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
