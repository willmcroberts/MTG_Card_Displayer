import React, { useEffect, useState } from "react";
import Card from "./Card";
import "./MagicCards.css";

const SCRYFALL_API_URL = "https://api.scryfall.com/cards/search";

const MagicCards = () => {
    const [cards, setCards] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [heading, setHeading] = useState("Random Magic Cards");

    const loadRandomCards = async () => {
        setIsLoading(true);
        setMessage("");
        setHeading("Random Magic Cards");

        try {
            const response = await fetch(
                `${SCRYFALL_API_URL}?q=*&order=random&unique=cards&per_page=20`
            );

            if (!response.ok) {
                throw new Error("Could not load random cards.");
            }

            const data = await response.json();
            setCards(data.data.slice(0, 20));
        } catch (error) {
            console.error(error);
            setMessage("Could not load random cards. Please try again.");
            setCards([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadRandomCards();
    }, []);

    const searchCards = async (event) => {
        event.preventDefault();
        const term = searchTerm.trim();

        if (!term) {
            await loadRandomCards();
            return;
        }

        setIsLoading(true);
        setMessage("");
        setHeading(`Search Results for "${term}"`);

        try {
            const response = await fetch(
                `${SCRYFALL_API_URL}?q=${encodeURIComponent(term)}&unique=cards&per_page=20`
            );
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 404) {
                    setCards([]);
                    setMessage(`No cards found for "${term}".`);
                    return;
                }
                throw new Error("Card search failed.");
            }

            setCards(data.data.slice(0, 20));
            if (data.data.length === 0) {
                setMessage(`No cards found for "${term}".`);
            }
        } catch (error) {
            console.error(error);
            setCards([]);
            setMessage("Could not search for cards. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="magic-cards">
            <h1>Magic: The Gathering Cards</h1>

            <button type="button" onClick={loadRandomCards}>
                Load Random Cards
            </button>

            <form className="search" onSubmit={searchCards}>
                <input
                    type="text"
                    placeholder="Search for a card"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {isLoading && <p>Loading cards...</p>}
            {message && <p className="message">{message}</p>}

            {cards.length > 0 && (
                <div>
                    <h2>{heading} ({cards.length})</h2>
                    <div className="card-list">
                        {cards.map((card) => (
                            <Card key={card.id} card={card} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicCards;
