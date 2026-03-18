const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// --- CUSTOMERS ---

export const getCustomers = async () => {
  try {
    const res = await fetch(`${BASE_URL}/customers`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return [];
  }
};

export const getCustomer = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/customers/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    return null;
  }
};

export const createCustomer = async (data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/customers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to create customer:", error);
    throw error;
  }
};

export const updateCustomer = async (id: string | number, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to update customer:", error);
    throw error;
  }
};

export const deleteCustomer = async (id: string | number) => {
  try {
    const res = await fetch(`${BASE_URL}/customers/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to delete customer:", error);
    throw error;
  }
};

// --- INVOICES ---

export const getInvoices = async () => {
  try {
    const res = await fetch(`${BASE_URL}/invoices`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch invoices:", error);
    return [];
  }
};

export const getInvoice = async (id: string) => {
  try {
    const res = await fetch(`${BASE_URL}/invoices/${id}`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const text = await res.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to fetch invoice:", error);
    return null;
  }
};

export const createInvoice = async (data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to create invoice:", error);
    throw error;
  }
};

export const updateInvoice = async (id: string | number, data: any) => {
  try {
    const res = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to update invoice:", error);
    throw error;
  }
};

export const deleteInvoice = async (id: string | number) => {
  try {
    const res = await fetch(`${BASE_URL}/invoices/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (error) {
    console.error("Failed to delete invoice:", error);
    throw error;
  }
};