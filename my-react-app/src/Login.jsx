// Import React useStates
import { useState } from "react";

// Create the registration modal.
export default function Login( {onClose, onLoginSuccess }) {
    // Create the form and its setter.
    const [form, setForm] = useState({
        identifier: "",
        password: ""
    });

    // Registration status message useState.
    const [message, setMessage] = useState("");

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

        setMessage("")

        // Send to Express server as a POST request.
        try{
            const res = await fetch("http://localhost:8080/api/auth/login", {
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

            <button type="submit">
                Login
            </button>

            {message && <p>{message}</p>}
        </form>
    );
};