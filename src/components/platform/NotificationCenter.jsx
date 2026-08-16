import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, TriangleAlert, X } from 'lucide-react';

const icons = {
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
  error: AlertCircle,
};

export default function NotificationCenter() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const handleNotification = (event) => {
      const id = crypto.randomUUID();
      const notification = {
        id,
        type: event.detail?.type || 'info',
        title: event.detail?.title || 'Notice',
        message: event.detail?.message || '',
      };

      setItems((current) => [...current, notification].slice(-3));
      window.setTimeout(() => {
        setItems((current) => current.filter((item) => item.id !== id));
      }, 5500);
    };

    window.addEventListener('esg:notification', handleNotification);
    return () => window.removeEventListener('esg:notification', handleNotification);
  }, []);

  const dismiss = (id) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  if (!items.length) {
    return null;
  }

  return (
    <div className="notification-stack" role="status" aria-live="polite">
      {items.map((item) => {
        const Icon = icons[item.type] || Info;
        return (
          <div className={`notification-toast ${item.type}`} key={item.id}>
            <Icon size={20} />
            <div>
              <strong>{item.title}</strong>
              {item.message ? <p>{item.message}</p> : null}
            </div>
            <button type="button" aria-label="Dismiss notification" onClick={() => dismiss(item.id)}>
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
