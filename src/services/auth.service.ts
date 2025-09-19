import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export async function register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) {
    return axios.post(`${API_URL}/register/user`, data);
}

export async function registerAgent(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    mobile?: string;
    companyName: string;
    address: string;
    city: string;
    logo?: string;
    description?: string;
}) {
    return axios.post(`${API_URL}/register/agent`, data);
}

export async function login(data: { email: string; password: string }) {
    return axios.post(`${API_URL}/login`, data);
}
