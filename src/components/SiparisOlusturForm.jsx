import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisOlusturForm = () => {
  const { istasyonlar, kombinasyonlar, siparisOlustur } = useFabrika();
  
  // Form alanları için state
  const [siparisAdi, setSiparisAdi] = useState('');
  const [siparisNo, setSiparisNo] = useState('');
  const [siparisTarihi, setSiparisTarihi] = useState(new Date().toISOString().split('T')[0]);
  const [teslimTarihi, setTeslimTarihi] = useState('');
  const [musteri, setMusteri] = useState('');
  const [cariUnvan, setCariUnvan] = useState('');
  const [kombinasyonId, setKombinasyonId] = useState('');
  const [toplamMiktar, setToplamMiktar] = useState('');
  const [oncelik, setOncelik] = useState('2'); // Varsayılan orta öncelik
  const [secilenIstasyonlar, setSecilenIstasyonlar] = useState([]);
  const [manuelIstasyonSecimi, setManuelIstasyonSecimi] = useState(false);
  
  // Form gönderme işleyicisi
  const formGonder = (e) => {
    e.preventDefault();
    
    if (!siparisAdi.trim() || !siparisNo.trim()) {
      alert('Lütfen sipariş adı ve numarası girin!');
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
    
    if (!kombinasyonId && secilenIstasyonlar.length === 0) {
      alert('Lütfen bir cam kombinasyonu seçin veya en az bir istasyon seçin!');
      return;
    }
    
    // Sipariş oluştur
    siparisOlustur({
      siparisAdi,
      siparisNo,
      siparisTarihi,
      teslimTarihi,
      musteri,
      cariUnvan,
      kombinasyonId: manuelIstasyonSecimi ? '' : kombinasyonId,
      toplamMiktar,
      oncelik,
      secilenIstasyonlar
    });
    
    // Formu sıfırla
    setSiparisAdi('');
    setSiparisNo('');
    setSiparisTarihi(new Date().toISOString().split('T')[0]);
    setTeslimTarihi('');
    setMusteri('');
    setCariUnvan('');
    setKombinasyonId('');
    setToplamMiktar('');
    setOncelik('2');
    setSecilenIstasyonlar([]);
    setManuelIstasyonSecimi(false);
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
  
  // Kombinasyon seçimi işleyicisi
  const kombinasyonSecimDegistir = (e) => {
    const seciliKombinasyonId = e.target.value;
    setKombinasyonId(seciliKombinasyonId);
    
    if (seciliKombinasyonId && !manuelIstasyonSecimi) {
      // Seçilen kombinasyona göre istasyonları otomatik seç
      const seciliKombinasyon = kombinasyonlar.find(k => k.id === seciliKombinasyonId);
      if (seciliKombinasyon) {
        setSecilenIstasyonlar(seciliKombinasyon.istasyonlar);
      }
    }
  };
  
  // Manuel istasyon seçimi işleyicisi
  const manuelSecimDegistir = (e) => {
    const yeniDurum = e.target.checked;
    setManuelIstasyonSecimi(yeniDurum);
    
    if (yeniDurum) {
      // Manuel seçime geçildiğinde, kombinasyonu temizle
      setKombinasyonId('');
    } else if (kombinasyonId) {
      // Manuel seçimden çıkılıp, bir kombinasyon seçiliyse istasyonları güncelle
      const seciliKombinasyon = kombinasyonlar.find(k => k.id === kombinasyonId);
      if (seciliKombinasyon) {
        setSecilenIstasyonlar(seciliKombinasyon.istasyonlar);
      }
    } else {
      // Manuel seçimden çıkılıp, kombinasyon seçili değilse istasyonları temizle
      setSecilenIstasyonlar([]);
    }
  };
  
  return (
    <div className="siparis-olustur-form">
      <h2>Yeni Sipariş Oluştur</h2>
      <form onSubmit={formGonder}>
        <div className="form-grup">
          <label htmlFor="siparisAdi">Sipariş Adı:</label>
          <input
            type="text"
            id="siparisAdi"
            value={siparisAdi}
            onChange={(e) => setSiparisAdi(e.target.value)}
            placeholder="Sipariş-101"
            required
          />
        </div>
        
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
          <select
            id="kombinasyon"
            value={kombinasyonId}
            onChange={kombinasyonSecimDegistir}
            disabled={manuelIstasyonSecimi}
          >
            <option value="">Seçiniz...</option>
            {kombinasyonlar.map(kombinasyon => (
              <option key={kombinasyon.id} value={kombinasyon.id}>
                {kombinasyon.name}
              </option>
            ))}
          </select>
          
          <div className="manuel-secim">
            <input
              type="checkbox"
              id="manuelSecim"
              checked={manuelIstasyonSecimi}
              onChange={manuelSecimDegistir}
            />
            <label htmlFor="manuelSecim">
              Manuel İstasyon Seçimi
            </label>
          </div>
        </div>
        
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
        
        {(manuelIstasyonSecimi || !kombinasyonId) && (
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
        )}
        
        <button type="submit" className="olustur-button">
          Sipariş Oluştur
        </button>
      </form>
    </div>
  );
};

export default SiparisOlusturForm; 