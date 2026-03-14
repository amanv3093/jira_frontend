"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Camera,
  Save,
  Mail,
  Shield,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { useGetUserProfile, useUpdateUserProfile, useChangePassword } from "@/hooks/user";
import Loader from "@/app/Loader";

function getInitials(firstName: string, lastName: string) {
  return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase() || "U";
}

const ROLE_STYLE: Record<string, string> = {
  ADMIN: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  MANAGER: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  USER: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data: profile, isLoading } = useGetUserProfile();
  const updateProfile = useUpdateUserProfile();
  const changePassword = useChangePassword();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
    }
  }, [profile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = () => {
    const formData = new FormData();
    if (firstName.trim()) formData.append("first_name", firstName.trim());
    if (lastName.trim()) formData.append("last_name", lastName.trim());
    if (selectedFile) formData.append("avatarUrl", selectedFile);

    updateProfile.mutate(formData, {
      onSuccess: () => {
        setSelectedFile(null);
      },
    });
  };

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) return;
    if (!currentPassword || !newPassword) return;

    changePassword.mutate(
      { currentPassword, newPassword },
      {
        onSuccess: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <Loader size={40} />
      </div>
    );
  }

  const avatarSrc = previewUrl || profile?.avatarUrl;
  const hasProfileChanges =
    firstName.trim() !== (profile?.first_name || "") ||
    lastName.trim() !== (profile?.last_name || "") ||
    selectedFile !== null;

  const passwordsMatch = newPassword === confirmPassword;
  const canChangePassword =
    currentPassword.length > 0 &&
    newPassword.length >= 6 &&
    passwordsMatch;

  return (
    <div className="p-6 max-w-[900px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-muted">
          <User className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Manage your personal information
          </p>
        </div>
      </div>

      {/* Profile Info Card */}
      <Card className="border shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Personal Information</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar upload */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="relative group cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Avatar className="h-24 w-24 border-2 border-muted">
                  {avatarSrc ? (
                    <AvatarImage src={avatarSrc} alt="Profile" />
                  ) : null}
                  <AvatarFallback className="text-xl font-bold bg-muted">
                    {getInitials(
                      profile?.first_name || "",
                      profile?.last_name || ""
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="h-5 w-5 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-[11px] text-muted-foreground">
                Click to upload
              </span>
            </div>

            {/* Form fields */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="h-10"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="h-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  Email
                </label>
                <Input
                  value={profile?.email || ""}
                  readOnly
                  className="h-10 bg-muted/50 text-muted-foreground"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Role:</span>
                </div>
                <Badge
                  className={`text-[11px] px-2 py-0.5 border-0 font-medium ${
                    ROLE_STYLE[profile?.role || "USER"] || ROLE_STYLE.USER
                  }`}
                >
                  {profile?.role || "USER"}
                </Badge>

                {profile?.createdAt && (
                  <>
                    <span className="text-border">|</span>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        Joined{" "}
                        {new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSaveProfile}
              disabled={!hasProfileChanges || updateProfile.isPending}
              className="gap-2"
              size="sm"
            >
              {updateProfile.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="border shadow-sm">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-base font-semibold">Change Password</h2>
          </div>

          <div className="max-w-md space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <div className="relative">
                <Input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  className="h-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm New Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`h-10 ${
                  confirmPassword && !passwordsMatch
                    ? "border-red-500 focus-visible:ring-red-500"
                    : ""
                }`}
              />
              {confirmPassword && !passwordsMatch && (
                <p className="text-xs text-red-500">Passwords do not match</p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleChangePassword}
              disabled={!canChangePassword || changePassword.isPending}
              className="gap-2"
              size="sm"
            >
              {changePassword.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
