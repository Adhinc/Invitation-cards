import { useSearchParams, useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';
import type { EventType } from '../constants/events';

export function Component() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const eventType = params.get('event') as EventType | null;

  const handleComplete = (data: any) => {
    sessionStorage.setItem('inviteFormData', JSON.stringify(data));
    navigate('/templates', { state: { formData: data, eventType: data.eventType } });
  };

  return (
    <Chatbot
      eventType={eventType || undefined}
      onComplete={handleComplete}
    />
  );
}
