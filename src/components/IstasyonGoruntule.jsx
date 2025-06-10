import { useFabrika } from '../context/FabrikaContext';
import SiparisKarti from './SiparisKarti';

const IstasyonGoruntule = ({ istasyonId, istasyonGorunumu = false }) => {
  const { istasyonlar, istasyonSiparisleriGetir, siralama, siralamaDegistir } = useFabrika();
  
  // İstasyon bilgilerini al
  const istasyon = istasyonlar.find(i => i.id === istasyonId);
  
  // Bu istasyona ait siparişleri al
  const istasyonSiparisleri = istasyonSiparisleriGetir(istasyonId);

  // Sıralama başlıklarını oluştur
  const siralamaBaşligi = (alan, metin) => {
    const aktif = siralama.alan === alan;
    const yonIcon = aktif ? (siralama.artan ? '↑' : '↓') : '';
    
    return (
      <div 
        className={`siralama-baslik ${aktif ? 'aktif' : ''}`}
        onClick={() => siralamaDegistir(alan)}
      >
        {metin} {yonIcon}
      </div>
    );
  };

  return (
    <div className="istasyon-goruntule">
      <h3>
        {istasyonGorunumu ? 'Çalışma İstasyonu: ' : 'Siparişler: '}
        {istasyon ? istasyon.name : ''}
      </h3>
      
      {istasyonSiparisleri.length === 0 ? (
        <p>Bu istasyonda bekleyen sipariş bulunmamaktadır.</p>
      ) : (
        <div className="istasyon-icerik">
          <div className="siralama-basliklar">
            {siralamaBaşligi('siparisNo', 'Sipariş No')}
            {siralamaBaşligi('siparisTarihi', 'Sipariş Tarihi')}
            {siralamaBaşligi('teslimTarihi', 'Teslim Tarihi')}
            {siralamaBaşligi('gun', 'Gün')}
            {siralamaBaşligi('musteri', 'Müşteri')}
            {siralamaBaşligi('cariUnvan', 'Cari Ünvan')}
            {siralamaBaşligi('kombinasyonAdi', 'Kombinasyon')}
            {siralamaBaşligi('toplamMiktar', 'Miktar')}
            {siralamaBaşligi('adet', 'Adet')}
            {siralamaBaşligi('oncelik', 'Öncelik')}
          </div>
          
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
        </div>
      )}
    </div>
  );
};

export default IstasyonGoruntule; 