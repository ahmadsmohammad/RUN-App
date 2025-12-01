// Import React useStates
import { useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";

// Create the login modal.
export default function Login( {onClose, onLoginSuccess }) {
    // Create the form and its setter.
    const [form, setForm] = useState({
        identifier: "",
        password: ""
    });

    // Login status message and loading icon useState.
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Event handler for change in fields filled out.
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Event handler for when the form is submitted.
    const handleSubmit = async (e) => {
        // Prevent the page from reloading
        e.preventDefault();

        setMessage("");
        setLoading(true);

        // Send to Express server as a POST request.
        try{
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });


            // Get status from server
            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Login failed.");
                return;
            }

            // console.log(message);

            onLoginSuccess(data.userId);

            setMessage(data.message || "Login successful!");

            // Auto-close after 1 sec
            setTimeout(() => {
                onClose();
            }, 800);

        } catch { // Catches an error (usually when the backend is offline).
            setMessage("Oops! That's embarassing... Something went wrong in the backend.");
        } finally {
            setLoading(false);
        }
    };

    // Creates the Form to register.
    return(
        <form onSubmit={handleSubmit}>
            <h2>Login</h2>

            <div>
                <label>Username/Email</label>
                <input 
                    name="identifier"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Password</label>
                <input
                    name="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            {/* BUTTON + LOADING INDICATOR */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "10px", justifyContent: "center" }}>
                {!loading && (
                    <button type="submit" disabled={loading} style={{ width: "100%"}}>
                        Login
                    </button>)}
                

                {loading && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                        <LoadingSpinner />
                        <span>Please wait...</span>
                    </div>
                )}
            </div>

            {message && <p>{message}</p>}
        </form>
    );
};