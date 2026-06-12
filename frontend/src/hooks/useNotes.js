// import { useState, useEffect } from "react";
// import { getErrorMessage } from "../utils/errorHandler";
// import { fetchNotes, fetchCategories } from "../services/notes";

// export function useNotes(initialParams = {}) {
//   const [notes, setNotes] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [params, setParams] = useState(initialParams);

//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     fetchNotes(params)
//       .then(res => {
//         if (!cancelled) {
//           setNotes(res.data.notes);
//           setTotal(res.data.total);
//         }
//       })
//       // .catch(e => { if (!cancelled) setError(e.message); })
//       .catch(e => {
//   if (!cancelled) {
//     setError(getErrorMessage(e));
//   }
// })
//       .finally(() => { if (!cancelled) setLoading(false); });
//     return () => { cancelled = true; };
//   }, [JSON.stringify(params)]);

//   return { notes, total, loading, error, params, setParams };
// }

// export function useCategories() {
//   const [categories, setCategories] = useState([]);
//   useEffect(() => {
//     fetchCategories().then(res => setCategories(res.data.categories)).catch(() => {});
//   }, []);
//   return categories;
// }


import { useState, useEffect } from "react";
import { getErrorMessage } from "../utils/errorHandler";
import { fetchNotes, fetchCategories } from "../services/notes";

export function useNotes(initialParams = {}) {
  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [refresh, setRefresh] = useState(0);

  const refetch = () => {
    setRefresh((prev) => prev + 1);
  };

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    fetchNotes(params)
      .then((res) => {
        if (!cancelled) {
          setNotes(res.data.notes);
          setTotal(res.data.total);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(getErrorMessage(e));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(params), refresh]);

  return {
    notes,
    total,
    loading,
    error,
    params,
    setParams,
    refetch,
  };
}


export function useCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories()
      .then((res) => {
        setCategories(res.data.categories);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
      });
  }, []);

  return categories;
}
