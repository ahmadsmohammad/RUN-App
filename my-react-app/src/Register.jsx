// Import React useStates
import { useState } from "react";

// Create the registration modal.
export default function Register() {
    // Create the form and its setter.
    const [form, setForm] = useState({
        username: "",
        email: "",
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

        // Regex Email Check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(form.email)){
            setMessage("Please enter a valid email address.");
            return;
        }

        // Send to Express server as a POST request.
        try{
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            // Send registration status details (Success, repeat registration, etc.)
            const data = await res.json();
            setMessage(data.message);
        } catch { // Catches an error (usually when the backend is offline).
            setMessage("Oops! That's embarassing... Something went wrong in the backend.");
        }
    };

    // Creates the Form to register.
    return(
        <form onSubmit={handleSubmit}>
            <h2>Create Account</h2>

            <div>
                <label>Username</label>
                <input 
                    name="username"
                    type="text"
                    value={form.username}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label>Email Address</label>
                <input
                    name="email"
                    type="email"
                    value={form.email}
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
                Register
            </button>

            {message && <p>{message}</p>}
        </form>
    );
};