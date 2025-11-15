"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateWorkspace } from "@/hooks/workspace";

interface Props {
  onClose: () => void;
}

// ---------------- Zod Schema ----------------
const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required"),
  image: z.instanceof(File).optional().nullable(),
});

type WorkSpaceFormData = z.infer<typeof workspaceSchema>;

const WorkspaceCreateModal = ({ onClose }: Props) => {
  const createWorkspace = useCreateWorkspace();
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<WorkSpaceFormData>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      image: null,
    },
  });

  const onSubmit = (data: WorkSpaceFormData) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data.image) {
      formData.append("profilePic", data.image);
    }

    createWorkspace.mutate(formData, {
      onSuccess: () => {
        reset();
        setPreview(null);
        onClose();
      },
    });

   
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setValue("image", selectedFile); // ✅ store in RHF
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Close Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Create Workspace</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-md hover:bg-gray-100"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Workspace Name */}
        <div>
          <Label htmlFor="workspaceName">Name</Label>
          <Input
            id="workspaceName"
            placeholder="Enter workspace name"
            {...register("name")}
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Optional Profile Picture */}
        <div>
          <Label htmlFor="workspaceImage">Profile Picture (optional)</Label>
          <Input
            id="workspaceImage"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <div className="mt-2">
              <Image
                src={preview}
                alt="Preview"
                width={60}
                height={60}
                className="rounded-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full">
          Create
        </Button>
      </form>
    </div>
  );
};

export default WorkspaceCreateModal;
