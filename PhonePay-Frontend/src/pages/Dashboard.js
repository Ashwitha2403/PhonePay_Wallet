import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";
function Dashboard() {

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [activeSection, setActiveSection] = useState("wallet");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  // Load wallet balance
  useEffect(() => {

    const loadBalance = async () => {

      try {

        const response = await fetch(
          `http://localhost:8080/wallet/balance?userId=${userId}`
        );

        const text = await response.text();
        const value = Number(text);

        if (!isNaN(value)) {
          setBalance(value);
        }

      } catch (error) {
        console.error(error);
      }

    };

    if (userId) {
      loadBalance();
    }

  }, [userId]);


  // SEND MONEY
  const sendMoney = async () => {

    const fromPhone = localStorage.getItem("phoneNumber");

    if (!receiverPhone || !sendAmount) {
      alert("Enter phone number and amount");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:8080/wallet/send-money",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            fromPhone: String(fromPhone).trim(),
            toPhone: String(receiverPhone).trim(),
            amount: Number(sendAmount)
          })
        }
      );

      const text = await response.text();
      alert(text);

      // Reload wallet balance
      const balanceResponse = await fetch(
        `http://localhost:8080/wallet/balance?userId=${userId}`
      );

      const balanceText = await balanceResponse.text();

      setBalance(Number(balanceText));

      setReceiverPhone("");
      setSendAmount("");
      setActiveSection("wallet");

    } catch (error) {
      console.error(error);
      alert("Transfer failed");
    }

  };


  // ADD MONEY
  const addMoney = async () => {

    if (!amount) {
      alert("Enter amount");
      return;
    }

    try {

      const response = await fetch(
        "http://localhost:8080/wallet/add-money",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: Number(userId),
            amount: Number(amount)
          })
        }
      );

      if (!response.ok) {
        throw new Error("API failed");
      }

      const newBalance = await response.json();

      setBalance(newBalance);
      setAmount("");
      setActiveSection("wallet");

    } catch (error) {
      console.error(error);
      alert("Failed to add money");
    }

  };


  // LOAD TRANSACTION HISTORY
  const loadHistory = async () => {

    try {

      const response = await fetch(
        `http://localhost:8080/transactions/user/${userId}`
      );

      const data = await response.json();

      setTransactions(data);

    } catch (error) {
      console.error(error);
    }

  };

  // LOGOUT
  const logout = () => {

  // clear saved login data
  localStorage.removeItem("userId");
  localStorage.removeItem("phoneNumber");
  localStorage.removeItem("upiId");
  // redirect to login page
  navigate("/");
    };


  return (

    <div className="dashboard">

      <div className="header">

        <h1>PhonePe</h1>

        <div className="menu">

          <button onClick={() => setActiveSection("wallet")}>
            💰 Wallet
          </button>

          <button onClick={() => setActiveSection("send")}>
            💸 Send Money
          </button>

          <button onClick={() => setActiveSection("add")}>
            ➕ Add Money
          </button>

          <button
            onClick={() => {
              setActiveSection("history");
              loadHistory();
            }}
          >
            📜 History
          </button>

          <button onClick={logout}>
            🚪 Logout
            </button>

        </div>

      </div>


      {/* Wallet Section */}
      {activeSection === "wallet" && (

        <div className="wallet-card">

          <h3>Wallet Balance</h3>

          <h1>₹{Number(balance).toLocaleString()}</h1>

        </div>

      )}


      {/* Add Money */}
      {activeSection === "add" && (

        <div className="add-money-popup">

          <h3>Add Money</h3>

          <input
            type="number"
            placeholder="Enter Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <button onClick={addMoney}>
            Add Money
          </button>

        </div>

      )}


      {/* Send Money */}
      {activeSection === "send" && (

        <div className="add-money-popup">

          <h3>Send Money</h3>

          <input
            type="text"
            placeholder="Receiver Phone Number"
            value={receiverPhone}
            onChange={(e) => setReceiverPhone(e.target.value)}
          />

          <input
            type="number"
            placeholder="Enter Amount"
            value={sendAmount}
            onChange={(e) => setSendAmount(e.target.value)}
          />

          <button onClick={sendMoney}>
            Send Money
          </button>

        </div>

      )}


      {/* Transaction History */}
      {activeSection === "history" && (

        <div className="history-card">

          <h3>Transaction History</h3>

          {transactions.length === 0 ? (
            <p>No transactions found</p>
          ) : (

            transactions.map((t) => (

              <div key={t.id} className="transaction-item">

                <p><b>Amount:</b> ₹{t.amount}</p>
                <p><b>From:</b> {t.senderUpi}</p>
                <p><b>To:</b> {t.receiverUpi}</p>
                <p><b>Status:</b> {t.status}</p>
                <p><b>Date:</b> {new Date(t.timestamp).toLocaleString()}</p>

                <hr />

              </div>

            ))

          )}

        </div>

      )}

    </div>

  );

}

export default Dashboard;