import { useFabrika } from '../context/FabrikaContext';
import SiparisKarti from './SiparisKarti';
import EmptyState from './EmptyState';

const IstasyonGoruntule = ({ istasyonId, istasyonGorunumu = false }) => {
  const { istasyonlar, istasyonSiparisleriGetir, siralama, siralamaDegistir } = useFabrika();
  
  const istasyon = istasyonlar.find(i => i.id === istasyonId);
  const istasyonSiparisleri = istasyonSiparisleriGetir(istasyonId);
  
  if (!istasyon) {
    return (
      <div className="empty-state">
        <h3>İstasyon Bulunamadı</h3>
        <p>İstasyon ID: {istasyonId}</p>
        <p>Lütfen geçerli bir istasyon seçin.</p>
      </div>
    );
  }

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
      <div className="istasyon-header">
        <h2>
          {istasyonGorunumu ? 'Çalışma İstasyonu: ' : ''}
          {istasyon ? istasyon.name : ''}
        </h2>
        {istasyonGorunumu && (
          <div className="istasyon-ozet">
            <span className="ozet-item">
              <strong>Toplam:</strong> {istasyonSiparisleri.length}
            </span>
            <span className="ozet-item">
              <strong>Bekleyen:</strong> {istasyonSiparisleri.filter(s => s.durum === 'Bekliyor').length}
            </span>
            <span className="ozet-item">
              <strong>İşlemde:</strong> {istasyonSiparisleri.filter(s => s.durum === 'İşlemde').length}
            </span>
          </div>
        )}
      </div>
      
      {istasyonSiparisleri.length === 0 ? (
        <EmptyState 
          title="Sipariş Yok"
          message={`${istasyon ? istasyon.name : 'Bu'} istasyonunda şu anda bekleyen veya işlemde olan sipariş bulunmuyor.`}
          icon="📦"
        />
      ) : (
        <>
          <div className="siralama-basliklar">
            {siralamaBaşligi('siparisNo', 'Sipariş No')}
            {siralamaBaşligi('siparisTarihi', 'Sipariş')}
            {siralamaBaşligi('teslimTarihi', 'Teslim')}
            {siralamaBaşligi('gun', 'Gün')}
            {siralamaBaşligi('musteri', 'Müşteri')}
            {siralamaBaşligi('kombinasyonAdi', 'Kombinasyon')}
            {siralamaBaşligi('toplamMiktar', 'Miktar')}
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
        </>
      )}
    </div>
  );
};

export default IstasyonGoruntule;