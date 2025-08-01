import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  ArrowLeft,
  Check,
  CreditCard,
  Smartphone,
  Building,
  AlertCircle,
} from "lucide-react";
import { apiPost } from "../services/api";
import { API_ENDPOINTS } from "../utils/constants";

const PaymentPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  // Redirect if user already has payment completed
  useEffect(() => {
    if (user?.paymentCompleted) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const plans = [
    {
      id: "basic",
      name: "Basic Plan",
      price: 2999,
      period: "month",
      features: [
        "Up to 50 job applications per month",
        "Basic job matching",
        "Email notifications",
        "Resume upload",
        "Standard support",
      ],
      recommended: false,
    },
    {
      id: "premium",
      name: "Premium Plan",
      price: 4999,
      period: "month",
      features: [
        "Unlimited job applications",
        "AI-powered job matching",
        "Auto-apply feature",
        "Priority support",
        "Advanced filters",
        "Interview preparation tips",
        "Salary insights",
      ],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Plan",
      price: 9999,
      period: "month",
      features: [
        "Everything in Premium",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced analytics",
        "Team collaboration features",
        "Priority job placement",
        "24/7 phone support",
      ],
      recommended: false,
    },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      available: true,
    },
    {
      id: "easypaisa",
      name: "EasyPaisa",
      icon: Smartphone,
      available: false,
    },
    {
      id: "jazzcash",
      name: "JazzCash",
      icon: Smartphone,
      available: false,
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: Building,
      available: false,
    },
  ];

  const handlePlanSelection = (planId) => {
    setSelectedPlan(planId);
  };

  const handlePaymentMethodSelection = (methodId) => {
    const method = paymentMethods.find((m) => m.id === methodId);
    if (!method.available) return;

    setSelectedPaymentMethod(methodId);
    if (methodId === "card") {
      setShowPaymentForm(true);
    }
  };

  const handleCardDetailsChange = (field, value) => {
    let formattedValue = value;

    if (field === "number") {
      // Format card number with spaces
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/\D/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim();
      formattedValue = formattedValue.slice(0, 19); // Limit to 16 digits + spaces
    } else if (field === "expiry") {
      // Format expiry as MM/YY
      formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);
    } else if (field === "cvv") {
      // Limit CVV to 4 digits
      formattedValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setCardDetails((prev) => ({
      ...prev,
      [field]: formattedValue,
    }));
  };

  const isCardFormValid = () => {
    return (
      cardDetails.number.replace(/\s/g, "").length >= 16 &&
      cardDetails.expiry.length === 5 &&
      cardDetails.cvv.length >= 3 &&
      cardDetails.name.trim().length > 0
    );
  };

  const handleCardPayment = async () => {
    if (!isCardFormValid()) return;

    setLoading(true);
    try {
      // Get selected plan details
      const plan = plans.find((p) => p.id === selectedPlan);

      // Simulate payment processing (replace with actual payment gateway)
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Create payment record and update user
      const paymentData = {
        plan: selectedPlan,
        amount: plan.price,
        currency: "PKR",
        paymentMethod: "card",
        cardDetails: {
          lastFour: cardDetails.number.slice(-4),
          cardType: "card", // You can detect card type based on number
        },
      };

      // Call API to complete payment
      const response = await apiPost("/payment/complete", paymentData);

      if (response.data) {
        // Update user context with payment completion
        await updateUser({
          ...user,
          paymentCompleted: true,
          paymentCompletedAt: new Date(),
          selectedPlan: selectedPlan,
        });

        alert("Payment successful! Welcome to AutoApplyJob.");
        navigate("/dashboard");
      } else {
        throw new Error(response.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Don't render if user already has payment completed
  if (user?.paymentCompleted) {
    return null;
  }

  if (showPaymentForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowPaymentForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">AA</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Payment Details
                  </h1>
                  <p className="text-gray-600">
                    {plans.find((p) => p.id === selectedPlan)?.name} - Rs.{" "}
                    {plans.find((p) => p.id === selectedPlan)?.price}/month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="max-w-2xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Card Information
            </h2>

            <div className="space-y-6">
              {/* Card Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  placeholder="1234 5678 9012 3456"
                  value={cardDetails.number}
                  onChange={(e) =>
                    handleCardDetailsChange("number", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardDetails.expiry}
                    onChange={(e) =>
                      handleCardDetailsChange("expiry", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    placeholder="123"
                    value={cardDetails.cvv}
                    onChange={(e) =>
                      handleCardDetailsChange("cvv", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={cardDetails.name}
                  onChange={(e) =>
                    handleCardDetailsChange("name", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                />
              </div>

              {/* Payment Button */}
              <div className="pt-4">
                <button
                  onClick={handleCardPayment}
                  disabled={!isCardFormValid() || loading}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-colors ${
                    isCardFormValid() && !loading
                      ? "bg-black hover:bg-gray-800"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay Rs. ${plans.find((p) => p.id === selectedPlan)?.price}`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/onboarding")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">AA</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Choose Your Plan
                </h1>
                <p className="text-gray-600">
                  Select a plan to start your job search journey
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-lg ${
                selectedPlan === plan.id
                  ? "border-black"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                    Recommended
                  </span>
                </div>
              )}

              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                      Rs. {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanSelection(plan.id)}
                  className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                    selectedPlan === plan.id
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {selectedPlan === plan.id ? "Selected" : "Select Plan"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Payment Methods */}
        {selectedPlan && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Payment Method
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handlePaymentMethodSelection(method.id)}
                    disabled={!method.available}
                    className={`relative p-4 border-2 rounded-lg transition-all duration-200 ${
                      method.available
                        ? selectedPaymentMethod === method.id
                          ? "border-black bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-gray-700" />
                      <span className="font-medium text-gray-900">
                        {method.name}
                      </span>
                    </div>
                    {!method.available && (
                      <span className="absolute top-2 right-2 text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                        Coming Soon
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Coming Soon Message */}
        {selectedPaymentMethod && selectedPaymentMethod !== "card" && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-orange-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Coming Soon
              </h3>
              <p className="text-gray-600 mb-6">
                {
                  paymentMethods.find((m) => m.id === selectedPaymentMethod)
                    ?.name
                }{" "}
                integration is coming soon. Please use a credit/debit card for
                now.
              </p>
              <button
                onClick={() => setSelectedPaymentMethod("card")}
                className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                Use Card Instead
              </button>
            </div>
          </div>
        )}

        {/* Terms and Conditions */}
        <div className="text-center text-sm text-gray-500 mt-8">
          By proceeding with payment, you agree to our{" "}
          <a href="#" className="text-black hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-black hover:underline">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
