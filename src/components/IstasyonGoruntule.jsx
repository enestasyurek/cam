import { useFabrika } from '../context/FabrikaContext';
import SiparisKarti from './SiparisKarti';

const IstasyonGoruntule = ({ istasyonId, istasyonGorunumu = false }) => {
  const { istasyonlar, istasyonSiparisleriGetir } = useFabrika();
  
  // İstasyon bilgilerini al
  const istasyon = istasyonlar.find(i => i.id === istasyonId);
  
  // Bu istasyona ait siparişleri al
  const istasyonSiparisleri = istasyonSiparisleriGetir(istasyonId);

  return (
    <div className="istasyon-goruntule">
      <h3>
        {istasyonGorunumu ? 'Çalışma İstasyonu: ' : 'Siparişler: '}
        {istasyon ? istasyon.name : ''}
      </h3>
      
      {istasyonSiparisleri.length === 0 ? (
        <p>Bu istasyonda bekleyen sipariş bulunmamaktadır.</p>
      ) : (
        <div className="siparisler-listesi">
          {istasyonSiparisleri.map(siparis => (
            <SiparisKarti 
              key={siparis.id} 
              siparis={siparis} 
              istasyonGorunumu={istasyonGorunumu} 
              istasyonId={istasyonId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default IstasyonGoruntule; 