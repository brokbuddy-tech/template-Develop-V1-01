
import { Phone, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FloatingSocialBar() {
  return (
    <div className="fixed top-1/2 right-0 -translate-y-1/2 z-50">
      <div className="flex flex-col gap-2 p-2 rounded-l-lg bg-black/50 backdrop-blur-md">
        <Button asChild variant="ghost" size="icon" className="text-green-500 hover:bg-green-500/20 hover:text-green-400">
          <Link href="#">
            <MessageCircle className="h-6 w-6" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
          <Link href="#">
            <Phone className="h-6 w-6" />
          </Link>
        </Button>
        <Button asChild variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
          <Link href="#">
            <Mail className="h-6 w-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
