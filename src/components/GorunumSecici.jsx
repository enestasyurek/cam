import { useFabrika } from '../context/FabrikaContext';

const GorunumSecici = () => {
  const { istasyonlar, aktifGorunum, setAktifGorunum } = useFabrika();
  
  // Görünüm değiştirme işleyicisi
  const gorunumDegistir = (e) => {
    setAktifGorunum(e.target.value);
  };
  
  return (
    <div className="gorunum-secici">
      <label htmlFor="gorunum">Görünüm: </label>
      <select 
        id="gorunum" 
        value={aktifGorunum} 
        onChange={gorunumDegistir}
      >
        <option value="admin">Admin Görünümü</option>
        {istasyonlar.map(istasyon => (
          <option 
            key={istasyon.id} 
            value={`istasyon-${istasyon.id}`}
          >
            İstasyon: {istasyon.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default GorunumSecici; 