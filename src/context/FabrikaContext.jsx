import { createContext, useState, useContext } from 'react';

// Fabrika bağlamını oluştur
const FabrikaContext = createContext();

// Bağlam sağlayıcı bileşeni
export const FabrikaProvider = ({ children }) => {
  // İstasyonlar için veri
  const [istasyonlar] = useState([
    { id: 'kesim', name: 'Intermac Kesim' },
    { id: 'rodaj', name: 'Rodaj' },
    { id: 'temper', name: 'Temper' },
    { id: 'isicam', name: 'Isıcam' },
    { id: 'lamine', name: 'Lamine' },
    { id: 'montaj', name: 'Montaj' }
  ]);

  // Kombinasyonlar için veri (cam türleri ve izleyecekleri süreçler)
  const [kombinasyonlar] = useState([
    { 
      id: '6mm-coolplus-62-44', 
      name: '6 mm Coolplus 62/44',
      istasyonlar: ['kesim', 'rodaj', 'temper', 'isicam']
    },
    { 
      id: '8mm-lamine', 
      name: '8 mm Lamine',
      istasyonlar: ['kesim', 'rodaj', 'lamine']
    },
    { 
      id: '10mm-temperli', 
      name: '10 mm Temperli',
      istasyonlar: ['kesim', 'rodaj', 'temper']
    },
    { 
      id: '4mm-duz', 
      name: '4 mm Düz Cam',
      istasyonlar: ['kesim', 'isicam']
    }
  ]);

  // Siparişler için veri
  const [siparisler, setSiparisler] = useState([]);

  // Aktif görünüm için durum (Admin veya İstasyon)
  const [aktifGorunum, setAktifGorunum] = useState('admin');

  // Sipariş sıralama seçenekleri
  const [siralama, setSiralama] = useState({
    alan: 'siparisNo',
    artan: true
  });

  // Yeni sipariş oluşturma fonksiyonu
  const siparisOlustur = (siparisData) => {
    const {
      siparisNo,
      siparisTarihi,
      teslimTarihi,
      musteri,
      cariUnvan,
      kombinasyonMetni,
      toplamMiktar,
      adet,
      oncelik,
      secilenIstasyonlar
    } = siparisData;

    // İstasyon sırası seçilen istasyonlardan gelecek
    const istasyonSirasi = istasyonlar
      .filter(istasyon => secilenIstasyonlar.includes(istasyon.id))
      .map(istasyon => istasyon.id);

    if (istasyonSirasi.length === 0) {
      alert('En az bir istasyon seçmelisiniz!');
      return;
    }

    const yeniSiparis = {
      id: Date.now().toString(),
      siparisNo,
      siparisTarihi,
      teslimTarihi,
      gun: hesaplaGunSayisi(siparisTarihi, teslimTarihi),
      musteri,
      cariUnvan,
      kombinasyonAdi: kombinasyonMetni || 'Belirtilmemiş',
      toplamMiktar: parseFloat(toplamMiktar) || 0,
      adet: parseInt(adet) || 0,
      oncelik: parseInt(oncelik),
      olusturmaTarihi: new Date().toISOString(),
      istasyonSirasi,
      guncelIstasyonIndex: 0,
      durum: 'Bekliyor',
      gecmis: istasyonSirasi.map(istasyonId => ({
        istasyonId,
        baslamaSaati: null,
        bitisSaati: null
      }))
    };

    setSiparisler(oncekiSiparisler => [...oncekiSiparisler, yeniSiparis]);
  };

  // Gün sayısını hesaplama yardımcı fonksiyonu
  const hesaplaGunSayisi = (baslangic, bitis) => {
    if (!baslangic || !bitis) return 0;
    
    const baslangicTarihi = new Date(baslangic);
    const bitisTarihi = new Date(bitis);
    
    // Milisaniye cinsinden fark
    const farkMilisaniye = bitisTarihi - baslangicTarihi;
    // Gün cinsinden fark (86400000 ms = 1 gün)
    return Math.ceil(farkMilisaniye / 86400000);
  };

  // İşe başlama fonksiyonu
  const iseBasla = (siparisId) => {
    setSiparisler(oncekiSiparisler => {
      return oncekiSiparisler.map(siparis => {
        if (siparis.id === siparisId) {
          const guncelGecmis = [...siparis.gecmis];
          guncelGecmis[siparis.guncelIstasyonIndex] = {
            ...guncelGecmis[siparis.guncelIstasyonIndex],
            baslamaSaati: new Date().toISOString()
          };

          return {
            ...siparis,
            durum: 'İşlemde',
            gecmis: guncelGecmis
          };
        }
        return siparis;
      });
    });
  };

  // İşi bitirme fonksiyonu
  const isiBitir = (siparisId) => {
    setSiparisler(oncekiSiparisler => {
      return oncekiSiparisler.map(siparis => {
        if (siparis.id === siparisId) {
          const guncelGecmis = [...siparis.gecmis];
          guncelGecmis[siparis.guncelIstasyonIndex] = {
            ...guncelGecmis[siparis.guncelIstasyonIndex],
            bitisSaati: new Date().toISOString()
          };

          // Son istasyonda mıyız kontrol et
          const yeniIstasyonIndex = siparis.guncelIstasyonIndex + 1;
          const sonrakiDurum = yeniIstasyonIndex >= siparis.istasyonSirasi.length
            ? 'Tamamlandı'
            : 'Bekliyor';

          return {
            ...siparis,
            durum: sonrakiDurum,
            guncelIstasyonIndex: yeniIstasyonIndex,
            gecmis: guncelGecmis
          };
        }
        return siparis;
      });
    });
  };

  // Sıralama fonksiyonu
  const siralamaDegistir = (alan) => {
    setSiralama(onceki => {
      if (onceki.alan === alan) {
        // Aynı alana tekrar tıklandıysa yönü değiştir
        return { alan, artan: !onceki.artan };
      } else {
        // Farklı bir alana tıklandıysa, yeni alanı artan şekilde sırala
        return { alan, artan: true };
      }
    });
  };

  // İstasyon için sipariş filtreleme ve sıralama fonksiyonu
  const istasyonSiparisleriGetir = (istasyonId) => {
    const filtrelenmis = siparisler
      .filter(siparis => {
        const istasyonSiraIndex = siparis.istasyonSirasi.indexOf(istasyonId);
        return istasyonSiraIndex === siparis.guncelIstasyonIndex && siparis.durum !== 'Tamamlandı';
      });

    return siralaSiparisler(filtrelenmis);
  };

  // Siparişleri sıralama fonksiyonu
  const siralaSiparisler = (siparisListesi) => {
    return [...siparisListesi].sort((a, b) => {
      let karsilastirma = 0;
      
      switch (siralama.alan) {
        case 'siparisNo':
          karsilastirma = a.siparisNo.localeCompare(b.siparisNo);
          break;
        case 'siparisTarihi':
          karsilastirma = new Date(a.siparisTarihi) - new Date(b.siparisTarihi);
          break;
        case 'teslimTarihi':
          karsilastirma = new Date(a.teslimTarihi) - new Date(b.teslimTarihi);
          break;
        case 'gun':
          karsilastirma = a.gun - b.gun;
          break;
        case 'musteri':
          karsilastirma = a.musteri.localeCompare(b.musteri);
          break;
        case 'cariUnvan':
          karsilastirma = a.cariUnvan.localeCompare(b.cariUnvan);
          break;
        case 'kombinasyonAdi':
          karsilastirma = a.kombinasyonAdi.localeCompare(b.kombinasyonAdi);
          break;
        case 'toplamMiktar':
          karsilastirma = a.toplamMiktar - b.toplamMiktar;
          break;
        case 'adet':
          karsilastirma = a.adet - b.adet;
          break;  
        case 'oncelik':
          karsilastirma = a.oncelik - b.oncelik;
          break;
        default:
          // Varsayılan sıralama: önce öncelik, sonra oluşturma tarihi
          if (a.oncelik !== b.oncelik) {
            karsilastirma = a.oncelik - b.oncelik;
          } else {
            karsilastirma = new Date(a.olusturmaTarihi) - new Date(b.olusturmaTarihi);
          }
      }
      
      // Artan/azalan sıralama için çarpan
      return siralama.artan ? karsilastirma : -karsilastirma;
    });
  };

  // Tüm fabrika verilerini ve fonksiyonlarını değer olarak sağla
  const value = {
    istasyonlar,
    kombinasyonlar,
    siparisler,
    aktifGorunum,
    siralama,
    setAktifGorunum,
    siparisOlustur,
    iseBasla,
    isiBitir,
    istasyonSiparisleriGetir,
    siralamaDegistir,
    siralaSiparisler
  };

  return (
    <FabrikaContext.Provider value={value}>
      {children}
    </FabrikaContext.Provider>
  );
};

// Özel kanca
export const useFabrika = () => {
  const context = useContext(FabrikaContext);
  if (!context) {
    throw new Error('useFabrika must be used within a FabrikaProvider');
  }
  return context;
}; 