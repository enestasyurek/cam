import { FabrikaProvider, useFabrika } from './context/FabrikaContext';
import Dashboard from './components/Dashboard';
import SiparisOlusturForm from './components/SiparisOlusturForm';
import IstasyonGoruntule from './components/IstasyonGoruntule';
import GorunumSecici from './components/GorunumSecici';
import Rapor from './components/Rapor';
import SiparisSorgula from './components/SiparisSorgula';
import { ToastContainer } from './components/Toast';
import { useEffect } from 'react';
import './config/chartConfig'; // Initialize Chart.js
import './App.css';

// Ana içerik bileşeni
const IcerikGoruntule = () => {
  const { aktifGorunum } = useFabrika();
  
  // Rapor görünümü
  if (aktifGorunum === 'rapor') {
    return <Rapor />;
  }
  
  // Sipariş sorgulama görünümü
  if (aktifGorunum === 'siparis-sorgula') {
    return <SiparisSorgula />;
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
        <img src="/logo.jpg" alt="Efes Cam" className="dashboard-logo" />
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
  const { 
    toasts, 
    removeToast, 
    sunumModu, 
    setSunumModu,
    demoSiparisEkle,
    rastgeleSiparisIlerlet,
    rastgeleKirilanCamEkle,
    toast
  } = useFabrika();
  
  // Klavye kısayolları
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Sunum modu kısayolları
      if (sunumModu) {
        switch(e.key) {
          case 'n':
          case 'N':
            demoSiparisEkle();
            break;
          case 'i':
          case 'İ':
          case 'I':
            rastgeleSiparisIlerlet();
            break;
          case 'k':
          case 'K':
            rastgeleKirilanCamEkle();
            break;
          case 'Escape':
            setSunumModu(false);
            toast.info('Sunum modu kapatıldı');
            break;
        }
      }
      
      // Genel kısayollar
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        setSunumModu(!sunumModu);
        toast.info(sunumModu ? 'Sunum modu kapatıldı' : 'Sunum modu açıldı');
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sunumModu, setSunumModu, demoSiparisEkle, rastgeleSiparisIlerlet, rastgeleKirilanCamEkle, toast]);
  
  return (
    <div className={`app ${sunumModu ? 'sunum-modu' : ''}`}>
      <img src="/logo.jpg" alt="Efes Cam" className="app-logo" />
      
      {/* Sunum Modu Kontrolleri */}
      <div className="sunum-kontrolleri">
        <button 
          className={`sunum-toggle ${sunumModu ? 'aktif' : ''}`}
          onClick={() => {
            setSunumModu(!sunumModu);
            toast.info(sunumModu ? 'Sunum modu kapatıldı' : 'Sunum modu açıldı');
          }}
          title="Ctrl+P ile de açabilirsiniz"
        >
          🎭 Sunum Modu
        </button>
        
        {sunumModu && (
          <div className="sunum-butonlari">
            <button 
              className="demo-buton"
              onClick={demoSiparisEkle}
              title="Yeni sipariş ekle (N)"
            >
              ➕ Yeni Sipariş
            </button>
            <button 
              className="demo-buton ilerlet"
              onClick={rastgeleSiparisIlerlet}
              title="Sipariş ilerlet (I)"
            >
              ⏩ İlerlet
            </button>
            <button 
              className="demo-buton kirilan"
              onClick={rastgeleKirilanCamEkle}
              title="Kırılan cam ekle (K)"
            >
              💥 Kırılan Cam
            </button>
            <div className="sunum-ipucu">
              Kısayollar: N=Yeni, I=İlerlet, K=Kırılan, ESC=Kapat
            </div>
          </div>
        )}
      </div>
      
      <GorunumSecici />
      <IcerikGoruntule />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default App;
