import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisSorgula = () => {
  const { siparisler, istasyonlar, setAktifGorunum } = useFabrika();
  const [sorguNo, setSorguNo] = useState('');
  const [bulunanSiparis, setBulunanSiparis] = useState(null);
  const [hata, setHata] = useState('');

  const siparisSorgula = () => {
    setHata('');
    setBulunanSiparis(null);
    
    if (!sorguNo.trim()) {
      setHata('Lütfen sipariş numarası girin');
      return;
    }
    
    const siparis = siparisler.find(s => s.siparisNo === sorguNo.trim());
    
    if (siparis) {
      setBulunanSiparis(siparis);
    } else {
      setHata('Sipariş bulunamadı');
    }
  };

  const getDurumRengi = (durum) => {
    switch (durum) {
      case 'bekliyor': return 'warning';
      case 'işlemde': return 'info';
      case 'tamamlandı': return 'success';
      case 'kirilan': return 'danger';
      default: return 'secondary';
    }
  };

  const getOncelikText = (oncelik) => {
    switch (oncelik) {
      case '1': return 'Yüksek';
      case '2': return 'Orta';
      case '3': return 'Düşük';
      default: return oncelik;
    }
  };

  const getIstasyonAdi = (istasyonId) => {
    const istasyon = istasyonlar.find(i => i.id === istasyonId);
    return istasyon ? istasyon.name : istasyonId;
  };

  return (
    <div className="siparis-sorgula">
      <div className="sorgula-header">
        <h2>Sipariş Sorgulama</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => setAktifGorunum('admin')}
        >
          Geri Dön
        </button>
      </div>

      <div className="sorgula-form">
        <div className="form-grup">
          <label htmlFor="sorguNo">Sipariş Numarası</label>
          <div className="arama-input-container">
            <input
              type="text"
              id="sorguNo"
              value={sorguNo}
              onChange={(e) => setSorguNo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && siparisSorgula()}
              placeholder="Örn: S-2023-001"
              className="arama-input"
            />
            <button 
              className="btn btn-primary" 
              onClick={siparisSorgula}
            >
              Sorgula
            </button>
          </div>
        </div>

        {hata && (
          <div className="hata-mesaj">
            <span>{hata}</span>
          </div>
        )}

        {bulunanSiparis && (
          <div className="siparis-detay-kart">
            <div className="siparis-detay-header">
              <h3>Sipariş Detayları</h3>
              <span className={`durum-badge ${getDurumRengi(bulunanSiparis.durum)}`}>
                {bulunanSiparis.durum.toUpperCase()}
              </span>
            </div>

            <div className="siparis-bilgileri">
              <div className="bilgi-grup">
                <h4>Genel Bilgiler</h4>
                <div className="bilgi-satirlari">
                  <div className="bilgi-satir">
                    <span>Sipariş No:</span>
                    <strong>{bulunanSiparis.siparisNo}</strong>
                  </div>
                  <div className="bilgi-satir">
                    <span>Müşteri:</span>
                    <strong>{bulunanSiparis.musteri}</strong>
                  </div>
                  {bulunanSiparis.projeAdi && (
                    <div className="bilgi-satir">
                      <span>Proje:</span>
                      <strong>{bulunanSiparis.projeAdi}</strong>
                    </div>
                  )}
                  <div className="bilgi-satir">
                    <span>Fabrika:</span>
                    <strong>{bulunanSiparis.fabrika}</strong>
                  </div>
                  <div className="bilgi-satir">
                    <span>Öncelik:</span>
                    <strong className={`oncelik-${bulunanSiparis.oncelik}`}>
                      {getOncelikText(bulunanSiparis.oncelik)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="bilgi-grup">
                <h4>Tarih Bilgileri</h4>
                <div className="bilgi-satirlari">
                  <div className="bilgi-satir">
                    <span>Sipariş Tarihi:</span>
                    <strong>{new Date(bulunanSiparis.siparisTarihi).toLocaleDateString('tr-TR')}</strong>
                  </div>
                  <div className="bilgi-satir">
                    <span>Teslim Tarihi:</span>
                    <strong>{new Date(bulunanSiparis.teslimTarihi).toLocaleDateString('tr-TR')}</strong>
                  </div>
                  {bulunanSiparis.tamamlanmaTarihi && (
                    <div className="bilgi-satir">
                      <span>Tamamlanma Tarihi:</span>
                      <strong>{new Date(bulunanSiparis.tamamlanmaTarihi).toLocaleDateString('tr-TR')}</strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="bilgi-grup">
                <h4>Cam Bilgileri</h4>
                <div className="bilgi-satirlari">
                  <div className="bilgi-satir">
                    <span>Cam Kombinasyonu:</span>
                    <strong>{bulunanSiparis.camKombinasyonu}</strong>
                  </div>
                  <div className="bilgi-satir">
                    <span>Cam Tipi:</span>
                    <strong>{bulunanSiparis.camTipi}</strong>
                  </div>
                  {bulunanSiparis.toplamMiktar && (
                    <div className="bilgi-satir">
                      <span>Toplam Miktar:</span>
                      <strong>{bulunanSiparis.toplamMiktar} m²</strong>
                    </div>
                  )}
                  <div className="bilgi-satir">
                    <span>Adet:</span>
                    <strong>{bulunanSiparis.adet}</strong>
                  </div>
                </div>
              </div>

              <div className="bilgi-grup tam-genislik">
                <h4>İstasyon Rotası</h4>
                <div className="istasyon-rota">
                  {bulunanSiparis.istasyonlar && bulunanSiparis.istasyonlar.length > 0 ? (
                    bulunanSiparis.istasyonlar.map((istasyonId, index) => {
                      const istasyonDurum = bulunanSiparis.istasyonDurumlari?.[istasyonId] || 'bekliyor';
                      return (
                        <div key={istasyonId} className="rota-adim">
                          <div className={`rota-nokta ${istasyonDurum}`}>
                            {index + 1}
                          </div>
                          <div className="rota-bilgi">
                            <span className="istasyon-isim">{getIstasyonAdi(istasyonId)}</span>
                            <span className={`istasyon-durum ${istasyonDurum}`}>
                              {istasyonDurum}
                            </span>
                          </div>
                          {index < bulunanSiparis.istasyonlar.length - 1 && (
                            <div className="rota-cizgi"></div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="istasyon-uyari">İstasyon rotası belirtilmemiş</p>
                  )}
                </div>
              </div>

              {bulunanSiparis.notlar && (
                <div className="bilgi-grup tam-genislik">
                  <h4>Notlar</h4>
                  <p className="notlar">{bulunanSiparis.notlar}</p>
                </div>
              )}

              {bulunanSiparis.kirilanMiktar > 0 && (
                <div className="bilgi-grup tam-genislik kirilan-bilgi">
                  <h4>Kırılan Cam Bilgisi</h4>
                  <div className="bilgi-satirlari">
                    <div className="bilgi-satir">
                      <span>Kırılan Miktar:</span>
                      <strong className="kirmizi">{bulunanSiparis.kirilanMiktar} m²</strong>
                    </div>
                    {bulunanSiparis.kirilanTarih && (
                      <div className="bilgi-satir">
                        <span>Kırılma Tarihi:</span>
                        <strong>{new Date(bulunanSiparis.kirilanTarih).toLocaleDateString('tr-TR')}</strong>
                      </div>
                    )}
                    {bulunanSiparis.kirilanIstasyon && (
                      <div className="bilgi-satir">
                        <span>Kırılan İstasyon:</span>
                        <strong>{getIstasyonAdi(bulunanSiparis.kirilanIstasyon)}</strong>
                      </div>
                    )}
                    {bulunanSiparis.kirilanNeden && (
                      <div className="bilgi-satir">
                        <span>Kırılma Nedeni:</span>
                        <strong>{bulunanSiparis.kirilanNeden}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiparisSorgula;