import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"


export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch();
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(null);

  const fetchAll = useCallback(async () => {
    if (paginatedTransactions === null) {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
        "paginatedTransactions",
        {
          page: 0,
        }
      );
  
      setPaginatedTransactions(response);
    } else if (paginatedTransactions.nextPage !== null && paginatedTransactions.nextPage !== undefined) {
      const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
        "paginatedTransactions",
        {
          page: paginatedTransactions.nextPage,
        }
      );
  
      setPaginatedTransactions((previousResponse) => {
        if (response === null || previousResponse === null) {
          return response;
        }
        if (response.data.length === 0) {
          return previousResponse;
        }
        return {
          data: previousResponse.data.concat(response.data),
          nextPage: response.nextPage,
        };
      });
    }
  }, [fetchWithCache, paginatedTransactions]);
  
  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null);
  }, []);

  const result: PaginatedTransactionsResult = { data: paginatedTransactions, loading, fetchAll, invalidateData, nextPage: null }
if (paginatedTransactions !== null) {
  result.nextPage = paginatedTransactions.nextPage
}
  

  return result;
}



