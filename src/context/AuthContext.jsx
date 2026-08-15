import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../supabase-client";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Added missing loading state

    useEffect(() => {
        // Check current session on mount
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        // Listen for authentication changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signInWithGitHub = async () => {
        setIsLoading(true);
        const { data, error } = await supabase.auth.signInWithOAuth({ provider: "github" });
        setIsLoading(false);
        return { data, error };
    };

    const signUpWithEmail = async (email, password) => {
        setIsLoading(true);
        // Added async/await and implicit return
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo: 'https://localhost:5173',
            }
        });
        setIsLoading(false);
        return { data, error }; // Returns object back to UI components
    };

    const signInWithEmail = async (email, password) => {
        setIsLoading(true);
        // Added async/await and implicit return
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });
        setIsLoading(false);
        return { data, error }; // Returns object back to UI components
    };

    const signOut = async () => {
        setIsLoading(true);
        await supabase.auth.signOut();
        setIsLoading(false);
    };

    return (
        // Added 'isLoading' to the provided context values
        <AuthContext.Provider value={{ user, isLoading, signInWithGitHub, signOut, signInWithEmail, signUpWithEmail }}>
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
