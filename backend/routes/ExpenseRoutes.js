
import { Router } from 'express';
import { addExpense, getExpensesByTrip, updateExpense, deleteExpense,getExpenseShares, getOwedShares} from '../controllers/expenseController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = Router();

router.post('/add-expense', verifyToken, addExpense); // Add expense
router.get('/get-expenses/:tripId', verifyToken, getExpensesByTrip); // Get expenses for a trip
router.put('/update-expense/:expenseId', verifyToken, updateExpense); // Update expense
router.delete('/delete-expense/:expenseId', verifyToken, deleteExpense); // Delete expense
router.get("/get-expense-shares/:expenseId", verifyToken,getExpenseShares);
router.get("/owed/:tripId", verifyToken,getOwedShares); // Fetch owed shares for a trip

export default router;