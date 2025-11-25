import { useState } from 'react';
import { validateAdminPIN } from '@/lib/pinAuth';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Shield, Delete } from 'lucide-react';

interface AdminPINModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AdminPINModal: React.FC<AdminPINModalProps> = ({ open, onOpenChange, onSuccess }) => {
  const [pin, setPin] = useState('');
  const [shake, setShake] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 6) {
      setPin(pin + num);
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleSubmit = () => {
    if (!pin) return;

    const isValid = validateAdminPIN(pin);
    
    if (isValid) {
      setPin('');
      onOpenChange(false);
      onSuccess();
    } else {
      setShake(true);
      setPin('');
      setTimeout(() => setShake(false), 500);
    }
  };

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Shield className="w-6 h-6 text-primary" />
            Admin PIN Required
          </DialogTitle>
          <DialogDescription>
            Enter your admin PIN to access the admin panel
          </DialogDescription>
        </DialogHeader>

        <div className={`space-y-6 ${shake ? 'animate-shake' : ''}`}>
          {/* PIN Display */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                  i < pin.length
                    ? 'border-primary bg-primary/10 scale-110'
                    : 'border-muted bg-muted/5'
                }`}
              >
                {i < pin.length ? '●' : ''}
              </div>
            ))}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {numbers.map((num) => (
              <Button
                key={num}
                variant="outline"
                size="lg"
                onClick={() => handleNumberClick(num)}
                className="h-16 text-2xl font-bold hover:bg-primary/10 hover:border-primary transition-all"
              >
                {num}
              </Button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handleClear}
              className="h-12"
            >
              Clear
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="h-12"
            >
              <Delete className="w-5 h-5" />
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={pin.length === 0}
              className="h-12 gradient-primary font-bold"
            >
              Enter
            </Button>
          </div>
        </div>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.5s ease-in-out;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};
