import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/authSlice';
import { getSecondsUntilExpiry } from '@/lib/jwt';
import { Clock } from 'lucide-react';

const WARNING_SECONDS = 30; // Show warning 30 seconds before expiry

export const SessionWarningModal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(WARNING_SECONDS);

  const handleLogout = useCallback(() => {
    setShowWarning(false);
    dispatch(logout());
    navigate('/auth');
  }, [dispatch, navigate]);

  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    // Redirect to auth to re-login (since backend doesn't support token refresh)
    dispatch(logout());
    navigate('/auth', { state: { message: 'Please log in again to continue.' } });
  }, [dispatch, navigate]);

  useEffect(() => {
    if (!isAuthenticated || !user?.token) {
      setShowWarning(false);
      return;
    }

    const checkExpiry = () => {
      const secondsLeft = getSecondsUntilExpiry(user.token);
      
      if (secondsLeft <= 0) {
        // Token already expired
        setShowWarning(false);
        handleLogout();
      } else if (secondsLeft <= WARNING_SECONDS) {
        // Show warning
        setShowWarning(true);
        setCountdown(secondsLeft);
      }
    };

    // Check immediately
    checkExpiry();

    // Check every second
    const interval = setInterval(checkExpiry, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.token, handleLogout]);

  // Countdown timer when warning is shown
  useEffect(() => {
    if (!showWarning) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning, handleLogout]);

  if (!showWarning) return null;

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-500" />
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Your session will expire in <span className="font-bold text-amber-600">{countdown} seconds</span>.
            </p>
            <p>
              Would you like to log in again to continue your session?
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
          <AlertDialogAction onClick={handleStayLoggedIn}>
            Log In Again
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
