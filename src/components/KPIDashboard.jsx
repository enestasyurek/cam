import { useFabrika } from '../context/FabrikaContext';
import './KPIDashboard.css';

const KPIDashboard = () => {
  const { siparisler, istasyonlar, kirilanCamlar } = useFabrika();

  // KPI hesaplamaları
  const toplamSiparis = siparisler.length;
  const tamamlananSiparis = siparisler.filter(s => s.durum === 'Tamamlandı').length;
  const islemdekiSiparis = siparisler.filter(s => s.durum === 'İşlemde').length;
  const bekleyenSiparis = siparisler.filter(s => s.durum === 'Bekliyor').length;
  
  // Tamamlanma oranı
  const tamamlanmaOrani = toplamSiparis > 0 ? (tamamlananSiparis / toplamSiparis * 100).toFixed(1) : 0;
  
  // Ortalama teslim süresi (gün)
  const teslimSureleri = siparisler
    .filter(s => s.durum === 'Tamamlandı' && s.gecmis && s.gecmis.length > 0)
    .map(s => {
      const ilkBaslama = s.gecmis.find(g => g.baslamaSaati)?.baslamaSaati;
      const sonBitis = [...s.gecmis].reverse().find(g => g.bitisSaati)?.bitisSaati;
      if (ilkBaslama && sonBitis) {
        return (new Date(sonBitis) - new Date(ilkBaslama)) / (1000 * 60 * 60 * 24);
      }
      return null;
    })
    .filter(s => s !== null);
  
  const ortalamaTeslimSuresi = teslimSureleri.length > 0 
    ? (teslimSureleri.reduce((a, b) => a + b, 0) / teslimSureleri.length).toFixed(1)
    : 0;
  
  // Kırılan cam oranı
  const toplamAdet = siparisler.reduce((sum, s) => sum + s.adet, 0);
  const toplamKirilan = kirilanCamlar.reduce((sum, k) => sum + k.adet, 0);
  const kirilanOrani = toplamAdet > 0 ? (toplamKirilan / toplamAdet * 100).toFixed(2) : 0;
  
  // İstasyon verimliliği
  const aktifIstasyonSayisi = new Set(
    siparisler
      .filter(s => s.durum === 'İşlemde')
      .map(s => s.istasyonSirasi[s.guncelIstasyonIndex])
  ).size;
  
  const istasyonVerimliligi = istasyonlar.length > 0 
    ? (aktifIstasyonSayisi / istasyonlar.length * 100).toFixed(1)
    : 0;

  // Günlük üretim kapasitesi
  const bugun = new Date().toLocaleDateString('tr-TR');
  const bugunBaslayan = siparisler.filter(s => {
    const baslamaTarihi = s.gecmis?.[0]?.baslamaSaati;
    return baslamaTarihi && new Date(baslamaTarihi).toLocaleDateString('tr-TR') === bugun;
  }).length;

  const bugunTamamlanan = siparisler.filter(s => {
    if (s.durum !== 'Tamamlandı') return false;
    const sonBitis = [...s.gecmis].reverse().find(g => g.bitisSaati)?.bitisSaati;
    return sonBitis && new Date(sonBitis).toLocaleDateString('tr-TR') === bugun;
  }).length;

  const kpiData = [
    {
      title: 'Toplam Sipariş',
      value: toplamSiparis,
      icon: '📦',
      color: 'primary',
      trend: '+12%',
      subtitle: 'Son 30 gün'
    },
    {
      title: 'Tamamlanma Oranı',
      value: `%${tamamlanmaOrani}`,
      icon: '✅',
      color: 'success',
      trend: '+5%',
      subtitle: `${tamamlananSiparis} / ${toplamSiparis}`
    },
    {
      title: 'Ortalama Teslim',
      value: `${ortalamaTeslimSuresi} gün`,
      icon: '⏱️',
      color: 'info',
      trend: '-8%',
      subtitle: 'Hızlanıyor'
    },
    {
      title: 'Kırılan Cam Oranı',
      value: `%${kirilanOrani}`,
      icon: '💔',
      color: 'danger',
      trend: '-3%',
      subtitle: `${toplamKirilan} adet`
    },
    {
      title: 'İstasyon Verimliliği',
      value: `%${istasyonVerimliligi}`,
      icon: '🏭',
      color: 'warning',
      trend: '+10%',
      subtitle: `${aktifIstasyonSayisi} / ${istasyonlar.length} aktif`
    },
    {
      title: 'Bugünkü Üretim',
      value: `${bugunBaslayan} / ${bugunTamamlanan}`,
      icon: '📊',
      color: 'purple',
      trend: 'Başlayan / Tamamlanan',
      subtitle: 'Günlük'
    }
  ];

  return (
    <div className="kpi-dashboard">
      <h2 className="kpi-title">Performans Göstergeleri (KPI)</h2>
      <div className="kpi-grid">
        {kpiData.map((kpi, index) => (
          <div key={index} className={`kpi-card kpi-${kpi.color}`}>
            <div className="kpi-header">
              <span className="kpi-icon">{kpi.icon}</span>
              <span className={`kpi-trend ${kpi.trend.startsWith('+') ? 'trend-up' : 'trend-down'}`}>
                {kpi.trend}
              </span>
            </div>
            <div className="kpi-body">
              <h3 className="kpi-value">{kpi.value}</h3>
              <p className="kpi-label">{kpi.title}</p>
              <p className="kpi-subtitle">{kpi.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="kpi-summary">
        <div className="summary-item">
          <span className="summary-label">İşlemdeki:</span>
          <span className="summary-value">{islemdekiSiparis}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Bekleyen:</span>
          <span className="summary-value">{bekleyenSiparis}</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Toplam Metrekare:</span>
          <span className="summary-value">
            {siparisler.reduce((sum, s) => sum + parseFloat(s.toplamMiktar || 0), 0).toFixed(1)} m²
          </span>
        </div>
      </div>
    </div>
  );
};

export default KPIDashboard;