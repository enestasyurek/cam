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


  // Sunum modu durumu
  const [sunumModu, setSunumModu] = useState(false);

  // Siparişler için veri - Zengin demo siparişler ile başlat
  const [siparisler, setSiparisler] = useState([
    // A1 Fabrikası Siparişleri
    {
      id: 'demo-1',
      siparisNo: 'S-2024-001',
      siparisTarihi: '2024-12-10',
      teslimTarihi: '2024-12-20',
      gun: 10,
      musteri: 'Anadolu İnşaat A.Ş.',
      projeAdi: 'Levent Towers Projesi',
      camKombinasyonu: '6+16+6',
      camTipi: 'Coolplus 62/44',
      fabrika: 'A1',
      toplamMiktar: 156.5,
      adet: 48,
      oncelik: 1,
      olusturmaTarihi: new Date().toISOString(),
      istasyonSirasi: ['intermac-kesim-a1', 'tesir-taslama-a1', 'cnc-cemil-a1', 'temper-244-a1'],
      guncelIstasyonIndex: 0,
      durum: 'Bekliyor',
      gecmis: [
        { istasyonId: 'intermac-kesim-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'tesir-taslama-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'cnc-cemil-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'temper-244-a1', baslamaSaati: null, bitisSaati: null }
      ]
    },
    {
      id: 'demo-2',
      siparisNo: 'S-2024-002',
      siparisTarihi: '2024-12-11',
      teslimTarihi: '2024-12-25',
      gun: 14,
      musteri: 'Ege Yapı Ltd. Şti.',
      projeAdi: 'Marina Residence',
      camKombinasyonu: '4+12+4',
      camTipi: 'Guardian Sun',
      fabrika: 'A1',
      toplamMiktar: 89.3,
      adet: 24,
      oncelik: 2,
      olusturmaTarihi: new Date().toISOString(),
      istasyonSirasi: ['intermac-kesim-a1', 'double-edger-a1', 'temper-244-a1'],
      guncelIstasyonIndex: 1,
      durum: 'İşlemde',
      gecmis: [
        { istasyonId: 'intermac-kesim-a1', baslamaSaati: new Date(Date.now() - 3600000).toISOString(), bitisSaati: new Date(Date.now() - 1800000).toISOString() },
        { istasyonId: 'double-edger-a1', baslamaSaati: new Date(Date.now() - 1800000).toISOString(), bitisSaati: null },
        { istasyonId: 'temper-244-a1', baslamaSaati: null, bitisSaati: null }
      ]
    },
    {
      id: 'demo-3',
      siparisNo: 'S-2024-003',
      siparisTarihi: '2024-12-12',
      teslimTarihi: '2024-12-22',
      gun: 10,
      musteri: 'Modern Cam Sistemleri',
      projeAdi: 'Ofis Plaza Renovasyon',
      camKombinasyonu: '8+16+8',
      camTipi: 'Low-E Neutral',
      fabrika: 'A1',
      toplamMiktar: 234.7,
      adet: 65,
      oncelik: 1,
      olusturmaTarihi: new Date(Date.now() - 86400000).toISOString(),
      istasyonSirasi: ['intermac-kesim-a1', 'tesir-taslama-a1', 'delik-a1', 'temper-244-a1', 'on-laminasyon-a1'],
      guncelIstasyonIndex: 2,
      durum: 'İşlemde',
      gecmis: [
        { istasyonId: 'intermac-kesim-a1', baslamaSaati: new Date(Date.now() - 7200000).toISOString(), bitisSaati: new Date(Date.now() - 5400000).toISOString() },
        { istasyonId: 'tesir-taslama-a1', baslamaSaati: new Date(Date.now() - 5400000).toISOString(), bitisSaati: new Date(Date.now() - 3600000).toISOString() },
        { istasyonId: 'delik-a1', baslamaSaati: new Date(Date.now() - 600000).toISOString(), bitisSaati: null },
        { istasyonId: 'temper-244-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'on-laminasyon-a1', baslamaSaati: null, bitisSaati: null }
      ]
    },
    {
      id: 'demo-4',
      siparisNo: 'S-2024-004',
      siparisTarihi: '2024-12-13',
      teslimTarihi: '2024-12-28',
      gun: 15,
      musteri: 'Kristal Cam San. A.Ş.',
      projeAdi: 'Showroom Vitrini',
      camKombinasyonu: '10+12+10',
      camTipi: 'Guardian Clarity',
      fabrika: 'A1',
      toplamMiktar: 45.2,
      adet: 12,
      oncelik: 3,
      olusturmaTarihi: new Date(Date.now() - 172800000).toISOString(),
      istasyonSirasi: ['intermac-kesim-a1', 'cnc-abdullah-a1', 'boya-ipek-a1', 'temper-244-a1'],
      guncelIstasyonIndex: 0,
      durum: 'Bekliyor',
      gecmis: [
        { istasyonId: 'intermac-kesim-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'cnc-abdullah-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'boya-ipek-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'temper-244-a1', baslamaSaati: null, bitisSaati: null }
      ]
    },
    {
      id: 'demo-5',
      siparisNo: 'S-2024-005-YDK',
      siparisTarihi: '2024-12-14',
      teslimTarihi: '2024-12-24',
      gun: 10,
      musteri: 'Anadolu İnşaat A.Ş.',
      projeAdi: 'Levent Towers Projesi',
      camKombinasyonu: '6+16+6',
      camTipi: 'Coolplus 62/44',
      fabrika: 'A1',
      toplamMiktar: 13.5,
      adet: 4,
      oncelik: 1,
      olusturmaTarihi: new Date(Date.now() - 3600000).toISOString(),
      istasyonSirasi: ['intermac-kesim-a1', 'tesir-taslama-a1', 'cnc-cemil-a1', 'temper-244-a1'],
      guncelIstasyonIndex: 0,
      durum: 'Bekliyor',
      gecmis: [
        { istasyonId: 'intermac-kesim-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'tesir-taslama-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'cnc-cemil-a1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'temper-244-a1', baslamaSaati: null, bitisSaati: null }
      ],
      yedekSiparis: true,
      orijinalSiparisId: 'demo-1',
      kirilanAdet: 0
    },
    // B1 Fabrikası Siparişleri
    {
      id: 'demo-6',
      siparisNo: 'S-2024-006',
      siparisTarihi: '2024-12-10',
      teslimTarihi: '2024-12-18',
      gun: 8,
      musteri: 'Marmara Yapı Grubu',
      projeAdi: 'Business Center',
      camKombinasyonu: '5+12+5+12+5',
      camTipi: 'Guardian ClimaGuard',
      fabrika: 'B1',
      toplamMiktar: 312.8,
      adet: 85,
      oncelik: 1,
      olusturmaTarihi: new Date(Date.now() - 259200000).toISOString(),
      istasyonSirasi: ['liva-kesim-b1', 'tesir-taslama-1-b1', 'isicam-b1', 'temper-280-b1'],
      guncelIstasyonIndex: 3,
      durum: 'İşlemde',
      gecmis: [
        { istasyonId: 'liva-kesim-b1', baslamaSaati: new Date(Date.now() - 259200000).toISOString(), bitisSaati: new Date(Date.now() - 172800000).toISOString() },
        { istasyonId: 'tesir-taslama-1-b1', baslamaSaati: new Date(Date.now() - 172800000).toISOString(), bitisSaati: new Date(Date.now() - 86400000).toISOString() },
        { istasyonId: 'isicam-b1', baslamaSaati: new Date(Date.now() - 86400000).toISOString(), bitisSaati: new Date(Date.now() - 7200000).toISOString() },
        { istasyonId: 'temper-280-b1', baslamaSaati: new Date(Date.now() - 3600000).toISOString(), bitisSaati: null }
      ]
    },
    {
      id: 'demo-7',
      siparisNo: 'S-2024-007',
      siparisTarihi: '2024-12-11',
      teslimTarihi: '2024-12-21',
      gun: 10,
      musteri: 'İstanbul Cephe Ltd.',
      projeAdi: 'Rezidans Projesi',
      camKombinasyonu: '6.38+16+6.38',
      camTipi: 'Lamine Heat Soak',
      fabrika: 'B1',
      toplamMiktar: 178.5,
      adet: 42,
      oncelik: 2,
      olusturmaTarihi: new Date(Date.now() - 172800000).toISOString(),
      istasyonSirasi: ['lamine-kesim-b1', 'tesir-taslama-2-b1', 'heat-soak-b1', 'yukleme-b1'],
      guncelIstasyonIndex: 1,
      durum: 'İşlemde',
      gecmis: [
        { istasyonId: 'lamine-kesim-b1', baslamaSaati: new Date(Date.now() - 14400000).toISOString(), bitisSaati: new Date(Date.now() - 10800000).toISOString() },
        { istasyonId: 'tesir-taslama-2-b1', baslamaSaati: new Date(Date.now() - 900000).toISOString(), bitisSaati: null },
        { istasyonId: 'heat-soak-b1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'yukleme-b1', baslamaSaati: null, bitisSaati: null }
      ]
    },
    {
      id: 'demo-8',
      siparisNo: 'S-2024-008',
      siparisTarihi: '2024-12-12',
      teslimTarihi: '2024-12-19',
      gun: 7,
      musteri: 'Akdeniz Cam San.',
      projeAdi: 'Otel Renovasyon',
      camKombinasyonu: '4+16+4',
      camTipi: 'Guardian Solar',
      fabrika: 'B1',
      toplamMiktar: 98.7,
      adet: 28,
      oncelik: 1,
      olusturmaTarihi: new Date(Date.now() - 86400000).toISOString(),
      istasyonSirasi: ['liva-kesim-b1', 'tesir-dik-cnc-b1', 'temper-280-b1'],
      guncelIstasyonIndex: 0,
      durum: 'Bekliyor',
      gecmis: [
        { istasyonId: 'liva-kesim-b1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'tesir-dik-cnc-b1', baslamaSaati: null, bitisSaati: null },
        { istasyonId: 'temper-280-b1', baslamaSaati: null, bitisSaati: null }
      ]
    },
    // Tamamlanmış Sipariş Örneği
    {
      id: 'demo-9',
      siparisNo: 'S-2024-009',
      siparisTarihi: '2024-12-01',
      teslimTarihi: '2024-12-10',
      gun: 9,
      musteri: 'Elit Cam Sistemleri',
      projeAdi: 'Villa Projesi',
      camKombinasyonu: '8+12+8',
      camTipi: 'Guardian ExtraClear',
      fabrika: 'A1',
      toplamMiktar: 67.4,
      adet: 18,
      oncelik: 2,
      olusturmaTarihi: new Date(Date.now() - 864000000).toISOString(),
      istasyonSirasi: ['intermac-kesim-a1', 'double-edger-a1', 'temper-244-a1', 'yukleme-erol-a1'],
      guncelIstasyonIndex: 4,
      durum: 'Tamamlandı',
      gecmis: [
        { istasyonId: 'intermac-kesim-a1', baslamaSaati: new Date(Date.now() - 864000000).toISOString(), bitisSaati: new Date(Date.now() - 777600000).toISOString() },
        { istasyonId: 'double-edger-a1', baslamaSaati: new Date(Date.now() - 777600000).toISOString(), bitisSaati: new Date(Date.now() - 691200000).toISOString() },
        { istasyonId: 'temper-244-a1', baslamaSaati: new Date(Date.now() - 691200000).toISOString(), bitisSaati: new Date(Date.now() - 604800000).toISOString() },
        { istasyonId: 'yukleme-erol-a1', baslamaSaati: new Date(Date.now() - 604800000).toISOString(), bitisSaati: new Date(Date.now() - 518400000).toISOString() }
      ]
    }
  ]);

  // Kırılan cam takibi için veri - Demo verilerle başlat
  const [kirilanCamlar, setKirilanCamlar] = useState([
    {
      id: 'kirilan-1',
      istasyonId: 'cnc-cemil-a1',
      siparisId: 'demo-1',
      adet: 4,
      aciklama: 'Poz 3-4: CNC işlemi sırasında kenarda çatlak oluştu',
      tarih: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'kirilan-2',
      istasyonId: 'temper-280-b1',
      siparisId: 'demo-6',
      adet: 2,
      aciklama: 'Poz 12: Temper fırınında termal stres nedeniyle kırıldı',
      tarih: new Date(Date.now() - 7200000).toISOString()
    }
  ]);

  // İstasyon sıra beklemeleri (queue) için veri - Demo siparişler ile başlat
  const [istasyonKuyruklar, setIstasyonKuyruklar] = useState({
    'intermac-kesim-a1': ['demo-1', 'demo-4', 'demo-5'],
    'double-edger-a1': ['demo-2'],
    'delik-a1': ['demo-3'],
    'liva-kesim-b1': ['demo-8'],
    'tesir-taslama-2-b1': ['demo-7'],
    'temper-280-b1': ['demo-6']
  });

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
      projeAdi: siparisData.projeAdi || '',
      camKombinasyonu: siparisData.camKombinasyonu || '',
      camTipi: siparisData.camTipi || '',
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
    const kirilanAdet = parseInt(adet);
    
    // Kırılan cam kaydını oluştur
    const yeniKirilanCam = {
      id: Date.now().toString(),
      istasyonId,
      siparisId,
      adet: kirilanAdet,
      aciklama,
      tarih: new Date().toISOString()
    };

    setKirilanCamlar(onceki => [...onceki, yeniKirilanCam]);

    // Orijinal siparişi bul
    const orijinalSiparis = siparisler.find(s => s.id === siparisId);
    if (!orijinalSiparis) {
      toast.error('Sipariş bulunamadı!');
      return;
    }

    // Yeni yedek sipariş oluştur
    const yedekSiparisId = `${Date.now()}-yedek`;
    const yedekSiparis = {
      ...orijinalSiparis,
      id: yedekSiparisId,
      siparisNo: `${orijinalSiparis.siparisNo}-YDK`,
      adet: kirilanAdet,
      toplamMiktar: (orijinalSiparis.toplamMiktar / orijinalSiparis.adet) * kirilanAdet, // Birim miktar * yeni adet
      kirilanAdet: 0, // Yeni sipariş kırık ile başlamaz
      olusturmaTarihi: new Date().toISOString(),
      guncelIstasyonIndex: 0, // İlk istasyondan başla
      durum: 'Bekliyor',
      gecmis: orijinalSiparis.istasyonSirasi.map(istasyonId => ({
        istasyonId,
        baslamaSaati: null,
        bitisSaati: null
      })),
      yedekSiparis: true, // Yedek sipariş olduğunu belirt
      orijinalSiparisId: siparisId // Hangi siparişin yedeği olduğunu belirt
    };

    // Siparişleri güncelle: orijinali güncelle ve yedek ekle
    setSiparisler(oncekiSiparisler => {
      const guncelSiparisler = oncekiSiparisler.map(siparis => {
        if (siparis.id === siparisId) {
          return {
            ...siparis,
            kirilanAdet: (siparis.kirilanAdet || 0) + kirilanAdet
          };
        }
        return siparis;
      });
      
      // Yedek siparişi listeye ekle
      return [...guncelSiparisler, yedekSiparis];
    });

    // Yedek siparişi ilk istasyonun kuyruğuna ekle
    if (orijinalSiparis.istasyonSirasi.length > 0) {
      const ilkIstasyon = orijinalSiparis.istasyonSirasi[0];
      setIstasyonKuyruklar(onceki => ({
        ...onceki,
        [ilkIstasyon]: [...(onceki[ilkIstasyon] || []), yedekSiparisId]
      }));
    }
    
    toast.warning(`${kirilanAdet} adet kırılan cam kaydedildi.`);
    toast.success(`Yedek sipariş oluşturuldu: ${yedekSiparis.siparisNo}`);
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

  // SUNUM MODU FONKSİYONLARI
  
  // Hızlı demo sipariş oluşturma
  const demoSiparisEkle = () => {
    const musteriler = [
      'Arı İnşaat A.Ş.', 'Beyaz Yapı Ltd.', 'Cevher Mühendislik', 'Doğuş Cam San.',
      'Efe Cephe Sistemleri', 'Fırat Yapı Grubu', 'Güneş İnşaat', 'Hilal Cam Tic.',
      'İpek Yapı Malz.', 'Kardeşler İnşaat', 'Mavi Cam Sistemleri', 'Nur İnşaat Ltd.'
    ];
    
    const projeler = [
      'Rezidans Projesi', 'Plaza İnşaatı', 'AVM Cephe Yenileme', 'Otel Renovasyon',
      'Hastane Projesi', 'Okul İnşaatı', 'Fabrika Binası', 'Ofis Projesi',
      'Kültür Merkezi', 'Spor Kompleksi', 'Alışveriş Merkezi', 'Konut Projesi'
    ];
    
    const a1CamTipleri = [
      'Coolplus 62/44', 'Guardian Sun', 'Low-E Neutral', 'Guardian Clarity',
      'Guardian Solar', 'Guardian ExtraClear', 'Guardian ClimaGuard'
    ];
    
    const b1CamTipleri = [
      'Guardian ClimaGuard', 'Lamine Heat Soak', 'Guardian Solar',
      'Double Silver', 'Triple Silver', 'Solar Control'
    ];
    
    const kombinasyonlar = ['4+12+4', '4+16+4', '5+12+5', '6+16+6', '8+16+8', '10+12+10', '5+12+5+12+5', '6.38+16+6.38'];
    
    const fabrika = Math.random() > 0.5 ? 'A1' : 'B1';
    const siparisNo = `S-2024-${String(siparisler.length + 1001).padStart(3, '0')}`;
    const gun = Math.floor(Math.random() * 20) + 5;
    const adet = Math.floor(Math.random() * 80) + 10;
    
    // Fabrikaya göre istasyon seçimi
    let secilenIstasyonlar = [];
    if (fabrika === 'A1') {
      const a1Rotalar = [
        ['intermac-kesim-a1', 'tesir-taslama-a1', 'temper-244-a1'],
        ['intermac-kesim-a1', 'double-edger-a1', 'cnc-cemil-a1', 'temper-244-a1'],
        ['intermac-kesim-a1', 'cnc-abdullah-a1', 'boya-ipek-a1', 'temper-244-a1'],
        ['intermac-kesim-a1', 'tesir-taslama-a1', 'delik-a1', 'on-laminasyon-a1'],
        ['intermac-kesim-a1', 'double-edger-a1', 'temper-244-a1', 'yukleme-erol-a1']
      ];
      secilenIstasyonlar = a1Rotalar[Math.floor(Math.random() * a1Rotalar.length)];
    } else {
      const b1Rotalar = [
        ['liva-kesim-b1', 'tesir-taslama-1-b1', 'temper-280-b1'],
        ['liva-kesim-b1', 'tesir-taslama-2-b1', 'isicam-b1', 'yukleme-b1'],
        ['lamine-kesim-b1', 'tesir-dik-cnc-b1', 'heat-soak-b1'],
        ['liva-kesim-b1', 'tesir-taslama-1-b1', 'isicam-b1', 'temper-280-b1']
      ];
      secilenIstasyonlar = b1Rotalar[Math.floor(Math.random() * b1Rotalar.length)];
    }
    
    const siparisData = {
      siparisNo,
      siparisTarihi: new Date().toISOString().split('T')[0],
      teslimTarihi: new Date(Date.now() + gun * 86400000).toISOString().split('T')[0],
      musteri: musteriler[Math.floor(Math.random() * musteriler.length)],
      projeAdi: projeler[Math.floor(Math.random() * projeler.length)],
      camKombinasyonu: kombinasyonlar[Math.floor(Math.random() * kombinasyonlar.length)],
      camTipi: fabrika === 'A1' 
        ? a1CamTipleri[Math.floor(Math.random() * a1CamTipleri.length)]
        : b1CamTipleri[Math.floor(Math.random() * b1CamTipleri.length)],
      fabrika,
      toplamMiktar: (Math.random() * 300 + 50).toFixed(1),
      adet,
      oncelik: Math.floor(Math.random() * 3) + 1,
      secilenIstasyonlar
    };
    
    siparisOlustur(siparisData);
  };
  
  // Rastgele sipariş ilerletme (sunum için)
  const rastgeleSiparisIlerlet = () => {
    const bekleyenVeyaIslemdekiler = siparisler.filter(s => 
      s.durum === 'Bekliyor' || s.durum === 'İşlemde'
    );
    
    if (bekleyenVeyaIslemdekiler.length === 0) {
      toast.info('Hareket ettirilecek sipariş yok');
      return;
    }
    
    const rastgeleSiparis = bekleyenVeyaIslemdekiler[
      Math.floor(Math.random() * bekleyenVeyaIslemdekiler.length)
    ];
    
    if (rastgeleSiparis.durum === 'Bekliyor') {
      iseBasla(rastgeleSiparis.id);
      toast.success(`${rastgeleSiparis.siparisNo} işleme başladı`);
    } else {
      isiBitir(rastgeleSiparis.id);
      const yeniIndex = rastgeleSiparis.guncelIstasyonIndex + 1;
      const tamamlandi = yeniIndex >= rastgeleSiparis.istasyonSirasi.length;
      
      if (tamamlandi) {
        toast.success(`${rastgeleSiparis.siparisNo} tamamlandı!`);
      } else {
        const sonrakiIstasyon = istasyonlar.find(
          ist => ist.id === rastgeleSiparis.istasyonSirasi[yeniIndex]
        );
        toast.info(`${rastgeleSiparis.siparisNo} ${sonrakiIstasyon?.name} istasyonuna geçti`);
      }
    }
  };
  
  // Rastgele kırılan cam ekleme
  const rastgeleKirilanCamEkle = () => {
    const islemdekiler = siparisler.filter(s => s.durum === 'İşlemde');
    
    if (islemdekiler.length === 0) {
      toast.warning('İşlemde sipariş yok');
      return;
    }
    
    const siparis = islemdekiler[Math.floor(Math.random() * islemdekiler.length)];
    const mevcutIstasyonId = siparis.istasyonSirasi[siparis.guncelIstasyonIndex];
    const kirilanAdet = Math.min(Math.floor(Math.random() * 3) + 1, siparis.adet - (siparis.kirilanAdet || 0));
    
    const aciklamalar = [
      'Termal stres nedeniyle kırıldı',
      'İşleme sırasında çatlak oluştu',
      'Kenarda kırık tespit edildi',
      'Ebat hatası nedeniyle kırıldı',
      'Taşıma sırasında hasar gördü'
    ];
    
    kirilanCamBildir(
      mevcutIstasyonId,
      siparis.id,
      kirilanAdet,
      `Poz ${Math.floor(Math.random() * siparis.adet) + 1}: ${aciklamalar[Math.floor(Math.random() * aciklamalar.length)]}`
    );
  };

  // Tüm fabrika verilerini ve fonksiyonlarını değer olarak sağla
  const value = {
    istasyonlar,
    siparisler,
    kirilanCamlar,
    istasyonKuyruklar,
    aktifGorunum,
    siralama,
    sunumModu,
    setSunumModu,
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
    // Sunum fonksiyonları
    demoSiparisEkle,
    rastgeleSiparisIlerlet,
    rastgeleKirilanCamEkle,
    toast,
    toasts: toast.toasts,
    removeToast: toast.removeToast
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