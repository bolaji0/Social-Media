import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase-client";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGitHub = () => {
        supabase.auth.signInWithOAuth({ provider: "github" });
    };

    const signOut = () => {
        supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGitHub, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return context;
};