import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react"; // Icons
import { FaRupeeSign } from "react-icons/fa";
import styles from "../../styles/TripHistory.module.css";

const UNSPLASH_ACCESS_KEY = "d7ctCPDT5DFqPALl3BdLR9uXi7-fDsk32wCKO8EWb5E";

const TripHistory = () => {
  const [trips, setTrips] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const historyScrollRef = useRef(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const response = await fetch("http://localhost:5000/trips/get-trips", {
          method: "GET",
          credentials: "include", // If authentication is needed
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          setErrorMessage(errorData.message || "Failed to fetch trips");
          return;
        }

        const data = await response.json();
        const updatedTrips = await Promise.all(
          data.map(async (trip) => {
            if (!trip.image) {
              const imageUrl = await fetchUnsplashImage(trip.destination);
              return { ...trip, image: imageUrl };
            }
            return trip;
          })
        );
        setTrips(
          updatedTrips.sort(
            (a, b) => new Date(a.startDate) - new Date(b.startDate)
          )
        );
      } catch (error) {
        setErrorMessage("Failed to connect to the server. Please try again.");
      }
    };

    fetchTrips();
  }, []);

  const fetchUnsplashImage = async (destination) => {
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${destination}&client_id=${UNSPLASH_ACCESS_KEY}&per_page=1`
      );
      const data = await response.json();
      return data.results[0]?.urls?.regular || "images/defaultImage.jpeg";
    } catch (error) {
      console.error("Error fetching image from Unsplash:", error);
      return "images/defaultImage.jpeg";
    }
  };

  const viewTripDetails = (tripId) => {
    navigate(`/trips/${tripId}`);
  };

  const scrollLeft = (ref) => {
    ref.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (ref) => {
    ref.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const getCompletedTrips = () => {
    const today = new Date();
    return trips.filter((trip) => new Date(trip.endDate) < today);
  };

  return (
    <div className={styles.HistoryContainer}>
      <h2 className={styles.HistoryHeading}>Completed Trips</h2>
      <div className={styles.HistoryCarousel}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {getCompletedTrips().length === 0 ? (
          <p>No completed trips found.</p>
        ) : (
          <>
            <button
              className={styles.HistoryArrowLeft}
              onClick={() => scrollLeft(historyScrollRef)}
            >
              <ChevronLeft />
            </button>
            <div className={styles.HistoryTripList} ref={historyScrollRef}>
              {getCompletedTrips().map((trip) => (
                <div
                  key={trip._id}
                  className={styles.HistoryTripCard}
                  onClick={() => viewTripDetails(trip._id)}
                >
                  <div className={styles.HistoryCardHeader}>
                    <h3 className={styles.HistoryDestination}>
                      {trip.destination}
                    </h3>
                  </div>
                  <div className={styles.HistoryImageContainer}>
                    <img
                      src={trip.image}
                      alt={trip.destination}
                      className={styles.HistoryTripImage}
                    />
                  </div>
                  <div className={styles.HistoryTripDetails}>
                    <p>
                      <img
                        src="images/calendar.png"
                        alt="calendar"
                        className={styles.Calendar}
                      />{" "}
                      {new Date(trip.startDate).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}
                      {" - "}
                      {new Date(trip.endDate).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}
                      <span className={styles.BudgetContainer}>
                        <FaRupeeSign className={styles.BudgetIcon} />
                        {trip.budget}
                      </span>
                    </p>
                    <p>
                      <img
                        src="images/group.png"
                        alt="group"
                        className={styles.TripmatesImg}
                      />{" "}
                      {trip.tripMates.length} members
                    </p>
                    <p className={styles.CompletedInfo}>
                      <span className={styles.CompletedText}>
                        Trip completed on{" "}
                        {new Date(trip.endDate).toLocaleDateString("en-US", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              className={styles.HistoryArrowRight}
              onClick={() => scrollRight(historyScrollRef)}
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TripHistory;