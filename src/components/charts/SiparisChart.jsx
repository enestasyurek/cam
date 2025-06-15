import { Bar } from 'react-chartjs-2';
import '../../config/chartConfig';

const SiparisChart = ({ siparisler = [] }) => {
  // Günlük sipariş sayısını hesapla
  const gunlukSiparisler = siparisler.reduce((acc, siparis) => {
    const tarih = new Date(siparis.siparisTarihi).toLocaleDateString('tr-TR');
    acc[tarih] = (acc[tarih] || 0) + 1;
    return acc;
  }, {});

  // Son 7 günü al
  const sonYediGun = [];
  for (let i = 6; i >= 0; i--) {
    const tarih = new Date();
    tarih.setDate(tarih.getDate() - i);
    sonYediGun.push(tarih.toLocaleDateString('tr-TR'));
  }

  const data = {
    labels: sonYediGun,
    datasets: [
      {
        label: 'Günlük Sipariş Sayısı',
        data: sonYediGun.map(tarih => gunlukSiparisler[tarih] || 0),
        backgroundColor: 'rgba(16, 185, 129, 0.6)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 40
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
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
        text: 'Son 7 Gün Sipariş Trendi',
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
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
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SiparisChart;