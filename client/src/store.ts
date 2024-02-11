import { create } from 'zustand';
import { JwtPayload } from 'jsonwebtoken'

interface User {
    email: string;
    name: string;
    // Add other properties as needed
}

interface CommerceStore {
    token: User | null;
    setToken: (user: User | null) => void;
    decodedToken: JwtPayload | null;
    setDecodedToken: (decodedToken: JwtPayload | null) => void;

}


export const useCommerceStore = create<CommerceStore>((set) => ({
    token: null,
    setToken: (user) => set((state) => ({ token: user })),
    decodedToken: null,
    setDecodedToken: (decodedToken) => set({ decodedToken }),
}))