import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignInForm from "./SignInForm";
import { useState } from "react";
import RegisterForm from "./RegisterForm";

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {showRegister ? "Create Account" : "Welcome Back"}
          </DialogTitle>
        </DialogHeader>

        {showRegister ? (
          <div className="space-y-4">
            <RegisterForm onSuccess={onClose} />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Already have an account?
              </p>
              <Button
                variant="default"
                className="bg-black hover:bg-black/90 text-white"
                onClick={() => setShowRegister(false)}
              >
                Sign in instead
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <SignInForm onSuccess={onClose} />
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Don't have an account?
              </p>
              <Button
                variant="default"
                className="bg-black hover:bg-black/90 text-white"
                onClick={() => setShowRegister(true)}
              >
                Create an account
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}