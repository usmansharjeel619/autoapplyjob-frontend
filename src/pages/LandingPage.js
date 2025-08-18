import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Shield,
  Clock,
  Target,
  TrendingUp,
  Users,
  Award,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Upload,
  Search,
  Send,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const LandingPage = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

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

  // Navigation items
  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About Us" },
    { id: "how-it-works", label: "How It Works" },
    { id: "features", label: "Features" },
    { id: "pricing", label: "Pricing" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ];

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(sectionId);
      setMobileMenuOpen(false);
    }
  };

  // Update active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.id);
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter animation
  const [counters, setCounters] = useState({
    projects: 0,
    designs: 0,
    awards: 0,
    running: 0,
  });

  useEffect(() => {
    const finalValues = {
      projects: 120,
      designs: 210,
      awards: 15,
      running: 62,
    };

    const duration = 2000; // 2 seconds
    const steps = 60; // Number of animation steps
    const stepTime = duration / steps;

    const animate = (key, finalValue) => {
      let currentValue = 0;
      const increment = finalValue / steps;

      const interval = setInterval(() => {
        currentValue += increment;
        if (currentValue >= finalValue) {
          currentValue = finalValue;
          clearInterval(interval);
        }
        setCounters((prev) => ({
          ...prev,
          [key]: Math.floor(currentValue),
        }));
      }, stepTime);
    };

    // Start animations with delays
    Object.entries(finalValues).forEach(([key, value], index) => {
      setTimeout(() => animate(key, value), index * 200);
    });
  }, []);

  const features = [
    {
      icon: <Shield className="text-black mx-auto" size={48} />,
      title: "Professional Quality",
      description: "Expert recruiters handle your applications with care",
    },
    {
      icon: <Clock className="text-black mx-auto" size={48} />,
      title: "Save Time",
      description:
        "Focus on preparing for interviews while we handle applications",
    },
    {
      icon: <Target className="text-black mx-auto" size={48} />,
      title: "Targeted Matching",
      description:
        "AI-powered job matching based on your skills and preferences",
    },
  ];

  const whyChooseUs = [
    "Unlimited job applications",
    "Custom resume optimization",
    "Real-time application tracker",
    "Priority support",
  ];

  const plans = [
    {
      name: "Plan A: Accelerator",
      price: "3,250 PKR",
      features: [
        "50 automated applications/month",
        "1 resume optimization",
        "Basic dashboard",
        "Start in <5 minutes",
        "Bank-level encryption",
        "Quick query resolution",
      ],
    },
    {
      name: "Plan B: Professional",
      price: "4,250 PKR",
      popular: true,
      features: [
        "100 applications/month",
        "3 resume versions",
        "Interview analytics",
        "24-hour onboarding",
        "Resume compatibility report",
        "Avg. interviews/month",
      ],
    },
    {
      name: "Plan C: Executive",
      price: "10,450 PKR",
      features: [
        "500 applications/month",
        "Premium ATS resume builder",
        "Dedicated career advisor",
        "Advisor reviews top 5 applications",
        "Industry-specific hiring insights",
        "Freeze/cancel anytime",
      ],
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Software Engineer",
      content:
        "AutoApplyJob helped me land my dream job at a Fortune 500 company. The process was seamless and professional.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Marketing Manager",
      content:
        "I was skeptical at first, but the results speak for themselves. Got 3 interview offers in the first month!",
      rating: 5,
    },
    {
      name: "Emily Davis",
      role: "Data Analyst",
      content:
        "The team's expertise in crafting applications is outstanding. Highly recommend their services.",
      rating: 5,
    },
  ];
  const howItWorksSteps = [
    {
      number: "01",
      title: "Upload & Customize",
      description:
        "Share your resume/CV and career preferences. Our system analyzes your strengths and target roles.",
      icon: (
        <svg
          className="w-12 h-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "AI-Driven Matching",
      description:
        "We scan 20+ job boards and company portals, matching you with opportunities aligned with your profile.",
      icon: (
        <svg
          className="w-12 h-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Smart Application Engine",
      description:
        "Automatically submits tailored applications—optimized resumes, keyword-rich cover letters, and one-click submissions.",
      icon: (
        <svg
          className="w-12 h-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      ),
    },
    {
      number: "04",
      title: "Interview Pipeline",
      description:
        "Track applications and interview invites through your dashboard. Get real-time status updates.",
      icon: (
        <svg
          className="w-12 h-12 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AA</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                AutoApplyJob
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="md:flex items-center gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`font-medium transition-colors text-sm lg:text-base ${
                    activeSection === item.id
                      ? "text-black border-b-2 border-black pb-1"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className=" md:flex items-center gap-4">
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

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              icon={mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            />
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-white border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left font-medium ${
                      activeSection === item.id ? "text-black" : "text-gray-600"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                <div className="border-t border-gray-200 pt-4 flex flex-col gap-3">
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
                        className="bg-black hover:bg-gray-800 text-white w-full"
                      >
                        Get Started
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleGetStarted}
                      className="bg-black hover:bg-gray-800 text-white w-full"
                    >
                      Dashboard
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Background Image and Vertical Lines */}
      <section
        id="home"
        className="relative h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-background.jpg')",
          backgroundAttachment: "fixed", // Optional: creates parallax effect
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60"></div>

        {/* Vertical Lines Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="container mx-auto h-full relative">
            {/* Multiple vertical lines with different opacities and positions */}
            <div className="absolute left-1/6 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
            <div className="absolute left-1/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
            <div className="absolute left-2/3 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
            <div className="absolute right-1/6 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

            {/* Additional decorative lines */}
            <div className="absolute left-1/4 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-white/8 to-transparent"></div>
            <div className="absolute right-1/4 top-0 w-0.5 h-full bg-gradient-to-b from-transparent via-white/8 to-transparent"></div>
          </div>
        </div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Let Us Find Your
            <span className="block text-gray-300 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Dream Job
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            Sit back while our AI-powered experts handle your job applications
            professionally and efficiently
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-black hover:bg-gray-100 text-lg px-8 py-4 transform hover:scale-105 transition-all duration-200"
          >
            Start Your Journey
            <ArrowRight className="ml-2" size={20} />
          </Button>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left side - Portrait Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/images/about-us.png"
                  alt="Professional team"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              {/* Floating card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-6 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-xl text-black">98%</p>
                    <p className="text-gray-600 text-sm">Success Rate</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Content */}
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
                About Us
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Revolutionizing Job Search with AI-Powered Precision.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                We're a tech-driven career accelerator dedicated to landing you
                interviews. Our AI platform automates job applications while
                maintaining a personalized touch, ensuring your profile stands
                out in crowded job markets. No manual legwork—just strategic,
                data-backed outreach designed for today's competitive landscape.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Expert Team</h4>
                    <p className="text-gray-600">
                      Former recruiters and HR professionals
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Target className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">
                      AI-Powered Matching
                    </h4>
                    <p className="text-gray-600">
                      Advanced algorithms for perfect job matches
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Shield className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">
                      Quality Guarantee
                    </h4>
                    <p className="text-gray-600">
                      Professional applications with proven results
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGetStarted}
                size="lg"
                className="bg-black hover:bg-gray-800 text-white px-8 py-4"
              >
                Get Started Today
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced How It Works */}
      <section
        id="how-it-works"
        className="py-20 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-black mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our streamlined process gets you from application to interview in
              record time
            </p>
          </div>

          {/* Steps in a row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center group">
                {/* Icon with gradient background */}
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${step.color} text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 mx-auto mb-6`}
                >
                  {step.icon}
                </div>

                {/* Step number */}
                <div className="inline-block bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mb-4">
                  {step.number}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-black mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Statistics Counter with Background Image */}
      <section
        className="relative py-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-background.jpg')",
          backgroundAttachment: "fixed", // Optional: creates parallax effect
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* Vertical Lines Overlay (optional) */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="container mx-auto h-full relative">
            {/* Subtle vertical lines */}
            <div className="absolute left-1/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
            <div className="absolute left-1/2 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/15 to-transparent"></div>
            <div className="absolute left-3/4 top-0 w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent"></div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-6">
          <div className="grid grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">
                {counters.projects}
              </div>
              <p className="text-gray-300 text-sm md:text-lg">
                Projects Completed
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">
                {counters.designs}+
              </div>
              <p className="text-gray-300 text-sm md:text-lg">
                Applications Sent
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">
                {counters.awards}
              </div>
              <p className="text-gray-300 text-sm md:text-lg">
                Industry Awards
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-4xl lg:text-5xl font-bold mb-2 text-white">
                {counters.running}
              </div>
              <p className="text-gray-300 text-sm md:text-lg">Active Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600">
              The advantages of working with AutoApplyJob
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <Card.Body className="p-8 text-center">
                  <div className="mb-6 transform hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card.Body>
              </Card>
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-black text-center mb-8">
              What You Get
            </h3>
            <p className="text-center text-gray-600 mb-8 text-lg">
              ✨ All Plans Include:
            </p>

            <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {whyChooseUs.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="text-black flex-shrink-0" size={20} />
                  <span className="text-gray-700 font-medium">• {benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
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
                  plan.popular
                    ? "border-black shadow-xl scale-105"
                    : "border-gray-200 hover:shadow-lg"
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <Card.Body className="p-8">
                  {/* Plan name and description - left aligned */}
                  <div className="text-left mb-6">
                    <h3 className="text-2xl font-bold text-black mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600">{plan.description}</p>
                  </div>

                  {/* Price - center aligned */}
                  <div className="text-center mb-6">
                    <span className="text-4xl font-bold text-black">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">/{plan.period}</span>
                  </div>

                  {/* Features list - left aligned */}
                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle
                          className="text-black flex-shrink-0 mt-0.5"
                          size={16}
                        />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button - center aligned */}
                  <div className="text-center">
                    <Button
                      onClick={handleGetStarted}
                      className={`w-full ${
                        plan.popular
                          ? "bg-black hover:bg-gray-800 text-white"
                          : "border border-black text-black hover:bg-black hover:text-white"
                      }`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      Choose {plan.name}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
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
              <Card
                key={index}
                className="border-gray-200 hover:shadow-lg transition-shadow"
              >
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
      <section id="contact" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-black mb-4">Contact Us</h2>
            <p className="text-xl text-gray-600">Get in touch with our team</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold text-black mb-6">
                Get In Touch
              </h3>
              <p className="text-gray-600 mb-8">
                Ready to transform your job search? Contact us today and let our
                experts help you land your dream job.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <Mail className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Email</h4>
                    <p className="text-gray-600">contact@autoapplyjob.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <Phone className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Phone</h4>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
                    <MapPin className="text-white" size={24} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black">Office</h4>
                    <p className="text-gray-600">
                      123 Business Ave, Suite 100
                      <br />
                      New York, NY 10001
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Tell us about your job search goals..."
                  ></textarea>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white py-3"
                >
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold text-sm">AA</span>
                </div>
                <span className="font-bold text-xl">AutoApplyJob</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing job search with AI-powered automation and expert
                human touch.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Job Application
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    CV Optimization
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Interview Coaching
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    LinkedIn Profile
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <button
                    onClick={() => scrollToSection("about")}
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>contact@autoapplyjob.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Business Ave, Suite 100</li>
                <li>New York, NY 10001</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AutoApplyJob. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
