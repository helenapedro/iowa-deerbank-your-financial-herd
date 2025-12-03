import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Shield, TrendingUp, Users, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Bank-Level Security',
      description: 'Your money is protected with enterprise-grade encryption and FDIC insurance.',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'Grow Your Wealth',
      description: 'Competitive rates and smart tools to help your savings flourish.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Community First',
      description: 'Local service with a personal touch, built on Iowa values.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button variant="hero" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-gold-muted text-foreground px-4 py-2 rounded-full text-sm font-medium">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Now serving Iowa communities
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight">
              Banking that grows{' '}
              <span className="text-primary">with you</span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-lg">
              Experience modern banking rooted in tradition. Iowa DeerBank combines cutting-edge technology with the trusted values of the heartland.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="xl" 
                onClick={() => navigate('/auth')}
                className="group"
              >
                Open Your Account
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="xl">
                Learn More
              </Button>
            </div>

            <div className="flex items-center gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-foreground">$2B+</div>
                <div className="text-sm text-muted-foreground">Assets Managed</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">500K+</div>
                <div className="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div className="w-px h-12 bg-border" />
              <div>
                <div className="text-2xl font-bold text-foreground">50+</div>
                <div className="text-sm text-muted-foreground">Iowa Locations</div>
              </div>
            </div>
          </div>

          {/* Hero Image/Card */}
          <div className="relative animate-fade-in stagger-2" style={{ opacity: 0 }}>
            <div className="absolute inset-0 gradient-hero rounded-3xl blur-3xl opacity-20" />
            <div className="relative gradient-balance rounded-3xl p-8 lg:p-12 text-primary-foreground shadow-glow">
              <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-primary-foreground/5 -translate-y-1/2 translate-x-1/2" />
              
              <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-primary-foreground/70 text-sm">Iowa DeerBank</span>
                  <span className="text-primary-foreground/70 text-sm">Savings</span>
                </div>
                
                <div>
                  <p className="text-primary-foreground/70 text-sm mb-1">Available Balance</p>
                  <p className="text-4xl font-bold">$24,538.00</p>
                </div>
                
                <div className="flex items-center gap-4 pt-6">
                  <div className="flex-1 bg-primary-foreground/10 rounded-lg p-3">
                    <p className="text-xs text-primary-foreground/60">Account</p>
                    <p className="font-mono text-sm">•••• 7885</p>
                  </div>
                  <div className="flex-1 bg-primary-foreground/10 rounded-lg p-3">
                    <p className="text-xs text-primary-foreground/60">Growth</p>
                    <p className="text-sm font-semibold text-primary-foreground">+12.4%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground mb-4">
            Why Choose Iowa DeerBank?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We combine the reliability of traditional banking with modern convenience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s`, opacity: 0 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="gradient-hero rounded-3xl p-8 lg:p-16 text-center text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-foreground/20 animate-float" />
            <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-primary-foreground/10 animate-float" style={{ animationDelay: '1.5s' }} />
          </div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-display font-bold mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-primary-foreground/80 mb-8">
              Join thousands of Iowans who trust their finances to DeerBank. Open your account in minutes.
            </p>
            <Button 
              variant="secondary" 
              size="xl"
              onClick={() => navigate('/auth')}
              className="group"
            >
              Open Your Account Today
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2024 Iowa DeerBank. All rights reserved. FDIC Insured.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
