import type { Room } from "../interfaces/detail.interface";
import api from "./api";

export const roomApi = {
    // Lấy chi tiết phòng theo ID
    getRoomById: async (id: number): Promise<Room> => {
        try {
            const response = await api.get(`/phong-thue/${id}`);
            return response.data.content;
        } catch (error) {
            console.error('Error fetching room details:', error);
            throw error;
        }
    }
};