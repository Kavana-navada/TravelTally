import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../../styles/OwedShare.module.css";
import Navbar from "../navbar/Navbar";
import ProfileDialog from "../profile/Profile";
import { useNavigate } from "react-router-dom"; 

const OwedShare = () => {
  const { tripId } = useParams();
  const [summary, setSummary] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const navigate = useNavigate();
  function handleShowProfile() {
    return setShowProfile(true);
  }
  const backToExpense= () => {
  navigate(`/trips/${tripId}/expenses`);
  }
  useEffect(() => {
    const fetchOwedShares = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/expenses/owed/${tripId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (response.status === 404) {
          setSummary([]);
          setTransactions([]);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch owed shares.");
        }

        const data = await response.json();
        setSummary(data.summary || []);
        setTransactions(data.transactions || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOwedShares();
  }, [tripId]);

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;

  return (
    <>
      <Navbar
        toggleMenu={toggleMenu}
        menuOpen={menuOpen}
        setShowProfile={() => setShowProfile(true)} // Open the profile dialog
      />
      {showProfile && (
        <ProfileDialog
          show={showProfile}
          onClose={() => setShowProfile(false)}
        />
      )}
      <div className="bodyDiv">
        <div className={styles.summaryContainer}>
          <div className={styles.summaryCard}>
          <h2 >Expense Settlement</h2>

          <div className={styles.summaryBox}>
            {summary.length > 0 ? (
              summary.map((item, index) => (
                <p
                  key={index}
                  className={`${styles.summaryItem}`}
                >
                  {item.user} {item.amount < 0 ? "owes" : "should receive"} ₹
                  <span  className={`${
                    item.amount < 0 ? styles.owe : styles.receive
                  }`}>{Math.abs(item.amount).toFixed(2)}</span>
                </p>
              ))
            ) : (
              <p className={styles.noBalance}>No outstanding balances</p>
            )}
          </div>
            <button className={styles.backBtn} onClick={backToExpense}>Back to Expenses</button>
          </div>
        </div>

        <div className={styles.container}>
         
          

          <h2 className={styles.heading}>Transaction Details</h2>
          <div className={styles.transactionList}>
            {transactions.length > 0 ? (
              transactions.map((txn, index) => (
                <div key={index} className={styles.transactionCard}>
                  <p className={styles.transactionDate}>
                    <strong>Date:</strong>{" "}
                    {new Date(txn.date).toLocaleDateString()}
                  </p>
                  <p className={styles.transactionCategory}>
                    <strong>Category:</strong> {txn.category}
                  </p>
                  <div className={styles.transactionDetails}>
                    {Object.entries(txn.details).map(([user, amount]) => (
                      <p
                        key={user}
                        className={`${styles.transactionItem} `}
                      >
                        {user}:<span className={`${
                          amount < 0 ? styles.owe : styles.receive
                        }`}>   {amount > 0 ? "+" : "-"}{" "}
                         ₹{Math.abs(amount).toFixed(2)}</span>
                       
                      </p>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noTransactions}>No transactions found</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OwedShare;
