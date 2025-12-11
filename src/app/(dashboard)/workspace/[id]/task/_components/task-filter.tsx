"use client";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  BrushCleaning,
  Flag,
  Folder,
  ListChecks,
  ListFilter,
  Search,
  SearchX,
  Squirrel,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Member, Project } from "@/types";

interface TaskFiltersProps {
  onFilterChange: (filters: {
    status: string[];
    priority: string[];
    project: string[]; // project IDs
    assignee: string[];
    search: string;
  }) => void;
  project?: Project[];
  members: Member[];
}

export default function TaskFilters({
  onFilterChange,
  project,
  members,
}: TaskFiltersProps) {
  const router = useRouter();

  const allStatuses = [
    { key: "BACKLOG", label: "Backlog" },
    { key: "TODO", label: "To Do" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "IN_REVIEW", label: "In Review" },
    { key: "DONE", label: "Done" },
  ];

  const allPriorities = [
    { key: "LOW", label: "Low" },
    { key: "MEDIUM", label: "Medium" },
    { key: "HIGH", label: "High" },
    { key: "CRITICAL", label: "Critical" },
  ];

  const [search, setSearch] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const totalActiveFilters =
    selectedProjects.length +
    selectedUsers.length +
    selectedStatuses.length +
    selectedPriorities.length;

  // Update URL + trigger parent callback when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (selectedStatuses.length)
      params.set("status", selectedStatuses.join(","));
    if (selectedPriorities.length)
      params.set("priority", selectedPriorities.join(","));
    if (selectedProjects.length)
      params.set("project", selectedProjects.join(","));
    if (selectedUsers.length) params.set("assignee", selectedUsers.join(","));
    if (search) params.set("search", search);

    router.replace(`${window.location.pathname}?${params.toString()}`);

    onFilterChange({
      status: selectedStatuses,
      priority: selectedPriorities,
      project: selectedProjects, // send IDs
      assignee: selectedUsers,
      search,
    });
  }, [
    selectedStatuses,
    selectedPriorities,
    selectedProjects,
    selectedUsers,
    search,
  ]);

  const createFilterSection = (
    title: string,
    items: { key: string; label: string }[],
    selected: string[],
    setSelected: (items: string[]) => void,
    Icon?: React.ElementType
  ) => {
    const [localSearch, setLocalSearch] = useState("");

    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="text-sm py-1 px-2 flex justify-between cursor-pointer select-none hover:bg-gray-100 data-[state=open]:bg-blue-100 data-[state=open]:border-l-2 data-[state=open]:border-info outline-none">
          <div className="flex items-center gap-2">
            {" "}
            {Icon && <Icon size={14} className="" />} <span>{title}</span>{" "}
          </div>
          {selected.length > 0 && (
            <span className="bg-blue-200 text-xs px-3 flex justify-center items-center font-normal w-[30px]">
              {selected.length}
            </span>
          )}
        </DropdownMenuSubTrigger>

        <DropdownMenuPortal>
          <DropdownMenuSubContent className="w-56 p-2 ml-[9px] mt-[-9px] bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="relative mb-2">
              <div className="absolute left-0 top-[50%] transform -translate-y-1/2 pl-3 pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {items
              .filter((item) =>
                item.label.toLowerCase().includes(localSearch.toLowerCase())
              )
              .map((item) => (
                <DropdownMenuItem
                  key={item.key}
                  onSelect={(e) => {
                    e.preventDefault();
                    setSelected(
                      selected.includes(item.key)
                        ? selected.filter((i) => i !== item.key)
                        : [...selected, item.key]
                    );
                  }}
                  className={`flex justify-between items-center px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                    selected.includes(item.key) ? "bg-blue-100" : ""
                  } outline-none focus:outline-none focus:ring-0 border-none cursor-pointer`}
                >
                  {item.label}
                  {selected.includes(item.key) && (
                    <span className="text-blue-500 font-bold">✔</span>
                  )}
                </DropdownMenuItem>
              ))}

            {items.filter((i) =>
              i.label.toLowerCase().includes(localSearch.toLowerCase())
            ).length === 0 && (
              <div className="flex justify-center items-center pt-1 gap-1">
                <SearchX size={14} className="text-gray-400" />
                <div className=" text-gray-400 text-xs"> No results</div>
              </div>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  };

  const createProjectFilterSection = () => {
    const [localSearch, setLocalSearch] = useState("");

    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="text-sm py-1 px-2 flex justify-between cursor-pointer select-none hover:bg-gray-100 data-[state=open]:bg-blue-100 data-[state=open]:border-l-2 data-[state=open]:border-info outline-none">
          <div className="flex items-center gap-2">
            <Folder size={14} />
            <span>Project</span>{" "}
          </div>
          {selectedProjects.length > 0 && (
            <span className="bg-blue-200 text-xs px-3 flex justify-center items-center font-normal w-[30px]">
              {selectedProjects.length}
            </span>
          )}
        </DropdownMenuSubTrigger>

        <DropdownMenuPortal>
          <DropdownMenuSubContent className="w-56 p-2 ml-[9px] mt-[-9px] bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="relative mb-2">
              <div className="absolute left-0 top-[50%] transform -translate-y-1/2 pl-3 pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search project..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            {project?.filter((p) =>
                p.name.toLowerCase().includes(localSearch.toLowerCase())
              )
              .map((p) => (
                <DropdownMenuItem
                  key={p.id}
                  onSelect={(e) => {
                    e.preventDefault();
                    setSelectedProjects((prev) =>
                      prev.includes(p.id)
                        ? prev.filter((id) => id !== p.id)
                        : [...prev, p.id]
                    );
                  }}
                  className={`flex justify-between items-center px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                    selectedProjects.includes(p.id) ? "bg-blue-100" : ""
                  } outline-none focus:outline-none focus:ring-0 border-none cursor-pointer`}
                >
                  {p.name}
                  {selectedProjects.includes(p.id) && (
                    <span className="text-blue-500 font-bold">✔</span>
                  )}
                </DropdownMenuItem>
              ))}

            {project?.filter((p) =>
              p.name.toLowerCase().includes(localSearch.toLowerCase())
            ).length === 0 && (
              <div className="flex justify-center items-center pt-1 gap-1">
                <SearchX size={14} className="text-gray-400" />
                <div className=" text-gray-400 text-xs"> No results</div>
              </div>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  };

  const createAssigneeFilterSection = () => {
    const [localSearch, setLocalSearch] = useState("");

    return (
      <DropdownMenuSub>
        <DropdownMenuSubTrigger className="text-sm py-1 px-2 flex justify-between cursor-pointer select-none hover:bg-gray-100 data-[state=open]:bg-blue-100 data-[state=open]:border-l-2 data-[state=open]:border-info outline-none">
          <div className="flex items-center gap-2">
            <UserPlus size={14} />
            <span>Assignee</span>
          </div>
          {selectedUsers.length > 0 && (
            <span className="bg-blue-200 text-xs px-3 flex justify-center items-center font-normal w-[30px]">
              {selectedUsers.length}
            </span>
          )}
        </DropdownMenuSubTrigger>

        <DropdownMenuPortal>
          <DropdownMenuSubContent className="w-56 p-2 ml-[9px] mt-[-9px] bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="relative mb-2">
              <div className="absolute left-0 top-[50%] transform -translate-y-1/2 pl-3 pointer-events-none">
                <Search size={16} className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search Assignee..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-1 border border-gray-300 shadow-sm focus:outline-none focus:ring-1 focus:ring-info sm:text-sm"
              />
            </div>

            {members
              ?.filter((m) =>
                m.user.full_name
                  .toLowerCase()
                  .includes(localSearch.toLowerCase())
              )
              .map((m) => (
                <DropdownMenuItem
                  key={m.user.id}
                  onSelect={(e) => {
                    e.preventDefault();
                    setSelectedUsers((prev) =>
                      prev.includes(m.user.id)
                        ? prev.filter((id) => id !== m.user.id)
                        : [...prev, m.user.id]
                    );
                  }}
                  className={`flex justify-between items-center px-2 py-1 text-sm rounded hover:bg-gray-100  ${
                    selectedUsers.includes(m.user.id) ? "bg-blue-100" : ""
                  } outline-none focus:outline-none focus:ring-0 border-none cursor-pointer`}
                >
                  {m.user.full_name}
                  {selectedUsers.includes(m.user.id) && (
                    <span className="text-blue-500 font-bold">✔</span>
                  )}
                </DropdownMenuItem>
              ))}

            {members?.filter((m) =>
              m.user.full_name.toLowerCase().includes(localSearch.toLowerCase())
            ).length === 0 && (
              <div className="flex justify-center items-center pt-1 gap-1">
                <SearchX size={14} className="text-gray-400" />
                <div className=" text-gray-400 text-xs"> No results</div>
              </div>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  };

  return (
    <div className="flex gap-2">
      <div className="relative w-[200px]">
        {/* Search Icon */}
        <div className="absolute left-0 top-[50%] transform -translate-y-1/2 pl-3 pointer-events-none">
          <Search size={16} className="text-gray-500 " />
        </div>

        {/* Input Field */}
        <input
          type="text"
          placeholder="Search..."
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-10 pr-3 py-1 border border-gray-300  shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className={`!py-1 !h-[30px] !rounded-none font-normal flex items-center gap-1 ${
              totalActiveFilters > 0
                ? "border-info bg-blue-100 text-info"
                : "border-gray-300 text-gray-700"
            }`}
          >
            <ListFilter
              className={totalActiveFilters > 0 ? "text-info" : "text-black"}
            />
            Filter
            {totalActiveFilters > 0 && (
              <span className="bg-blue-400 ml-1 text-xs text-black px-2 rounded-sm flex justify-center items-center font-medium">
                {totalActiveFilters}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        {totalActiveFilters > 0 && (
          <Button
            variant="outline"
            className={`!py-1 !h-[30px] !rounded-none font-normal flex items-center gap-1`}
            onClick={() => {
              setSelectedProjects([]);
              setSelectedUsers([]);
              setSelectedStatuses([]);
              setSelectedPriorities([]);
            }}
          >
            Clear filters
          </Button>
        )}

        <DropdownMenuContent
          sideOffset={4}
          alignOffset={0}
          className="w-56 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-50"
          align="start"
        >
          <DropdownMenuGroup>
            {project && createProjectFilterSection()}

            {createAssigneeFilterSection()}
            {createFilterSection(
              "Status",
              allStatuses,
              selectedStatuses,
              setSelectedStatuses,
              ListChecks
            )}
            {createFilterSection(
              "Priority",
              allPriorities,
              selectedPriorities,
              setSelectedPriorities,
              Flag
            )}
          </DropdownMenuGroup>

          <div className=" mt-4 px-1 border-t border-gray-200 pt-1">
            <div className="hover:bg-gray-100 flex items-center px-2 gap-2 w-fit rounded-sm">
            <BrushCleaning size={14} />
            <button
              className="text-[12px] py-1 font-semibold"
              onClick={() => {
                setSelectedProjects([]);
                setSelectedUsers([]);
                setSelectedStatuses([]);
                setSelectedPriorities([]);
              }}
            >
              Clear All
            </button>
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
