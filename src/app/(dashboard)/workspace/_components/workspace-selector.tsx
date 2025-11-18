"use client";

import { ArrowRightLeft, Check, Plus, Search } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import WorkspaceCreateModal from "./workspace-create-modal";
import Modal from "@/components/modal/custom-modal";

interface Workspace {
  id: string;
  name: string;
  profilePic: string | null;
}

interface Props {
  workspaces: Workspace[];
  onSelect: (workspaceId: string) => void;
}

const WorkspaceSelector = ({ workspaces, onSelect }: Props) => {
  const [selected, setSelected] = useState(workspaces?.[0]?.id || "");
  const current = workspaces.find((ws) => ws.id === selected);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false);

  const [search, setSearch] = useState("");

  const handleSwitchWorkspace = (wsId: string) => {
    setSelected(wsId);
    onSelect(wsId);
    setIsSwitchModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>Workspaces</h1>

        {/* Add new workspace */}
        <button
          className="bg-gray-100 rounded-md p-1 hover:bg-gray-200"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Switch button */}
      <div
        className="mt-4 bg-white border w-full p-3 rounded-lg cursor-pointer hover:bg-gray-50 
  flex items-center justify-between transition"
        onClick={() => setIsSwitchModalOpen(true)}
      >
        <div className="flex items-center gap-2">
          {current?.profilePic ? (
            <Image
              src={current.profilePic}
              alt={current.name}
              width={28}
              height={28}
              className="rounded-md object-cover h-[32px] w-[32px]"
            />
          ) : (
            <div className="bg-blue-600 rounded-md text-white h-[32px] w-[32px] flex items-center justify-center text-sm font-medium">
              {current?.name.slice(0, 1)}
            </div>
          )}

          <span className="font-medium text-sm">{current?.name}</span>
        </div>

        <ArrowRightLeft size={18} className="text-gray-600" />
      </div>

      {/* Switch Workspace Modal */}
      {isSwitchModalOpen && (
        <Modal
          isOpen={isSwitchModalOpen}
          onClose={() => setIsSwitchModalOpen(false)}
        >
          <div className="bg-white rounded-xl p-5 w-[380px] max-h-[460px] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="font-semibold text-lg">Switch Workspace</h2>
              <button
                onClick={() => setIsSwitchModalOpen(false)}
                className="p-1.5 rounded-md hover:bg-gray-200 text-gray-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Search Input */}
            <div className="mt-4 border rounded-lg flex items-center gap-2 px-3 py-2 bg-gray-50">
              <Search size={16} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search workspace..."
                className="w-full text-sm bg-transparent outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </div>

            {/* Workspace List */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {workspaces
                .filter((ws) => ws.name.toLowerCase().includes(search))
                .map((ws) => {
                  const isCurrent = selected === ws.id;

                  return (
                    <button
                      key={ws.id}
                      className={`flex flex-col items-center w-full p-4 rounded-lg border text-center transition 
                ${
                  isCurrent
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 hover:bg-gray-100"
                }
              `}
                      onClick={() => handleSwitchWorkspace(ws.id)}
                    >
                      <div className="relative">
                        {ws.profilePic ? (
                          <Image
                            src={ws.profilePic}
                            alt={ws.name}
                            width={44}
                            height={44}
                            className="rounded-lg object-cover h-[44px] w-[44px]"
                          />
                        ) : (
                          <div className="bg-blue-600 text-white h-[44px] w-[44px] rounded-lg flex items-center justify-center font-medium uppercase">
                            {ws.name.slice(0, 1)}
                          </div>
                        )}
                      </div>

                      <p className="font-medium text-sm mt-2">{ws.name}</p>
                      <p className="text-[10px] text-gray-500">
                        {isCurrent ? "Active" : "Switch"}
                      </p>
                    </button>
                  );
                })}
            </div>
          </div>
        </Modal>
      )}

      {/* Create Workspace Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        >
          <WorkspaceCreateModal onClose={() => setIsCreateModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
};

export default WorkspaceSelector;

// "use client";

// import { Plus } from "lucide-react";
// import Image from "next/image";
// import { useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import WorkspaceCreateModal from "./workspace-create-modal";
// import Modal from "@/components/modal/custom-modal";

// interface Workspace {
//   id: string;
//   name: string;
//   profilePic: string | null;
// }

// interface Props {
//   workspaces: Workspace[];
//   onSelect: (workspaceId: string) => void;
// }

// const WorkspaceSelector = ({ workspaces, onSelect }: Props) => {
//   const [selected, setSelected] = useState(workspaces?.[0]?.id || "");

//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const onClose = () => setIsModalOpen(false);

//   const handleChange = (value: string) => {
//     setSelected(value);
//     onSelect(value);
//   };

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <h1>Workspaces</h1>

//         <div className="bg-gray-100 rounded-md p-1 cursor-pointer hover:bg-gray-200"
//           onClick={() => setIsModalOpen(true)}
//         >

//           <Plus size={14} />
//         </div>
//       </div>
//       <div className="flex items-center justify-between mt-4">
//         <Select value={selected} onValueChange={handleChange}>
//           <SelectTrigger className="w-full">
//             <SelectValue placeholder="Select workspace" />
//           </SelectTrigger>
//           <SelectContent>
//             {workspaces.map((ws) => (
//               <SelectItem key={ws.id} value={ws.id}>
//                 <div className="flex items-center gap-2">
//                   {ws.profilePic ? (
//                     <Image
//                       src={ws.profilePic || "/default-avatar.png"}
//                       alt={ws.name}
//                       width={20}
//                       height={20}
//                       className="rounded-md h-[20px] w-[20px] object-cover"
//                     />
//                   ) : (
//                     <div className="bg-blue-700 rounded-md text-white h-[20px] w-[20px] flex items-center justify-center">
//                       {ws.name.slice(0, 1)}
//                     </div>
//                   )}

//                   <span>{ws.name}</span>
//                 </div>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       </div>
//       {isModalOpen && (
//         <Modal isOpen={isModalOpen} onClose={onClose}>
//           <WorkspaceCreateModal onClose={onClose} />
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default WorkspaceSelector;
