import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export interface Application {
  id: string;
  user_id: string;
  role_title: string;
  company: string;
  status: string;
  salary: string | null;
  date_applied: string;
}

export function useUserApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setApplications([]);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('user_id', user.id)
        .order('date_applied', { ascending: false });
      if (error) {
        setApplications([]);
      } else {
        setApplications((data as Application[]) || []);
      }
      setLoading(false);
    };
    fetchApplications();
  }, []);

  return { applications, loading };
} 