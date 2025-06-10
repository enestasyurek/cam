import { useFabrika } from '../context/FabrikaContext';

const SiparisKarti = ({ siparis, istasyonGorunumu, istasyonId }) => {
  const { iseBasla, isiBitir, aktifGorunum, istasyonlar } = useFabrika();
  
  // Sipariş durumunu kontrol et
  const durum = siparis.durum;
  // Durum değerlerini CSS sınıflarına uygun şekilde dönüştür
  const durumSinifi = durum === 'İşlemde' ? 'islemde' : 
                      durum === 'Bekliyor' ? 'bekliyor' : 
                      'tamamlandi';
  
  const islemdeMi = durum === 'İşlemde';
  const bekliyor = durum === 'Bekliyor';
  
  // Siparişteki geçerli istasyon kaydını bul
  const istasyonGecmisi = siparis.gecmis[siparis.guncelIstasyonIndex];
  
  // Butonların etkin olup olmadığını belirle
  const iseBaslaButonuEtkin = istasyonGorunumu && bekliyor;
  const isiBitirButonuEtkin = istasyonGorunumu && islemdeMi;
  
  // Buton işleyicileri
  const iseBaslaHandler = () => {
    iseBasla(siparis.id);
  };
  
  const isiBitirHandler = () => {
    isiBitir(siparis.id);
  };
  
  // Eğer aktif görünüm bu kartın istasyonu değilse butonları devre dışı bırak
  const butonlarEtkin = aktifGorunum === `istasyon-${istasyonId}`;
  
  // Öncelik metnini belirle
  const oncelikMetni = 
    siparis.oncelik === 1 ? 'Yüksek' : 
    siparis.oncelik === 2 ? 'Orta' : 'Düşük';
  
  // Tarihleri formatlama
  const formatTarih = (tarihStr) => {
    if (!tarihStr) return '-';
    return new Date(tarihStr).toLocaleDateString('tr-TR');
  };
  
  // İstasyon sırasını formatlama
  const istasyonSirasiMetni = siparis.istasyonSirasi
    .map(istId => istasyonlar.find(ist => ist.id === istId)?.name || istId)
    .join(' → ');
  
  // Güncel istasyon
  const guncelIstasyonId = siparis.istasyonSirasi[siparis.guncelIstasyonIndex];
  const guncelIstasyon = istasyonlar.find(ist => ist.id === guncelIstasyonId);
  const guncelIstasyonAdi = guncelIstasyon?.name || '-';
  
  return (
    <div className={`siparis-kart ${durumSinifi}`}>
      <div className="siparis-bilgi">
        <div className="siparis-baslik">
          <h4>{siparis.siparisNo}</h4>
          <span className={`oncelik-rozet oncelik-${siparis.oncelik}`}>
            {oncelikMetni}
          </span>
        </div>
        
        <div className="siparis-detaylar">
          <div className="detay-grup">
            <p><strong>Müşteri:</strong> {siparis.musteri}</p>
            {siparis.cariUnvan && <p><strong>Cari Ünvan:</strong> {siparis.cariUnvan}</p>}
          </div>
          
          <div className="detay-grup">
            <p>
              <strong>Sipariş Tarihi:</strong> {formatTarih(siparis.siparisTarihi)}
            </p>
            <p>
              <strong>Teslim Tarihi:</strong> {formatTarih(siparis.teslimTarihi)}
            </p>
            <p><strong>Gün:</strong> {siparis.gun}</p>
          </div>
          
          <div className="detay-grup">
            <p><strong>Kombinasyon:</strong> {siparis.kombinasyonAdi}</p>
            {siparis.toplamMiktar > 0 && 
              <p><strong>Toplam Miktar:</strong> {siparis.toplamMiktar} m²</p>
            }
            {siparis.adet > 0 && 
              <p><strong>Adet:</strong> {siparis.adet}</p>
            }
            <p><strong>Durum:</strong> {durum}</p>
          </div>
          
          <div className="detay-grup">
            <p><strong>İş Akışı:</strong> {istasyonSirasiMetni}</p>
            <p><strong>Güncel İstasyon:</strong> {guncelIstasyonAdi}</p>
          </div>
        </div>
      </div>
      
      {istasyonGorunumu && (
        <div className="siparis-butonlar">
          <button 
            onClick={iseBaslaHandler}
            disabled={!iseBaslaButonuEtkin || !butonlarEtkin}
            className={islemdeMi ? 'disabled' : ''}
          >
            İşe Başla
          </button>
          <button 
            onClick={isiBitirHandler}
            disabled={!isiBitirButonuEtkin || !butonlarEtkin}
            className={!islemdeMi ? 'disabled' : ''}
          >
            İşi Bitir
          </button>
        </div>
      )}
    </div>
  );
};

export default SiparisKarti; 