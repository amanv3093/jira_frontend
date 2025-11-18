"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Modal from "@/components/modal/custom-modal";
import InvitePage from "./invite-modal";
import { useGetMemberByWorkspaceId } from "@/hooks/member";
import { useParams } from "next/navigation";
import Loader from "@/app/Loader";
import JoinPage from "./join-modal";

// Sample member type
type Member = {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  boards: number;
  tasks: number;
  overdue?: number;
};



export default function MemberCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false);

  const [isModalJoinOpen, setIsModalJoinOpen] = useState(false);
  const onCloseJoin = () => setIsModalJoinOpen(false);

  const params = useParams();
  const workspaceId = params?.id as string;
  const { data: members, isLoading } = useGetMemberByWorkspaceId(workspaceId);
  console.log("member", members);
  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-[1180px] mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Members</h1>
          <div className="flex items-center gap-3">
            <input
              placeholder="Search"
              className="px-3 py-2 border rounded-md bg-white text-sm shadow-sm"
            />
            <Button size="sm">New</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           <div
            className="flex items-center justify-center"
            onClick={() => setIsModalOpen(true)}
          >
            <button className="w-full max-w-[240px] h-40 border-2 border-dashed rounded-lg bg-white flex flex-col items-center justify-center text-sm text-slate-600">
              + INVITE
            </button>
          </div>
           <div
            className="flex items-center justify-center"
            onClick={() => setIsModalJoinOpen(true)}
          >
            <button className="w-full max-w-[240px] h-40 border-2 border-dashed rounded-lg bg-white flex flex-col items-center justify-center text-sm text-slate-600">
              + Join
            </button>
          </div>
          {members?.map((m) => (
            <Card key={m.id} className="relative overflow-visible">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {m?.avatar ? (
                        <AvatarImage src={m?.avatar} alt={m?.name} />
                      ) : (
                        <AvatarFallback>
                          {m?.user?.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </AvatarFallback>
                      )}
                    </Avatar>

                    <div>
                      <div className="font-medium text-sm">{m.user?.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {m?.role}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Assign task</DropdownMenuItem>
                        <DropdownMenuItem>View time records</DropdownMenuItem>
                        <DropdownMenuItem>Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 text-center">
                  <div>
                    <div className="text-xs text-muted-foreground">Tasks</div>
                    <div className="font-semibold">{m?.stats?.totalTasks}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Completed</div>
                    <div className="font-semibold">{m?.stats?.completedTasks}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                    <div className="font-semibold text-rose-500">
                      {m?.stats?.overdueTasks}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Invite card */}
         
        </div>
      </div>
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={onClose}>
          <InvitePage onClose={onClose} />
        </Modal>
      )}
      {isModalJoinOpen && (
        <Modal isOpen={isModalJoinOpen} onClose={onCloseJoin}>
          <JoinPage onClose={onCloseJoin} />
        </Modal>
      )}
    </div>
  );
}
