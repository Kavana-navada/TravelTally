import Expense from '../models/Expense.js';
import ExpenseShare from '../models/ExpenseShare.js';
import Trip from '../models/Trip.js';

// ✅ Add a new expense
// ✅ Add a new expense
export const addExpense = async (req, res) => {
    try {
      const { tripId, date, amount, category, description, payer, sharedAmong, sharedType, customShares } = req.body;
  
      // Check if the trip exists
      const trip = await Trip.findById(tripId);
      if (!trip) return res.status(404).json({ message: "Trip not found" });
  
      if (!date) {
        return res.status(400).json({ message: "Date is required for the expense." });
      }
  
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Amount should be greater than zero." });
      }
  
      if (!payer) {
        return res.status(400).json({ message: "Payer is required." });
      }
  
      if (!Array.isArray(sharedAmong) || sharedAmong.length === 0) {
        return res.status(400).json({ message: "At least one person must share the expense." });
      }
  
      if (sharedType === "unequally" && (!Array.isArray(customShares) || customShares.length !== sharedAmong.length)) {
        return res.status(400).json({ message: "Custom shares must match the number of payees." });
      }
  
      const newExpense = new Expense({
        tripId,
        date,
        amount,
        category,
        description,
        payer,
        sharedAmong,
        sharedType,
      });
  
      await newExpense.save();
  
      // Handle shares based on sharedType
      let expenseShares = [];
  
      if (sharedType === "equally") {
        // Equally divide the amount
        const shareAmount = amount / sharedAmong.length;
        expenseShares = sharedAmong.map((payee) => ({
          expenseId: newExpense._id,
          tripId,
          payer,
          payee,
          share: shareAmount,
        }));
      } else if (sharedType === "unequally" && customShares) {

 

        const totalCustomShare = customShares.reduce((acc, share) => acc + share, 0);
   
   const numericAmount = parseFloat(amount);
   
        if (totalCustomShare !==numericAmount) {
          return res.status(400).json({ message: "Custom shares must sum up to the total amount" });
        }
  
        expenseShares = sharedAmong.map((payee, index) => ({
          expenseId: newExpense._id,
          tripId,
          payer,
          payee,
          share: customShares[index],
        }));
      }
  
      if (expenseShares.length > 0) {
        await ExpenseShare.insertMany(expenseShares);
      }
  
      res.status(201).json({ message: "Expense added successfully", expense: newExpense });
  
    } catch (error) {
      console.error("Error adding expense:", error);
      res.status(500).json({ message: "Error adding expense", error: error.message });
    }
  };

// ✅ Fetch expenses for a trip
export const getExpensesByTrip = async (req, res) => {
    try {
        const { tripId } = req.params;

        const expenses = await Expense.find({ tripId });

        if (!expenses || expenses.length === 0) {
            return res.status(404).json({ message: "No expenses found for this trip." });
        }

        res.status(200).json(expenses);
    } catch (error) {
        console.error("Error fetching expenses:", error);
        res.status(500).json({ message: "Error fetching expenses", error: error.message });
    }
};

// ✅ Update an expense
export const updateExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;
        const { amount, sharedAmong, sharedType, customShares, ...rest } = req.body;

        const existingExpense = await Expense.findById(expenseId);
        if (!existingExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        if (amount && amount <= 0) {
            return res.status(400).json({ message: "Amount must be greater than zero." });
        }

        if (sharedType === "unequally" && (!Array.isArray(customShares) || customShares.length !== sharedAmong.length)) {
            return res.status(400).json({ message: "Custom shares must match the number of payees." });
        }

        // Update the expense
        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            { ...rest, amount, sharedAmong, sharedType },
            { new: true }
        );

        // Update ExpenseShares
        await ExpenseShare.deleteMany({ expenseId });

        let expenseShares = [];

        if (sharedType === "equally") {
            const shareAmount = amount / sharedAmong.length;
            expenseShares = sharedAmong.map((payee) => ({
                expenseId,
                tripId: updatedExpense.tripId,
                payer: updatedExpense.payer,
                payee,
                share: shareAmount,
            }));
        } else if (sharedType === "unequally" && customShares) {
            const totalCustomShare = customShares.reduce((acc, share) => acc + share, 0);

            if (totalCustomShare !== amount) {
                return res.status(400).json({ message: "Custom shares must sum up to the total amount" });
            }

            expenseShares = sharedAmong.map((payee, index) => ({
                expenseId,
                tripId: updatedExpense.tripId,
                payer: updatedExpense.payer,
                payee,
                share: customShares[index],
            }));
        }

        if (expenseShares.length > 0) {
            await ExpenseShare.insertMany(expenseShares);
        }

        res.status(200).json({ message: "Expense updated successfully", expense: updatedExpense });
    } catch (error) {
        console.error("Error updating expense:", error);
        res.status(500).json({ message: "Error updating expense", error: error.message });
    }
};

// ✅ Delete an expense
export const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.params;

        const existingExpense = await Expense.findById(expenseId);
        if (!existingExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        // Delete related ExpenseShares before deleting the expense
        await ExpenseShare.deleteMany({ expenseId });

        await Expense.findByIdAndDelete(expenseId);

        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Error deleting expense:", error);
        res.status(500).json({ message: "Error deleting expense", error: error.message });
    }
};

// ✅ Fetch expense shares for a specific expense
export const getExpenseShares = async (req, res) => {
  try {
    const { expenseId } = req.params;

    const expenseShares = await ExpenseShare.find({ expenseId });

    if (!expenseShares || expenseShares.length === 0) {
      return res.status(404).json({ message: "No shares found for this expense." });
    }

    res.status(200).json(expenseShares);
  } catch (error) {
    console.error("Error fetching expense shares:", error);
    res.status(500).json({ message: "Error fetching expense shares", error: error.message });
  }
};



export const getOwedShares = async (req, res) => {
  try {
      const { tripId } = req.params;

      // Find all expense shares related to the given trip
      const expenseShares = await ExpenseShare.find({ tripId }).populate("expenseId");

      if (!expenseShares.length) {
          return res.status(404).json({ message: "No expense shares found for this trip" });
      }

      let transactions = {}; 
      let balances = {}; 
      let userEmails = new Set(); // Store unique emails

      // Collect all unique payer and payee emails
      expenseShares.forEach(({ payer, payee }) => {
          if (payer) userEmails.add(payer);
          if (payee) userEmails.add(payee);
      });

      // Convert Set to an array
      const emailArray = Array.from(userEmails);

      // Fetch user names using the existing getUsersByEmails API
      let userMap = {}; // Will map emails to names
      if (emailArray.length > 0) {
        try {
          const response = await fetch("http://localhost:5000/api/get-users", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ emails: emailArray })
          });
      
          if (!response.ok) {
              const errorMessage = await response.text(); // Get response error message
              throw new Error(`Server responded with ${response.status}: ${errorMessage}`);
          }
      
          const users = await response.json();
          users.forEach(({ email, name }) => {
              userMap[email] = name;
          });
      
      } catch (error) {
          console.error("Error fetching user names:", error.message);
      }
    }      

      // Process transactions and balances
      expenseShares.forEach(share => {
          const { payer, payee, share: amount, expenseId } = share;
          const category = expenseId?.category || "Unknown";
          const date = expenseId?.date || new Date();
          const expenseKey = `${expenseId}`;

          // Convert emails to names, default to email if name is missing
          const payerName = userMap[payer] || payer || "Unknown";
          const payeeName = userMap[payee] || payee || "Unknown";

          if (!transactions[expenseKey]) {
              transactions[expenseKey] = {
                  date,
                  category,
                  details: {}
              };
          }

          if (!transactions[expenseKey].details[payerName]) {
              transactions[expenseKey].details[payerName] = 0;
          }
          if (!transactions[expenseKey].details[payeeName]) {
              transactions[expenseKey].details[payeeName] = 0;
          }

          transactions[expenseKey].details[payerName] += amount; 
          transactions[expenseKey].details[payeeName] -= amount; 

          if (!balances[payerName]) balances[payerName] = 0;
          if (!balances[payeeName]) balances[payeeName] = 0;

          balances[payerName] += amount;
          balances[payeeName] -= amount;
      });

      let summary = Object.entries(balances)
          .map(([user, amount]) => ({ user, amount }))
          .filter(entry => entry.amount !== 0);

      const formattedTransactions = Object.values(transactions).sort((a, b) => new Date(a.date) - new Date(b.date));

      res.status(200).json({ summary, transactions: formattedTransactions });
  } catch (error) {
      console.error("Error fetching owed shares:", error);
      res.status(500).json({ message: "Internal Server Error" });
  }
};

