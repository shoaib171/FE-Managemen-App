
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from '@/components/Logo';
import { Loader2, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, register, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      onOpenChange(false);
      navigate('/');
    } catch (err) {
      console.error('Authentication error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleMode = () => {
    clearError();
    setIsLogin(!isLogin);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden">
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Form */}
          <div className={`flex-1 p-6 ${!isLogin ? 'md:order-2' : ''}`}>
            <DialogHeader className="text-left mb-4">
              <DialogTitle className="text-2xl">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm py-1">{error}</div>
              )}
              
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isLogin ? 'Logging in...' : 'Signing up...'}
                  </>
                ) : (
                  isLogin ? 'Log In' : 'Sign Up'
                )}
              </Button>
              
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </form>
          </div>
          
          {/* Right side - Logo or Sign up */}
          <div className={`flex-1 bg-primary text-primary-foreground p-8 flex flex-col items-center justify-center ${!isLogin ? 'md:order-1' : ''}`}>
            <div className="text-center max-w-xs mx-auto">
              {isLogin ? (
                <>
                  <Logo className="h-12 w-auto mx-auto mb-6" />
                  <h2 className="text-xl font-bold mb-2">New to our platform?</h2>
                  <p className="mb-6 text-primary-foreground/80">
                    Sign up now to manage your tasks efficiently and collaborate with your team.
                  </p>
                  <Button variant="outline" className="w-full" onClick={toggleMode}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <>
                  <Mail className="h-12 w-12 mx-auto mb-6" />
                  <h2 className="text-xl font-bold mb-2">Already have an account?</h2>
                  <p className="mb-6 text-primary-foreground/80">
                    Log in to access your tasks, track progress, and collaborate with your team.
                  </p>
                  <Button variant="outline" className="w-full" onClick={toggleMode}>
                    Log In
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
