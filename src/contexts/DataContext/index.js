import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);

  const getData = useCallback(async () => {
    try {
      const responseData = await api.loadData();
      setData(responseData);
      // Trouver le dernier evenement
      if (
        responseData &&
        responseData.events &&
        responseData.events.length > 0
      ) {
        const lastEvent = responseData.events.reduce(
          (latest, event) =>
            new Date(event.date) > new Date(latest.date) ? event : latest,
          responseData.events[0]
        );
        setLast(lastEvent);
      }
    } catch (err) {
      setError(err);
    }
  }, []);

  useEffect(() => {
    if (data) return;
    getData();
  });

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;
