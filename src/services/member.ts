import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, } from "@/types";

const MEMBER_API = {
  POST: "member/invite",
  GET_BY_WORKSPACE_ID: (id: string) => `member/${id}`,
  REMOVE: (workspaceId: string, memberId: string) => `member/${workspaceId}/${memberId}`,
  UPDATE_ROLE: (workspaceId: string, memberId: string) => `member/${workspaceId}/${memberId}/role`,
} as const;

export const memberService = {
  inviteMember: (payload: FormData) =>
    fetchHandler<ApiResponse>(MEMBER_API.POST, "POST", payload),
  getMemberByWorkspaceId: (id: string) =>
    fetchHandler<ApiResponse>(MEMBER_API.GET_BY_WORKSPACE_ID(id), "GET"),
  removeMember: (workspaceId: string, memberId: string) =>
    fetchHandler<ApiResponse>(MEMBER_API.REMOVE(workspaceId, memberId), "DELETE"),
  updateMemberRole: (workspaceId: string, memberId: string, role: string) =>
    fetchHandler<ApiResponse>(MEMBER_API.UPDATE_ROLE(workspaceId, memberId), "PUT", { role }),
};
