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
    { id: 'lamine', name: 'Lamine' },
    { id: 'montaj', name: 'Montaj' }
  ]);

  // Siparişler için veri
  const [siparisler, setSiparisler] = useState([]);

  // Aktif görünüm için durum (Admin veya İstasyon)
  const [aktifGorunum, setAktifGorunum] = useState('admin');

  // Yeni sipariş oluşturma fonksiyonu
  const siparisOlustur = (siparisAdi, oncelik, secilenIstasyonlar) => {
    const istasyonSirasi = istasyonlar
      .filter(istasyon => secilenIstasyonlar.includes(istasyon.id))
      .map(istasyon => istasyon.id);

    if (istasyonSirasi.length === 0) {
      alert('En az bir istasyon seçmelisiniz!');
      return;
    }

    const yeniSiparis = {
      id: Date.now().toString(),
      siparisAdi,
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

  // İstasyon için sipariş filtreleme fonksiyonu
  const istasyonSiparisleriGetir = (istasyonId) => {
    return siparisler
      .filter(siparis => {
        const istasyonSiraIndex = siparis.istasyonSirasi.indexOf(istasyonId);
        return istasyonSiraIndex === siparis.guncelIstasyonIndex && siparis.durum !== 'Tamamlandı';
      })
      .sort((a, b) => {
        // Önce önceliğe göre sırala (küçük öncelik değeri = yüksek öncelik)
        if (a.oncelik !== b.oncelik) return a.oncelik - b.oncelik;
        // Sonra oluşturma tarihine göre sırala (eski önce)
        return new Date(a.olusturmaTarihi) - new Date(b.olusturmaTarihi);
      });
  };

  // Tüm fabrika verilerini ve fonksiyonlarını değer olarak sağla
  const value = {
    istasyonlar,
    siparisler,
    aktifGorunum,
    setAktifGorunum,
    siparisOlustur,
    iseBasla,
    isiBitir,
    istasyonSiparisleriGetir
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