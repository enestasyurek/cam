import { useFabrika } from '../context/FabrikaContext';

const GorunumSecici = () => {
  const { istasyonlar, aktifGorunum, setAktifGorunum } = useFabrika();
  
  const gorunumDegistir = (e) => {
    setAktifGorunum(e.target.value);
  };
  
  return (
    <div className="gorunum-secici">
      <h3>Görünüm Seçimi</h3>
      <select 
        id="gorunum" 
        value={aktifGorunum} 
        onChange={gorunumDegistir}
        aria-label="Görünüm seçimi"
      >
        <option value="admin">Admin Görünümü</option>
        <option value="rapor">📊 Rapor Sayfası</option>
        <optgroup label="A1 Fabrikası">
          {istasyonlar
            .filter(istasyon => istasyon.fabrika === 'A1')
            .map(istasyon => (
              <option 
                key={istasyon.id} 
                value={`istasyon-${istasyon.id}`}
              >
                {istasyon.name}
              </option>
            ))}
        </optgroup>
        <optgroup label="B1 Fabrikası">
          {istasyonlar
            .filter(istasyon => istasyon.fabrika === 'B1')
            .map(istasyon => (
              <option 
                key={istasyon.id} 
                value={`istasyon-${istasyon.id}`}
              >
                {istasyon.name}
              </option>
            ))}
        </optgroup>
      </select>
    </div>
  );
};

export default GorunumSecici;