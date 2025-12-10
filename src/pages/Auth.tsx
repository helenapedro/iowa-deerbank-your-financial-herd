import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/authSlice';
import { authApi, setAuthToken } from '@/services/api';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    contactNo: '',
    accountNumber: '',
  });

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.username || !loginForm.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.login({
        username: loginForm.username,
        password: loginForm.password,
      });
      
      if (response.success) {
        // Set the auth token for API calls
        if (response.data.token) {
          setAuthToken(response.data.token);
        }
        dispatch(login(response.data));
        toast.success(response.message || 'Welcome back!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.username || !registerForm.password || !registerForm.name || !registerForm.contactNo || !registerForm.accountNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (registerForm.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.register({
        username: registerForm.username,
        password: registerForm.password,
        name: registerForm.name,
        contactNo: registerForm.contactNo,
        accountNumber: registerForm.accountNumber,
      });
      
      if (response.success) {
        // Set the auth token for API calls
        if (response.data.token) {
          setAuthToken(response.data.token);
        }
        dispatch(login(response.data));
        toast.success(response.message || 'Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 rounded-full bg-primary-foreground/20 animate-float" />
          <div className="absolute bottom-40 right-20 w-60 h-60 rounded-full bg-primary-foreground/10 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-primary-foreground/15 animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative z-10">
          <Logo size="lg" />
        </div>
        
        <div className="relative z-10 space-y-6">
          <h1 className="text-4xl font-display font-bold text-primary-foreground leading-tight">
            Bank with the<br />strength of nature
          </h1>
          <p className="text-primary-foreground/80 text-lg max-w-md">
            Experience secure, modern banking rooted in Iowa values. Your financial future grows here.
          </p>
          <div className="flex gap-4 pt-4">
            <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground">500K+</div>
              <div className="text-sm text-primary-foreground/70">Happy Customers</div>
            </div>
            <div className="bg-primary-foreground/20 backdrop-blur-sm rounded-lg p-4">
              <div className="text-2xl font-bold text-primary-foreground">$2B+</div>
              <div className="text-sm text-primary-foreground/70">Assets Managed</div>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 text-sm text-primary-foreground/60">
          © 2025 Iowa DeerBank. FDIC Insured.
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-base">Sign In</TabsTrigger>
              <TabsTrigger value="register" className="text-base">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="border-0 shadow-card">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-display">Welcome back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-username">Username</Label>
                      <Input
                        id="login-username"
                        type="text"
                        placeholder="Enter your username"
                        value={loginForm.username}
                        onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register">
              <Card className="border-0 shadow-card">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-display">Create account</CardTitle>
                  <CardDescription>
                    Register to link your existing account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Full Name</Label>
                      <Input
                        id="register-name"
                        type="text"
                        placeholder="Enter your full name"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        value={registerForm.username}
                        onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-contact">Contact Number</Label>
                      <Input
                        id="register-contact"
                        type="tel"
                        placeholder="+1-555-0123"
                        value={registerForm.contactNo}
                        onChange={(e) => setRegisterForm({ ...registerForm, contactNo: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-account">Account Number</Label>
                      <Input
                        id="register-account"
                        type="text"
                        placeholder="ACC4015357885"
                        value={registerForm.accountNumber}
                        onChange={(e) => setRegisterForm({ ...registerForm, accountNumber: e.target.value })}
                        disabled={isLoading}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Min. 8 characters"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="register-confirm">Confirm</Label>
                        <Input
                          id="register-confirm"
                          type="password"
                          placeholder="Confirm password"
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <Button type="submit" variant="hero" size="lg" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
