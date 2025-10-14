import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

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

const members: Member[] = [
  { id: "1", name: "Antoinette Martinez", role: "UI Designer", boards: 3, tasks: 24 },
  { id: "2", name: "Chris Harris", role: "Front End", boards: 3, tasks: 24 },
  { id: "3", name: "Victor Parker", role: "Full Stack", boards: 3, tasks: 24, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: "4", name: "Nick Robins", role: "Net Developer", boards: 3, tasks: 24 },
  { id: "5", name: "Sandra Osborne", role: "Team Leader", boards: 3, tasks: 24 },
  { id: "6", name: "Tim Johnson", role: "Product Owner", boards: 3, tasks: 24 },
  { id: "7", name: "Helen Coppola", role: "UI Designer", boards: 3, tasks: 24 },
];

export default function MemberCard() {
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
          {members.map((m) => (
            <Card key={m.id} className="relative overflow-visible">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      {m.avatar ? (
                        <AvatarImage src={m.avatar} alt={m.name} />
                      ) : (
                        <AvatarFallback>{m.name.split(" ").map(n => n[0]).slice(0,2).join("")}</AvatarFallback>
                      )}
                    </Avatar>

                    <div>
                      <div className="font-medium text-sm">{m.name}</div>
                      <div className="text-xs text-muted-foreground">{m.role}</div>
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
                    <div className="text-xs text-muted-foreground">Boards</div>
                    <div className="font-semibold">{m.boards}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Tasks</div>
                    <div className="font-semibold">{m.tasks}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Overdue</div>
                    <div className="font-semibold text-rose-500">{m.overdue ?? 0}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Invite card */}
          <div className="flex items-center justify-center">
            <button className="w-full max-w-[240px] h-40 border-2 border-dashed rounded-lg bg-white flex flex-col items-center justify-center text-sm text-slate-600">
              + INVITE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
