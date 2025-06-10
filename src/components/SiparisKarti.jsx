import { useFabrika } from '../context/FabrikaContext';

const SiparisKarti = ({ siparis, istasyonGorunumu, istasyonId }) => {
  const { iseBasla, isiBitir, aktifGorunum } = useFabrika();
  
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
  
  return (
    <div className={`siparis-kart ${durumSinifi}`}>
      <div className="siparis-bilgi">
        <h4>{siparis.siparisAdi}</h4>
        <p>
          <strong>Öncelik:</strong> {oncelikMetni}
        </p>
        <p>
          <strong>Durum:</strong> {durum}
        </p>
        <p>
          <strong>Oluşturma Tarihi:</strong> {new Date(siparis.olusturmaTarihi).toLocaleString('tr-TR')}
        </p>
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