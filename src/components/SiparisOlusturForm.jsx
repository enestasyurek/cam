import { useState } from 'react';
import { useFabrika } from '../context/FabrikaContext';

const SiparisOlusturForm = () => {
  const { istasyonlar, siparisOlustur } = useFabrika();
  
  // Form alanları için state
  const [siparisAdi, setSiparisAdi] = useState('');
  const [oncelik, setOncelik] = useState('2'); // Varsayılan orta öncelik
  const [secilenIstasyonlar, setSecilenIstasyonlar] = useState([]);
  
  // Form gönderme işleyicisi
  const formGonder = (e) => {
    e.preventDefault();
    
    if (!siparisAdi.trim()) {
      alert('Lütfen bir sipariş adı girin!');
      return;
    }
    
    if (secilenIstasyonlar.length === 0) {
      alert('Lütfen en az bir istasyon seçin!');
      return;
    }
    
    // Sipariş oluştur
    siparisOlustur(siparisAdi, oncelik, secilenIstasyonlar);
    
    // Formu sıfırla
    setSiparisAdi('');
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