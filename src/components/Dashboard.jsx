import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';
import IstasyonGoruntule from './IstasyonGoruntule';

const Dashboard = () => {
  const { istasyonlar, setAktifGorunum } = useFabrika();
  
  // Seçilen fabrika için durum
  const [secilenFabrika, setSecilenFabrika] = useState(null);
  // Seçilen istasyon için durum
  const [secilenIstasyon, setSecilenIstasyon] = useState(null);

  // Fabrika seçme işleyicisi
  const fabrikaSec = (fabrikaAdi) => {
    setSecilenFabrika(fabrikaAdi);
    setSecilenIstasyon(null);
  };

  // İstasyon seçme işleyicisi
  const istasyonSec = (istasyonId) => {
    setSecilenIstasyon(istasyonId);
  };

  // İstasyon görünümüne geçiş işleyicisi
  const istasyonGorunumuneGec = (istasyonId) => {
    setAktifGorunum(`istasyon-${istasyonId}`);
  };

  // Seçilen istasyonun bilgilerini getir
  const secilenIstasyonBilgisi = istasyonlar.find(i => i.id === secilenIstasyon);

  return (
    <div className="dashboard">
      <h1>Cam Fabrikası Üretim Takip Sistemi</h1>
      
      {!secilenFabrika ? (
        <div className="fabrikalar-container">
          <h2>Fabrikalar</h2>
          <div className="fabrika-kartlari">
            <div 
              className="fabrika-kart" 
              onClick={() => fabrikaSec('A1')}
            >
              <h3>A1 Fabrikası</h3>
            </div>
            <div 
              className="fabrika-kart" 
              onClick={() => fabrikaSec('B1')}
            >
              <h3>B1 Fabrikası</h3>
            </div>
          </div>
        </div>
      ) : !secilenIstasyon ? (
        <div className="istasyonlar-container">
          <h2>{secilenFabrika} Fabrikası İstasyonları</h2>
          <div className="istasyon-kartlari">
            {istasyonlar.map(istasyon => (
              <div 
                key={istasyon.id} 
                className="istasyon-kart" 
                onClick={() => istasyonSec(istasyon.id)}
              >
                <h3>{istasyon.name}</h3>
              </div>
            ))}
          </div>
          <button 
            className="geri-button" 
            onClick={() => setSecilenFabrika(null)}
          >
            Geri
          </button>
        </div>
      ) : (
        <div className="istasyon-detay">
          <h2>{secilenFabrika} Fabrikası - {secilenIstasyonBilgisi.name}</h2>
          <IstasyonGoruntule istasyonId={secilenIstasyon} />
          <div className="button-group">
            <button 
              className="geri-button" 
              onClick={() => setSecilenIstasyon(null)}
            >
              Geri
            </button>
            <button 
              className="goruntule-button" 
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