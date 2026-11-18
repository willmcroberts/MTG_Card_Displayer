import React from "react";

// Displays one user. The user object is passed in as a prop.
const UserCard = ({ user }) => {
    return (
        <div className="user-card">
            <img src={user.picture.large} alt={`${user.name.first} ${user.name.last}`} />
            <h3>
                {user.name.first} {user.name.last}
            </h3>
            <p>{user.email}</p>
            <p>
                {user.location.city}, {user.location.country}
            </p>
        </div>
    );
};

export default UserCard;
