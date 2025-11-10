// "use client";

// import { useGetWorkspaceById } from "@/hooks/workspace";
// import { useParams } from "next/navigation";
// import React from "react";
// import TaskStatsCards from "../project/[project_id]/_component/task-stats-card";

// function WorkspacePage() {
//   const params = useParams();
//   const workspaceId = params?.id as string;
//   // const { data: workspaceData } = useGetWorkspaceById(workspaceId);
//   // console.log("workspaceData", workspaceData);
//   return (
//     <div>
//       <p>WorkspacePage</p>

//       <TaskStatsCards />
//     </div>
//   );
// }

// export default WorkspacePage;
"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";

interface Task {
  id: string;
  title: string;
  due: string;
  status: "todo" | "in-progress" | "done";
}

interface Project {
  id: string;
  title: string;
  description: string;
}

export default function WorkspacePage() {
  const { id } = useParams();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setTasks([
      { id: "t1", title: "Create UI System", due: "Today", status: "in-progress" },
      { id: "t2", title: "Fix Auth bugs", due: "Tomorrow", status: "todo" },
      { id: "t3", title: "Deploy API Server", due: "Next week", status: "done" },
    ]);

    setProjects([
      { id: "p1", title: "Platform Engine", description: "Core backend services" },
      { id: "p2", title: "Dashboard UI", description: "Front UI revamp" },
      { id: "p3", title: "Notification System", description: "Alerts + automation" },
    ]);
  }, []);

  const statusColor = {
    todo: "bg-gray-200 text-gray-600",
    "in-progress": "bg-indigo-200 text-indigo-700",
    done: "bg-green-200 text-green-700",
  };

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Sidebar */}
    

      {/* Main */}
      <main className="flex-1 p-8 space-y-10">
        
        {/* Top bar */}
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold">Welcome Back 👋</h2>
            <p className="text-gray-500 text-sm mt-1">
              Workspace ID: <span className="text-blue-600">{id}</span>
            </p>
          </div>

          <div className="flex gap-3 items-center">
            <div className="bg-white flex items-center gap-2 border rounded-lg px-3 py-2">
              <FiSearch className="text-gray-500" />
              <input placeholder="Search…" className="outline-none text-sm" />
            </div>

            <button className="bg-black text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
              <FiPlus /> New Task
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { label: "Tasks", value: tasks.length },
            { label: "In Progress", value: tasks.filter(t=>t.status==="in-progress").length },
            { label: "Completed", value: tasks.filter(t=>t.status==="done").length },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-sm border">
              <p className="text-gray-500 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Projects & Tasks */}
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Projects */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-lg">Projects</h3>
              <button className="text-indigo-600 text-sm">+ Add</button>
            </div>

            <div className="space-y-4">
              {projects.map((p) => (
                <div key={p.id} className="bg-white p-5 rounded-xl border shadow-sm hover:shadow-lg transition cursor-pointer">
                  <h4 className="font-semibold text-base">{p.title}</h4>
                  <p className="text-gray-500 text-sm mt-1">{p.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div>
            <div className="flex justify-between mb-3">
              <h3 className="font-semibold text-lg">Recent Tasks</h3>
            </div>

            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-400">{task.due}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor[task.status]}`}>
                    {task.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
