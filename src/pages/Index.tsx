
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-12">
        <header className="flex justify-between items-center mb-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">LinkTree Clone</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link to={`/u/${user.username}`}>
                  <Button variant="ghost">My Profile</Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </header>

        <main className="flex flex-col md:flex-row items-center gap-12 mt-12">
          <div className="md:w-1/2">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Share all your links in one place
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Create a customizable page that houses all the important links you want to share with your audience.
            </p>
            <div className="flex gap-4">
              <Link to={user ? "/dashboard" : "/register"}>
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  {user ? 'Go to Dashboard' : 'Get Started for Free'}
                </Button>
              </Link>
              {!user && (
                <Link to="/login">
                  <Button variant="outline" size="lg">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative w-full h-[500px] overflow-hidden rounded-lg shadow-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 p-4 pt-12">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg mb-4 flex flex-col items-center">
                  <div className="h-20 w-20 rounded-full bg-white/30 backdrop-blur-sm mb-3"></div>
                  <div className="h-6 w-32 bg-white/30 rounded-full mb-2"></div>
                  <div className="h-4 w-48 bg-white/20 rounded-full mb-6"></div>
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/20 backdrop-blur-sm py-3 px-4 rounded-lg flex items-center justify-center">
                      <div className="h-5 w-24 bg-white/30 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            Simple, Fast, and Beautiful
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create an account</h3>
              <p className="text-gray-600">Sign up and get started in seconds, no credit card required.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add your links</h3>
              <p className="text-gray-600">Add all your important links in one place, customize your page.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Share with the world</h3>
              <p className="text-gray-600">Share your custom link with your audience on social media.</p>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600">© 2023 LinkTree Clone. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-600 hover:text-purple-600">Terms</a>
              <a href="#" className="text-gray-600 hover:text-purple-600">Privacy</a>
              <a href="#" className="text-gray-600 hover:text-purple-600">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
