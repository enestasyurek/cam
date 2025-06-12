import { useState, useEffect } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const KirilanCamModal = ({ 
  isOpen, 
  onClose, 
  siparis, 
  istasyonId 
}) => {
  const { kirilanCamBildir, toast } = useFabrika();
  
  const [formData, setFormData] = useState({
    pozNo: '',
    adet: '',
    sebep: ''
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        pozNo: '',
        adet: '',
        sebep: ''
      });
    }
  }, [isOpen]);

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
    if (!formData.pozNo.trim()) {
      toast.error('Lütfen poz numarası giriniz!');
      return;
    }
    
    if (!formData.adet || parseInt(formData.adet) <= 0) {
      toast.error('Lütfen geçerli bir adet giriniz!');
      return;
    }
    
    if (parseInt(formData.adet) > siparis.adet) {
      toast.error('Kırılan adet, sipariş adedinden fazla olamaz!');
      return;
    }
    
    if (!formData.sebep.trim()) {
      toast.error('Lütfen kırılma sebebini giriniz!');
      return;
    }

    // Submit the data
    kirilanCamBildir(
      istasyonId, 
      siparis.id, 
      formData.adet, 
      `Poz: ${formData.pozNo} - ${formData.sebep}`
    );
    
    toast.success('Kırılan cam kaydedildi!');
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.pozNo.trim() && 
                     formData.adet && 
                     parseInt(formData.adet) > 0 && 
                     formData.sebep.trim();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay modal-fullscreen" onClick={onClose}>
      <div className="modal-content modal-content-fullscreen" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔴 Kırılan Cam Bildir</h3>
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
              <h4>📋 Sipariş Bilgileri</h4>
              <div className="bilgi-detay">
                <p><strong>Sipariş No:</strong> {siparis.siparisNo}</p>
                <p><strong>Müşteri:</strong> {siparis.musteri}</p>
                <p><strong>Toplam Adet:</strong> {siparis.adet}</p>
                {siparis.camKombinasyonu && (
                  <p><strong>Cam Kombinasyonu:</strong> {siparis.camKombinasyonu}</p>
                )}
                {siparis.kirilanAdet > 0 && (
                  <p><strong>Önceki Kırıklar:</strong> <span className="kirmizi">{siparis.kirilanAdet} adet</span></p>
                )}
              </div>
            </div>
          </div>

          {formData.adet && parseInt(formData.adet) > 0 && (
            <div className="bilgilendirme-mesaj">
              <h4>🔄 Otomatik Yedek Sipariş</h4>
              <p>
                <strong>{formData.adet} adet</strong> kırık bildirimi yapıldığında, 
                sistem otomatik olarak <strong>{siparis.siparisNo}-YDK</strong> numaralı 
                yedek sipariş oluşturacak ve ilk istasyondan başlatacaktır.
              </p>
              <div className="yedek-detay">
                <p>📦 <strong>Yedek Sipariş Detayları:</strong></p>
                <ul>
                  <li>Adet: {formData.adet}</li>
                  <li>Miktar: {siparis.toplamMiktar && formData.adet ? 
                    ((siparis.toplamMiktar / siparis.adet) * parseInt(formData.adet)).toFixed(2) 
                    : '0'} m²</li>
                  <li>Rota: Aynı istasyon sırası</li>
                  <li>Durum: İlk istasyonda bekliyor</li>
                </ul>
              </div>
            </div>
          )}

          <div className="form-grup">
            <label htmlFor="pozNo">📍 Poz No</label>
            <input
              id="pozNo"
              type="text"
              value={formData.pozNo}
              onChange={(e) => handleInputChange('pozNo', e.target.value)}
              placeholder="Poz numarasını giriniz (örn: A1, B2, C3)"
              autoFocus
            />
          </div>
          
          <div className="form-grup">
            <label htmlFor="kirilanAdet">🔢 Kırılan Adet</label>
            <input
              id="kirilanAdet"
              type="number"
              value={formData.adet}
              onChange={(e) => handleInputChange('adet', e.target.value)}
              min="1"
              max={siparis.adet}
              placeholder="Kırılan adet sayısı"
            />
            <small className="form-text">
              Maksimum {siparis.adet} adet girilebilir
            </small>
          </div>
          
          <div className="form-grup">
            <label htmlFor="kirilanSebep">📝 Kırılma Sebebi</label>
            <textarea
              id="kirilanSebep"
              value={formData.sebep}
              onChange={(e) => handleInputChange('sebep', e.target.value)}
              placeholder="Kırılma sebebini detaylı olarak açıklayınız..."
              rows="4"
            />
            <small className="form-text">
              Örn: Taşıma sırasında düştü, işlem hatası, malzeme kusuru
            </small>
          </div>
        </div>
        
        <div className="modal-buttons">
          <button 
            className="btn btn-secondary btn-lg" 
            onClick={onClose}
          >
            ❌ İptal
          </button>
          <button 
            className="btn btn-danger btn-lg" 
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            💾 Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default KirilanCamModal;