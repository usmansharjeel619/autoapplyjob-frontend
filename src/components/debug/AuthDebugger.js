import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useLocation } from "react-router-dom";
import { STORAGE_KEYS } from "../../utils/constants";

// Helper function to get localStorage items
const getStorageItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting storage item ${key}:`, error);
    return null;
  }
};

const AuthDebugger = () => {
  const { user, isAuthenticated, isLoading, error } = useAuth();
  const location = useLocation();

  if (process.env.NODE_ENV !== "development") return null;

  // Get stored data for debugging
  const storedToken = getStorageItem(STORAGE_KEYS.AUTH_TOKEN);
  const storedUser = getStorageItem(STORAGE_KEYS.USER_DATA);
  const storedRefreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h4 className="font-bold mb-2">🔍 Auth Debug Info:</h4>

      <div className="space-y-1">
        <div>
          📍 Location:{" "}
          <span className="text-green-400">{location.pathname}</span>
        </div>
        <div>🔐 Is Authenticated: {isAuthenticated ? "✅" : "❌"}</div>
        <div>⏳ Is Loading: {isLoading ? "⏳" : "✅"}</div>
        <div>✉️ Email Verified: {user?.isEmailVerified ? "✅" : "❌"}</div>
        <div>
          📋 Onboarding Complete: {user?.onboardingCompleted ? "✅" : "❌"}
        </div>
        <div>
          👤 User Type:{" "}
          <span className="text-blue-400">{user?.userType || "none"}</span>
        </div>
        <div>
          🆔 User ID:{" "}
          <span className="text-blue-400">{user?._id || "none"}</span>
        </div>
        <div>
          📧 Email:{" "}
          <span className="text-blue-400">{user?.email || "none"}</span>
        </div>
        <div>
          📛 Name: <span className="text-blue-400">{user?.name || "none"}</span>
        </div>

        <hr className="border-gray-600 my-2" />

        <div>🎫 Has Token: {storedToken ? "✅" : "❌"}</div>
        <div>🔄 Has Refresh: {storedRefreshToken ? "✅" : "❌"}</div>
        <div>💾 Stored User: {storedUser ? "✅" : "❌"}</div>

        {error && <div className="text-red-400">❌ Error: {error}</div>}

        {storedUser && !user && (
          <div className="text-yellow-400">
            ⚠️ Stored user exists but context user is null
          </div>
        )}

        {storedToken && !isAuthenticated && (
          <div className="text-yellow-400">
            ⚠️ Token exists but not authenticated
          </div>
        )}

        {/* Show raw stored user data for debugging */}
        {storedUser && (
          <div className="mt-2 p-2 bg-gray-800 rounded">
            <div className="text-yellow-400 text-xs mb-1">
              📄 Stored User Data:
            </div>
            <div className="text-xs text-gray-300">
              Email Verified: {storedUser.isEmailVerified ? "✅" : "❌"}
              <br />
              Onboarding: {storedUser.onboardingCompleted ? "✅" : "❌"}
              <br />
              Type: {storedUser.userType || "none"}
              <br />
              ID: {storedUser._id || "none"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthDebugger;
