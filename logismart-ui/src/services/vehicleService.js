import axiosInstance from '../api/axiosInstance';

const vehicleService = {
    // Sadece uygun/boşta olan araçları getir
    getAvailableVehicles: async () => {
        const response = await axiosInstance.get('/vehicle/available');
        return response.data;
    }
};

export default vehicleService;