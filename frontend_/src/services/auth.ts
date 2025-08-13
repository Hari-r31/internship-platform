import api from './api';

// Login (you may already have a login endpoint)
export async function login(payload: { username: string; password: string }) {
  const { data } = await api.post('/api/token/', payload); // update if needed
  return data; // { access, refresh?, user }
}

// Register
export async function register(payload: any) {
  const { data } = await api.post('/register/', payload); // matches your URL
  return data;
}

// Get current user + profile
export async function getMe() {
  const { data } = await api.get('/me/'); // matches your URL
  return data;
}

// Patch only user fields
export async function patchMeUser(update: any) {
  const { data } = await api.patch('/me/user/', update); // matches your URL
  return data;
}

// Patch only profile fields (multipart for images)
export async function patchMeProfile(update: Record<string, any>) {
  const formData = new FormData();
  Object.entries(update).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });

  const { data } = await api.patch("/me/profile/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}

// Logout
export async function logout() {
  const { data } = await api.post('/api/logout/');
  return data;
}
