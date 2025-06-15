import { Radar } from 'react-chartjs-2';
import '../../config/chartConfig';

const PerformansChart = ({ siparisler = [], istasyonlar = [] }) => {
  // İstasyon performans metrikleri hesapla
  const istasyonMetrikleri = {};

  istasyonlar.forEach(istasyon => {
    istasyonMetrikleri[istasyon.id] = {
      name: istasyon.name,
      toplamSiparis: 0,
      tamamlananSiparis: 0,
      ortalamaSure: 0,
      verimlilik: 0,
      sureler: []
    };
  });

  // Siparişleri analiz et
  siparisler.forEach(siparis => {
    if (siparis.gecmis && Array.isArray(siparis.gecmis)) {
      siparis.gecmis.forEach((gecmis, index) => {
        const istasyonId = gecmis.istasyonId;
        if (istasyonMetrikleri[istasyonId]) {
          istasyonMetrikleri[istasyonId].toplamSiparis += 1;
          
          if (gecmis.bitisSaati && gecmis.baslamaSaati) {
            istasyonMetrikleri[istasyonId].tamamlananSiparis += 1;
            
            // Süre hesapla (saat cinsinden)
            const baslama = new Date(gecmis.baslamaSaati);
            const bitis = new Date(gecmis.bitisSaati);
            const sure = (bitis - baslama) / (1000 * 60 * 60); // Saat cinsinden
            if (sure > 0 && !isNaN(sure)) {
              istasyonMetrikleri[istasyonId].sureler.push(sure);
            }
          }
        }
      });
    }
  });

  // Metrikleri hesapla
  const performansData = [];
  const labels = [];
  
  Object.values(istasyonMetrikleri).forEach(metrik => {
    if (metrik.toplamSiparis > 0) {
      // Ortalama süre
      if (metrik.sureler.length > 0) {
        const toplamSure = metrik.sureler.reduce((a, b) => a + b, 0);
        metrik.ortalamaSure = toplamSure / metrik.sureler.length;
      }
      
      // Verimlilik (tamamlanan/toplam * 100)
      metrik.verimlilik = (metrik.tamamlananSiparis / metrik.toplamSiparis) * 100;
      
      if (metrik.toplamSiparis >= 3) { // En az 3 sipariş olan istasyonları göster
        labels.push(metrik.name);
        performansData.push({
          verimlilik: metrik.verimlilik,
          hiz: metrik.ortalamaSure > 0 ? Math.min(100, 100 / metrik.ortalamaSure) : 0,
          kapasite: Math.min(100, (metrik.toplamSiparis / 10) * 100),
          kalite: 95 - (Math.random() * 10) // Simüle edilmiş kalite skoru
        });
      }
    }
  });

  // Radar chart için metrik başlıkları
  const metricLabels = ['Verimlilik', 'Hız', 'Kapasite', 'Kalite'];
  
  // Her istasyon için ayrı dataset oluştur
  const datasets = labels.map((label, index) => ({
    label: label,
    data: [
      performansData[index].verimlilik,
      performansData[index].hiz,
      performansData[index].kapasite,
      performansData[index].kalite
    ],
    backgroundColor: `rgba(${100 + index * 30}, ${185 - index * 20}, ${129 + index * 15}, 0.2)`,
    borderColor: `rgba(${100 + index * 30}, ${185 - index * 20}, ${129 + index * 15}, 1)`,
    borderWidth: 2,
    pointBackgroundColor: `rgba(${100 + index * 30}, ${185 - index * 20}, ${129 + index * 15}, 1)`,
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: `rgba(${100 + index * 30}, ${185 - index * 20}, ${129 + index * 15}, 1)`
  }));

  const data = {
    labels: metricLabels,
    datasets: datasets
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: '600'
          },
          padding: 10
        }
      },
      title: {
        display: true,
        text: 'İstasyon Performans Analizi',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const metricName = context.label;
            const stationName = context.dataset.label;
            return `${stationName} - ${metricName}: %${value.toFixed(1)}`;
          }
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 11
          }
        },
        pointLabels: {
          font: {
            size: 12,
            weight: '600'
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  if (labels.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Yeterli veri bulunmamaktadır</p>
      </div>
    );
  }

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <Radar data={data} options={options} />
    </div>
  );
};

export default PerformansChart;