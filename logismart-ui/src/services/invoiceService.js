import axiosInstance from '../api/axiosInstance';

const invoiceService = {
    // Tüm faturaları getir
    getAllInvoices: async () => {
        const response = await axiosInstance.get('/invoice');
        return response.data;
    },

    // Sadece teslim edilmiş bir sefer için fatura oluştur
    createInvoice: async (invoiceData) => {
        const response = await axiosInstance.post('/invoice', invoiceData);
        return response.data;
    },

    // Faturayı "Ödendi" olarak işaretle
    markAsPaid: async (id) => {
        const response = await axiosInstance.patch(`/invoice/${id}/mark-paid`);
        return response.data;
    }
};

export default invoiceService;