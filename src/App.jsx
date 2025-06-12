import { FabrikaProvider, useFabrika } from './context/FabrikaContext';
import Dashboard from './components/Dashboard';
import SiparisOlusturForm from './components/SiparisOlusturForm';
import IstasyonGoruntule from './components/IstasyonGoruntule';
import GorunumSecici from './components/GorunumSecici';
import Rapor from './components/Rapor';
import { ToastContainer } from './components/Toast';
import logo from './assets/logo.jpg';
import './App.css';

// Ana içerik bileşeni
const IcerikGoruntule = () => {
  const { aktifGorunum } = useFabrika();
  
  // Rapor görünümü
  if (aktifGorunum === 'rapor') {
    return <Rapor />;
  }
  
  // Eğer aktif görünüm "admin" ise, dashboard ve sipariş oluşturma formunu göster
  if (aktifGorunum === 'admin') {
    return (
      <div className="ana-icerik">
        <Dashboard />
        <SiparisOlusturForm />
      </div>
    );
  } 
  // Eğer değilse, istasyon görünümünü göster
  else {
    // İstasyon ID'sini aktif görünümden çıkar (örn: 'istasyon-kesim' -> 'kesim')
    const istasyonId = aktifGorunum.replace('istasyon-', '');
    
    return (
      <div className="istasyon-icerik">
        <img src={logo} alt="Efes Cam" className="dashboard-logo" />
        <h1>Cam Fabrikası Üretim Takip Sistemi</h1>
        <IstasyonGoruntule 
          istasyonId={istasyonId} 
          istasyonGorunumu={true} 
        />
      </div>
    );
  }
};

function App() {
  return (
    <FabrikaProvider>
      <AppContent />
    </FabrikaProvider>
  );
}

// Separate component to use the context
const AppContent = () => {
  const { toast } = useFabrika();
  
  return (
    <div className="app">
      <img src={logo} alt="Efes Cam" className="app-logo" />
      <GorunumSecici />
      <IcerikGoruntule />
      <ToastContainer toasts={toast.toasts} removeToast={toast.removeToast} />
    </div>
  );
};

export default App;
