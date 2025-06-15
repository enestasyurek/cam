import { useState, lazy, Suspense } from 'react';
import { useFabrika } from '../context/FabrikaContext';
import KirilanCamModal from './KirilanCamModal';
import SiparisDuzenleModal from './SiparisDuzenleModal';
import KPIDashboard from './KPIDashboard';
import ErrorBoundary from './ErrorBoundary';

// Lazy load chart components
const SiparisChart = lazy(() => import('./charts/SiparisChart'));
const IstasyonChart = lazy(() => import('./charts/IstasyonChart'));
const UretimTrendChart = lazy(() => import('./charts/UretimTrendChart'));
const PerformansChart = lazy(() => import('./charts/PerformansChart'));

const Rapor = () => {
  const { 
    siparisler, 
    kirilanCamlar, 
    istasyonlar, 
    siparisAra,
    istasyonKuyruklar,
    setAktifGorunum,
    istasyonSiparisleriGetir
  } = useFabrika();
  
  const [aramaMetni, setAramaMetni] = useState('');
  const [sekmeler, setSekmeler] = useState('genel'); // genel, detay, istasyon, kirilan, kuyruk, grafikler
  const [modaller, setModaller] = useState({
    kirilan: false,
    duzenle: false,
    secilenSiparis: null,
    secilenIstasyon: null
  });

  // Arama sonuçları
  const filtrelenmisiSiparisler = siparisAra(aramaMetni);

  // İstatistikleri hesapla
  const toplamSiparis = siparisler.length;
  const tamamlananSiparis = siparisler.filter(s => s.durum === 'Tamamlandı').length;
  const devamEdenSiparis = siparisler.filter(s => s.durum === 'İşlemde' || s.durum === 'Bekliyor').length;
  const toplamKirilanCam = kirilanCamlar.reduce((toplam, k) => toplam + k.adet, 0);
  
  // Detaylı istatistikler
  const toplamMiktar = siparisler.reduce((toplam, s) => toplam + s.toplamMiktar, 0);
  const toplamAdet = siparisler.reduce((toplam, s) => toplam + s.adet, 0);
  const ortalamaTeslimSuresi = siparisler.length > 0 
    ? Math.round(siparisler.reduce((toplam, s) => toplam + s.gun, 0) / siparisler.length)
    : 0;
    
  // Fabrika bazlı istatistikler
  const fabrikaIstatistikleri = {
    A1: siparisler.filter(s => s.fabrika === 'A1').length,
    B1: siparisler.filter(s => s.fabrika === 'B1').length
  };

  // İstasyon bazlı kırılan cam istatistikleri
  const istasyonKirilanIstatistik = istasyonlar.map(istasyon => {
    const istasyonKirilanlari = kirilanCamlar.filter(k => k.istasyonId === istasyon.id);
    const toplamAdet = istasyonKirilanlari.reduce((toplam, k) => toplam + k.adet, 0);
    return {
      ...istasyon,
      kirilanAdet: toplamAdet,
      kirilanKayitSayisi: istasyonKirilanlari.length
    };
  });

  // Kuyruk durumu
  const kuyrukDurumu = istasyonlar.map(istasyon => ({
    ...istasyon,
    kuyrukUzunlugu: (istasyonKuyruklar[istasyon.id] || []).length,
    kuyruktakiSiparisler: (istasyonKuyruklar[istasyon.id] || []).map(siparisId => 
      siparisler.find(s => s.id === siparisId)
    ).filter(Boolean)
  }));

  // Modal functions
  const modalAc = (modalTip, siparis, istasyonId = null) => {
    setModaller({
      kirilan: modalTip === 'kirilan',
      duzenle: modalTip === 'duzenle',
      secilenSiparis: siparis,
      secilenIstasyon: istasyonId
    });
  };

  const modalKapat = () => {
    setModaller({
      kirilan: false,
      duzenle: false,
      secilenSiparis: null,
      secilenIstasyon: null
    });
  };

  return (
    <div className="rapor-container">
      <div className="rapor-header">
        <h2>📊 Fabrika Raporu</h2>
        <button 
          className="geri-btn"
          onClick={() => setAktifGorunum('admin')}
        >
          ← Ana Sayfaya Dön
        </button>
      </div>

      {/* Arama Alanı */}
      <div className="arama-alani">
        <input 
          type="text"
          placeholder="🔍 Sipariş no, müşteri adı veya cari ünvan ile ara..."
          value={aramaMetni}
          onChange={(e) => setAramaMetni(e.target.value)}
          className="arama-input"
        />
      </div>

      {/* Genel İstatistikler */}
      <div className="istatistik-kartlari">
        <div className="istatistik-kart">
          <h3>Toplam Sipariş</h3>
          <div className="istatistik-deger">{toplamSiparis}</div>
          <p className="istatistik-alt">A1: {fabrikaIstatistikleri.A1} | B1: {fabrikaIstatistikleri.B1}</p>
        </div>
        <div className="istatistik-kart">
          <h3>Tamamlanan</h3>
          <div className="istatistik-deger yesil">{tamamlananSiparis}</div>
          <p className="istatistik-alt">%{toplamSiparis > 0 ? Math.round((tamamlananSiparis / toplamSiparis) * 100) : 0}</p>
        </div>
        <div className="istatistik-kart">
          <h3>Devam Eden</h3>
          <div className="istatistik-deger mavi">{devamEdenSiparis}</div>
          <p className="istatistik-alt">İşlemde: {siparisler.filter(s => s.durum === 'İşlemde').length}</p>
        </div>
        <div className="istatistik-kart">
          <h3>Toplam Kırılan</h3>
          <div className="istatistik-deger kirmizi">{toplamKirilanCam} adet</div>
          <p className="istatistik-alt">%{toplamAdet > 0 ? ((toplamKirilanCam / toplamAdet) * 100).toFixed(1) : 0}</p>
        </div>
        <div className="istatistik-kart">
          <h3>Toplam Üretim</h3>
          <div className="istatistik-deger">{toplamMiktar.toFixed(2)} m²</div>
          <p className="istatistik-alt">{toplamAdet} adet</p>
        </div>
        <div className="istatistik-kart">
          <h3>Ort. Teslim Süresi</h3>
          <div className="istatistik-deger">{ortalamaTeslimSuresi} gün</div>
          <p className="istatistik-alt">Toplam sipariş</p>
        </div>
      </div>

      {/* Sekme Başlıkları */}
      <div className="sekme-basliklar">
        <button 
          className={`sekme-btn ${sekmeler === 'genel' ? 'aktif' : ''}`}
          onClick={() => setSekmeler('genel')}
        >
          Genel Rapor
        </button>
        <button 
          className={`sekme-btn ${sekmeler === 'detay' ? 'aktif' : ''}`}
          onClick={() => setSekmeler('detay')}
        >
          Sipariş Listesi
        </button>
        <button 
          className={`sekme-btn ${sekmeler === 'istasyon' ? 'aktif' : ''}`}
          onClick={() => setSekmeler('istasyon')}
        >
          İstasyon Raporu
        </button>
        <button 
          className={`sekme-btn ${sekmeler === 'kirilan' ? 'aktif' : ''}`}
          onClick={() => setSekmeler('kirilan')}
        >
          Kırılan Cam Takibi
        </button>
        <button 
          className={`sekme-btn ${sekmeler === 'kuyruk' ? 'aktif' : ''}`}
          onClick={() => setSekmeler('kuyruk')}
        >
          İstasyon Kuyrukları
        </button>
        <button 
          className={`sekme-btn ${sekmeler === 'grafikler' ? 'aktif' : ''}`}
          onClick={() => setSekmeler('grafikler')}
        >
          Grafikler & Analizler
        </button>
      </div>

      {/* Sekme İçerikleri */}
      <div className="sekme-icerik">
        {sekmeler === 'genel' && (
          <div className="genel-rapor">
            <h3>Genel Durum Özeti</h3>
            
            {/* Fabrika Karşılaştırması */}
            <div className="fabrika-karsilastirma">
              <h4>Fabrika Bazlı Performans</h4>
              <div className="karsilastirma-grid">
                {['A1', 'B1'].map(fabrika => {
                  const fabrikaSiparisleri = siparisler.filter(s => s.fabrika === fabrika);
                  const fabrikaTamamlanan = fabrikaSiparisleri.filter(s => s.durum === 'Tamamlandı').length;
                  const fabrikaDevam = fabrikaSiparisleri.filter(s => s.durum !== 'Tamamlandı').length;
                  const fabrikaMiktar = fabrikaSiparisleri.reduce((t, s) => t + s.toplamMiktar, 0);
                  const fabrikaKirilan = kirilanCamlar.filter(k => {
                    const siparis = siparisler.find(s => s.id === k.siparisId);
                    return siparis && siparis.fabrika === fabrika;
                  }).reduce((t, k) => t + k.adet, 0);
                  
                  return (
                    <div key={fabrika} className="fabrika-kart-rapor">
                      <h5>{fabrika} Fabrikası</h5>
                      <div className="fabrika-metrikler">
                        <div className="metrik">
                          <span className="metrik-etiket">Toplam Sipariş:</span>
                          <span className="metrik-deger">{fabrikaSiparisleri.length}</span>
                        </div>
                        <div className="metrik">
                          <span className="metrik-etiket">Tamamlanan:</span>
                          <span className="metrik-deger yesil">{fabrikaTamamlanan}</span>
                        </div>
                        <div className="metrik">
                          <span className="metrik-etiket">Devam Eden:</span>
                          <span className="metrik-deger mavi">{fabrikaDevam}</span>
                        </div>
                        <div className="metrik">
                          <span className="metrik-etiket">Toplam Üretim:</span>
                          <span className="metrik-deger">{fabrikaMiktar.toFixed(1)} m²</span>
                        </div>
                        <div className="metrik">
                          <span className="metrik-etiket">Kırılan Cam:</span>
                          <span className="metrik-deger kirmizi">{fabrikaKirilan} adet</span>
                        </div>
                        <div className="metrik">
                          <span className="metrik-etiket">Verimlilik:</span>
                          <span className="metrik-deger">
                            %{fabrikaSiparisleri.length > 0 ? Math.round((fabrikaTamamlanan / fabrikaSiparisleri.length) * 100) : 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cam Tipi Analizi */}
            <div className="cam-tipi-analizi">
              <h4>Cam Tipi Bazlı Analiz</h4>
              <table className="rapor-tablo">
                <thead>
                  <tr>
                    <th>Cam Tipi</th>
                    <th>Sipariş Sayısı</th>
                    <th>Toplam Miktar (m²)</th>
                    <th>Ortalama Miktar</th>
                    <th>Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    siparisler.reduce((acc, siparis) => {
                      const tip = siparis.camTipi || 'Belirtilmemiş';
                      if (!acc[tip]) {
                        acc[tip] = {
                          sayi: 0,
                          miktar: 0,
                          tamamlanan: 0,
                          devam: 0
                        };
                      }
                      acc[tip].sayi += 1;
                      acc[tip].miktar += siparis.toplamMiktar;
                      if (siparis.durum === 'Tamamlandı') {
                        acc[tip].tamamlanan += 1;
                      } else {
                        acc[tip].devam += 1;
                      }
                      return acc;
                    }, {})
                  ).map(([tip, veri]) => (
                    <tr key={tip}>
                      <td>{tip}</td>
                      <td>{veri.sayi}</td>
                      <td>{veri.miktar.toFixed(2)}</td>
                      <td>{(veri.miktar / veri.sayi).toFixed(2)}</td>
                      <td>
                        <span className="durum-ozet">
                          ✅ {veri.tamamlanan} | ⏳ {veri.devam}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sekmeler === 'detay' && (
          <div className="detay-rapor">
            <h3>Tüm Siparişler ({filtrelenmisiSiparisler.length} adet)</h3>
            <div className="tablo-container">
              <table className="rapor-tablo">
                <thead>
                  <tr>
                    <th>Sipariş No</th>
                    <th>Müşteri</th>
                    <th>Proje</th>
                    <th>Cam Tipi</th>
                    <th>Miktar</th>
                    <th>Adet</th>
                    <th>Fabrika</th>
                    <th>Durum</th>
                    <th>Teslim</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrelenmisiSiparisler.map(siparis => (
                    <tr key={siparis.id}>
                      <td>{siparis.siparisNo}</td>
                      <td>{siparis.musteri}</td>
                      <td>{siparis.projeAdi}</td>
                      <td>{siparis.camTipi}</td>
                      <td>{siparis.toplamMiktar} m²</td>
                      <td>{siparis.adet}</td>
                      <td>
                        <span className={`fabrika-badge ${siparis.fabrika.toLowerCase()}`}>
                          {siparis.fabrika}
                        </span>
                      </td>
                      <td>
                        <span className={`durum-badge ${siparis.durum.toLowerCase().replace(/\s+/g, '-')}`}>
                          {siparis.durum}
                        </span>
                      </td>
                      <td>{new Date(siparis.teslimTarihi).toLocaleDateString('tr-TR')}</td>
                      <td>
                        <div className="btn-group">
                          <button 
                            className="btn-sm btn-primary"
                            onClick={() => modalAc('duzenle', siparis)}
                            title="Düzenle"
                          >
                            ✏️
                          </button>
                          {siparis.durum === 'İşlemde' && (
                            <button 
                              className="btn-sm btn-danger"
                              onClick={() => modalAc('kirilan', siparis, siparis.istasyonSirasi[siparis.guncelIstasyonIndex])}
                              title="Kırılan Cam"
                            >
                              💔
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sekmeler === 'istasyon' && (
          <div className="istasyon-rapor">
            <h3>İstasyon Performans Raporu</h3>
            <div className="istasyon-grid">
              {istasyonlar.map(istasyon => {
                const istasyonSiparisleri = siparisler.filter(s => 
                  s.istasyonSirasi.includes(istasyon.id)
                );
                const aktifSiparisler = istasyonSiparisleriGetir(istasyon.id);
                const tamamlananlar = istasyonSiparisleri.filter(s => {
                  const istasyonIndex = s.istasyonSirasi.indexOf(istasyon.id);
                  return s.gecmis[istasyonIndex]?.bitisSaati;
                });
                const ortalamaSure = tamamlananlar.length > 0
                  ? tamamlananlar.reduce((toplam, s) => {
                      const istasyonIndex = s.istasyonSirasi.indexOf(istasyon.id);
                      const baslama = new Date(s.gecmis[istasyonIndex].baslamaSaati);
                      const bitis = new Date(s.gecmis[istasyonIndex].bitisSaati);
                      return toplam + (bitis - baslama) / (1000 * 60 * 60);
                    }, 0) / tamamlananlar.length
                  : 0;

                return (
                  <div key={istasyon.id} className="istasyon-kart-rapor">
                    <div className="istasyon-baslik">
                      <h4>{istasyon.name}</h4>
                      <span className={`fabrika-badge ${istasyon.fabrika.toLowerCase()}`}>
                        {istasyon.fabrika}
                      </span>
                    </div>
                    <div className="istasyon-metrikler">
                      <div className="metrik">
                        <span className="metrik-etiket">Toplam İşlem:</span>
                        <span className="metrik-deger">{istasyonSiparisleri.length}</span>
                      </div>
                      <div className="metrik">
                        <span className="metrik-etiket">Aktif:</span>
                        <span className="metrik-deger mavi">{aktifSiparisler.length}</span>
                      </div>
                      <div className="metrik">
                        <span className="metrik-etiket">Tamamlanan:</span>
                        <span className="metrik-deger yesil">{tamamlananlar.length}</span>
                      </div>
                      <div className="metrik">
                        <span className="metrik-etiket">Ort. Süre:</span>
                        <span className="metrik-deger">{ortalamaSure.toFixed(1)} saat</span>
                      </div>
                      <div className="metrik">
                        <span className="metrik-etiket">Kırılan:</span>
                        <span className="metrik-deger kirmizi">
                          {istasyonKirilanIstatistik.find(i => i.id === istasyon.id)?.kirilanAdet || 0} adet
                        </span>
                      </div>
                      <div className="metrik">
                        <span className="metrik-etiket">Verimlilik:</span>
                        <span className="metrik-deger">
                          %{istasyonSiparisleri.length > 0 
                            ? Math.round((tamamlananlar.length / istasyonSiparisleri.length) * 100) 
                            : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sekmeler === 'kirilan' && (
          <div className="kirilan-rapor">
            <h3>Kırılan Cam Kayıtları ({kirilanCamlar.length} kayıt)</h3>
            <div className="kirilan-ozet">
              <div className="ozet-kart">
                <h4>Toplam Kırılan</h4>
                <div className="ozet-deger kirmizi">{toplamKirilanCam} adet</div>
              </div>
              <div className="ozet-kart">
                <h4>Etkilenen Sipariş</h4>
                <div className="ozet-deger">{new Set(kirilanCamlar.map(k => k.siparisId)).size}</div>
              </div>
              <div className="ozet-kart">
                <h4>Kırılma Oranı</h4>
                <div className="ozet-deger">%{toplamAdet > 0 ? ((toplamKirilanCam / toplamAdet) * 100).toFixed(2) : 0}</div>
              </div>
            </div>
            
            <table className="rapor-tablo">
              <thead>
                <tr>
                  <th>Tarih</th>
                  <th>İstasyon</th>
                  <th>Sipariş No</th>
                  <th>Müşteri</th>
                  <th>Miktar</th>
                  <th>Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {kirilanCamlar.map(kirilan => {
                  const siparis = siparisler.find(s => s.id === kirilan.siparisId);
                  const istasyon = istasyonlar.find(i => i.id === kirilan.istasyonId);
                  
                  return (
                    <tr key={kirilan.id}>
                      <td>{new Date(kirilan.tarih).toLocaleString('tr-TR')}</td>
                      <td>{istasyon?.name || '-'}</td>
                      <td>{siparis?.siparisNo || '-'}</td>
                      <td>{siparis?.musteri || '-'}</td>
                      <td className="kirmizi">{kirilan.adet} adet</td>
                      <td>{kirilan.aciklama}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {sekmeler === 'kuyruk' && (
          <div className="kuyruk-durumu">
            <h3>İstasyon Kuyruk Durumları</h3>
            <div className="kuyruk-grid">
              {kuyrukDurumu
                .filter(k => k.kuyrukUzunlugu > 0)
                .sort((a, b) => b.kuyrukUzunlugu - a.kuyrukUzunlugu)
                .map(kuyruk => (
                <div key={kuyruk.id} className="kuyruk-kart">
                  <div className="kuyruk-baslik">
                    <h4>{kuyruk.name}</h4>
                    <span className={`kuyruk-badge ${kuyruk.kuyrukUzunlugu > 5 ? 'kirmizi' : kuyruk.kuyrukUzunlugu > 2 ? 'sari' : 'yesil'}`}>
                      {kuyruk.kuyrukUzunlugu} sipariş
                    </span>
                  </div>
                  <div className="kuyruk-detay">
                    <p className="fabrika-info">{kuyruk.fabrika} Fabrikası</p>
                    <ul className="kuyruk-liste">
                      {kuyruk.kuyruktakiSiparisler.map(siparis => (
                        <li key={siparis.id}>
                          <span className="siparis-no">{siparis.siparisNo}</span>
                          <span className="musteri">{siparis.musteri}</span>
                          <span className={`oncelik oncelik-${siparis.oncelik}`}>
                            Öncelik: {siparis.oncelik}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {kuyruk.kuyrukUzunlugu > 5 && (
                    <div className="uyari-mesaj">
                      ⚠️ Yüksek yoğunluk! Kapasite artırımı gerekebilir.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {sekmeler === 'grafikler' && (
          <div className="grafikler-rapor">
            {/* KPI Dashboard */}
            <KPIDashboard />
            
            {/* Grafikler Grid */}
            <div className="grafikler-grid">
              <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Yükleniyor...</div>}>
                <div className="grafik-kart">
                  <h3>Sipariş Trend Analizi</h3>
                  <ErrorBoundary>
                    <SiparisChart siparisler={siparisler} />
                  </ErrorBoundary>
                </div>
                
                <div className="grafik-kart">
                  <h3>İstasyon Yoğunluk Dağılımı</h3>
                  <ErrorBoundary>
                    <IstasyonChart siparisler={siparisler} istasyonlar={istasyonlar} />
                  </ErrorBoundary>
                </div>
                
                <div className="grafik-kart tam-genislik">
                  <h3>Üretim Performans Trendi</h3>
                  <ErrorBoundary>
                    <UretimTrendChart siparisler={siparisler} />
                  </ErrorBoundary>
                </div>
                
                <div className="grafik-kart tam-genislik">
                  <h3>İstasyon Performans Metrikleri</h3>
                  <ErrorBoundary>
                    <PerformansChart siparisler={siparisler} istasyonlar={istasyonlar} />
                  </ErrorBoundary>
                </div>
              </Suspense>
            </div>
          </div>
        )}
      </div>

      {/* Modal Components */}
      {modaller.secilenSiparis && (
        <>
          <KirilanCamModal
            isOpen={modaller.kirilan}
            onClose={modalKapat}
            siparis={modaller.secilenSiparis}
            istasyonId={modaller.secilenIstasyon}
          />
          
          <SiparisDuzenleModal
            isOpen={modaller.duzenle}
            onClose={modalKapat}
            siparis={modaller.secilenSiparis}
          />
        </>
      )}
    </div>
  );
};

export default Rapor;