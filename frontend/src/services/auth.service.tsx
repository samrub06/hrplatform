
const API_URL = "http://localhost:3000/api"; // Assurez-vous que l'URL de l'API pointe vers le bon port

export const Register = async (values: any) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }
	const data = await response.json(); 
	return data;

};

export const Login = async (values: any) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }
	const data = await response.json(); 
	return data;

};