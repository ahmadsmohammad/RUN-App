import { useState } from "react";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Regex Email Check
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailPattern.test(form.email)){
            setMessage("Please enter a valid email address.");
            return;
        }

        // Send to Express server
        try{
            const res = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();
            setMessage(data.message);
        } catch {
            setMessage("Oops! That's embarassing... Something went wrong in the backend.");
        }
    };

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