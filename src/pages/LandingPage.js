import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Zap,
  Target,
  Shield,
  CheckCircle,
  Star,
  Users,
  TrendingUp,
  Play,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const LandingPage = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (isAdmin()) {
        navigate("/admin/dashboard");
      } else {
        navigate("/dashboard");
      }
    } else {
      navigate("/auth");
    }
  };

  const features = [
    {
      icon: <Zap className="text-gray-800" size={24} />,
      title: "AI-Powered Profile Creation",
      description:
        "Our advanced AI creates and optimizes your professional profile to match the best opportunities in your field.",
    },
    {
      icon: <Target className="text-gray-800" size={24} />,
      title: "Smart Job Matching",
      description:
        "We analyze thousands of jobs and match you with the most relevant opportunities based on your skills and preferences.",
    },
    {
      icon: <Shield className="text-gray-800" size={24} />,
      title: "Expert Application Management",
      description:
        "Our team manually applies to jobs on your behalf, ensuring professional and personalized applications every time.",
    },
  ];

  const whyChooseUs = [
    "Professional job application management",
    "AI-powered CV optimization and updates",
    "Personal profile creation and maintenance",
    "Expert job matching and selection",
    "No need to search jobs yourself",
    "Dedicated account management",
  ];

  const testimonials = [
    {
      name: "Ahmed Khan",
      role: "Software Engineer",
      content:
        "AutoApplyJob helped me land my dream job at a top tech company. The AI CV updates were game-changing!",
      rating: 5,
    },
    {
      name: "Fatima Ali",
      role: "Marketing Manager",
      content:
        "I saved weeks of job searching. The team applied to relevant positions while I focused on interview prep.",
      rating: 5,
    },
    {
      name: "Hassan Ahmed",
      role: "Data Analyst",
      content:
        "The professional application management gave me confidence. Highly recommend their services!",
      rating: 5,
    },
  ];

  const plans = [
    {
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

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="bg-white border-b border-gray-300">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="AutoApplyJob Logo"
                className="w-8 h-8"
              />
              <span className="font-bold text-xl text-black">AutoApplyJob</span>
            </div>

            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/auth"
                    className="text-gray-600 hover:text-black font-medium"
                  >
                    Sign In
                  </Link>
                  <Button
                    onClick={handleGetStarted}
                    className="bg-black hover:bg-gray-800 text-white"
                  >
                    Get Started
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleGetStarted}
                  className="bg-black hover:bg-gray-800 text-white"
                >
                  Dashboard
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Full Screen Image */}
      <section
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            Let Us Find Your
            <span className="block text-gray-300">Dream Job</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">
            Sit back while our experts handle your job applications
            professionally
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4"
          >
            Start Your Journey
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">
              Simple steps to your dream job
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    Create Your Profile
                  </h3>
                  <p className="text-gray-600">
                    Upload your CV and fill out your preferences. Our AI will
                    optimize everything.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    We Find Jobs
                  </h3>
                  <p className="text-gray-600">
                    Our team searches and selects the best job opportunities
                    that match your profile.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    We Apply For You
                  </h3>
                  <p className="text-gray-600">
                    Our experts apply to jobs professionally on your behalf with
                    personalized applications.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-black rounded-lg p-8 text-center">
                <Play className="text-white mx-auto mb-4" size={64} />
                <p className="text-white text-lg mb-4">Watch How It Works</p>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black"
                >
                  Play Video
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600">
              The advantages of working with AutoApplyJob
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-gray-200 hover:shadow-lg transition-shadow"
              >
                <Card.Body className="p-8 text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-black mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="mt-16">
            <h3 className="text-2xl font-bold text-black text-center mb-8">
              What You Get
            </h3>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whyChooseUs.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-black flex-shrink-0" size={20} />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Select the perfect plan for your job search needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${
                  plan.popular ? "border-black border-2" : "border-gray-200"
                }`}
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
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-black hover:bg-gray-800 text-white"
                        : "border border-black text-black hover:bg-black hover:text-white"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Choose {plan.name}
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Client Feedback */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Client Feedback
            </h2>
            <p className="text-xl text-gray-600">
              What our clients say about us
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-gray-200">
                <Card.Body className="p-8">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="text-black fill-current"
                        size={20}
                      />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-6 italic">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <p className="font-semibold text-black">
                      {testimonial.name}
                    </p>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">Get in touch with our team</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-black mb-8">
                Send us a message
              </h3>
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Message
                  </label>
                  <textarea
                    rows="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Your message"
                  ></textarea>
                </div>
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  Send Message
                </Button>
              </form>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-8">
                Get in touch
              </h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Phone className="text-black" size={24} />
                  <div>
                    <p className="font-medium text-black">Phone</p>
                    <p className="text-gray-600">+92 300 1234567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Mail className="text-black" size={24} />
                  <div>
                    <p className="font-medium text-black">Email</p>
                    <p className="text-gray-600">info@autoapplyjob.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="text-black" size={24} />
                  <div>
                    <p className="font-medium text-black">Address</p>
                    <p className="text-gray-600">
                      Rawalpindi, Punjab, Pakistan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="/images/logo-white.png"
                  alt="AutoApplyJob Logo"
                  className="w-8 h-8"
                />
                <span className="font-bold text-xl">AutoApplyJob</span>
              </div>
              <p className="text-gray-400">
                Professional job application management service helping you land
                your dream job.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>How it Works</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <div>Help Center</div>
                <div>Contact</div>
                <div>Privacy</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <div className="space-y-2 text-gray-400">
                <div>About</div>
                <div>Blog</div>
                <div>Careers</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 AutoApplyJob. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
