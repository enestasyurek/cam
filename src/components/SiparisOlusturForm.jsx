import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisOlusturForm = () => {
  const { istasyonlar, siparisOlustur, toast } = useFabrika();
  
  const [siparisNo, setSiparisNo] = useState('');
  const [siparisTarihi, setSiparisTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [teslimTarihi, setTeslimTarihi] = useState('');
  const [musteri, setMusteri] = useState('');
  const [projeAdi, setProjeAdi] = useState('');
  const [camKombinasyonu, setCamKombinasyonu] = useState('');
  const [camTipi, setCamTipi] = useState('');
  const [fabrika, setFabrika] = useState('A1');
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
    
    if (!camTipi.trim()) {
      errors.push('Cam tipi zorunludur');
    }
    
    if (!camKombinasyonu.trim()) {
      errors.push('Cam kombinasyonu zorunludur');
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
    
    siparisOlustur({
      siparisNo,
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
      secilenIstasyonlar
    });
    
    setSiparisNo('');
    setSiparisTarihi(new Date().toISOString().split('T')[0]);
    setTeslimTarihi('');
    setMusteri('');
    setProjeAdi('');
    setCamKombinasyonu('');
    setCamTipi('');
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
          <label htmlFor="fabrika">Fabrika</label>
          <select
            id="fabrika"
            value={fabrika}
            onChange={(e) => setFabrika(e.target.value)}
          >
            <option value="A1">A1 Fabrikası</option>
            <option value="B1">B1 Fabrikası</option>
          </select>
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
          <input
            type="text"
            id="camTipi"
            value={camTipi}
            onChange={(e) => setCamTipi(e.target.value)}
            placeholder="Örn: Coolplus 62/44"
            required
          />
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