"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false);

  const handleChange = (value: string) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1>Workspaces</h1>

        <div className="bg-gray-100 rounded-md p-1 cursor-pointer hover:bg-gray-200"
          onClick={() => setIsModalOpen(true)}
        >
         
          <Plus size={14} />
        </div>
      </div>
      <div className="flex items-center justify-between mt-4">
        <Select value={selected} onValueChange={handleChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select workspace" />
          </SelectTrigger>
          <SelectContent>
            {workspaces.map((ws) => (
              <SelectItem key={ws.id} value={ws.id}>
                <div className="flex items-center gap-2">
                  {ws.profilePic ? (
                    <Image
                      src={ws.profilePic || "/default-avatar.png"}
                      alt={ws.name}
                      width={24}
                      height={24}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="bg-blue-700 rounded-md text-white h-[20px] w-[20px] flex items-center justify-center">
                      {ws.name.slice(0, 1)}
                    </div>
                  )}

                  <span>{ws.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={onClose}>
          <WorkspaceCreateModal onClose={onClose} />
        </Modal>
      )}
    </div>
  );
};

export default WorkspaceSelector;
