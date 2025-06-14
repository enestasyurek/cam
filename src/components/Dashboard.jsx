import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';
import IstasyonGoruntule from './IstasyonGoruntule';

const Dashboard = () => {
  const { 
    istasyonlar, 
    setAktifGorunum,
    istasyonSiparisleriGetir,
    istasyonKuyruklar 
  } = useFabrika();
  
  const [secilenFabrika, setSecilenFabrika] = useState(null);
  const [secilenIstasyon, setSecilenIstasyon] = useState(null);

  const fabrikaSec = (fabrikaAdi) => {
    setSecilenFabrika(fabrikaAdi);
    setSecilenIstasyon(null);
  };

  const istasyonSec = (istasyonId) => {
    setSecilenIstasyon(istasyonId);
  };

  const istasyonGorunumuneGec = (istasyonId) => {
    setAktifGorunum(`istasyon-${istasyonId}`);
  };

  const secilenIstasyonBilgisi = istasyonlar.find(i => i.id === secilenIstasyon);

  const bekleyenSiparislerByIstasyon = (istasyonId) => {
    return istasyonSiparisleriGetir(istasyonId).length;
  };

  const kuyrukUzunlugu = (istasyonId) => {
    return (istasyonKuyruklar[istasyonId] || []).length;
  };

  return (
    <div className="dashboard">
      <img src="/logo.jpg" alt="Efes Cam" className="dashboard-logo" />
      <h1>Efes Cam Üretim Takip Sistemi</h1>
      
      {!secilenFabrika ? (
        <div className="fabrika-secimi">
          <h2>Fabrika Seçimi</h2>
          <div className="fabrika-kartlari">
            <div 
              className="fabrika-kart" 
              onClick={() => fabrikaSec('A1')}
            >
              <h3>Merkez Fabrika</h3>
              <p>A1 Tesisi</p>
            </div>
            <div 
              className="fabrika-kart" 
              onClick={() => fabrikaSec('B1')}
            >
              <h3>Şube Fabrika</h3>
              <p>B1 Tesisi</p>
            </div>
          </div>
          <div className="dashboard-actions">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={() => setAktifGorunum('siparis-sorgula')}
            >
              Sipariş Sorgula
            </button>
          </div>
        </div>
      ) : !secilenIstasyon ? (
        <div className="istasyon-secimi">
          <h2>{secilenFabrika} Fabrikası İstasyonları</h2>
          <div className="istasyon-kartlari">
            {istasyonlar
              .filter(istasyon => istasyon.fabrika === secilenFabrika)
              .map(istasyon => {
                const bekleyenSayisi = bekleyenSiparislerByIstasyon(istasyon.id);
                const kuyrukSayisi = kuyrukUzunlugu(istasyon.id);
                return (
                  <div 
                    key={istasyon.id} 
                    className="istasyon-kart" 
                    onClick={() => istasyonSec(istasyon.id)}
                  >
                    <h4>{istasyon.name}</h4>
                    <p>{bekleyenSayisi} aktif sipariş</p>
                    {kuyrukSayisi > 0 && (
                      <span className="bekleyen-badge">{kuyrukSayisi} kuyrukta</span>
                    )}
                  </div>
                );
              })}
          </div>
          <div className="button-group">
            <button 
              className="btn btn-secondary" 
              onClick={() => setSecilenFabrika(null)}
            >
              Geri
            </button>
          </div>
        </div>
      ) : (
        <div className="istasyon-detay">
          <div className="istasyon-header">
            <h2>{secilenFabrika} - {secilenIstasyonBilgisi?.name || 'İstasyon'}</h2>
          </div>
          <IstasyonGoruntule istasyonId={secilenIstasyon} />
          <div className="button-group">
            <button 
              className="btn btn-secondary" 
              onClick={() => setSecilenIstasyon(null)}
            >
              Geri
            </button>
            <button 
              className="btn btn-primary" 
              onClick={() => istasyonGorunumuneGec(secilenIstasyon)}
            >
              İstasyon Görünümüne Geç
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;