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
      icon: <Zap className="text-primary-600" size={24} />,
      title: "AI-Powered Job Hunting",
      description:
        "Our advanced AI scans thousands of job listings across multiple platforms to find the perfect matches for your profile.",
    },
    {
      icon: <Target className="text-primary-600" size={24} />,
      title: "Smart Matching",
      description:
        "Get personalized job recommendations based on your skills, experience, and preferences with our intelligent matching algorithm.",
    },
    {
      icon: <Shield className="text-primary-600" size={24} />,
      title: "Admin Controlled Applications",
      description:
        "Every application is reviewed and manually submitted by our admin team to ensure quality and avoid spam.",
    },
  ];

  const benefits = [
    "Save 10+ hours per week on job searching",
    "Get matched with relevant opportunities",
    "Professional application management",
    "Real-time application tracking",
    "AI-generated cover letters",
    "Resume optimization suggestions",
  ];

  const stats = [
    { number: "50K+", label: "Jobs Found Daily" },
    { number: "95%", label: "Match Accuracy" },
    { number: "10K+", label: "Happy Users" },
    { number: "24/7", label: "Job Hunting" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">AA</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                AutoApplyJob
              </span>
            </div>

            <div className="flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/auth?mode=login">
                    <Button variant="ghost">Sign In</Button>
                  </Link>
                  <Link to="/auth?mode=signup">
                    <Button>Get Started</Button>
                  </Link>
                </>
              ) : (
                <Button onClick={handleGetStarted}>Go to Dashboard</Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Let AI Find Your
            <span className="text-primary-600 block">Dream Job</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stop wasting time on endless job applications. Our AI-powered
            platform hunts for the perfect opportunities while our admin team
            ensures quality applications that get noticed.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              onClick={handleGetStarted}
              icon={<ArrowRight size={20} />}
              iconPosition="right"
            >
              Start Job Hunting for Free
            </Button>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How AutoApplyJob Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our intelligent platform combines AI automation with human
              oversight to deliver the best job hunting experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="text-center p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose AutoApplyJob?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Transform your job search from a time-consuming chore into an
                efficient, automated process that works around the clock.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle
                      className="text-green-500 flex-shrink-0"
                      size={20}
                    />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  icon={<ArrowRight size={20} />}
                  iconPosition="right"
                >
                  Get Started Today
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="/api/placeholder/600/400"
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center gap-2 text-green-600">
                  <TrendingUp size={20} />
                  <span className="font-semibold">Jobs Found: 247</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Job Seekers
            </h2>
            <p className="text-xl text-gray-600">
              See what our users say about their success with AutoApplyJob
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="text-yellow-400 fill-current"
                      size={16}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "AutoApplyJob helped me land my dream job in just 2 weeks. The
                  AI found opportunities I never would have discovered on my
                  own!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Sarah Johnson
                    </div>
                    <div className="text-sm text-gray-500">
                      Software Engineer
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of successful job seekers who found their perfect
            role with AutoApplyJob
          </p>

          <Button
            size="lg"
            variant="secondary"
            onClick={handleGetStarted}
            className="bg-white text-primary-600 hover:bg-gray-100"
          >
            Start Your Free Job Hunt
          </Button>

          <div className="mt-8 flex items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>10,000+ active users</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>100% secure & private</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AA</span>
                </div>
                <span className="font-bold text-xl">AutoApplyJob</span>
              </div>
              <p className="text-gray-400">
                Revolutionizing job applications with AI-powered automation and
                human oversight.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <div className="space-y-2 text-gray-400">
                <div>Features</div>
                <div>Pricing</div>
                <div>Demo</div>
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
            <p>© 2024 AutoApplyJob. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
