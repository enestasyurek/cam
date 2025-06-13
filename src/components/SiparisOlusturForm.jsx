import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisOlusturForm = () => {
  const { istasyonlar, siparisOlustur, toast } = useFabrika();
  
  const camTurleriA1 = [
    { kalinlik: '4 mm', tip: 'Bronz Ayna' },
    { kalinlik: '4 mm', tip: 'Düz Cam' },
    { kalinlik: '4 mm', tip: 'Füme Cam' },
    { kalinlik: '4 mm', tip: 'Low-E Cam' },
    { kalinlik: '4 mm', tip: 'Satina Cam' },
    { kalinlik: '4 mm', tip: 'Tentesol Füme Reflekte' },
    { kalinlik: '4 mm', tip: 'Ultra Clear Cam' },
    { kalinlik: '4 mm', tip: 'Yeşil Cam' },
    { kalinlik: '5 mm', tip: 'Düz Cam' },
    { kalinlik: '5 mm', tip: 'Nervürlü Cam' },
    { kalinlik: '6 mm', tip: 'AGC Planibel Clearlite-EX CLR' },
    { kalinlik: '6 mm', tip: 'AGC Ultra Clear' },
    { kalinlik: '6 mm', tip: 'Bronz Cam' },
    { kalinlik: '6 mm', tip: 'Düz Cam' },
    { kalinlik: '6 mm', tip: 'Füme Cam' },
    { kalinlik: '6 mm', tip: 'Mavi Cam' },
    { kalinlik: '6 mm', tip: 'Mısır Füme Reflekte' },
    { kalinlik: '6 mm', tip: 'Pilkington Mirropane' },
    { kalinlik: '6 mm', tip: 'Satina Cam' },
    { kalinlik: '6 mm', tip: 'Ultra Clear' },
    { kalinlik: '6 mm', tip: 'Yeşil Cam' },
    { kalinlik: '8 mm', tip: 'Düz Cam' },
    { kalinlik: '8 mm', tip: 'Füme Cam' },
    { kalinlik: '8 mm', tip: 'Satina Cam' },
    { kalinlik: '10 mm', tip: 'Düz Cam' },
    { kalinlik: '10 mm', tip: 'AGC Clear Vision' },
    { kalinlik: '10 mm', tip: 'Şişecam Extra Clear' },
    { kalinlik: '10 mm', tip: 'Ultra Clear' },
    { kalinlik: '12 mm', tip: 'Düz Cam' }
  ];
  
  const camTurleriB1 = [
    { kalinlik: '4 mm', tip: 'Coolplus 62/44' },
    { kalinlik: '4 mm', tip: 'Düz Cam' },
    { kalinlik: '4 mm', tip: 'Füme Cam' },
    { kalinlik: '4 mm', tip: 'Low-E Cam' },
    { kalinlik: '4 mm', tip: 'Termoplus 71/53' },
    { kalinlik: '5 mm', tip: 'Düz Cam' },
    { kalinlik: '6 mm', tip: 'Coolplus 50/33' },
    { kalinlik: '6 mm', tip: 'Coolplus 58/32' },
    { kalinlik: '6 mm', tip: 'Coolplus 62/44' },
    { kalinlik: '6 mm', tip: 'Coolplus 70/40' },
    { kalinlik: '6 mm', tip: 'Düz Cam' },
    { kalinlik: '6 mm', tip: 'Füme Reflekte' },
    { kalinlik: '6 mm', tip: 'Low-E Cam' },
    { kalinlik: '6 mm', tip: 'Mısır Füme Reflekte' },
    { kalinlik: '6 mm', tip: 'Solar Low-E' },
    { kalinlik: '6 mm', tip: 'Solar Low-E 70/37' },
    { kalinlik: '6 mm', tip: 'Solar Low-e Füme 31/28' },
    { kalinlik: '6 mm', tip: 'Sunguard SN 70/37 HT' },
    { kalinlik: '6 mm', tip: 'Tentesol Gümüş Reflekte' },
    { kalinlik: '6 mm', tip: 'Tentesol Yeşil Reflekte' },
    { kalinlik: '6 mm', tip: 'Yorsan Mavi Reflekte' },
    { kalinlik: '8 mm', tip: 'AGC Energy 65/42S' },
    { kalinlik: '8 mm', tip: 'Coolplus 43/28' },
    { kalinlik: '8 mm', tip: 'Coolplus 50/33' },
    { kalinlik: '8 mm', tip: 'Coolplus 62/44' },
    { kalinlik: '8 mm', tip: 'Düz Cam' },
    { kalinlik: '8 mm', tip: 'SNX 60 HT' },
    { kalinlik: '8 mm', tip: 'Sunguard SN 70/37 HT' },
    { kalinlik: '8 mm', tip: 'Guardian Solar Low-E SN51 HT' },
    { kalinlik: '4+4 0,38 mm', tip: 'Lamine Cam' },
    { kalinlik: '4+4 0,76 mm', tip: 'Lamine Cam' },
    { kalinlik: '4+4 0,76 mm', tip: 'Akustik Lamine Cam' },
    { kalinlik: '4+4 0,76 mm', tip: 'Opak Lamine Cam' },
    { kalinlik: '5+5 0,38 mm', tip: 'Lamine Cam' },
    { kalinlik: '5+5 0,76 mm', tip: 'Lamine Cam' },
    { kalinlik: '5+5 0,76 mm', tip: 'Akustik Lamine Cam' }
  ];
  
  const [siparisNo, setSiparisNo] = useState('');
  const [siparisTarihi, setSiparisTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [teslimTarihi, setTeslimTarihi] = useState('');
  const [musteri, setMusteri] = useState('');
  const [projeAdi, setProjeAdi] = useState('');
  const [camKombinasyonu, setCamKombinasyonu] = useState('');
  const [camTipi, setCamTipi] = useState('');
  const [fabrika, setFabrika] = useState('');
  const [secilenFabrikalar, setSecilenFabrikalar] = useState([]);
  const [toplamMiktar, setToplamMiktar] = useState('');
  const [adet, setAdet] = useState('');
  const [oncelik, setOncelik] = useState('2');
  const [secilenIstasyonlar, setSecilenIstasyonlar] = useState([]);
  
  const formGonder = (e) => {
    e.preventDefault();
    
    // Form validation
    const errors = [];
    
    if (!siparisNo.trim()) {
      errors.push('Sipariş numarası zorunludur');
    }
    
    if (!siparisTarihi) {
      errors.push('Sipariş tarihi zorunludur');
    }
    
    if (!teslimTarihi) {
      errors.push('Teslim tarihi zorunludur');
    }
    
    if (new Date(teslimTarihi) < new Date(siparisTarihi)) {
      errors.push('Teslim tarihi sipariş tarihinden önce olamaz');
    }
    
    if (!musteri.trim()) {
      errors.push('Müşteri adı zorunludur');
    }
    
    if (!camTipi) {
      errors.push('Cam tipi seçimi zorunludur');
    }
    
    if (!camKombinasyonu.trim()) {
      errors.push('Cam kombinasyonu zorunludur');
    }
    
    if (secilenFabrikalar.length === 0) {
      errors.push('En az bir fabrika seçmelisiniz');
    }
    
    if (secilenIstasyonlar.length === 0) {
      errors.push('En az bir istasyon seçmelisiniz');
    }
    
    if (!adet || parseInt(adet) <= 0) {
      errors.push('Adet sıfırdan büyük olmalıdır');
    }
    
    if (errors.length > 0) {
      toast.error(errors[0]); // Show the first error
      return;
    }
    
    secilenFabrikalar.forEach(fabrika => {
      siparisOlustur({
        siparisNo: secilenFabrikalar.length > 1 ? `${siparisNo}-${fabrika}` : siparisNo,
        siparisTarihi,
        teslimTarihi,
        musteri,
        projeAdi,
        camKombinasyonu,
        camTipi,
        fabrika,
        toplamMiktar,
        adet,
        oncelik,
        secilenIstasyonlar: secilenIstasyonlar.filter(istId => {
          const istasyon = istasyonlar.find(ist => ist.id === istId);
          return istasyon && istasyon.fabrika === fabrika;
        })
      });
    });
    
    setSiparisNo('');
    setSiparisTarihi(new Date().toISOString().split('T')[0]);
    setTeslimTarihi('');
    setMusteri('');
    setProjeAdi('');
    setCamKombinasyonu('');
    setCamTipi('');
    setFabrika('');
    setSecilenFabrikalar([]);
    setToplamMiktar('');
    setAdet('');
    setOncelik('2');
    setSecilenIstasyonlar([]);
  };
  
  const istasyonSecimDegistir = (istasyonId) => {
    setSecilenIstasyonlar(onceki => {
      if (onceki.includes(istasyonId)) {
        return onceki.filter(id => id !== istasyonId);
      } else {
        return [...onceki, istasyonId];
      }
    });
  };
  
  const istasyonYukariTasi = (index) => {
    if (index > 0) {
      const yeniSira = [...secilenIstasyonlar];
      [yeniSira[index - 1], yeniSira[index]] = [yeniSira[index], yeniSira[index - 1]];
      setSecilenIstasyonlar(yeniSira);
    }
  };
  
  const istasyonAsagiTasi = (index) => {
    if (index < secilenIstasyonlar.length - 1) {
      const yeniSira = [...secilenIstasyonlar];
      [yeniSira[index], yeniSira[index + 1]] = [yeniSira[index + 1], yeniSira[index]];
      setSecilenIstasyonlar(yeniSira);
    }
  };
  
  const istasyonSil = (istasyonId) => {
    setSecilenIstasyonlar(onceki => onceki.filter(id => id !== istasyonId));
  };
  
  return (
    <div className="siparis-olustur-form">
      <h2>Yeni Sipariş Oluştur</h2>
      <form onSubmit={formGonder}>
        <div className="form-grup">
          <label htmlFor="siparisNo">Sipariş No</label>
          <input
            type="text"
            id="siparisNo"
            value={siparisNo}
            onChange={(e) => setSiparisNo(e.target.value)}
            placeholder="S-2023-001"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-grup">
            <label htmlFor="siparisTarihi">Sipariş Tarihi</label>
            <input
              type="date"
              id="siparisTarihi"
              value={siparisTarihi}
              onChange={(e) => setSiparisTarihi(e.target.value)}
              required
            />
          </div>
          
          <div className="form-grup">
            <label htmlFor="teslimTarihi">Teslim Tarihi</label>
            <input
              type="date"
              id="teslimTarihi"
              value={teslimTarihi}
              onChange={(e) => setTeslimTarihi(e.target.value)}
              min={siparisTarihi}
              required
            />
          </div>
        </div>
        
        <div className="form-grup">
          <label htmlFor="musteri">Müşteri</label>
          <input
            type="text"
            id="musteri"
            value={musteri}
            onChange={(e) => setMusteri(e.target.value)}
            placeholder="Müşteri Adı"
            required
          />
        </div>
        
        <div className="form-grup">
          <label htmlFor="projeAdi">Proje</label>
          <input
            type="text"
            id="projeAdi"
            value={projeAdi}
            onChange={(e) => setProjeAdi(e.target.value)}
            placeholder="Proje Adı (Opsiyonel)"
          />
        </div>
        
        <div className="form-grup">
          <label>Fabrika Seçimi</label>
          <div className="fabrika-secim-container">
            <label className="fabrika-checkbox">
              <input
                type="checkbox"
                value="A1"
                checked={secilenFabrikalar.includes('A1')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSecilenFabrikalar([...secilenFabrikalar, 'A1']);
                  } else {
                    setSecilenFabrikalar(secilenFabrikalar.filter(f => f !== 'A1'));
                  }
                }}
              />
              <span>A1 Fabrikası</span>
            </label>
            <label className="fabrika-checkbox">
              <input
                type="checkbox"
                value="B1"
                checked={secilenFabrikalar.includes('B1')}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSecilenFabrikalar([...secilenFabrikalar, 'B1']);
                  } else {
                    setSecilenFabrikalar(secilenFabrikalar.filter(f => f !== 'B1'));
                  }
                }}
              />
              <span>B1 Fabrikası</span>
            </label>
          </div>
        </div>
        
        <div className="form-grup">
          <label htmlFor="camKombinasyonu">Cam Kombinasyonu</label>
          <input
            type="text"
            id="camKombinasyonu"
            value={camKombinasyonu}
            onChange={(e) => setCamKombinasyonu(e.target.value)}
            placeholder="Örn: 6+16+6"
            required
          />
        </div>
        
        <div className="form-grup">
          <label htmlFor="camTipi">Cam Tipi</label>
          <select
            id="camTipi"
            value={camTipi}
            onChange={(e) => setCamTipi(e.target.value)}
            required
            disabled={secilenFabrikalar.length === 0}
          >
            <option value="">Cam tipi seçin</option>
            {secilenFabrikalar.length > 0 && [
              ...(secilenFabrikalar.includes('A1') ? camTurleriA1.map((cam, index) => (
                <option key={`a1-${index}`} value={`${cam.kalinlik} ${cam.tip}`}>
                  A1 - {cam.kalinlik} {cam.tip}
                </option>
              )) : []),
              ...(secilenFabrikalar.includes('B1') ? camTurleriB1.map((cam, index) => (
                <option key={`b1-${index}`} value={`${cam.kalinlik} ${cam.tip}`}>
                  B1 - {cam.kalinlik} {cam.tip}
                </option>
              )) : [])
            ]}
          </select>
          {secilenFabrikalar.length === 0 && (
            <small className="form-help-text">Önce fabrika seçimi yapın</small>
          )}
        </div>
        
        <div className="form-row">
          <div className="form-grup">
            <label htmlFor="toplamMiktar">Toplam Miktar (m²)</label>
            <input
              type="number"
              id="toplamMiktar"
              value={toplamMiktar}
              onChange={(e) => setToplamMiktar(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          
          <div className="form-grup">
            <label htmlFor="adet">Adet</label>
            <input
              type="number"
              id="adet"
              value={adet}
              onChange={(e) => setAdet(e.target.value)}
              placeholder="0"
              step="1"
              min="0"
            />
          </div>
        </div>
        
        <div className="form-grup">
          <label htmlFor="oncelik">Öncelik</label>
          <select
            id="oncelik"
            value={oncelik}
            onChange={(e) => setOncelik(e.target.value)}
          >
            <option value="1">Yüksek</option>
            <option value="2">Orta</option>
            <option value="3">Düşük</option>
          </select>
        </div>
        
        <div className="form-grup">
          <label>İstasyon Rotası</label>
          <div className="istasyon-secenekleri">
            {secilenFabrikalar.length > 0 ? (
              secilenFabrikalar.map(fabrika => (
                <div key={fabrika} className="fabrika-istasyon-grup">
                  <h4>{fabrika} Fabrikası İstasyonları</h4>
                  {istasyonlar
                    .filter(istasyon => istasyon.fabrika === fabrika)
                    .map(istasyon => (
                <label key={istasyon.id} className="istasyon-secim">
                  <input
                    type="checkbox"
                    checked={secilenIstasyonlar.includes(istasyon.id)}
                    onChange={() => istasyonSecimDegistir(istasyon.id)}
                  />
                  <span>{istasyon.name}</span>
                </label>
              ))}
                </div>
              ))
            ) : (
              <p className="istasyon-uyari">Önce fabrika seçimi yapın</p>
            )}
          </div>
        </div>
        
        {secilenIstasyonlar.length > 0 && (
          <div className="form-grup">
            <label>İstasyon Sırası</label>
            <div className="istasyon-sirasi">
              {secilenIstasyonlar.map((istasyonId, index) => {
                const istasyon = istasyonlar.find(i => i.id === istasyonId);
                return (
                  <div key={istasyonId} className="istasyon-sira-item">
                    <span className="sira-no">{index + 1}</span>
                    <span className="istasyon-adi">{istasyon?.name}</span>
                    <div className="sira-butonlar">
                      <button
                        type="button"
                        className="sira-btn"
                        onClick={() => istasyonYukariTasi(index)}
                        disabled={index === 0}
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className="sira-btn"
                        onClick={() => istasyonAsagiTasi(index)}
                        disabled={index === secilenIstasyonlar.length - 1}
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className="sira-btn sil"
                        onClick={() => istasyonSil(istasyonId)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        <button type="submit" className="btn btn-success btn-lg">
          Sipariş Oluştur
        </button>
      </form>
    </div>
  );
};

export default SiparisOlusturForm;