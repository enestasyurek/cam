import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const Rapor = () => {
  const { 
    siparisler, 
    kirilanCamlar, 
    istasyonlar, 
    siparisAra,
    istasyonKuyruklar 
  } = useFabrika();
  
  const [aramaMetni, setAramaMetni] = useState('');
  const [sekmeler, setSekmeler] = useState('genel'); // genel, detay, istasyon, kirilan, kuyruk

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

  return (
    <div className="rapor-container">
      <div className="rapor-header">
        <h2>📊 Fabrika Raporu</h2>
        <button 
          className="geri-btn"
          onClick={() => window.location.reload()}
        >
          ← Ana Sayfaya Dön
        </button>
      </div>

      {/* Arama Alanı */}
      <div className="arama-alani">
        <input
          type="text"
          placeholder="Sipariş No, Müşteri veya Cari Ünvan ile ara..."
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
                          <span className="metrik-etiket">Üretim:</span>
                          <span className="metrik-deger">{fabrikaMiktar.toFixed(2)} m²</span>
                        </div>
                        <div className="metrik">
                          <span className="metrik-etiket">Kırılan:</span>
                          <span className="metrik-deger kirmizi">{fabrikaKirilan} adet</span>
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
              <div className="tablo-container">
                <table className="rapor-tablo">
                  <thead>
                    <tr>
                      <th>Cam Tipi</th>
                      <th>Sipariş Sayısı</th>
                      <th>Toplam Adet</th>
                      <th>Toplam m²</th>
                      <th>Kırılan</th>
                      <th>Verimlilik</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      siparisler.reduce((acc, siparis) => {
                        const tip = siparis.kombinasyonAdi;
                        if (!acc[tip]) {
                          acc[tip] = {
                            count: 0,
                            adet: 0,
                            miktar: 0,
                            kirilan: 0
                          };
                        }
                        acc[tip].count++;
                        acc[tip].adet += siparis.adet;
                        acc[tip].miktar += siparis.toplamMiktar;
                        acc[tip].kirilan += siparis.kirilanAdet || 0;
                        return acc;
                      }, {})
                    ).map(([tip, data]) => (
                      <tr key={tip}>
                        <td>{tip}</td>
                        <td>{data.count}</td>
                        <td>{data.adet}</td>
                        <td>{data.miktar.toFixed(2)}</td>
                        <td className="kirmizi">{data.kirilan}</td>
                        <td>{data.adet > 0 ? ((1 - data.kirilan / data.adet) * 100).toFixed(1) : 100}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        
        {sekmeler === 'detay' && (
          <div className="siparis-listesi">
            <h3>Sipariş Listesi {aramaMetni && `(${filtrelenmisiSiparisler.length} sonuç)`}</h3>
            <div className="tablo-container">
              <table className="rapor-tablo">
                <thead>
                  <tr>
                    <th>Sipariş No</th>
                    <th>Müşteri</th>
                    <th>Cam Tipi</th>
                    <th>Fabrika</th>
                    <th>Adet</th>
                    <th>M²</th>
                    <th>Durum</th>
                    <th>Güncel İstasyon</th>
                    <th>İlerleme</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrelenmisiSiparisler.map(siparis => {
                    const ilerlemeYuzdesi = siparis.istasyonSirasi.length > 0 
                      ? Math.round((siparis.guncelIstasyonIndex / siparis.istasyonSirasi.length) * 100)
                      : 0;
                    const guncelIstasyon = siparis.guncelIstasyonIndex < siparis.istasyonSirasi.length
                      ? istasyonlar.find(i => i.id === siparis.istasyonSirasi[siparis.guncelIstasyonIndex])
                      : null;

                    return (
                      <tr key={siparis.id}>
                        <td>{siparis.siparisNo}</td>
                        <td>{siparis.musteri}</td>
                        <td>{siparis.kombinasyonAdi}</td>
                        <td>{siparis.fabrika || 'A1'}</td>
                        <td>
                          {siparis.adet}
                          {siparis.kirilanAdet > 0 && (
                            <span className="kirilan-badge"> (-{siparis.kirilanAdet})</span>
                          )}
                        </td>
                        <td>{siparis.toplamMiktar}</td>
                        <td>
                          <span className={`durum-badge ${siparis.durum.toLowerCase()}`}>
                            {siparis.durum}
                          </span>
                        </td>
                        <td>{guncelIstasyon ? guncelIstasyon.name : 'Tamamlandı'}</td>
                        <td>
                          <div className="ilerleme-bar">
                            <div 
                              className="ilerleme-dolu" 
                              style={{ width: `${ilerlemeYuzdesi}%` }}
                            />
                            <span className="ilerleme-metin">{ilerlemeYuzdesi}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sekmeler === 'istasyon' && (
          <div className="istasyon-raporu">
            <h3>İstasyon Bazlı Detaylı Rapor</h3>
            
            {/* İstasyon Performans Kartları */}
            <div className="istasyon-grid">
              {istasyonlar.map(istasyon => {
                // İstasyona gelen siparişler
                const istasyonSiparisleri = siparisler.filter(siparis => 
                  siparis.istasyonSirasi.includes(istasyon.id)
                );
                
                // İstasyonda şu an bekleyen/işlemde olan
                const aktifSiparisler = istasyonSiparisleriGetir(istasyon.id);
                
                // İstasyonda tamamlanan
                const tamamlananSiparisler = siparisler.filter(siparis => {
                  const istasyonIndex = siparis.istasyonSirasi.indexOf(istasyon.id);
                  return istasyonIndex !== -1 && istasyonIndex < siparis.guncelIstasyonIndex;
                });
                
                // İstasyondaki kırılan camlar
                const istasyonKirilan = kirilanCamlar.filter(k => k.istasyonId === istasyon.id);
                const toplamKirilan = istasyonKirilan.reduce((t, k) => t + k.adet, 0);
                
                // İstasyon verimliliği
                const toplamIslenen = tamamlananSiparisler.reduce((t, s) => t + s.adet, 0);
                const verimlilik = toplamIslenen > 0 
                  ? ((toplamIslenen - toplamKirilan) / toplamIslenen * 100).toFixed(1)
                  : 100;
                
                // Ortalama işlem süresi
                const tamamlananSureler = tamamlananSiparisler
                  .map(siparis => {
                    const istasyonIndex = siparis.istasyonSirasi.indexOf(istasyon.id);
                    const gecmis = siparis.gecmis[istasyonIndex];
                    if (gecmis && gecmis.baslamaSaati && gecmis.bitisSaati) {
                      return new Date(gecmis.bitisSaati) - new Date(gecmis.baslamaSaati);
                    }
                    return null;
                  })
                  .filter(sure => sure !== null);
                
                const ortalamaIslemSuresi = tamamlananSureler.length > 0
                  ? Math.round(tamamlananSureler.reduce((t, s) => t + s, 0) / tamamlananSureler.length / 60000)
                  : 0;
                
                return (
                  <div key={istasyon.id} className="istasyon-rapor-kart">
                    <div className="istasyon-baslik">
                      <h4>{istasyon.name}</h4>
                      <span className="fabrika-etiketi">{istasyon.fabrika}</span>
                    </div>
                    
                    <div className="istasyon-metrikler">
                      <div className="metrik-satir">
                        <span>Toplam İş:</span>
                        <strong>{istasyonSiparisleri.length}</strong>
                      </div>
                      <div className="metrik-satir">
                        <span>Bekleyen:</span>
                        <strong className="mavi">{aktifSiparisler.length}</strong>
                      </div>
                      <div className="metrik-satir">
                        <span>Tamamlanan:</span>
                        <strong className="yesil">{tamamlananSiparisler.length}</strong>
                      </div>
                      <div className="metrik-satir">
                        <span>Kırılan:</span>
                        <strong className="kirmizi">{toplamKirilan} adet</strong>
                      </div>
                      <div className="metrik-satir">
                        <span>Verimlilik:</span>
                        <strong className={verimlilik >= 95 ? 'yesil' : verimlilik >= 90 ? 'turuncu' : 'kirmizi'}>
                          %{verimlilik}
                        </strong>
                      </div>
                      <div className="metrik-satir">
                        <span>Ort. Süre:</span>
                        <strong>{ortalamaIslemSuresi} dk</strong>
                      </div>
                    </div>
                    
                    {/* Kırılan cam detayları */}
                    {istasyonKirilan.length > 0 && (
                      <div className="kirilan-detay">
                        <h5>Kırılan Camlar:</h5>
                        <ul>
                          {istasyonKirilan.slice(0, 3).map(k => {
                            const siparis = siparisler.find(s => s.id === k.siparisId);
                            return (
                              <li key={k.id}>
                                {siparis?.siparisNo || 'Bilinmiyor'} - {k.adet} adet
                                {k.aciklama && <em> ({k.aciklama})</em>}
                              </li>
                            );
                          })}
                          {istasyonKirilan.length > 3 && (
                            <li className="daha-fazla">
                              ve {istasyonKirilan.length - 3} kayıt daha...
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {sekmeler === 'kirilan' && (
          <div className="kirilan-cam-listesi">
            <h3>İstasyon Bazlı Kırılan Cam İstatistikleri</h3>
            <div className="tablo-container">
              <table className="rapor-tablo">
                <thead>
                  <tr>
                    <th>İstasyon</th>
                    <th>Fabrika</th>
                    <th>Toplam Kırılan</th>
                    <th>Kayıt Sayısı</th>
                  </tr>
                </thead>
                <tbody>
                  {istasyonKirilanIstatistik
                    .filter(i => i.kirilanAdet > 0)
                    .map(istasyon => (
                      <tr key={istasyon.id}>
                        <td>{istasyon.name}</td>
                        <td>{istasyon.fabrika}</td>
                        <td className="kirmizi">{istasyon.kirilanAdet} adet</td>
                        <td>{istasyon.kirilanKayitSayisi}</td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3>Kırılan Cam Detayları</h3>
            <div className="tablo-container">
              <table className="rapor-tablo">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>İstasyon</th>
                    <th>Sipariş No</th>
                    <th>Adet</th>
                    <th>Açıklama</th>
                  </tr>
                </thead>
                <tbody>
                  {kirilanCamlar.map(kirilan => {
                    const istasyon = istasyonlar.find(i => i.id === kirilan.istasyonId);
                    const siparis = siparisler.find(s => s.id === kirilan.siparisId);
                    return (
                      <tr key={kirilan.id}>
                        <td>{new Date(kirilan.tarih).toLocaleString('tr-TR')}</td>
                        <td>{istasyon ? istasyon.name : kirilan.istasyonId}</td>
                        <td>{siparis ? siparis.siparisNo : '-'}</td>
                        <td className="kirmizi">{kirilan.adet}</td>
                        <td>{kirilan.aciklama}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {sekmeler === 'kuyruk' && (
          <div className="kuyruk-durumu">
            <h3>İstasyon Kuyruk Durumları</h3>
            <div className="kuyruk-grid">
              {kuyrukDurumu.map(istasyon => (
                <div key={istasyon.id} className="kuyruk-kart">
                  <h4>{istasyon.name}</h4>
                  <div className="kuyruk-bilgi">
                    <span className="kuyruk-sayi">{istasyon.kuyrukUzunlugu}</span>
                    <span className="kuyruk-metin">sipariş bekliyor</span>
                  </div>
                  {istasyon.kuyruktakiSiparisler.length > 0 && (
                    <div className="kuyruk-siparisler">
                      <h5>Bekleyen Siparişler:</h5>
                      <ul>
                        {istasyon.kuyruktakiSiparisler.slice(0, 5).map(siparis => (
                          <li key={siparis.id}>
                            {siparis.siparisNo} - {siparis.musteri} ({siparis.adet} adet)
                          </li>
                        ))}
                        {istasyon.kuyruktakiSiparisler.length > 5 && (
                          <li className="daha-fazla">
                            ve {istasyon.kuyruktakiSiparisler.length - 5} sipariş daha...
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rapor;