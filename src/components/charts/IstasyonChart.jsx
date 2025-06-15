import { Doughnut } from 'react-chartjs-2';
import '../../config/chartConfig';

const IstasyonChart = ({ siparisler = [], istasyonlar = [] }) => {
  // İstasyon bazlı sipariş dağılımı
  const istasyonDagilim = {};
  
  siparisler.forEach(siparis => {
    if (siparis.durum !== 'Tamamlandı' && siparis.guncelIstasyonIndex < siparis.istasyonSirasi.length) {
      const mevcutIstasyonId = siparis.istasyonSirasi[siparis.guncelIstasyonIndex];
      istasyonDagilim[mevcutIstasyonId] = (istasyonDagilim[mevcutIstasyonId] || 0) + 1;
    }
  });

  const labels = [];
  const dataValues = [];
  const backgroundColors = [
    'rgba(255, 99, 132, 0.8)',
    'rgba(54, 162, 235, 0.8)',
    'rgba(255, 206, 86, 0.8)',
    'rgba(75, 192, 192, 0.8)',
    'rgba(153, 102, 255, 0.8)',
    'rgba(255, 159, 64, 0.8)',
    'rgba(199, 199, 199, 0.8)',
    'rgba(83, 102, 255, 0.8)',
    'rgba(255, 99, 255, 0.8)',
    'rgba(99, 255, 132, 0.8)'
  ];

  Object.entries(istasyonDagilim).forEach(([istasyonId, count], index) => {
    const istasyon = istasyonlar.find(ist => ist.id === istasyonId);
    if (istasyon) {
      labels.push(istasyon.name);
      dataValues.push(count);
    }
  });

  const data = {
    labels,
    datasets: [
      {
        label: 'Sipariş Sayısı',
        data: dataValues,
        backgroundColor: backgroundColors.slice(0, labels.length),
        borderColor: backgroundColors.slice(0, labels.length).map(color => color.replace('0.8', '1')),
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 15,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'İstasyon Bazlı Sipariş Dağılımı',
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
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} sipariş (%${percentage})`;
          }
        }
      }
    }
  };

  if (dataValues.length === 0) {
    return (
      <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Aktif sipariş bulunmamaktadır</p>
      </div>
    );
  }

  return (
    <div style={{ height: '300px', width: '100%', position: 'relative' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default IstasyonChart;