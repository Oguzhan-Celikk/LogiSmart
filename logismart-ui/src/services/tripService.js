import axiosInstance from '../api/axiosInstance';

const tripService = {
    // Tüm seferleri getir (GET /api/trip)
    getAllTrips: async () => {
        const response = await axiosInstance.get('/trip');
        return response.data;
    },

    // (İleride kullanacağımız diğer metodlar buraya gelecek)
    
    
    // Sürücünün kendi seferlerini getir
    getMyTrips: async (driverId) => {
        const response = await axiosInstance.get(`/trip/my-trips/${driverId}`);
        return response.data;
    },

    // Sefer durumunu güncelle (Planned -> InTransit -> Delivered)
    updateTripStatus: async (id, newStatus) => {
        const response = await axiosInstance.patch(`/trip/${id}/status`, { status: newStatus });
        return response.data;
    }
};

export default tripService;