//const API_URL = "http://localhost:8000"; // Sesuaikan dengan backend
const API_URL = process.env.REACT_APP_API_URL;
console.log("Backend URL:", API_URL);

export async function fetchMahasiswa() {
  try {
    const response = await fetch("http://localhost:8000/data");
    if (!response.ok) {
      throw new Error("Gagal mengambil data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
    return [];
  }
}

export async function login(nama, nim) {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, nim }),
  });
  return response.json();
}

export async function signUp(nama, nim) {
  const response = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, nim }),
  });
  return response.json();
}

export async function addMahasiswa(nama, nim) {
  const response = await fetch(`${API_URL}/mahasiswa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, nim }),
  });
  return response.json();
}

export async function updateMahasiswa(id, nama, nim) {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nama, nim }),
  });
  return response.json();
}

export async function deleteMahasiswa(id) {
  const response = await fetch(`${API_URL}/mahasiswa/${id}`, {
    method: "DELETE",
  });
  return response.json();
}
