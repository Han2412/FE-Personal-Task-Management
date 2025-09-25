import { useEffect, useState } from "react";
import { AiOutlineDelete, AiFillPlusCircle } from "react-icons/ai";
export default function Home() {
  const [q, setQ] = useState({
    page: 1,
    limit: 6,
    status: "",
    from: "",
    to: "",
  });
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [title, setTitle] = useState("");

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6 flex flex-col justify-center border rounded-lg border-blue mt-10">
      {/* Add new task */}
      <div className="border-b flex flex-col space-y-3 pb-4">
        {" "}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (title.trim()) {
              setData((prev) => ({
                ...prev,
                items: [
                  ...prev.items,
                  { _id: Date.now(), title, completed: false },
                ],
              }));
              setTitle("");
            }
          }}
          className="flex gap-2"
        >
          <input
            className="input input-bordered flex-1 px-3 py-2 rounded-lg border"
            placeholder="New task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white gap-1 flex items-center">
            Add task
            <AiFillPlusCircle />
          </button>
        </form>
        {/* fillter  */}
        <div className="flex flex-wrap gap-2 items-end">
          <select
            className="border rounded px-2 py-1"
            value={q.status}
            onChange={(e) => setQ((s) => ({ ...s, status: e.target.value }))}
          >
            <option value="">All</option>
            <option value="true">Completed</option>
          </select>
          <input
            type="date"
            className="border rounded px-2 py-1"
            onChange={(e) => setQ((s) => ({ ...s, from: e.target.value }))}
          />
          <input
            type="date"
            className="border rounded px-2 py-1"
            onChange={(e) => setQ((s) => ({ ...s, to: e.target.value }))}
          />
        </div>
      </div>
      {/* List Task */}
      <h1 className="text-2xl"> List Task </h1>
      <ul className="space-y-2">
        {data.items.map((t) => (
          <li
            key={t._id}
            className="p-4 border-b rounded bg-blue-50 hover:cursor-pointer flex justify-between items-center"
          >
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 hover:bg-blue"
                checked={t.completed}
                onChange={() =>
                  setData((prev) => ({
                    ...prev,
                    items: prev.items.map((item) =>
                      item._id === t._id
                        ? { ...item, completed: !item.completed }
                        : item
                    ),
                  }))
                }
              />
              <span className={t.completed ? "line-through opacity-60" : ""}>
                {t.title}
              </span>
            </div>
            <button
              onClick={() =>
                setData((prev) => ({
                  ...prev,
                  items: prev.items.filter((item) => item._id !== t._id),
                }))
              }
              className="text-red-600 flex items-center gap-1 cursor-pointer"
            >
              <AiOutlineDelete />
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex items-center gap-2">
        <button
          disabled={data.page <= 1}
          onClick={() => setQ((s) => ({ ...s, page: s.page - 1 }))}
          className="disabled:opacity-50 cusor-pointer"
        >
          <span>Page {data.page}</span> / <span>{data.pages}</span>
        </button>
        <button
          disabled={data.page >= data.pages}
          onClick={() => setQ((s) => ({ ...s, page: s.page + 1 }))}
          className="disabled:opacity-50 cusor-pointer"
        >
          <span>Next</span>
        </button>
      </div>
    </div>
  );
}
