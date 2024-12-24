import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Shield } from 'lucide-react';

export function CommunityPolicies() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" className="text-muted-foreground hover:text-foreground">
            Content Policy
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Content Policy</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
            <div className="space-y-6 pb-4">
              <section>
                <h3 className="font-semibold mb-2">1. Prohibited Content</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Illegal content or activities</li>
                  <li>Personal and confidential information</li>
                  <li>Harassment or bullying</li>
                  <li>Spam or self-promotion</li>
                  <li>Misleading or fraudulent content</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold mb-2">2. Professional Standards</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Maintain professional and respectful discourse</li>
                  <li>Provide accurate and verifiable information</li>
                  <li>Respect intellectual property rights</li>
                  <li>No unauthorized advertising or solicitation</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold mb-2">3. Content Moderation</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Content is subject to review by moderators</li>
                  <li>Violations may result in content removal</li>
                  <li>Repeated violations may lead to account suspension</li>
                  <li>Appeals process available for moderation decisions</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <span className="text-muted-foreground">•</span>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" className="text-muted-foreground hover:text-foreground">
            Privacy Policy
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Privacy Policy</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
            <div className="space-y-6 pb-4">
              <section>
                <h3 className="font-semibold mb-2">1. Information Collection</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Account information and profile data</li>
                  <li>Content and interactions</li>
                  <li>Usage information and analytics</li>
                  <li>Device and browser information</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold mb-2">2. Data Usage</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Providing and improving services</li>
                  <li>Communication and support</li>
                  <li>Security and fraud prevention</li>
                  <li>Legal compliance</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold mb-2">3. Data Protection</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Industry-standard security measures</li>
                  <li>Limited employee access</li>
                  <li>Regular security audits</li>
                  <li>Data retention policies</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <span className="text-muted-foreground">•</span>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="link" className="text-muted-foreground hover:text-foreground">
            User Agreement
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>User Agreement</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
            <div className="space-y-6 pb-4">
              <section>
                <h3 className="font-semibold mb-2">1. Account Terms</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Account creation and eligibility</li>
                  <li>Account security responsibilities</li>
                  <li>Accurate information requirement</li>
                  <li>Account termination conditions</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold mb-2">2. User Conduct</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Community guidelines compliance</li>
                  <li>Content ownership and licensing</li>
                  <li>Interaction with other users</li>
                  <li>Reporting violations</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold mb-2">3. Service Terms</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                  <li>Service availability and modifications</li>
                  <li>Intellectual property rights</li>
                  <li>Limitation of liability</li>
                  <li>Dispute resolution</li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}