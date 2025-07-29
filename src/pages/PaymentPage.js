import React, { useState } from "react";
import {
  CheckCircle,
  ArrowLeft,
  CreditCard,
  Smartphone,
  Lock,
  AlertCircle,
} from "lucide-react";

const PaymentPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("B");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  });

  const plans = [
    {
      id: "A",
      name: "Plan A",
      price: "3,250",
      features: [
        "Basic profile setup",
        "10 job applications per month",
        "AI CV updates",
        "Email support",
      ],
    },
    {
      id: "B",
      name: "Plan B",
      price: "4,250",
      popular: true,
      features: [
        "Advanced profile optimization",
        "25 job applications per month",
        "AI CV updates",
        "Priority support",
        "Interview preparation tips",
      ],
    },
    {
      id: "C",
      name: "Plan C",
      price: "10,450",
      features: [
        "Premium profile management",
        "Unlimited job applications",
        "AI CV updates",
        "Dedicated account manager",
        "Interview preparation",
        "Salary negotiation support",
      ],
    },
  ];

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: <CreditCard className="w-6 h-6" />,
      available: true,
      description: "Pay securely with your card",
    },
    {
      id: "jazzcash",
      name: "JazzCash",
      icon: <Smartphone className="w-6 h-6" />,
      available: false,
      description: "Coming Soon",
    },
    {
      id: "easypaisa",
      name: "EasyPaisa",
      icon: <Smartphone className="w-6 h-6" />,
      available: false,
      description: "Coming Soon",
    },
  ];

  const handlePayButtonClick = () => {
    setShowPaymentForm(true);
  };

  const handlePaymentMethodSelect = (methodId) => {
    if (paymentMethods.find((m) => m.id === methodId)?.available) {
      setSelectedPaymentMethod(methodId);
    }
  };

  const handleCardInputChange = (field, value) => {
    let formattedValue = value;

    if (field === "number") {
      // Format card number with spaces
      formattedValue = value
        .replace(/\s/g, "")
        .replace(/(.{4})/g, "$1 ")
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
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // In real implementation, you would call your payment API here
      // const response = await processCardPayment({
      //   plan: selectedPlan,
      //   amount: plans.find(p => p.id === selectedPlan)?.price,
      //   cardDetails: cardDetails
      // });

      alert("Payment successful! Welcome to AutoApplyJob.");
      // navigate("/dashboard"); // In your real implementation
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Choose Payment Method
            </h2>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? "border-black bg-gray-50"
                      : method.available
                      ? "border-gray-200 hover:border-gray-300"
                      : "border-gray-200 opacity-60 cursor-not-allowed"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={
                          method.available ? "text-black" : "text-gray-400"
                        }
                      >
                        {method.icon}
                      </div>
                      <div>
                        <div
                          className={`font-medium ${
                            method.available ? "text-gray-900" : "text-gray-400"
                          }`}
                        >
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {method.description}
                        </div>
                      </div>
                    </div>
                    {selectedPaymentMethod === method.id && (
                      <CheckCircle className="text-black w-5 h-5" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card Payment Form */}
          {selectedPaymentMethod === "card" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <div className="flex items-center gap-2 mb-6">
                <Lock className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Secure Card Payment
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={cardDetails.name}
                    onChange={(e) =>
                      handleCardInputChange("name", e.target.value)
                    }
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardDetails.number}
                    onChange={(e) =>
                      handleCardInputChange("number", e.target.value)
                    }
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardDetails.expiry}
                      onChange={(e) =>
                        handleCardInputChange("expiry", e.target.value)
                      }
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={cardDetails.cvv}
                      onChange={(e) =>
                        handleCardInputChange("cvv", e.target.value)
                      }
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Lock className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Your payment information is encrypted and secure
                  </span>
                </div>

                <button
                  onClick={handleCardPayment}
                  disabled={!isCardFormValid() || loading}
                  className={`w-full py-4 px-6 rounded-lg font-medium text-white transition-all ${
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
                  Use Card Payment
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => console.log("Navigate to onboarding")}
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
                  Select the perfect plan for your job search needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative cursor-pointer transition-all border rounded-xl p-8 text-center ${
                selectedPlan === plan.id
                  ? "border-black border-2 shadow-lg"
                  : "border-gray-200 hover:border-gray-300"
              } ${plan.popular ? "border-black border-2" : ""}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-black text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <h3 className="text-2xl font-bold text-black mb-2">
                {plan.name}
              </h3>
              <div className="mb-6">
                <span className="text-4xl font-bold text-black">
                  Rs. {plan.price}
                </span>
                <span className="text-gray-600">/month</span>
              </div>
              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle
                      className="text-black flex-shrink-0"
                      size={16}
                    />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              {selectedPlan === plan.id && (
                <div className="text-black font-medium">✓ Selected</div>
              )}
            </div>
          ))}
        </div>

        {/* Payment Button */}
        <div className="text-center mt-12">
          <button
            onClick={handlePayButtonClick}
            className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg rounded-lg transition-colors"
          >
            Pay Rs. {plans.find((p) => p.id === selectedPlan)?.price}
          </button>
          <p className="text-gray-600 mt-4 text-sm">
            Secure payment processing. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
