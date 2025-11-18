export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Plan, prioritize, and accomplish your tasks with ease.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Projects", value: 24 },
          { label: "Ended Projects", value: 10 },
          { label: "Running Projects", value: 12 },
          { label: "Pending Projects", value: 2 },
        ].map((card) => (
          <div key={card.label} className="bg-green-700 text-white p-6 rounded-xl shadow-sm">
            <p className=" text-sm">{card.label}</p>
            <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
          </div>
        ))}
      </div>

      {/* Project Analytics Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold mb-3">Project Analytics</h3>
        <div className="h-32 bg-gray-100 rounded-lg" />
      </div>

      {/* Lower Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Team Collaboration */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Team Collaboration</h3>
          <div className="space-y-3">
            {["Alexandra", "Edwin", "Issaq", "David"].map((name) => (
              <div key={name} className="p-3 bg-gray-100 rounded-lg">
                <p className="font-medium">{name}</p>
                <p className="text-xs text-gray-500">Working on project...</p>
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold mb-4">Project Progress</h3>
          <div className="h-40 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold">41%</span>
            <p className="text-gray-500 text-sm">Project Completed</p>
          </div>
        </div>

        {/* Time Tracker */}
        <div className="bg-green-700 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
          <div className="text-center">
            <h4 className="font-semibold">Time Tracker</h4>
            <p className="text-3xl mt-4 font-mono">01:24:08</p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button className="h-10 w-10 bg-white/20 rounded-full"></button>
            <button className="h-10 w-10 bg-white rounded-full"></button>
            <button className="h-10 w-10 bg-white/20 rounded-full"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
