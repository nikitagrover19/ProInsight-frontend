import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BarChart3, Brain, FileText, TrendingUp } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms extract insights from unstructured email and document data.",
    },
    {
      icon: BarChart3,
      title: "Visual Analytics",
      description: "Interactive dashboards and knowledge graphs reveal hidden patterns and relationships.",
    },
    {
      icon: TrendingUp,
      title: "Success Prediction",
      description: "Get probability scores and risk assessments for better project decision-making.",
    },
    {
      icon: FileText,
      title: "Multi-Format Support",
      description: "Upload emails, CSV files, text documents, and more for comprehensive analysis.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
        <div className="container mx-auto px-4 py-24 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Turn Emails into{" "}
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Project Insights
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Harness the power of AI to analyze your project communications and unlock actionable insights for better decision-making.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-gradient-hero hover:shadow-hero transition-all duration-300 text-lg px-8 py-6 rounded-2xl group"
              >
                <Link to="/upload" className="flex items-center">
                  Start Analysis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6 rounded-2xl">
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Powerful Features for Deep Insights
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transform your project data into strategic intelligence with our comprehensive analysis suite.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-all duration-300 group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-foreground mb-6">
              Ready to Transform Your Project Data?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of teams using ProInsight to make data-driven project decisions.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-hero hover:shadow-hero transition-all duration-300 text-lg px-8 py-6 rounded-2xl"
            >
              <Link to="/upload">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
