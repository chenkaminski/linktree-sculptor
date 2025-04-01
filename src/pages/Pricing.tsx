
import React from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

const PricingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSelectPlan = (planId: string) => {
    if (!user) {
      navigate('/register', { state: { planId } });
    } else {
      navigate('/dashboard', { state: { upgrade: true, planId } });
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 min-h-screen">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Navigation />
        
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Choose Your Plan
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Select the perfect plan for your needs. All plans include a custom page for your links.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>For individuals just getting started</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Up to 5 links</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic themes</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Social icons</span>
                </li>
                <li className="flex items-center opacity-50">
                  <Check className="h-5 w-5 mr-2" />
                  <span>Custom domain</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSelectPlan('free')}
              >
                {user ? 'Current Plan' : 'Get Started'}
              </Button>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="relative border-purple-500 shadow-md">
            <div className="absolute -top-4 left-0 right-0 flex justify-center">
              <span className="bg-purple-500 text-white text-sm font-semibold px-4 py-1 rounded-full">
                Most Popular
              </span>
            </div>
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For creators and professionals</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$9</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Unlimited links</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>All themes</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Custom fonts</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Remove branding</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => handleSelectPlan('pro')}
              >
                Go Pro
              </Button>
            </CardFooter>
          </Card>

          {/* Business Plan */}
          <Card className="relative">
            <CardHeader>
              <CardTitle>Business</CardTitle>
              <CardDescription>For teams and businesses</CardDescription>
              <div className="mt-4">
                <span className="text-3xl font-bold">$29</span>
                <span className="text-gray-500 ml-2">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Team management</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Advanced customization</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>API access</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => handleSelectPlan('business')}
              >
                Contact Sales
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto grid gap-6 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your billing period.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 14-day money-back guarantee for all paid plans.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards and PayPal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
