import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CreditCard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

const Billing = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Mock subscription status - in a real app, you would fetch this from your backend
  const [subscription, setSubscription] = useState({
    status: 'active',
    plan: 'Pro',
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    price: '$9.99/month'
  });

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    
    try {
      // Mock API call - in a real app, you would call your backend to cancel the subscription
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the subscription status
      setSubscription({
        ...subscription,
        status: 'cancelled'
      });
      
      toast({
        title: 'Subscription cancelled',
        description: 'Your subscription will remain active until the end of your billing period.',
      });
      
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel subscription. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl py-6">
        <h1 className="text-3xl font-bold mb-6">Billing</h1>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Subscription</CardTitle>
                <Badge variant={subscription.status === 'active' ? 'default' : 'secondary'}>
                  {subscription.status === 'active' ? 'Active' : 'Cancelled'}
                </Badge>
              </div>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">{subscription.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Price</p>
                  <p className="font-medium">{subscription.price}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {subscription.status === 'active' ? 'Next billing date' : 'Access until'}
                  </p>
                  <p className="font-medium">
                    {subscription.renewalDate.toLocaleDateString()}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 items-start">
              {subscription.status === 'active' ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive">Cancel Subscription</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Subscription</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your current billing period.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-md flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        Your subscription will remain active until {subscription.renewalDate.toLocaleDateString()}, after which you'll be downgraded to the free plan.
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isCancelling}
                      >
                        Keep Subscription
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleCancelSubscription}
                        disabled={isCancelling}
                      >
                        {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : (
                <Button variant="default">
                  Reactivate Subscription
                </Button>
              )}
              <div className="text-sm text-muted-foreground">
                Need help? <a href="#" className="font-medium text-primary underline-offset-4 hover:underline">Contact support</a>
              </div>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>
                View your recent payment history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">Pro Plan - Monthly</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-medium">$9.99</p>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-medium">Pro Plan - Monthly</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="font-medium">$9.99</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Billing; 