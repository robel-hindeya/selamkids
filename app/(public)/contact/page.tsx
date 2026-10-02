import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Phone, Send } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Top Header */}
      <section className="relative w-full night-sky-bg text-white py-16 px-4 text-center border-b-4 border-purple-900/50 overflow-hidden">
        <div className="absolute inset-0 stars-pattern opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-3xl space-y-3">
          <Badge variant="amber" className="mb-2 text-xs font-black gap-1.5">
            <Mail className="h-3.5 w-3.5" />
            We Are Here To Help
          </Badge>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-white tracking-tight drop-shadow-md">
            Get in Touch with our Keepers
          </h1>
          <p className="text-purple-200 text-sm sm:text-base font-medium max-w-xl mx-auto">
            Have questions regarding classroom setups, parent plans, tutoring feedback, or platform safety?
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 w-full space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="text-center p-6 border-2 border-purple-100 rounded-3xl hover:-translate-y-1 transition-all shadow-md bg-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-700 mb-3 shadow-inner">
              <Mail className="h-6 w-6" />
            </div>
            <h4 className="font-display font-black text-slate-900 text-base">Email Support</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">support@selamkids.com</p>
          </Card>

          <Card className="text-center p-6 border-2 border-emerald-100 rounded-3xl hover:-translate-y-1 transition-all shadow-md bg-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 mb-3 shadow-inner">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h4 className="font-display font-black text-slate-900 text-base">Schools & Tutors</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">schools@selamkids.com</p>
          </Card>

          <Card className="text-center p-6 border-2 border-amber-100 rounded-3xl hover:-translate-y-1 transition-all shadow-md bg-white">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 mb-3 shadow-inner">
              <Phone className="h-6 w-6" />
            </div>
            <h4 className="font-display font-black text-slate-900 text-base">Family Advisory</h4>
            <p className="text-xs text-slate-500 font-medium mt-1">Mon - Fri, 9am - 5pm</p>
          </Card>
        </div>

        <Card className="p-8 sm:p-10 border-4 border-purple-200/80 rounded-4xl shadow-xl bg-white">
          <form className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input label="Your Name" placeholder="Sarah Jenkins" required />
              <Input label="Email Address" type="email" placeholder="sarah@example.com" required />
            </div>
            <Input label="Subject" placeholder="Inquiring about classroom licenses" required />
            <div className="space-y-1.5">
              <label className="block text-xs font-display font-black uppercase tracking-wider text-slate-700">
                How Can We Help?
              </label>
              <textarea
                rows={5}
                placeholder="Share your question or feedback with our Night Zoo keepers..."
                className="w-full rounded-2xl border-2 border-slate-200 p-4 text-sm font-medium focus:border-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all"
                required
              />
            </div>
            <Button type="button" variant="yellow" size="lg" className="w-full font-black text-base gap-2">
              <Send className="h-4 w-4 text-purple-900" />
              Send Message to Keepers
            </Button>
          </form>
        </Card>
      </section>
    </div>
  );
}
