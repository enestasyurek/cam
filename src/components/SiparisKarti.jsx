import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';
import KirilanCamModal from './KirilanCamModal';
import SiparisDuzenleModal from './SiparisDuzenleModal';

const SiparisKarti = ({ siparis, istasyonGorunumu, istasyonId }) => {
  const { iseBasla, isiBitir, aktifGorunum, istasyonlar } = useFabrika();
  
  const [modaller, setModaller] = useState({
    kirilan: false,
    duzenle: false
  });
  
  const durum = siparis.durum;
  const durumSinifi = durum === 'İşlemde' ? 'islemde' : 
                      durum === 'Bekliyor' ? 'bekliyor' : 
                      'tamamlandi';
  
  const islemdeMi = durum === 'İşlemde';
  const bekliyor = durum === 'Bekliyor';
  
  const iseBaslaButonuEtkin = istasyonGorunumu && bekliyor;
  const isiBitirButonuEtkin = istasyonGorunumu && islemdeMi;
  
  const iseBaslaHandler = () => {
    iseBasla(siparis.id);
  };
  
  const isiBitirHandler = () => {
    isiBitir(siparis.id);
  };
  
  const modalAc = (modalTip) => {
    setModaller(prev => ({ ...prev, [modalTip]: true }));
  };

  const modalKapat = (modalTip) => {
    setModaller(prev => ({ ...prev, [modalTip]: false }));
  };
  
  const butonlarEtkin = aktifGorunum === `istasyon-${istasyonId}`;
  
  const oncelikMetni = 
    siparis.oncelik === 1 ? 'Yüksek' : 
    siparis.oncelik === 2 ? 'Orta' : 'Düşük';
  
  const formatTarih = (tarihStr) => {
    if (!tarihStr) return '-';
    return new Date(tarihStr).toLocaleDateString('tr-TR');
  };
  
  const istasyonSirasiMetni = siparis.istasyonSirasi
    .map(istId => istasyonlar.find(ist => ist.id === istId)?.name || istId)
    .join(' → ');
  
  const guncelIstasyonId = siparis.istasyonSirasi[siparis.guncelIstasyonIndex];
  const guncelIstasyon = istasyonlar.find(ist => ist.id === guncelIstasyonId);
  const guncelIstasyonAdi = guncelIstasyon?.name || '-';
  
  return (
    <>
      <div className={`siparis-kart ${durumSinifi}`}>
        <div className="siparis-baslik">
          <div className="siparis-baslik-sol">
            <h4>{siparis.siparisNo}</h4>
            <span className={`oncelik-rozet oncelik-${siparis.oncelik}`}>
              {oncelikMetni}
            </span>
          </div>
          
          {istasyonGorunumu && (
            <div className="siparis-butonlar">
              <button 
                onClick={iseBaslaHandler}
                disabled={!iseBaslaButonuEtkin || !butonlarEtkin}
                className={`btn ${islemdeMi ? 'btn-secondary' : 'btn-success'} btn-sm`}
              >
                ▶️ İşe Başla
              </button>
              <button 
                onClick={isiBitirHandler}
                disabled={!isiBitirButonuEtkin || !butonlarEtkin}
                className={`btn ${!islemdeMi ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              >
                ✅ İşi Bitir
              </button>
              <button 
                onClick={() => modalAc('kirilan')}
                className="btn btn-danger btn-sm"
                title="Kırılan Cam Bildir"
              >
                🔴 Kırık
              </button>
            </div>
          )}
          
          {!istasyonGorunumu && aktifGorunum === 'admin' && (
            <div className="siparis-butonlar">
              <button 
                onClick={() => modalAc('duzenle')}
                className="btn btn-warning btn-sm"
                title="Siparişi Düzenle"
              >
                ✏️ Düzenle
              </button>
            </div>
          )}
        </div>
        
        <div className="siparis-detaylar">
          <div className="detay-grup">
            <h5>👤 Müşteri Bilgileri</h5>
            <p><strong>Müşteri:</strong> {siparis.musteri}</p>
            {siparis.projeAdi && <p><strong>Proje:</strong> {String(siparis.projeAdi)}</p>}
          </div>
          
          <div className="detay-grup">
            <h5>📅 Tarih Bilgileri</h5>
            <p><strong>Sipariş:</strong> {formatTarih(siparis.siparisTarihi)}</p>
            <p><strong>Teslim:</strong> {formatTarih(siparis.teslimTarihi)}</p>
            <p><strong>Gün:</strong> {siparis.gun}</p>
          </div>
          
          <div className="detay-grup">
            <h5>🪟 Ürün Detayları</h5>
            {siparis.camKombinasyonu && <p><strong>Cam Kombinasyonu:</strong> {String(siparis.camKombinasyonu)}</p>}
            {siparis.camTipi && <p><strong>Cam Tipi:</strong> {String(siparis.camTipi)}</p>}
            {siparis.toplamMiktar > 0 && 
              <p><strong>Miktar:</strong> {siparis.toplamMiktar} m²</p>
            }
            {siparis.adet > 0 && 
              <p><strong>Adet:</strong> {siparis.adet} {siparis.kirilanAdet > 0 && <span className="kirmizi">(-{siparis.kirilanAdet} kırık)</span>}</p>
            }
          </div>
          
          <div className="detay-grup">
            <h5>🔄 İş Akışı</h5>
            <p><strong>Rota:</strong> {istasyonSirasiMetni}</p>
            <p><strong>Şu an:</strong> {guncelIstasyonAdi}</p>
            <p><strong>Durum:</strong> <span className={`durum-badge ${durumSinifi}`}>{durum}</span></p>
          </div>
        </div>
      </div>

      {/* Modal Components */}
      <KirilanCamModal
        isOpen={modaller.kirilan}
        onClose={() => modalKapat('kirilan')}
        siparis={siparis}
        istasyonId={istasyonId}
      />
      
      <SiparisDuzenleModal
        isOpen={modaller.duzenle}
        onClose={() => modalKapat('duzenle')}
        siparis={siparis}
      />
    </>
  );
};

export default SiparisKarti;