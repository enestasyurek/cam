import { useState, useEffect } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisDuzenleModal = ({ 
  isOpen, 
  onClose, 
  siparis 
}) => {
  const { siparisDuzenle, toast } = useFabrika();
  
  const [formData, setFormData] = useState({
    musteri: '',
    projeAdi: '',
    camKombinasyonu: '',
    camTipi: '',
    toplamMiktar: '',
    adet: ''
  });

  // Initialize form with siparis data when modal opens
  useEffect(() => {
    if (isOpen && siparis) {
      setFormData({
        musteri: siparis.musteri || '',
        projeAdi: siparis.projeAdi || '',
        camKombinasyonu: siparis.camKombinasyonu || '',
        camTipi: siparis.camTipi || '',
        toplamMiktar: siparis.toplamMiktar || '',
        adet: siparis.adet || ''
      });
    }
  }, [isOpen, siparis]);

  // Keyboard event handling
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    // Form validation
    if (!formData.musteri.trim()) {
      toast.error('Müşteri adı boş olamaz!');
      return;
    }
    
    if (formData.adet && parseInt(formData.adet) <= 0) {
      toast.error('Adet sıfırdan büyük olmalıdır!');
      return;
    }

    if (formData.toplamMiktar && parseFloat(formData.toplamMiktar) < 0) {
      toast.error('Miktar negatif olamaz!');
      return;
    }

    // Prepare clean data
    const cleanData = {
      musteri: String(formData.musteri).trim(),
      projeAdi: String(formData.projeAdi || '').trim(),
      camKombinasyonu: String(formData.camKombinasyonu || '').trim(),
      camTipi: String(formData.camTipi || '').trim(),
      toplamMiktar: parseFloat(formData.toplamMiktar) || 0,
      adet: parseInt(formData.adet) || 0
    };

    // Submit the data
    siparisDuzenle(siparis.id, cleanData);
    toast.success('Sipariş başarıyla güncellendi!');
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.musteri.trim() && 
                     (!formData.adet || parseInt(formData.adet) > 0) &&
                     (!formData.toplamMiktar || parseFloat(formData.toplamMiktar) >= 0);

  if (!isOpen || !siparis) return null;

  return (
    <div className="modal-overlay modal-fullscreen" onClick={onClose}>
      <div className="modal-content modal-content-fullscreen" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>✏️ Sipariş Düzenle</h3>
          <button 
            className="modal-close" 
            onClick={onClose}
            aria-label="Modalı Kapat"
          >
            ×
          </button>
        </div>
        
        <div className="modal-body">
          <div className="siparis-bilgi">
            <div className="bilgi-kart">
              <h4>📋 Mevcut Sipariş Bilgileri</h4>
              <div className="bilgi-detay">
                <p><strong>Sipariş No:</strong> {siparis.siparisNo}</p>
                <p><strong>Sipariş Tarihi:</strong> {new Date(siparis.siparisTarihi).toLocaleDateString('tr-TR')}</p>
                <p><strong>Teslim Tarihi:</strong> {new Date(siparis.teslimTarihi).toLocaleDateString('tr-TR')}</p>
                <p><strong>Durum:</strong> <span className={`durum-badge ${siparis.durum.toLowerCase()}`}>{siparis.durum}</span></p>
              </div>
            </div>
          </div>

          <div className="form-grup">
            <label htmlFor="musteri">👤 Müşteri *</label>
            <input
              id="musteri"
              type="text"
              value={formData.musteri}
              onChange={(e) => handleInputChange('musteri', e.target.value)}
              placeholder="Müşteri adını giriniz"
              required
            />
          </div>
          
          <div className="form-grup">
            <label htmlFor="projeAdi">🏗️ Proje Adı</label>
            <input
              id="projeAdi"
              type="text"
              value={formData.projeAdi}
              onChange={(e) => handleInputChange('projeAdi', e.target.value)}
              placeholder="Proje adı (Opsiyonel)"
            />
          </div>
          
          <div className="form-grup">
            <label htmlFor="camKombinasyonu">🔗 Cam Kombinasyonu</label>
            <input
              id="camKombinasyonu"
              type="text"
              value={formData.camKombinasyonu}
              onChange={(e) => handleInputChange('camKombinasyonu', e.target.value)}
              placeholder="Örn: 6+16+6, 4+12+4"
            />
            <small className="form-text">
              Cam kalınlıkları ve ara mesafeler
            </small>
          </div>
          
          <div className="form-grup">
            <label htmlFor="camTipi">🪟 Cam Tipi</label>
            <input
              id="camTipi"
              type="text"
              value={formData.camTipi}
              onChange={(e) => handleInputChange('camTipi', e.target.value)}
              placeholder="Örn: Coolplus 62/44, Guardian Sun"
            />
            <small className="form-text">
              Cam markası ve özellikleri
            </small>
          </div>
          
          <div className="form-row">
            <div className="form-grup">
              <label htmlFor="toplamMiktar">📐 Toplam Miktar (m²)</label>
              <input
                id="toplamMiktar"
                type="number"
                value={formData.toplamMiktar}
                onChange={(e) => handleInputChange('toplamMiktar', e.target.value)}
                step="0.01"
                min="0"
                placeholder="0.00"
              />
            </div>
            
            <div className="form-grup">
              <label htmlFor="adet">🔢 Adet</label>
              <input
                id="adet"
                type="number"
                value={formData.adet}
                onChange={(e) => handleInputChange('adet', e.target.value)}
                min="1"
                placeholder="0"
              />
            </div>
          </div>

          {siparis.kirilanAdet > 0 && (
            <div className="uyari-mesaj">
              <p><strong>⚠️ Dikkat:</strong> Bu siparişte {siparis.kirilanAdet} adet kırılan cam kaydı bulunmaktadır.</p>
            </div>
          )}
        </div>
        
        <div className="modal-buttons">
          <button 
            className="btn btn-secondary btn-lg" 
            onClick={onClose}
          >
            ❌ İptal
          </button>
          <button 
            className="btn btn-primary btn-lg" 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            💾 Güncelle
          </button>
        </div>
      </div>
    </div>
  );
};

export default SiparisDuzenleModal;