import { Line } from 'react-chartjs-2';
import '../../config/chartConfig';

const UretimTrendChart = ({ siparisler = [] }) => {
  // Son 30 günlük üretim trendi
  const sonOtuzGun = [];
  const gunlukUretim = {};
  
  // Son 30 günü oluştur
  for (let i = 29; i >= 0; i--) {
    const tarih = new Date();
    tarih.setDate(tarih.getDate() - i);
    const tarihStr = tarih.toLocaleDateString('tr-TR');
    sonOtuzGun.push(tarihStr);
    gunlukUretim[tarihStr] = { baslayan: 0, tamamlanan: 0 };
  }

  // Siparişleri analiz et
  siparisler.forEach(siparis => {
    // Başlama tarihi
    if (siparis.gecmis && Array.isArray(siparis.gecmis) && siparis.gecmis[0] && siparis.gecmis[0].baslamaSaati) {
      const baslamaTarihi = new Date(siparis.gecmis[0].baslamaSaati).toLocaleDateString('tr-TR');
      if (gunlukUretim[baslamaTarihi]) {
        gunlukUretim[baslamaTarihi].baslayan += 1;
      }
    }
    
    // Tamamlanma tarihi
    if (siparis.durum === 'Tamamlandı' && siparis.gecmis && Array.isArray(siparis.gecmis) && siparis.gecmis.length > 0) {
      const sonIstasyon = siparis.gecmis[siparis.gecmis.length - 1];
      if (sonIstasyon && sonIstasyon.bitisSaati) {
        const tamamlanmaTarihi = new Date(sonIstasyon.bitisSaati).toLocaleDateString('tr-TR');
        if (gunlukUretim[tamamlanmaTarihi]) {
          gunlukUretim[tamamlanmaTarihi].tamamlanan += 1;
        }
      }
    }
  });

  // Kümülatif hesaplama
  let kumulatifBaslayan = 0;
  let kumulatifTamamlanan = 0;
  const kumulatifData = sonOtuzGun.map(tarih => {
    kumulatifBaslayan += gunlukUretim[tarih].baslayan;
    kumulatifTamamlanan += gunlukUretim[tarih].tamamlanan;
    return {
      baslayan: kumulatifBaslayan,
      tamamlanan: kumulatifTamamlanan
    };
  });

  const data = {
    labels: sonOtuzGun.map((tarih, index) => {
      // Her 5 günde bir tarihi göster
      return index % 5 === 0 ? tarih : '';
    }),
    datasets: [
      {
        label: 'Başlayan Siparişler',
        data: kumulatifData.map(d => d.baslayan),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6
      },
      {
        label: 'Tamamlanan Siparişler',
        data: kumulatifData.map(d => d.tamamlanan),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: '600'
          }
        }
      },
      title: {
        display: true,
        text: '30 Günlük Üretim Trendi',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 5,
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          font: {
            size: 11
          },
          maxRotation: 45,
          minRotation: 45
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default UretimTrendChart;