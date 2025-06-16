import React, { useState } from "react";
import {
  Bell,
  Shield,
  Smartphone,
  Mail,
  Eye,
  Lock,
  Trash2,
  Download,
  AlertTriangle,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";

const Settings = () => {
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError, showWarning } = useApp();
  const [activeTab, setActiveTab] = useState("notifications");
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [notifications, setNotifications] = useState({
    emailJobMatches: true,
    emailApplicationUpdates: true,
    emailWeeklyReport: false,
    smsUrgentUpdates: false,
    smsInterviewReminders: true,
    pushNotifications: true,
    marketingEmails: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: "public",
    showSalaryExpectations: false,
    allowRecruiterContact: true,
    dataSharing: false,
    analyticsTracking: true,
  });

  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: "30",
  });

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "security", label: "Security", icon: Shield },
    { id: "account", label: "Account", icon: SettingsIcon },
  ];

  const handleNotificationChange = (key, value) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy((prev) => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await updateUser({
        settings: {
          notifications,
          privacy,
          security,
        },
      });

      showSuccess("Settings saved successfully!");
    } catch (error) {
      showError("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    showSuccess("Password change feature coming soon!");
  };

  const handleEnable2FA = () => {
    setSecurity((prev) => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled,
    }));
    showSuccess(security.twoFactorEnabled ? "2FA disabled" : "2FA enabled");
  };

  const handleExportData = () => {
    showSuccess("Data export will be sent to your email within 24 hours");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      // Simulate account deletion
      await new Promise((resolve) => setTimeout(resolve, 2000));
      showWarning("Account deletion feature is not yet implemented");
      setShowDeleteModal(false);
    } catch (error) {
      showError("Failed to delete account");
    }
  };

  const renderNotifications = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold text-gray-900">
          Notification Preferences
        </h3>
        <p className="text-sm text-gray-600">
          Choose how you want to be notified
        </p>
      </Card.Header>
      <Card.Body>
        <div className="space-y-6">
          {/* Email Notifications */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Mail size={16} />
              Email Notifications
            </h4>
            <div className="space-y-4">
              {[
                {
                  key: "emailJobMatches",
                  label: "New job matches",
                  description:
                    "Get notified when we find jobs that match your preferences",
                },
                {
                  key: "emailApplicationUpdates",
                  label: "Application updates",
                  description:
                    "Updates on your job applications and interview requests",
                },
                {
                  key: "emailWeeklyReport",
                  label: "Weekly summary",
                  description: "Weekly report of your job search activity",
                },
                {
                  key: "marketingEmails",
                  label: "Marketing emails",
                  description: "Product updates and career tips",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{item.label}</h5>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={(e) =>
                        handleNotificationChange(item.key, e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* SMS Notifications */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
              <Smartphone size={16} />
              SMS Notifications
            </h4>
            <div className="space-y-4">
              {[
                {
                  key: "smsUrgentUpdates",
                  label: "Urgent updates",
                  description:
                    "Critical application updates and interview confirmations",
                },
                {
                  key: "smsInterviewReminders",
                  label: "Interview reminders",
                  description: "Reminders 24 hours before interviews",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-start justify-between"
                >
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-900">{item.label}</h5>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={notifications[item.key]}
                      onChange={(e) =>
                        handleNotificationChange(item.key, e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Push Notifications */}
          <div>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">
                  Browser push notifications
                </h4>
                <p className="text-sm text-gray-600">
                  Get instant notifications in your browser
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={notifications.pushNotifications}
                  onChange={(e) =>
                    handleNotificationChange(
                      "pushNotifications",
                      e.target.checked
                    )
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  const renderPrivacy = () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold text-gray-900">
          Privacy Settings
        </h3>
        <p className="text-sm text-gray-600">
          Control your privacy and data sharing preferences
        </p>
      </Card.Header>
      <Card.Body>
        <div className="space-y-6">
          <div>
            <label className="form-label">Profile Visibility</label>
            <select
              className="form-input form-select"
              value={privacy.profileVisibility}
              onChange={(e) =>
                handlePrivacyChange("profileVisibility", e.target.value)
              }
            >
              <option value="public">Public - Visible to all recruiters</option>
              <option value="limited">Limited - Only partner companies</option>
              <option value="private">
                Private - Not visible to recruiters
              </option>
            </select>
            <p className="text-sm text-gray-600 mt-1">
              Control who can see your profile information
            </p>
          </div>

          {[
            {
              key: "showSalaryExpectations",
              label: "Show salary expectations",
              description: "Display your salary range to potential employers",
            },
            {
              key: "allowRecruiterContact",
              label: "Allow recruiter contact",
              description:
                "Let recruiters contact you directly through the platform",
            },
            {
              key: "dataSharing",
              label: "Data sharing with partners",
              description: "Share anonymized data with job board partners",
            },
            {
              key: "analyticsTracking",
              label: "Analytics tracking",
              description: "Help us improve the platform with usage analytics",
            },
          ].map((item) => (
            <div key={item.key} className="flex items-start justify-between">
              <div className="flex-1">
                <h5 className="font-medium text-gray-900">{item.label}</h5>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={privacy[item.key]}
                  onChange={(e) =>
                    handlePrivacyChange(item.key, e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Security Settings
          </h3>
          <p className="text-sm text-gray-600">
            Manage your account security preferences
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Change Password</h4>
                <p className="text-sm text-gray-600">
                  Update your account password
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleChangePassword}
                icon={<Lock size={16} />}
              >
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-gray-600">
                  {security.twoFactorEnabled
                    ? "Enabled"
                    : "Add an extra layer of security to your account"}
                </p>
              </div>
              <Button
                variant={security.twoFactorEnabled ? "outline" : "primary"}
                onClick={handleEnable2FA}
              >
                {security.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </Button>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">Login alerts</h4>
                <p className="text-sm text-gray-600">
                  Get notified of suspicious login attempts
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  checked={security.loginAlerts}
                  onChange={(e) =>
                    handleSecurityChange("loginAlerts", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div>
              <label className="form-label">Session timeout (minutes)</label>
              <select
                className="form-input form-select"
                value={security.sessionTimeout}
                onChange={(e) =>
                  handleSecurityChange("sessionTimeout", e.target.value)
                }
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="240">4 hours</option>
                <option value="never">Never</option>
              </select>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );

  const renderAccount = () => (
    <div className="space-y-6">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Account Information
          </h3>
          <p className="text-sm text-gray-600">
            Manage your account settings and data
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={user?.email || ""}
                  disabled
                />
              </div>
              <div>
                <label className="form-label">Account Type</label>
                <input
                  type="text"
                  className="form-input"
                  value="Job Seeker"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="form-label">Member Since</label>
              <input
                type="text"
                className="form-input"
                value="January 2024"
                disabled
              />
            </div>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">
            Data Management
          </h3>
          <p className="text-sm text-gray-600">
            Export or delete your account data
          </p>
        </Card.Header>
        <Card.Body>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Export Your Data</h4>
                <p className="text-sm text-gray-600">
                  Download a copy of all your data
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

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
              <div>
                <h4 className="font-medium text-red-900">Delete Account</h4>
                <p className="text-sm text-red-600">
                  Permanently delete your account and all data
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
        </Card.Body>
      </Card>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-red-500" size={24} />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Account
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will permanently delete:
            </p>

            <ul className="list-disc list-inside text-sm text-gray-600 mb-6 space-y-1">
              <li>Your profile and resume</li>
              <li>All job applications and history</li>
              <li>Saved jobs and preferences</li>
              <li>AI-generated content</li>
            </ul>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDeleteAccount}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "notifications":
        return renderNotifications();
      case "privacy":
        return renderPrivacy();
      case "security":
        return renderSecurity();
      case "account":
        return renderAccount();
      default:
        return renderNotifications();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account preferences and privacy settings
          </p>
        </div>

        <Button
          onClick={handleSaveSettings}
          loading={loading}
          icon={<Save size={16} />}
        >
          Save Changes
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default Settings;
