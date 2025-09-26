import { useEffect, useState } from "react";
import {
  AiOutlineDelete,
  AiFillPlusCircle,
  AiTwotoneEdit,
  AiOutlineCalendar,
  AiFillPieChart,
} from "react-icons/ai";
import axios from "axios";
import { formatDate } from "../utils/date";
import EditTaskForm from "../components/EditTaskForm";
const API = axios.create({
  baseURL: "http://localhost:5000/api", // chỉnh lại nếu server khác port
});

export default function Home() {
  const [editingTask, setEditingTask] = useState(null);

  const [q, setQ] = useState({
    page: 1,
    limit: 8,
    status: "",
    from: "",
    to: "",
  });

  const [data, setData] = useState({
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
  });

  const [title, setTitle] = useState("");
  // 🔹 Fetch list từ server
  const fetchTasks = async () => {
    try {
      const res = await API.get("/todos", { params: q });
      setData(res.data);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  // 🔹 Add new task
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await API.post("/todos", { title });
      setTitle("");
      fetchTasks();
    } catch (err) {
      console.error("Add error", err);
    }
  };

  // 🔹 Toggle completed
  const handleToggle = async (t) => {
    try {
      await API.put(`/todos/${t._id}`, {
        ...t,
        status: t.status === "DONE" ? "TODO" : "DONE",
      });
      fetchTasks();
    } catch (err) {
      console.error("Toggle error", err);
    }
  };

  // 🔹 Delete
  const handleDelete = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [q]);

  const handleUpdate = async (task) => {
    try {
      await API.put(`/todos/${task._id}`, task);
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.error("Update error", err);
    }
  };

  // component form edit (nằm ngoài return, trên cùng file)

  return (
    <div className="mx-auto max-w-4xl  space-y-6 flex flex-col justify-center border rounded-lg border-blue mt-10">
      {/* Add new task */}
      <div className="border-b flex flex-col space-y-4 pb-4 bg-[#122670] text-white p-4 rounded-t-lg">
        <form onSubmit={handleAdd} className="flex gap-2 ">
          <input
            className="input flex-1 px-3 py-2 rounded-lg border bg-blue-50 text-black"
            placeholder="New task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white gap-3 flex items-center cursor-pointer">
            Add task
            <AiFillPlusCircle className="w-6 h-6" />
          </button>
        </form>

        {/* filter */}
        <div className="flex flex-wrap justify-between gap-2 items-end">
          <div className="flex items-center gap-2">
            <select
              className="border rounded px-1 py-1 bg-blue-50 text-black"
              value={q.status}
              onChange={(e) => setQ((s) => ({ ...s, status: e.target.value }))}
            >
              <option value="" className="bg-blue-50 text-black">
                All
              </option>
              <option value="TODO" className="bg-blue-50 text-black">
                TODO
              </option>
              <option value="DONE" className="bg-blue-50 text-black">
                DONE
              </option>
            </select>

            <button className="px-3 py-1 rounded bg-blue-600 text-white flex items-center gap-1 cursor-pointer">
              Statistics <AiFillPieChart />
            </button>
          </div>
          {/* Date */}
          <div className="flex items-center gap-3 text-black">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Từ ngày</label>
              <input
                type="date"
                value={q.from}
                onChange={(e) => setQ((s) => ({ ...s, from: e.target.value }))}
                className="border bg-blue-50 rounded-lg px-3 py-2 text-center outline-none focus:ring-2 focus:ring-blue-400 w-40"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-1">Đến ngày</label>
              <input
                type="date"
                value={q.to}
                onChange={(e) => setQ((s) => ({ ...s, to: e.target.value }))}
                className="border bg-blue-50 rounded-lg px-3 py-2 text-center outline-none focus:ring-2 focus:ring-blue-400 w-40"
              />
            </div>
            <button
              onClick={() => setQ((s) => ({ ...s, from: "", to: "" }))}
              className="self-end px-3 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* List Task */}
      <h1 className="text-3xl ml-3 font-bold"> List Task </h1>

      <ul className="space-y-2 px-3">
        {data.items.map((t) => (
          <li
            key={t._id}
            className="p-2 border-b rounded bg-blue-50 flex justify-between items-center font-semibold border-shadow-smx"
          >
            {editingTask?._id === t._id ? (
              // 🔹 Form edit inline
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdate(editingTask);
                }}
                className="flex flex-col gap-2 w-full"
              >
                <input
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="border rounded px-2 py-3 w-full"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingTask(null)}
                    className="px-3 py-1 rounded bg-gray-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 rounded bg-blue-600 text-white cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              // 🔹 Normal view
              <>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-full border-2 border-[#122670] checked:bg-[#122670] appearance-none cursor-pointer"
                    checked={t.status === "DONE"}
                    onChange={() => handleToggle(t)}
                  />
                  <div className="flex flex-col pl-3">
                    <span
                      className={
                        t.status === "DONE" ? "line-through opacity-60" : ""
                      }
                    >
                      {t.title}
                    </span>
                    <span className=" flex justify-start items-center gap-2 text-sm text-black opacity-60">
                      <AiOutlineCalendar /> {formatDate(t.createdAt)}
                    </span>
                  </div>
                </div>

                {/* Edit, delete */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingTask(t)}
                    className="text-blue-600 flex items-center gap-1 cursor-pointer"
                  >
                    <AiTwotoneEdit className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => handleDelete(t._id)}
                    className="text-red-600 flex items-center gap-1 cursor-pointer"
                  >
                    <AiOutlineDelete className="w-6 h-6" />
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex items-center gap-2 justify-end p-2">
        <button
          disabled={data.meta?.page <= 1}
          onClick={() => setQ((s) => ({ ...s, page: s.page - 1 }))}
          className="disabled:opacity-50 cursor-pointer text-white bg-[#122670] px-4 py-1 rounded-lg"
        >
          Prev
        </button>
        <span>
          {data.meta?.page} / {data.meta?.totalPages}
        </span>
        <button
          disabled={data.meta?.page >= data.meta?.totalPages}
          onClick={() => setQ((s) => ({ ...s, page: s.page + 1 }))}
          className="disabled:opacity-50 cursor-pointer bg-[#122670] text-white px-4 py-1 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
