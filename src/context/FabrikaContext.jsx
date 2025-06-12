import { createContext, useState, useContext } from 'react';
import { useToast } from '../hooks/useToast';

// Fabrika bağlamını oluştur
const FabrikaContext = createContext();

// Bağlam sağlayıcı bileşeni
export const FabrikaProvider = ({ children }) => {
  const toast = useToast();
  // İstasyonlar için veri - A1 ve B1 için ayrı istasyonlar
  const [istasyonlar] = useState([
    // A1 Fabrikası İstasyonları
    { id: 'intermac-kesim-a1', name: 'Intermac Kesim', fabrika: 'A1', tip: 'kesim' },
    { id: 'tesir-taslama-a1', name: 'Tesir Taşlama', fabrika: 'A1', tip: 'taslama' },
    { id: 'double-edger-a1', name: 'Double Edger', fabrika: 'A1', tip: 'edger' },
    { id: 'cnc-cemil-a1', name: 'CNC (Cemil)', fabrika: 'A1', tip: 'cnc' },
    { id: 'cnc-abdullah-a1', name: 'CNC (Abdullah)', fabrika: 'A1', tip: 'cnc' },
    { id: 'boya-ipek-a1', name: 'Boya (İpek-Roller)', fabrika: 'A1', tip: 'boya' },
    { id: 'delik-a1', name: 'Delik', fabrika: 'A1', tip: 'delik' },
    { id: 'temper-244-a1', name: 'Temper (244x420)', fabrika: 'A1', tip: 'temper' },
    { id: 'on-laminasyon-a1', name: 'Ön Laminasyon', fabrika: 'A1', tip: 'laminasyon' },
    { id: 'yukleme-erol-a1', name: 'Yükleme (Erol)', fabrika: 'A1', tip: 'yukleme' },
    
    // B1 Fabrikası İstasyonları
    { id: 'liva-kesim-b1', name: 'Liva Kesim', fabrika: 'B1', tip: 'kesim' },
    { id: 'lamine-kesim-b1', name: 'Lamine Kesim', fabrika: 'B1', tip: 'kesim' },
    { id: 'tesir-taslama-1-b1', name: 'Tesir Taşlama 1', fabrika: 'B1', tip: 'taslama' },
    { id: 'tesir-taslama-2-b1', name: 'Tesir Taşlama 2', fabrika: 'B1', tip: 'taslama' },
    { id: 'tesir-dik-cnc-b1', name: 'Tesir Dik CNC', fabrika: 'B1', tip: 'cnc' },
    { id: 'temper-280-b1', name: 'Temper (280x600)', fabrika: 'B1', tip: 'temper' },
    { id: 'isicam-b1', name: 'Isıcam', fabrika: 'B1', tip: 'isicam' },
    { id: 'heat-soak-b1', name: 'Heat Soak', fabrika: 'B1', tip: 'heat-soak' },
    { id: 'yukleme-b1', name: 'Yükleme', fabrika: 'B1', tip: 'yukleme' }
  ]);


  // Siparişler için veri
  const [siparisler, setSiparisler] = useState([]);

  // Kırılan cam takibi için veri
  const [kirilanCamlar, setKirilanCamlar] = useState([]);

  // İstasyon sıra beklemeleri (queue) için veri
  const [istasyonKuyruklar, setIstasyonKuyruklar] = useState({});

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
      kombinasyonId,
      toplamMiktar,
      adet,
      oncelik,
      secilenIstasyonlar,
      fabrika
    } = siparisData;

    // Manuel istasyon seçimi - sıralı şekilde gelir
    let istasyonSirasi = secilenIstasyonlar || [];

    if (istasyonSirasi.length === 0) {
      toast.error('En az bir istasyon seçmelisiniz!');
      return;
    }

    const yeniSiparis = {
      id: Date.now().toString(),
      siparisNo,
      siparisTarihi,
      teslimTarihi,
      gun: hesaplaGunSayisi(siparisTarihi, teslimTarihi),
      musteri,
      projeAdi,
      camKombinasyonu,
      camTipi,
      fabrika: fabrika || 'A1',
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
    
    // İlk istasyonun kuyruğuna ekle
    if (istasyonSirasi.length > 0) {
      const ilkIstasyon = istasyonSirasi[0];
      setIstasyonKuyruklar(onceki => ({
        ...onceki,
        [ilkIstasyon]: [...(onceki[ilkIstasyon] || []), yeniSiparis.id]
      }));
    }
    
    toast.success(`Sipariş ${siparisNo} başarıyla oluşturuldu!`);
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

          // Mevcut istasyondan kuyruğu kaldır
          const mevcutIstasyon = siparis.istasyonSirasi[siparis.guncelIstasyonIndex];
          setIstasyonKuyruklar(onceki => {
            const yeniKuyruk = { ...onceki };
            if (yeniKuyruk[mevcutIstasyon]) {
              yeniKuyruk[mevcutIstasyon] = yeniKuyruk[mevcutIstasyon].filter(id => id !== siparisId);
            }
            return yeniKuyruk;
          });

          // Son istasyonda mıyız kontrol et
          const yeniIstasyonIndex = siparis.guncelIstasyonIndex + 1;
          const sonrakiDurum = yeniIstasyonIndex >= siparis.istasyonSirasi.length
            ? 'Tamamlandı'
            : 'Bekliyor';

          // Sonraki istasyona kuyruğa ekle
          if (sonrakiDurum !== 'Tamamlandı') {
            const sonrakiIstasyon = siparis.istasyonSirasi[yeniIstasyonIndex];
            setIstasyonKuyruklar(onceki => ({
              ...onceki,
              [sonrakiIstasyon]: [...(onceki[sonrakiIstasyon] || []), siparisId]
            }));
          }

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

  // Sipariş düzenleme fonksiyonu
  const siparisDuzenle = (siparisId, guncellenmisSiparis) => {
    setSiparisler(oncekiSiparisler => {
      return oncekiSiparisler.map(siparis => {
        if (siparis.id === siparisId) {
          return {
            ...siparis,
            ...guncellenmisSiparis,
            guncellemeTarihi: new Date().toISOString()
          };
        }
        return siparis;
      });
    });
  };

  // Kırılan cam bildirme fonksiyonu
  const kirilanCamBildir = (istasyonId, siparisId, adet, aciklama) => {
    const yeniKirilanCam = {
      id: Date.now().toString(),
      istasyonId,
      siparisId,
      adet: parseInt(adet),
      aciklama,
      tarih: new Date().toISOString()
    };

    setKirilanCamlar(onceki => [...onceki, yeniKirilanCam]);

    // Siparişin kırılan adet bilgisini güncelle (toplam adeti azaltmadan)
    setSiparisler(oncekiSiparisler => {
      return oncekiSiparisler.map(siparis => {
        if (siparis.id === siparisId) {
          return {
            ...siparis,
            kirilanAdet: (siparis.kirilanAdet || 0) + parseInt(adet)
          };
        }
        return siparis;
      });
    });
    
    toast.warning(`${adet} adet kırılan cam kaydedildi.`);
  };

  // Sipariş arama fonksiyonu
  const siparisAra = (aramaMetni) => {
    if (!aramaMetni) return siparisler;
    
    return siparisler.filter(siparis => 
      siparis.siparisNo.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      siparis.musteri.toLowerCase().includes(aramaMetni.toLowerCase()) ||
      siparis.cariUnvan.toLowerCase().includes(aramaMetni.toLowerCase())
    );
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
    siparisler,
    kirilanCamlar,
    istasyonKuyruklar,
    aktifGorunum,
    siralama,
    setAktifGorunum,
    siparisOlustur,
    siparisDuzenle,
    siparisAra,
    iseBasla,
    isiBitir,
    kirilanCamBildir,
    istasyonSiparisleriGetir,
    siralamaDegistir,
    siralaSiparisler,
    toast
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