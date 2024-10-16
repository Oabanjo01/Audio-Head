import axios from "axios";

// just to avoid circular dependency warnings
export const instance = axios.create({
  baseURL: "http://192.168.0.168:8000/", // house wifi
});

export const refreshInstance = axios.create({
  baseURL: "http://192.168.0.168:8000/",
});

// baseURL: "http://localhost/",
// baseURL: "http://192.168.1.168:8000/", // shaks wifi
// baseURL: "http://10.128.59.200:8000/", // office wifi
