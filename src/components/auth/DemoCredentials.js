// src/components/auth/DemoCredentials.js
import React, { useState } from "react";
import { User, Shield, Eye, EyeOff, Copy, Check } from "lucide-react";
import Card from "../ui/Card";
import Button from "../ui/Button";

const DemoCredentials = ({ onFillCredentials }) => {
  const [showPasswords, setShowPasswords] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const credentials = [
    {
      type: "Admin",
      email: "admin@example.com",
      password: "admin123456",
      icon: <Shield className="text-red-500" size={20} />,
      description:
        "Full access to admin dashboard, manage users and applications",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    {
      type: "User",
      email: "user@example.com",
      password: "user123456",
      icon: <User className="text-blue-500" size={20} />,
      description: "Regular user with completed onboarding",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
  ];

  const copyToClipboard = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleQuickLogin = (email, password) => {
    if (onFillCredentials) {
      onFillCredentials(email, password);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mb-6">
      <Card.Header>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Demo Accounts
            </h3>
            <p className="text-sm text-gray-600">
              Use these test accounts to explore different user roles
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPasswords(!showPasswords)}
            icon={showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}
          >
            {showPasswords ? "Hide" : "Show"} Passwords
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        <div className="space-y-4">
          {credentials.map((cred, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${cred.bgColor} ${cred.borderColor}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {cred.icon}
                  <div>
                    <h4 className="font-medium text-gray-900">{cred.type}</h4>
                    <p className="text-sm text-gray-600">{cred.description}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleQuickLogin(cred.email, cred.password)}
                  className="shrink-0"
                >
                  Quick Login
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono">
                      {cred.email}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(cred.email, `${index}-email`)
                      }
                      icon={
                        copiedField === `${index}-email` ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Password
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded text-sm font-mono">
                      {showPasswords ? cred.password : "••••••••"}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(cred.password, `${index}-password`)
                      }
                      icon={
                        copiedField === `${index}-password` ? (
                          <Check size={14} className="text-green-500" />
                        ) : (
                          <Copy size={14} />
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-yellow-800 text-xs font-bold">!</span>
            </div>
            <div>
              <h5 className="text-sm font-medium text-yellow-800 mb-1">
                Demo Mode
              </h5>
              <p className="text-sm text-yellow-700">
                This is a demo version with mock authentication. In production,
                these would be replaced with real user accounts and secure
                authentication.
              </p>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DemoCredentials;
