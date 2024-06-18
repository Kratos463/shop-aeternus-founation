export const getConfig = (): { headers: { 'Content-Type': string; 'x-api-key': string; 'Authorization': string } } => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.API_KEY as string,
        'Authorization': token ? `Bearer ${token}` : ''
      }
    };
  };
  