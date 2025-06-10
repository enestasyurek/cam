import { FabrikaProvider, useFabrika } from './context/FabrikaContext';
import Dashboard from './components/Dashboard';
import SiparisOlusturForm from './components/SiparisOlusturForm';
import IstasyonGoruntule from './components/IstasyonGoruntule';
import GorunumSecici from './components/GorunumSecici';
import './App.css';

// Ana içerik bileşeni
const IcerikGoruntule = () => {
  const { aktifGorunum } = useFabrika();
  
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
      <div className="app">
        <GorunumSecici />
        <IcerikGoruntule />
      </div>
    </FabrikaProvider>
  );
}

export default App;
