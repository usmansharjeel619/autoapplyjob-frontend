import React, { useState, useEffect } from "react";
import {
  Bell,
  Shield,
  Mail,
  Smartphone,
  Lock,
  Download,
  Trash2,
  Save,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Modal from "../../components/ui/Modal";
import userService from "../../services/user.service";
import authService from "../../services/auth.service";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError, showWarning } = useApp();

  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Email Notifications
    emailJobMatches: true,
    emailApplicationUpdates: true,
    emailWeeklyReport: false,

    // Security
    sessionTimeout: "30",
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await userService.getSettings();
      if (response.settings) {
        setSettings((prev) => ({
          ...prev,
          ...response.settings,
        }));
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  };

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      await userService.updateSettings(settings);
      showSuccess("Settings saved successfully!");
    } catch (error) {
      showError("Failed to save settings");
      console.error("Settings save error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError("New passwords don't match");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    try {
      await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      showSuccess("Password changed successfully!");
      setShowChangePasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      showError(error.response?.data?.message || "Failed to change password");
    }
  };

  const handleExportData = async () => {
    try {
      // Create a data export object
      const exportData = {
        profile: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          location: user.location,
          currentJobTitle: user.currentJobTitle,
          experienceLevel: user.experienceLevel,
          educationLevel: user.educationLevel,
          skills: user.skills,
          bio: user.bio,
        },
        settings: settings,
        exportDate: new Date().toISOString(),
      };

      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `autoapplyjob-data-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showSuccess("Data exported successfully!");
    } catch (error) {
      showError("Failed to export data");
    }
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      // In a real app, you'd call an API to delete the account
      showWarning("Account deletion feature will be available soon");
      setShowDeleteModal(false);
    } catch (error) {
      showError("Failed to delete account");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account preferences and security settings
        </p>
      </div>

      {/* Email Notifications */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Bell size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold">Email Notifications</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Job Match Alerts
                </label>
                <p className="text-sm text-gray-500">
                  Get notified when we find jobs that match your profile
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailJobMatches}
                onChange={(e) =>
                  handleSettingChange("emailJobMatches", e.target.checked)
                }
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Application Updates
                </label>
                <p className="text-sm text-gray-500">
                  Get notified about changes to your job applications
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailApplicationUpdates}
                onChange={(e) =>
                  handleSettingChange(
                    "emailApplicationUpdates",
                    e.target.checked
                  )
                }
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Weekly Report
                </label>
                <p className="text-sm text-gray-500">
                  Receive a weekly summary of your job search activity
                </p>
              </div>
              <input
                type="checkbox"
                checked={settings.emailWeeklyReport}
                onChange={(e) =>
                  handleSettingChange("emailWeeklyReport", e.target.checked)
                }
                className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      

      {/* Security Settings */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <Lock size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold">Security</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout
              </label>
              <Select
                value={settings.sessionTimeout}
                onChange={(value) =>
                  handleSettingChange("sessionTimeout", value)
                }
                options={[
                  { value: "15", label: "15 minutes" },
                  { value: "30", label: "30 minutes" },
                  { value: "60", label: "1 hour" },
                  { value: "120", label: "2 hours" },
                ]}
              />
              <p className="text-sm text-gray-500 mt-1">
                Automatically log out after this period of inactivity
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowChangePasswordModal(true)}
                icon={<Lock size={16} />}
              >
                Change Password
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Account Management */}
      <Card>
        <Card.Header>
          <div className="flex items-center gap-2">
            <User size={20} className="text-gray-600" />
            <h3 className="text-lg font-semibold">Account Management</h3>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  Export Your Data
                </h4>
                <p className="text-sm text-gray-500">
                  Download a copy of your profile data and settings
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleExportData}
                icon={<Download size={16} />}
              >
                Export Data
              </Button>
            </div>

            <div className="pt-4 border-t border-red-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-red-900">
                    Delete Account
                  </h4>
                  <p className="text-sm text-red-600">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleDeleteAccount}
                  icon={<Trash2 size={16} />}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSaveSettings}
          loading={loading}
          icon={<Save size={16} />}
          className="bg-black hover:bg-gray-800 text-white"
        >
          {loading ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={showChangePasswordModal}
        onClose={() => {
          setShowChangePasswordModal(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }}
        title="Change Password"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Current Password"
            type={showPasswords.current ? "text" : "password"}
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                currentPassword: e.target.value,
              }))
            }
            placeholder="Enter your current password"
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    current: !prev.current,
                  }))
                }
                className="text-gray-400 hover:text-gray-600"
              >
                {showPasswords.current ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            }
            required
          />

          <Input
            label="New Password"
            type={showPasswords.new ? "text" : "password"}
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                newPassword: e.target.value,
              }))
            }
            placeholder="Enter your new password"
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    new: !prev.new,
                  }))
                }
                className="text-gray-400 hover:text-gray-600"
              >
                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            required
          />

          <Input
            label="Confirm New Password"
            type={showPasswords.confirm ? "text" : "password"}
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            placeholder="Confirm your new password"
            rightIcon={
              <button
                type="button"
                onClick={() =>
                  setShowPasswords((prev) => ({
                    ...prev,
                    confirm: !prev.confirm,
                  }))
                }
                className="text-gray-400 hover:text-gray-600"
              >
                {showPasswords.confirm ? (
                  <EyeOff size={16} />
                ) : (
                  <Eye size={16} />
                )}
              </button>
            }
            required
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowChangePasswordModal(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handlePasswordChange}
              disabled={
                !passwordData.currentPassword ||
                !passwordData.newPassword ||
                !passwordData.confirmPassword
              }
            >
              Change Password
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Trash2 className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Are you sure you want to delete your account?
              </h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>This action cannot be undone. Deleting your account will:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Permanently delete your profile and resume</li>
                  <li>Cancel your subscription (if active)</li>
                  <li>Remove all your job applications and history</li>
                  <li>Delete all your saved jobs and preferences</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={confirmDeleteAccount}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Settings;
