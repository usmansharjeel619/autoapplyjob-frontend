import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const PaymentPage = () => {
  const [selectedPlan, setSelectedPlan] = useState("B");
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const { showSuccess, clearOnboardingProgress } = useApp();
  const navigate = useNavigate();

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

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user with selected plan and complete onboarding
      await updateUser({
        selectedPlan,
        onboardingCompleted: true,
        subscriptionActive: true,
      });

      clearOnboardingProgress();
      showSuccess("Payment successful! Welcome to AutoApplyJob.");
      navigate("/dashboard");
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              icon={<ArrowLeft size={20} />}
              onClick={() => navigate("/onboarding")}
            />
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
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all ${
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
              <Card.Body className="p-8 text-center">
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
              </Card.Body>
            </Card>
          ))}
        </div>

        {/* Payment Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={handlePayment}
            loading={loading}
            className="bg-black hover:bg-gray-800 text-white px-12 py-4 text-lg"
          >
            {loading
              ? "Processing..."
              : `Pay Rs. ${plans.find((p) => p.id === selectedPlan)?.price}`}
          </Button>
          <p className="text-gray-600 mt-4 text-sm">
            Secure payment processing. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
