// react custom hook file
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({
        balance: 0,
        income: 0,
        expenses: 0
    });
    const [isLoading, setIsLoading] = useState(true);

  // slanje HTTP zahteva i dobijanje odgovora sa servera
  // kod preuzima podatke iz baye preko API-ja                fetch() -> promise
  // useCallback zbog performansi jer ce zapamtiti funkciju

        // GET
    const fetchTransactions = useCallback(
        async () => {
            try {
                const response = await fetch(`${API_URL}/transactions/${userId}`)
                const data = await response.json();
                setTransactions(data);
                
            } catch (error) {
                console.error("Error fetching transactions",error);            
            }
        }, [userId]
    )
        // GET
    const fetchSummary = useCallback(
        async () => {
            try {
                const response = await fetch(`${API_URL}/transactions/${userId}`)
                const data = await response.json();
                setTransactions(data);
                
            } catch (error) {
                console.error("Error fetching transactions",error);            
            }
        }, [userId]
    )
        // POST
    const loadData = useCallback(async () => {
        if(!userId) return;

        setIsLoading(true);

        try {
              // await fetchTransactions()   2 sec for npr
              // await fetchSummary()        1 sec npr 
                // Promise.all  - se koristi da bi se povukli podaci istovremeno i za transakcija i za summary
                // samim time se ubrzava aplikacija jer se odjednom ucitavaju svi podaci ne mora se cekati da se ucita jedno pa drugo 
                // moze i jedno pa drugo ^ ali je brze ovako
            await Promise.all([fetchTransactions(), fetchSummary()]);

        } catch (error) {
            console.error("Error loading data:", error);
        }finally{
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

        // DELETE
    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete transactions");

              // Refresh data after deletion
            loadData();
            Alert.alert("Success", "Transaction deleted successfully!");
        } catch (error) {
            console.error("Error deleting transaction:", error);
            Alert.alert("Error", error.message);
        }
    };
    
    return{
        transactions,
        summary,
        isLoading,
        loadData,
        deleteTransaction
    };

}