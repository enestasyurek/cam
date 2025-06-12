import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisKarti = ({ siparis, istasyonGorunumu, istasyonId }) => {
  const { iseBasla, isiBitir, aktifGorunum, istasyonlar, kirilanCamBildir, siparisDuzenle } = useFabrika();
  const [kirilanModalAcik, setKirilanModalAcik] = useState(false);
  const [kirilanAdet, setKirilanAdet] = useState('');
  const [kirilanAciklama, setKirilanAciklama] = useState('');
  const [duzenleModalAcik, setDuzenleModalAcik] = useState(false);
  const [duzenleForm, setDuzenleForm] = useState({
    musteri: siparis.musteri,
    cariUnvan: siparis.cariUnvan,
    toplamMiktar: siparis.toplamMiktar,
    adet: siparis.adet
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
  
  const kirilanCamKaydet = () => {
    if (!kirilanAdet || parseInt(kirilanAdet) <= 0) {
      alert('Lütfen geçerli bir adet giriniz!');
      return;
    }
    
    if (parseInt(kirilanAdet) > siparis.adet) {
      alert('Kırılan adet, sipariş adedinden fazla olamaz!');
      return;
    }
    
    kirilanCamBildir(istasyonId, siparis.id, kirilanAdet, kirilanAciklama);
    setKirilanModalAcik(false);
    setKirilanAdet('');
    setKirilanAciklama('');
  };
  
  const siparisDuzenleKaydet = () => {
    siparisDuzenle(siparis.id, duzenleForm);
    setDuzenleModalAcik(false);
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
              İşe Başla
            </button>
            <button 
              onClick={isiBitirHandler}
              disabled={!isiBitirButonuEtkin || !butonlarEtkin}
              className={`btn ${!islemdeMi ? 'btn-secondary' : 'btn-primary'} btn-sm`}
            >
              İşi Bitir
            </button>
            <button 
              onClick={() => setKirilanModalAcik(true)}
              className="btn btn-danger btn-sm"
              title="Kırılan Cam Bildir"
            >
              Kırık
            </button>
            <button 
              onClick={() => setDuzenleModalAcik(true)}
              className="btn btn-warning btn-sm"
              title="Siparişi Düzenle"
            >
              Düzenle
            </button>
          </div>
        )}
      </div>
      
      <div className="siparis-detaylar">
        <div className="detay-grup">
          <h5>Müşteri Bilgileri</h5>
          <p><strong>Müşteri:</strong> {siparis.musteri}</p>
          {siparis.cariUnvan && <p><strong>Cari Ünvan:</strong> {siparis.cariUnvan}</p>}
        </div>
        
        <div className="detay-grup">
          <h5>Tarih Bilgileri</h5>
          <p><strong>Sipariş:</strong> {formatTarih(siparis.siparisTarihi)}</p>
          <p><strong>Teslim:</strong> {formatTarih(siparis.teslimTarihi)}</p>
          <p><strong>Gün:</strong> {siparis.gun}</p>
        </div>
        
        <div className="detay-grup">
          <h5>Ürün Detayları</h5>
          <p><strong>Kombinasyon:</strong> {siparis.kombinasyonAdi}</p>
          {siparis.toplamMiktar > 0 && 
            <p><strong>Miktar:</strong> {siparis.toplamMiktar} m²</p>
          }
          {siparis.adet > 0 && 
            <p><strong>Adet:</strong> {siparis.adet} {siparis.kirilanAdet > 0 && <span className="kirmizi">(-{siparis.kirilanAdet} kırık)</span>}</p>
          }
        </div>
        
        <div className="detay-grup">
          <h5>İş Akışı</h5>
          <p><strong>Rota:</strong> {istasyonSirasiMetni}</p>
          <p><strong>Şu an:</strong> {guncelIstasyonAdi}</p>
          <p><strong>Durum:</strong> <span className={`durum-badge ${durumSinifi}`}>{durum}</span></p>
        </div>
      </div>
      
      {/* Kırılan Cam Modal */}
      {kirilanModalAcik && (
        <div className="modal-overlay" onClick={() => setKirilanModalAcik(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Kırılan Cam Bildir</h3>
            <div className="form-grup">
              <label>Kırılan Adet</label>
              <input
                type="number"
                value={kirilanAdet}
                onChange={(e) => setKirilanAdet(e.target.value)}
                min="1"
                max={siparis.adet}
              />
            </div>
            <div className="form-grup">
              <label>Açıklama</label>
              <textarea
                value={kirilanAciklama}
                onChange={(e) => setKirilanAciklama(e.target.value)}
                placeholder="Kırılma sebebi..."
              />
            </div>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setKirilanModalAcik(false)}>İptal</button>
              <button className="btn btn-danger" onClick={kirilanCamKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Düzenleme Modal */}
      {duzenleModalAcik && (
        <div className="modal-overlay" onClick={() => setDuzenleModalAcik(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Siparişi Düzenle</h3>
            <div className="form-grup">
              <label>Müşteri</label>
              <input
                type="text"
                value={duzenleForm.musteri}
                onChange={(e) => setDuzenleForm({...duzenleForm, musteri: e.target.value})}
              />
            </div>
            <div className="form-grup">
              <label>Cari Ünvan</label>
              <input
                type="text"
                value={duzenleForm.cariUnvan}
                onChange={(e) => setDuzenleForm({...duzenleForm, cariUnvan: e.target.value})}
              />
            </div>
            <div className="form-grup">
              <label>Miktar (m²)</label>
              <input
                type="number"
                value={duzenleForm.toplamMiktar}
                onChange={(e) => setDuzenleForm({...duzenleForm, toplamMiktar: e.target.value})}
                step="0.01"
              />
            </div>
            <div className="form-grup">
              <label>Adet</label>
              <input
                type="number"
                value={duzenleForm.adet}
                onChange={(e) => setDuzenleForm({...duzenleForm, adet: e.target.value})}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setDuzenleModalAcik(false)}>İptal</button>
              <button className="btn btn-primary" onClick={siparisDuzenleKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiparisKarti;