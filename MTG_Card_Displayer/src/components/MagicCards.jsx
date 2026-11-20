import React, { useEffect, useState } from "react";
import Card from "./Card";
import "./MagicCards.css";

const SCRYFALL_API_URL = "https://api.scryfall.com/cards/search";
const CARDS_PER_PAGE = 20;
const input = document.getElementById("search-input");
const button = document.getElementById("search-button");

input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        button.click();
    }
});

const MagicCards = () => {
    const [displayedCards, setDisplayedCards] = useState([]);
    const [cardSearchTerm, setCardSearchTerm] = useState("");
    const [statusMessage, setStatusMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [resultsHeading, setResultsHeading] = useState("Release Radar");

    const loadLatestCards = async () => {
        setIsLoading(true);
        setStatusMessage("");
        setResultsHeading("Release Radar");

        try {
            const apiResponse = await fetch(
                `${SCRYFALL_API_URL}?q=*&order=released&unique=cards&per_page=${CARDS_PER_PAGE}`
            );

            if (!apiResponse.ok) {
                throw new Error("Could not load newly released cards.");
            }

            const searchResults = await apiResponse.json();
            setDisplayedCards(searchResults.data.slice(0, CARDS_PER_PAGE));
        } catch (error) {
            console.error(error);
            setStatusMessage("Could not load newly released cards. Please try again.");
            setDisplayedCards([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLatestCards();
    }, []);

    const handleCardSearch = async (submitEvent) => {
        submitEvent.preventDefault();
        const normalizedSearchTerm = cardSearchTerm.trim();

        if (!normalizedSearchTerm) {
            await loadLatestCards();
            return;
        }

        setIsLoading(true);
        setStatusMessage("");
        setResultsHeading(`Search Results for "${normalizedSearchTerm}"`);

        try {
            const apiResponse = await fetch(
                `${SCRYFALL_API_URL}?q=${encodeURIComponent(normalizedSearchTerm)}&unique=cards&per_page=${CARDS_PER_PAGE}`
            );
            const searchResults = await apiResponse.json();

            if (!apiResponse.ok) {
                if (apiResponse.status === 404) {
                    setDisplayedCards([]);
                    setStatusMessage(`No cards found for "${normalizedSearchTerm}".`);
                    return;
                }
                throw new Error("Card search failed.");
            }

            setDisplayedCards(searchResults.data.slice(0, CARDS_PER_PAGE));
            if (searchResults.data.length === 0) {
                setStatusMessage(`No cards found for "${normalizedSearchTerm}".`);
            }
        } catch (error) {
            console.error(error);
            setDisplayedCards([]);
            setStatusMessage("Could not search for cards. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="magic-cards">
            <h1>The Card Case</h1>

            <form className="search" onSubmit={handleCardSearch}>
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search Cards"
                    value={cardSearchTerm}
                    onChange={(changeEvent) => setCardSearchTerm(changeEvent.target.value)}
                />
                <button id="search-button" type="submit">Search</button>
            </form>

            {isLoading && <p>Loading cards...</p>}
            {statusMessage && <p className="message">{statusMessage}</p>}

            {displayedCards.length > 0 && (
                <div>
                    <h2>{resultsHeading}</h2>
                    <div className="card-list">
                        {displayedCards.map((card) => (
                            <Card key={card.id} card={card} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicCards;
