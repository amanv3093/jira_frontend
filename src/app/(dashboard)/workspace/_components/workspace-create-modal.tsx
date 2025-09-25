"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

const WorkspaceCreateModal = ({ onClose }: Props) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!name.trim()) return;

    // TODO: call API here

    setName("");
    setFile(null);
    setPreview(null);
    onClose(); // ✅ close after submit
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
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

      {/* Workspace Name */}
      <div>
        <Label htmlFor="workspaceName">Name</Label>
        <Input
          id="workspaceName"
          placeholder="Enter workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
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
      <Button onClick={handleSubmit} className="w-full">
        Create
      </Button>
    </div>
  );
};

export default WorkspaceCreateModal;
