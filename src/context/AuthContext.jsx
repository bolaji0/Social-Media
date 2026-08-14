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

    const signUpWithEmail = (email, password) => {
        const { data, error } = supabase.auth.signUp({
        email: email,
        password: password,
        options: {
        emailRedirectTo: 'https://localhost:5173',
        }
        })
    };

    const signInWithEmail = (email, password) => {
        const { data, error } = supabase.auth.signInWithPassword({
        email: email,
        password: password,
    })
    };

    const signOut = () => {
        supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, signInWithGitHub, signOut, signInWithEmail, signUpWithEmail }}>
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