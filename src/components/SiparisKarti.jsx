import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisKarti = ({ siparis, istasyonGorunumu, istasyonId }) => {
  const { iseBasla, isiBitir, aktifGorunum, istasyonlar, kirilanCamBildir, siparisDuzenle, toast } = useFabrika();
  const [kirilanModalAcik, setKirilanModalAcik] = useState(false);
  const [kirilanPozNo, setKirilanPozNo] = useState('');
  const [kirilanAdet, setKirilanAdet] = useState('');
  const [kirilanSebep, setKirilanSebep] = useState('');
  const [duzenleModalAcik, setDuzenleModalAcik] = useState(false);
  const [duzenleForm, setDuzenleForm] = useState({
    musteri: siparis.musteri || '',
    projeAdi: siparis.projeAdi || '',
    camKombinasyonu: siparis.camKombinasyonu || '',
    camTipi: siparis.camTipi || '',
    toplamMiktar: siparis.toplamMiktar || 0,
    adet: siparis.adet || 0
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
    if (!kirilanPozNo.trim()) {
      toast.error('Lütfen poz numarası giriniz!');
      return;
    }
    
    if (!kirilanAdet || parseInt(kirilanAdet) <= 0) {
      toast.error('Lütfen geçerli bir adet giriniz!');
      return;
    }
    
    if (parseInt(kirilanAdet) > siparis.adet) {
      toast.error('Kırılan adet, sipariş adedinden fazla olamaz!');
      return;
    }
    
    if (!kirilanSebep.trim()) {
      toast.error('Lütfen kırılma sebebini giriniz!');
      return;
    }
    
    kirilanCamBildir(istasyonId, siparis.id, kirilanAdet, `Poz: ${kirilanPozNo} - ${kirilanSebep}`);
    setKirilanModalAcik(false);
    setKirilanPozNo('');
    setKirilanAdet('');
    setKirilanSebep('');
  };
  
  const siparisDuzenleKaydet = () => {
    if (!duzenleForm.musteri.trim()) {
      toast.error('Müşteri adı boş olamaz!');
      return;
    }
    
    if (duzenleForm.adet && parseInt(duzenleForm.adet) <= 0) {
      toast.error('Adet sıfırdan büyük olmalıdır!');
      return;
    }
    
    // Ensure all values are strings or numbers, not DOM elements
    const temizForm = {
      musteri: String(duzenleForm.musteri),
      projeAdi: String(duzenleForm.projeAdi || ''),
      camKombinasyonu: String(duzenleForm.camKombinasyonu || ''),
      camTipi: String(duzenleForm.camTipi || ''),
      toplamMiktar: parseFloat(duzenleForm.toplamMiktar) || 0,
      adet: parseInt(duzenleForm.adet) || 0
    };
    
    siparisDuzenle(siparis.id, temizForm);
    setDuzenleModalAcik(false);
    toast.success('Sipariş güncellendi!');
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
          </div>
        )}
        {!istasyonGorunumu && aktifGorunum === 'admin' && (
          <div className="siparis-butonlar">
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
          {siparis.projeAdi && <p><strong>Proje:</strong> {String(siparis.projeAdi)}</p>}
        </div>
        
        <div className="detay-grup">
          <h5>Tarih Bilgileri</h5>
          <p><strong>Sipariş:</strong> {formatTarih(siparis.siparisTarihi)}</p>
          <p><strong>Teslim:</strong> {formatTarih(siparis.teslimTarihi)}</p>
          <p><strong>Gün:</strong> {siparis.gun}</p>
        </div>
        
        <div className="detay-grup">
          <h5>Ürün Detayları</h5>
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
          <h5>İş Akışı</h5>
          <p><strong>Rota:</strong> {istasyonSirasiMetni}</p>
          <p><strong>Şu an:</strong> {guncelIstasyonAdi}</p>
          <p><strong>Durum:</strong> <span className={`durum-badge ${durumSinifi}`}>{durum}</span></p>
        </div>
      </div>
      
      {/* Kırılan Cam Modal */}
      {kirilanModalAcik && (
        <div className="modal-overlay modal-fullscreen" onClick={() => setKirilanModalAcik(false)}>
          <div className="modal-content modal-content-fullscreen" onClick={(e) => e.stopPropagation()}>
            <h3>Kırılan Cam Bildir</h3>
            <div className="form-grup">
              <label>Poz No</label>
              <input
                type="text"
                value={kirilanPozNo}
                onChange={(e) => setKirilanPozNo(e.target.value)}
                placeholder="Poz numarasını giriniz"
                autoFocus
              />
            </div>
            <div className="form-grup">
              <label>Adet</label>
              <input
                type="number"
                value={kirilanAdet}
                onChange={(e) => setKirilanAdet(e.target.value)}
                min="1"
                max={siparis.adet}
                placeholder="Kırılan adet"
              />
            </div>
            <div className="form-grup">
              <label>Sebep</label>
              <textarea
                value={kirilanSebep}
                onChange={(e) => setKirilanSebep(e.target.value)}
                placeholder="Kırılma sebebini açıklayınız..."
                rows="4"
              />
            </div>
            <div className="modal-buttons">
              <button className="btn btn-secondary btn-lg" onClick={() => setKirilanModalAcik(false)}>İptal</button>
              <button className="btn btn-danger btn-lg" onClick={kirilanCamKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
      
      {/* Düzenleme Modal */}
      {duzenleModalAcik && (
        <div className="modal-overlay modal-fullscreen" onClick={() => setDuzenleModalAcik(false)}>
          <div className="modal-content modal-content-fullscreen" onClick={(e) => e.stopPropagation()}>
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
              <label>Proje</label>
              <input
                type="text"
                value={duzenleForm.projeAdi || ''}
                onChange={(e) => setDuzenleForm({...duzenleForm, projeAdi: e.target.value})}
                placeholder="Proje Adı"
              />
            </div>
            <div className="form-grup">
              <label>Cam Kombinasyonu</label>
              <input
                type="text"
                value={duzenleForm.camKombinasyonu || ''}
                onChange={(e) => setDuzenleForm({...duzenleForm, camKombinasyonu: e.target.value})}
                placeholder="Örn: 6+16+6"
              />
            </div>
            <div className="form-grup">
              <label>Cam Tipi</label>
              <input
                type="text"
                value={duzenleForm.camTipi || ''}
                onChange={(e) => setDuzenleForm({...duzenleForm, camTipi: e.target.value})}
                placeholder="Örn: Coolplus 62/44"
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
              <button className="btn btn-secondary btn-lg" onClick={() => setDuzenleModalAcik(false)}>İptal</button>
              <button className="btn btn-primary btn-lg" onClick={siparisDuzenleKaydet}>Kaydet</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiparisKarti;