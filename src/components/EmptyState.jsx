const EmptyState = ({ 
  title = 'Veri Bulunamadı', 
  message = 'Henüz görüntülenecek veri yok.',
  icon = '📋',
  action = null 
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && (
        <button className="btn btn-primary" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;