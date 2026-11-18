import React, { useState } from "react";
import UserCard from "./UserCard";
import "./Users.css";

// The "seed" makes randomuser.me return the SAME 20 users every time,
// so a user you see in the list can be found again with the search.
const API_URL = "https://randomuser.me/api/?results=20&seed=example";

const Users = () => {
    // useState has initial state of empty array
    const [users, setUsers] = useState([]);

    // State for the search box and the search result
    const [searchTerm, setSearchTerm] = useState("");
    const [foundUsers, setFoundUsers] = useState([]);
    const [message, setMessage] = useState("");

    // Fetch 20 users when the "Get Users" button is clicked
    const fetchUsers = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            console.log(data);

            // randomuser.me returns an OBJECT: { results: [...], info: {...} }
            // The array of users is in data.results, not data itself.
            if (data.results && data.results.length > 0) {
                setUsers(data.results);
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };

    // Fetch from the API again and look for a user by name
    const searchUser = async () => {
        const term = searchTerm.trim().toLowerCase();

        if (term === "") {
            setFoundUsers([]);
            setMessage("Please type a name to search for.");
            return;
        }

        try {
            const response = await fetch(API_URL);
            const data = await response.json();

            // Keep only users whose first, last or full name contains the search term
            const matches = data.results.filter((user) => {
                const fullName = `${user.name.first} ${user.name.last}`.toLowerCase();
                return fullName.includes(term);
            });

            setFoundUsers(matches);

            if (matches.length === 0) {
                setMessage(`No user found named "${searchTerm}".`);
            } else {
                setMessage("");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            setMessage("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="users">
            <h1>Users</h1>

            {/* Button to fetch the 20 users */}
            <button onClick={fetchUsers}>Get Users</button>

            {/* Search box and second button */}
            <div className="search">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={searchUser}>Search</button>
            </div>

            {/* Search result, or a "not found" message */}
            {message && <p className="message">{message}</p>}

            {foundUsers.length > 0 && (
                <div>
                    <h2>Search Result</h2>
                    <div className="user-list">
                        {foundUsers.map((user) => (
                            <UserCard key={user.login.uuid} user={user} />
                        ))}
                    </div>
                </div>
            )}

            {/* All 20 users */}
            {users.length > 0 && (
                <div>
                    <h2>All Users ({users.length})</h2>
                    <div className="user-list">
                        {users.map((user) => (
                            <UserCard key={user.login.uuid} user={user} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
