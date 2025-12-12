import React, { useState, useEffect } from 'react';
import { UserRole, User, WasteReport, UrgencyLevel, ReportStatus } from './types';
import { CitizenView } from './views/CitizenView';
import { MunicipalityView } from './views/MunicipalityView';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage, AboutPage, ServicesPage, ContactPage } from './views/PublicPages';

// Mock Initial Data
const MOCK_USER: User = {
  id: 'user-123',
  name: 'Alex Rivera',
  role: UserRole.CITIZEN,
  points: 1250,
  avatar: 'https://picsum.photos/200'
};

const ADMIN_USER: User = {
  id: 'admin-001',
  name: 'City Ops',
  role: UserRole.EMPLOYER,
  points: 0,
  avatar: 'https://picsum.photos/201'
};

type ViewState = 'home' | 'about' | 'services' | 'contact' | 'app';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [reports, setReports] = useState<WasteReport[]>([]);
  const [currentView, setCurrentView] = useState<ViewState>('home');

  // Simulate incoming reports for the dashboard
  useEffect(() => {
    const initialReports: WasteReport[] = [
      {
        id: '1',
        imageUrl: 'https://picsum.photos/seed/trash1/300/300',
        timestamp: Date.now() - 100000,
        location: { lat: 34.05, lng: -118.25 },
        status: ReportStatus.PENDING,
        urgency: UrgencyLevel.HIGH,
        wasteType: ['Organic', 'Plastic'],
        overflowLevel: 90,
        aiAnalysisText: "Severely overflowing bin with organic waste spilling.",
        reporterId: 'user-999'
      },
      {
        id: '2',
        imageUrl: 'https://picsum.photos/seed/trash2/300/300',
        timestamp: Date.now() - 500000,
        location: { lat: 34.06, lng: -118.26 },
        status: ReportStatus.PENDING,
        urgency: UrgencyLevel.LOW,
        wasteType: ['Cardboard'],
        overflowLevel: 45,
        aiAnalysisText: "Bin is nearing capacity, mostly cardboard.",
        reporterId: 'user-999'
      }
    ];
    setReports(initialReports);
  }, []);

  const handleAddReport = (report: WasteReport) => {
    setReports(prev => [report, ...prev]);
    if (currentUser && currentUser.role === UserRole.CITIZEN) {
      setCurrentUser({ ...currentUser, points: currentUser.points + 50 });
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleLogin = (role: UserRole = UserRole.CITIZEN) => {
    if (role === UserRole.EMPLOYER) {
      setCurrentUser(ADMIN_USER);
    } else {
      setCurrentUser(MOCK_USER);
    }
    setCurrentView('app');
  };
  
  // Render logic based on view state
  const renderPublicPage = () => {
    // Calculate global stats dynamically based on app state
    // We add a base number (e.g., +1200) to simulate existing historical data for the public view
    const stats = {
      totalReports: reports.length + 1242, 
      resolvedReports: reports.filter(r => r.status === ReportStatus.RESOLVED).length + 895,
      yearsExperience: 3
    };

    switch (currentView) {
      case 'about': return <AboutPage />;
      case 'services': return <ServicesPage />;
      case 'contact': return <ContactPage />;
      default: return <HomePage onLoginClick={handleLogin} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Navbar 
        user={currentUser} 
        onLogout={handleLogout} 
        onNavigate={(page) => setCurrentView(page as ViewState)}
        onLoginClick={() => handleLogin(UserRole.CITIZEN)} // Default logic for nav button
      />
      
      {/* Main Content Area */}
      <div className="pt-16 flex-1 flex flex-col">
        {currentUser && currentView === 'app' ? (
          <div className="flex-1 flex flex-col">
            {currentUser.role === UserRole.CITIZEN ? (
              <CitizenView 
                user={currentUser} 
                onLogout={handleLogout} 
                addReport={handleAddReport} 
              />
            ) : (
              <MunicipalityView 
                user={currentUser} 
                reports={reports} 
                onLogout={handleLogout} 
              />
            )}
          </div>
        ) : (
          <>
            {renderPublicPage()}
            <Footer onNavigate={(page) => setCurrentView(page as ViewState)} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;