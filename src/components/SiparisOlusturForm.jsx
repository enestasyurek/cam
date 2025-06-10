import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisOlusturForm = () => {
  const { istasyonlar, siparisOlustur } = useFabrika();
  
  // Form alanları için state
  const [siparisNo, setSiparisNo] = useState('');
  const [siparisTarihi, setSiparisTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [teslimTarihi, setTeslimTarihi] = useState('');
  const [musteri, setMusteri] = useState('');
  const [cariUnvan, setCariUnvan] = useState('');
  const [kombinasyonMetni, setKombinasyonMetni] = useState('');
  const [toplamMiktar, setToplamMiktar] = useState('');
  const [adet, setAdet] = useState('');
  const [oncelik, setOncelik] = useState('2'); // Varsayılan orta öncelik
  const [secilenIstasyonlar, setSecilenIstasyonlar] = useState([]);
  
  // Form gönderme işleyicisi
  const formGonder = (e) => {
    e.preventDefault();
    
    if (!siparisNo.trim()) {
      alert('Lütfen sipariş numarası girin!');
      return;
    }
    
    if (!siparisTarihi) {
      alert('Lütfen sipariş tarihini girin!');
      return;
    }
    
    if (!teslimTarihi) {
      alert('Lütfen teslim tarihini girin!');
      return;
    }
    
    if (!musteri.trim()) {
      alert('Lütfen müşteri adını girin!');
      return;
    }
    
    if (!kombinasyonMetni.trim()) {
      alert('Lütfen cam kombinasyonunu girin!');
      return;
    }
    
    if (secilenIstasyonlar.length === 0) {
      alert('Lütfen en az bir istasyon seçin!');
      return;
    }
    
    // Sipariş oluştur
    siparisOlustur({
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
    });
    
    // Formu sıfırla
    setSiparisNo('');
    setSiparisTarihi(new Date().toISOString().split('T')[0]);
    setTeslimTarihi('');
    setMusteri('');
    setCariUnvan('');
    setKombinasyonMetni('');
    setToplamMiktar('');
    setAdet('');
    setOncelik('2');
    setSecilenIstasyonlar([]);
  };
  
  // İstasyon seçimi işleyicisi
  const istasyonSecimDegistir = (istasyonId) => {
    setSecilenIstasyonlar(onceki => {
      if (onceki.includes(istasyonId)) {
        return onceki.filter(id => id !== istasyonId);
      } else {
        return [...onceki, istasyonId];
      }
    });
  };
  
  return (
    <div className="siparis-olustur-form">
      <h2>Yeni Sipariş Oluştur</h2>
      <form onSubmit={formGonder}>
        <div className="form-grup">
          <label htmlFor="siparisNo">Sipariş No:</label>
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
            <label htmlFor="siparisTarihi">Sipariş Tarihi:</label>
            <input
              type="date"
              id="siparisTarihi"
              value={siparisTarihi}
              onChange={(e) => setSiparisTarihi(e.target.value)}
              required
            />
          </div>
          
          <div className="form-grup">
            <label htmlFor="teslimTarihi">Teslim Tarihi:</label>
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
          <label htmlFor="musteri">Müşteri:</label>
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
          <label htmlFor="cariUnvan">Cari Ünvan:</label>
          <input
            type="text"
            id="cariUnvan"
            value={cariUnvan}
            onChange={(e) => setCariUnvan(e.target.value)}
            placeholder="Şirket Ünvanı"
          />
        </div>
        
        <div className="form-grup">
          <label htmlFor="kombinasyon">Cam Kombinasyonu:</label>
          <input
            type="text"
            id="kombinasyon"
            value={kombinasyonMetni}
            onChange={(e) => setKombinasyonMetni(e.target.value)}
            placeholder="Örn: 6 mm Coolplus 62/44"
            required
          />
        </div>
        
        <div className="form-row">
          <div className="form-grup">
            <label htmlFor="toplamMiktar">Toplam Miktar (m²):</label>
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
            <label htmlFor="adet">Adet:</label>
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
          <label htmlFor="oncelik">Öncelik:</label>
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
          <label>İstasyonlar:</label>
          <div className="istasyon-secenekleri">
            {istasyonlar.map(istasyon => (
              <div key={istasyon.id} className="istasyon-secim">
                <input
                  type="checkbox"
                  id={`istasyon-${istasyon.id}`}
                  checked={secilenIstasyonlar.includes(istasyon.id)}
                  onChange={() => istasyonSecimDegistir(istasyon.id)}
                />
                <label htmlFor={`istasyon-${istasyon.id}`}>
                  {istasyon.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <button type="submit" className="olustur-button">
          Sipariş Oluştur
        </button>
      </form>
    </div>
  );
};

export default SiparisOlusturForm; 