const API_BASE_URL = "https://localhost:7258/api/currencytransactions";

export const buyCurrency = async (transactionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/buy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Alış işlemi başarısız oldu.');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const sellCurrency = async (transactionData) => {
    try {
        const response = await fetch(`${API_BASE_URL}/sell`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(transactionData),
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Satış işlemi başarısız oldu.');
        }

        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export const getTransactions = async () => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('İşlem geçmişi yüklenemedi.');
        }

        
        const text = await response.text();
        const data = text ? JSON.parse(text) : [];

        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
};