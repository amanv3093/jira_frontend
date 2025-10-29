import { fetchHandler } from "@/lib/api-utils";
import { ApiResponse, } from "@/types";

const MEMBER_API = {
  POST: "member/invite",
  GET_BY_WORKSPACE_ID: (id: string) => `member/${id}`,
 
} as const;

export const memberService = {
  inviteMember: (payload: FormData) =>
    fetchHandler<ApiResponse>(MEMBER_API.POST, "POST", payload),
   getMemberByWorkspaceId: (id: string) =>
      fetchHandler<ApiResponse>(MEMBER_API.GET_BY_WORKSPACE_ID(id), "GET"),
 
};
