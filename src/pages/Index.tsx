
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 sm:py-12">
        <Navigation />

        <main className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mt-8 md:mt-12">
          <div className="w-full md:w-1/2">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 text-center md:text-left">
              Share all your links in one place
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 md:mb-8 text-center md:text-left">
              Create a customizable page that houses all the important links you want to share with your audience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to={user ? "/dashboard" : "/register"} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
                  {user ? 'Go to Dashboard' : 'Get Started for Free'}
                </Button>
              </Link>
              {!user && (
                <Link to="/login" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 mt-8 md:mt-0">
            <div className="relative w-full h-[350px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-lg shadow-xl mx-auto max-w-sm sm:max-w-md md:max-w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 p-4 pt-8 sm:pt-12">
                <div className="bg-white/20 backdrop-blur-sm p-4 rounded-lg mb-4 flex flex-col items-center">
                  <div className="h-16 sm:h-20 w-16 sm:w-20 rounded-full bg-white/30 backdrop-blur-sm mb-3"></div>
                  <div className="h-5 sm:h-6 w-24 sm:w-32 bg-white/30 rounded-full mb-2"></div>
                  <div className="h-3 sm:h-4 w-36 sm:w-48 bg-white/20 rounded-full mb-6"></div>
                </div>
                
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-white/20 backdrop-blur-sm py-2 sm:py-3 px-4 rounded-lg flex items-center justify-center">
                      <div className="h-4 sm:h-5 w-20 sm:w-24 bg-white/30 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <section className="py-10 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Simple, Fast, and Beautiful
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm">
              <div className="h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
                1
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Create an account</h3>
              <p className="text-sm sm:text-base text-gray-600">Sign up and get started in seconds, no credit card required.</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm">
              <div className="h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
                2
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Add your links</h3>
              <p className="text-sm sm:text-base text-gray-600">Add all your important links in one place, customize your page.</p>
            </div>
            <div className="bg-white p-5 sm:p-6 rounded-lg shadow-sm sm:col-span-2 md:col-span-1 mx-auto sm:mx-0 max-w-md sm:max-w-full">
              <div className="h-10 sm:h-12 w-10 sm:w-12 flex items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
                3
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Share with the world</h3>
              <p className="text-sm sm:text-base text-gray-600">Share your custom link with your audience on social media.</p>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="bg-white py-6 sm:py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-center sm:text-left mb-4 sm:mb-0">© 2023 LinkTree Clone. All rights reserved.</p>
            <div className="flex gap-4 sm:gap-6">
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
