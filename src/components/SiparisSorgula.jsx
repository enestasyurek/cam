import { useState, useEffect } from 'react';
import { useFabrika } from '../context/FabrikaContext';
import { Bar, Line } from 'react-chartjs-2';
import '../config/chartConfig';

const SiparisSorgula = () => {
  const { siparisler, istasyonlar, setAktifGorunum, kirilanCamlar } = useFabrika();
  const [sorguNo, setSorguNo] = useState('');
  const [bulunanSiparis, setBulunanSiparis] = useState(null);
  const [hata, setHata] = useState('');
  const [detayGorunum, setDetayGorunum] = useState('genel'); // genel, zaman-cizgisi, analiz
  const [aramaGecmisi, setAramaGecmisi] = useState([]);
  const [otomatikTamamla, setOtomatikTamamla] = useState([]);

  // Otomatik tamamlama için sipariş numaralarını filtrele
  useEffect(() => {
    if (sorguNo.length > 0) {
      const eslesen = siparisler
        .filter(s => s.siparisNo.toLowerCase().includes(sorguNo.toLowerCase()))
        .slice(0, 5)
        .map(s => s.siparisNo);
      setOtomatikTamamla(eslesen);
    } else {
      setOtomatikTamamla([]);
    }
  }, [sorguNo, siparisler]);

  const siparisSorgula = () => {
    setHata('');
    setBulunanSiparis(null);
    
    if (!sorguNo.trim()) {
      setHata('Lütfen sipariş numarası girin');
      return;
    }
    
    const siparis = siparisler.find(s => 
      s.siparisNo.toLowerCase() === sorguNo.trim().toLowerCase()
    );
    
    if (siparis) {
      setBulunanSiparis(siparis);
      // Arama geçmişine ekle
      setAramaGecmisi(prev => {
        const yeni = [siparis.siparisNo, ...prev.filter(no => no !== siparis.siparisNo)];
        return yeni.slice(0, 10); // Son 10 arama
      });
      setOtomatikTamamla([]);
    } else {
      setHata('Sipariş bulunamadı');
    }
  };

  const getDurumRengi = (durum) => {
    switch (durum?.toLowerCase()) {
      case 'bekliyor': return 'warning';
      case 'işlemde': return 'info';
      case 'tamamlandı': return 'success';
      default: return 'secondary';
    }
  };

  const getOncelikText = (oncelik) => {
    switch (oncelik) {
      case 1: return 'Yüksek';
      case 2: return 'Orta';
      case 3: return 'Düşük';
      default: return oncelik;
    }
  };

  const getIstasyonAdi = (istasyonId) => {
    const istasyon = istasyonlar.find(i => i.id === istasyonId);
    return istasyon ? istasyon.name : istasyonId;
  };

  // İstasyon süre analizi
  const getIstasyonSureleri = () => {
    if (!bulunanSiparis || !bulunanSiparis.gecmis) return [];
    
    return bulunanSiparis.gecmis.map((g, index) => {
      const istasyonAdi = getIstasyonAdi(g.istasyonId);
      let sure = 0;
      
      if (g.baslamaSaati && g.bitisSaati) {
        sure = (new Date(g.bitisSaati) - new Date(g.baslamaSaati)) / (1000 * 60 * 60); // Saat
      }
      
      return {
        istasyon: istasyonAdi,
        sure: parseFloat(sure.toFixed(2)),
        durum: g.bitisSaati ? 'Tamamlandı' : g.baslamaSaati ? 'İşlemde' : 'Bekliyor'
      };
    });
  };

  // İstasyon durumu hesapla
  const getIstasyonDurumu = (istasyonId, index) => {
    if (!bulunanSiparis || !bulunanSiparis.gecmis) return 'bekliyor';
    
    const gecmis = bulunanSiparis.gecmis[index];
    if (!gecmis) return 'bekliyor';
    
    if (gecmis.bitisSaati) return 'tamamlandı';
    if (gecmis.baslamaSaati) return 'işlemde';
    return 'bekliyor';
  };

  // Kırılan cam bilgilerini al
  const getSiparisKirilanCamlar = () => {
    if (!bulunanSiparis) return [];
    return kirilanCamlar.filter(k => k.siparisId === bulunanSiparis.id);
  };

  // Üretim süresi hesapla
  const getUretimSuresi = () => {
    if (!bulunanSiparis || !bulunanSiparis.gecmis) return null;
    
    const ilkBaslama = bulunanSiparis.gecmis.find(g => g.baslamaSaati)?.baslamaSaati;
    const sonBitis = [...bulunanSiparis.gecmis].reverse().find(g => g.bitisSaati)?.bitisSaati;
    
    if (!ilkBaslama) return null;
    
    const baslama = new Date(ilkBaslama);
    const bitis = sonBitis ? new Date(sonBitis) : new Date();
    const sureSaat = (bitis - baslama) / (1000 * 60 * 60);
    
    return {
      saat: Math.floor(sureSaat),
      dakika: Math.floor((sureSaat % 1) * 60),
      gun: Math.floor(sureSaat / 24)
    };
  };

  // İlerleme yüzdesi hesapla
  const getIlerlemeYuzdesi = () => {
    if (!bulunanSiparis || !bulunanSiparis.gecmis) return 0;
    
    const tamamlananIstasyon = bulunanSiparis.gecmis.filter(g => g.bitisSaati).length;
    const toplamIstasyon = bulunanSiparis.gecmis.length;
    
    return toplamIstasyon > 0 ? Math.round((tamamlananIstasyon / toplamIstasyon) * 100) : 0;
  };

  return (
    <div className="siparis-sorgula-detayli">
      <div className="sorgula-header">
        <h2>📋 Sipariş Sorgulama</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => setAktifGorunum('admin')}
        >
          ← Ana Sayfaya Dön
        </button>
      </div>

      <div className="sorgula-container">
        {/* Arama Bölümü */}
        <div className="arama-bolumu">
          <div className="arama-form-grup">
            <label htmlFor="sorguNo">Sipariş Numarası</label>
            <div className="arama-input-wrapper">
              <input
                type="text"
                id="sorguNo"
                value={sorguNo}
                onChange={(e) => setSorguNo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && siparisSorgula()}
                placeholder="Örn: S-2024-001"
                className="arama-input"
                autoComplete="off"
              />
              <button 
                className="btn btn-primary" 
                onClick={siparisSorgula}
              >
                🔍 Sorgula
              </button>
            </div>

            {/* Otomatik Tamamlama */}
            {otomatikTamamla.length > 0 && (
              <div className="otomatik-tamamla">
                {otomatikTamamla.map(no => (
                  <div 
                    key={no} 
                    className="otomatik-item"
                    onClick={() => {
                      setSorguNo(no);
                      setOtomatikTamamla([]);
                    }}
                  >
                    {no}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Arama Geçmişi */}
          {aramaGecmisi.length > 0 && !bulunanSiparis && (
            <div className="arama-gecmisi">
              <h4>Son Aramalar</h4>
              <div className="gecmis-listesi">
                {aramaGecmisi.map(no => (
                  <button 
                    key={no}
                    className="gecmis-item"
                    onClick={() => setSorguNo(no)}
                  >
                    {no}
                  </button>
                ))}
              </div>
            </div>
          )}

          {hata && (
            <div className="hata-mesaj">
              <span>⚠️ {hata}</span>
            </div>
          )}
        </div>

        {/* Sipariş Detayları */}
        {bulunanSiparis && (
          <div className="siparis-detay-container">
            {/* Özet Başlık */}
            <div className="detay-baslik">
              <div className="baslik-sol">
                <h3>{bulunanSiparis.siparisNo}</h3>
                <span className={`durum-badge ${getDurumRengi(bulunanSiparis.durum)}`}>
                  {bulunanSiparis.durum}
                </span>
                <span className={`oncelik-badge oncelik-${bulunanSiparis.oncelik}`}>
                  Öncelik: {getOncelikText(bulunanSiparis.oncelik)}
                </span>
              </div>
              <div className="baslik-sag">
                <div className="ilerleme-gosterge">
                  <span className="ilerleme-text">İlerleme: %{getIlerlemeYuzdesi()}</span>
                  <div className="ilerleme-bar">
                    <div 
                      className="ilerleme-dolu" 
                      style={{ width: `${getIlerlemeYuzdesi()}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Detay Sekmeler */}
            <div className="detay-sekmeler">
              <button 
                className={`sekme-btn ${detayGorunum === 'genel' ? 'aktif' : ''}`}
                onClick={() => setDetayGorunum('genel')}
              >
                Genel Bilgiler
              </button>
              <button 
                className={`sekme-btn ${detayGorunum === 'zaman-cizgisi' ? 'aktif' : ''}`}
                onClick={() => setDetayGorunum('zaman-cizgisi')}
              >
                Zaman Çizelgesi
              </button>
              <button 
                className={`sekme-btn ${detayGorunum === 'analiz' ? 'aktif' : ''}`}
                onClick={() => setDetayGorunum('analiz')}
              >
                Analiz & Grafikler
              </button>
            </div>

            {/* Detay İçerik */}
            <div className="detay-icerik">
              {detayGorunum === 'genel' && (
                <div className="genel-bilgiler">
                  <div className="bilgi-grid">
                    {/* Müşteri Bilgileri */}
                    <div className="bilgi-kart">
                      <h4>👤 Müşteri Bilgileri</h4>
                      <div className="bilgi-satirlari">
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
                          <strong className={`fabrika-badge ${bulunanSiparis.fabrika.toLowerCase()}`}>
                            {bulunanSiparis.fabrika}
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Tarih Bilgileri */}
                    <div className="bilgi-kart">
                      <h4>📅 Tarih Bilgileri</h4>
                      <div className="bilgi-satirlari">
                        <div className="bilgi-satir">
                          <span>Sipariş Tarihi:</span>
                          <strong>{new Date(bulunanSiparis.siparisTarihi).toLocaleDateString('tr-TR')}</strong>
                        </div>
                        <div className="bilgi-satir">
                          <span>Teslim Tarihi:</span>
                          <strong>{new Date(bulunanSiparis.teslimTarihi).toLocaleDateString('tr-TR')}</strong>
                        </div>
                        <div className="bilgi-satir">
                          <span>Kalan Gün:</span>
                          <strong className={bulunanSiparis.gun < 3 ? 'kirmizi' : ''}>
                            {bulunanSiparis.gun} gün
                          </strong>
                        </div>
                      </div>
                    </div>

                    {/* Cam Bilgileri */}
                    <div className="bilgi-kart">
                      <h4>🪟 Cam Bilgileri</h4>
                      <div className="bilgi-satirlari">
                        <div className="bilgi-satir">
                          <span>Cam Tipi:</span>
                          <strong>{bulunanSiparis.camTipi}</strong>
                        </div>
                        <div className="bilgi-satir">
                          <span>Kombinasyon:</span>
                          <strong>{bulunanSiparis.camKombinasyonu}</strong>
                        </div>
                        <div className="bilgi-satir">
                          <span>Miktar:</span>
                          <strong>{bulunanSiparis.toplamMiktar} m²</strong>
                        </div>
                        <div className="bilgi-satir">
                          <span>Adet:</span>
                          <strong>{bulunanSiparis.adet} parça</strong>
                        </div>
                      </div>
                    </div>

                    {/* Üretim Bilgileri */}
                    <div className="bilgi-kart">
                      <h4>⚙️ Üretim Bilgileri</h4>
                      <div className="bilgi-satirlari">
                        <div className="bilgi-satir">
                          <span>Mevcut İstasyon:</span>
                          <strong>
                            {bulunanSiparis.guncelIstasyonIndex < bulunanSiparis.istasyonSirasi.length
                              ? getIstasyonAdi(bulunanSiparis.istasyonSirasi[bulunanSiparis.guncelIstasyonIndex])
                              : 'Tamamlandı'}
                          </strong>
                        </div>
                        <div className="bilgi-satir">
                          <span>İstasyon İlerlemesi:</span>
                          <strong>
                            {bulunanSiparis.guncelIstasyonIndex + 1} / {bulunanSiparis.istasyonSirasi.length}
                          </strong>
                        </div>
                        {getUretimSuresi() && (
                          <div className="bilgi-satir">
                            <span>Üretim Süresi:</span>
                            <strong>
                              {getUretimSuresi().gun > 0 && `${getUretimSuresi().gun} gün `}
                              {getUretimSuresi().saat} saat {getUretimSuresi().dakika} dakika
                            </strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* İstasyon Rotası */}
                  <div className="istasyon-rota-detay">
                    <h4>🛤️ İstasyon Rotası</h4>
                    <div className="rota-container">
                      {bulunanSiparis.istasyonSirasi.map((istasyonId, index) => {
                        const durum = getIstasyonDurumu(istasyonId, index);
                        const gecmis = bulunanSiparis.gecmis?.[index];
                        
                        return (
                          <div key={istasyonId} className="rota-adim-detay">
                            <div className={`rota-nokta ${durum}`}>
                              {durum === 'tamamlandı' ? '✓' : 
                               durum === 'işlemde' ? '⚡' : 
                               index + 1}
                            </div>
                            <div className="rota-bilgi-detay">
                              <div className="istasyon-baslik">
                                <span className="istasyon-isim">{getIstasyonAdi(istasyonId)}</span>
                                <span className={`istasyon-durum ${durum}`}>
                                  {durum}
                                </span>
                              </div>
                              {gecmis && (
                                <div className="istasyon-zaman">
                                  {gecmis.baslamaSaati && (
                                    <span className="zaman-bilgi">
                                      Başlama: {new Date(gecmis.baslamaSaati).toLocaleString('tr-TR')}
                                    </span>
                                  )}
                                  {gecmis.bitisSaati && (
                                    <span className="zaman-bilgi">
                                      Bitiş: {new Date(gecmis.bitisSaati).toLocaleString('tr-TR')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {index < bulunanSiparis.istasyonSirasi.length - 1 && (
                              <div className={`rota-cizgi ${durum === 'tamamlandı' ? 'tamamlandi' : ''}`} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Kırılan Cam Bilgileri */}
                  {getSiparisKirilanCamlar().length > 0 && (
                    <div className="kirilan-cam-detay">
                      <h4>💔 Kırılan Cam Kayıtları</h4>
                      <div className="kirilan-liste">
                        {getSiparisKirilanCamlar().map(kirilan => {
                          const istasyon = istasyonlar.find(i => i.id === kirilan.istasyonId);
                          return (
                            <div key={kirilan.id} className="kirilan-item">
                              <div className="kirilan-header">
                                <span className="kirilan-istasyon">{istasyon?.name}</span>
                                <span className="kirilan-tarih">
                                  {new Date(kirilan.tarih).toLocaleString('tr-TR')}
                                </span>
                              </div>
                              <div className="kirilan-detay">
                                <span className="kirilan-adet">{kirilan.adet} adet</span>
                                <span className="kirilan-aciklama">{kirilan.aciklama}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {detayGorunum === 'zaman-cizgisi' && (
                <div className="zaman-cizgisi">
                  <h4>⏱️ Üretim Zaman Çizelgesi</h4>
                  <div className="timeline-container">
                    {bulunanSiparis.gecmis?.map((gecmis, index) => {
                      const istasyonAdi = getIstasyonAdi(gecmis.istasyonId);
                      const durum = getIstasyonDurumu(gecmis.istasyonId, index);
                      
                      return (
                        <div key={index} className={`timeline-item ${durum}`}>
                          <div className="timeline-marker">
                            {durum === 'tamamlandı' ? '✓' : 
                             durum === 'işlemde' ? '⚡' : '⏳'}
                          </div>
                          <div className="timeline-content">
                            <h5>{istasyonAdi}</h5>
                            {gecmis.baslamaSaati && (
                              <div className="timeline-tarih">
                                <span className="tarih-label">Başlangıç:</span>
                                <span className="tarih-deger">
                                  {new Date(gecmis.baslamaSaati).toLocaleString('tr-TR')}
                                </span>
                              </div>
                            )}
                            {gecmis.bitisSaati && (
                              <div className="timeline-tarih">
                                <span className="tarih-label">Bitiş:</span>
                                <span className="tarih-deger">
                                  {new Date(gecmis.bitisSaati).toLocaleString('tr-TR')}
                                </span>
                              </div>
                            )}
                            {gecmis.baslamaSaati && gecmis.bitisSaati && (
                              <div className="timeline-sure">
                                <span className="sure-label">Süre:</span>
                                <span className="sure-deger">
                                  {((new Date(gecmis.bitisSaati) - new Date(gecmis.baslamaSaati)) / (1000 * 60 * 60)).toFixed(1)} saat
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {detayGorunum === 'analiz' && (
                <div className="analiz-grafikler">
                  <h4>📊 Üretim Analizi</h4>
                  
                  {/* İstasyon Süre Grafiği */}
                  <div className="grafik-kart">
                    <h5>İstasyon Bazlı İşlem Süreleri</h5>
                    <div style={{ height: '300px' }}>
                      <Bar
                        data={{
                          labels: getIstasyonSureleri().map(s => s.istasyon),
                          datasets: [{
                            label: 'İşlem Süresi (Saat)',
                            data: getIstasyonSureleri().map(s => s.sure),
                            backgroundColor: getIstasyonSureleri().map(s => 
                              s.durum === 'Tamamlandı' ? 'rgba(16, 185, 129, 0.6)' :
                              s.durum === 'İşlemde' ? 'rgba(59, 130, 246, 0.6)' :
                              'rgba(156, 163, 175, 0.6)'
                            ),
                            borderColor: getIstasyonSureleri().map(s => 
                              s.durum === 'Tamamlandı' ? 'rgba(16, 185, 129, 1)' :
                              s.durum === 'İşlemde' ? 'rgba(59, 130, 246, 1)' :
                              'rgba(156, 163, 175, 1)'
                            ),
                            borderWidth: 2
                          }]
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            y: {
                              beginAtZero: true,
                              title: {
                                display: true,
                                text: 'Saat'
                              }
                            }
                          },
                          plugins: {
                            legend: {
                              display: false
                            },
                            tooltip: {
                              callbacks: {
                                label: (context) => {
                                  const sure = context.parsed.y;
                                  const durum = getIstasyonSureleri()[context.dataIndex].durum;
                                  return `${sure} saat (${durum})`;
                                }
                              }
                            }
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Özet Bilgiler */}
                  <div className="analiz-ozet">
                    <div className="ozet-kart">
                      <h5>Toplam İstasyon</h5>
                      <div className="ozet-deger">{bulunanSiparis.istasyonSirasi.length}</div>
                    </div>
                    <div className="ozet-kart">
                      <h5>Tamamlanan</h5>
                      <div className="ozet-deger yesil">
                        {bulunanSiparis.gecmis?.filter(g => g.bitisSaati).length || 0}
                      </div>
                    </div>
                    <div className="ozet-kart">
                      <h5>Ortalama Süre</h5>
                      <div className="ozet-deger">
                        {getIstasyonSureleri().filter(s => s.sure > 0).length > 0
                          ? (getIstasyonSureleri()
                              .filter(s => s.sure > 0)
                              .reduce((sum, s) => sum + s.sure, 0) / 
                              getIstasyonSureleri().filter(s => s.sure > 0).length
                            ).toFixed(1)
                          : '0'} saat
                      </div>
                    </div>
                    <div className="ozet-kart">
                      <h5>Kırılan Cam</h5>
                      <div className="ozet-deger kirmizi">
                        {getSiparisKirilanCamlar().reduce((sum, k) => sum + k.adet, 0)} adet
                      </div>
                    </div>
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