import './App.css';
import {useState, useEffect} from "react";
import { useInfiniteQuery } from "react-query";
import styles from "./styles.module.css";
import LoadingIndicator from './Spinner/Spinner';

const ACCESS_KEY = 'v39EkSSoKajEHuEE44vT81LaiTDp7_S-Le7AwVLSteo' 
// const ACCESS_KEY = '2E0BM_294w3WbHVftkayBoRMhuv3RuZDPHDXzhZkOxA'  
// const ACCESS_KEY = 'vfo-wr1xynoV0aTg-4ou1ylgZh0zbd94BB99tNee8O4' 
// const ACCESS_KEY = 'SW9sCzSlr-g3vHVECDvvDKWHobrOzlNEfpuXPd2AANs'
// const ACCESS_KEY = '8YRHoJ6T7sA63p_KfWF8j4Z8sGN2GbihY5Xmwq4Z6Sw'
// const ACCESS_KEY = 'GPGvh09yGG64URnJEc2849tEqqk1uCnKTk93xNctNHM'
// const ACCESS_KEY = '7NpDlD-Z2X1TC_Keq8MnqfBi2zoxPWDqaOTWdz00Fg0'
// const ACCESS_KEY = 'qoKORaIQ7yjygmOX2ZRTox8h5BYUUvujVElVf3omlVs'
// const ACCESS_KEY = 'ZlU71zsQPbu9Avf9Oc3bL8SmdyxVbBOuuGdB4s7ErJM'
// const ACCESS_KEY = 'QTTfFoohR-ifaOuIfEDFupowOnO4GHvauyHdKBMtGXA'

function App() {
  const [inputValue, setInputValue] = useState('');
  const [searchText, setSearchText] = useState('random');

  const fetchData = async (pageNumber) => {
    const rawData = await fetch(
      `https://api.unsplash.com/search/photos?page=${pageNumber}&query=${searchText}&per_page=9&client_id=${ACCESS_KEY}`
    );
    const data = await rawData.json();
    const result = data.results;
    return {
      images: result.map(image => image.urls.small),
      total_pages: data.total_pages
    }
  };
  
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    searchText,
    ({ pageParam: pageNumber = 1 }) =>  fetchData(pageNumber),
    {
      getNextPageParam: (lastPage, allPages) => {
        const nextPageNumber = Math.min(allPages.length + 1, lastPage.total_pages);
        return nextPageNumber;
      },
    }
  );

  useEffect(() => {
    let isFetching = false;
    const onScroll = async (event) => {
      const { clientHeight, scrollHeight, scrollTop} =
        event.target.scrollingElement;

      if (!isFetching && clientHeight >= scrollHeight - scrollTop) {
        isFetching = true;
        if (hasNextPage) await fetchNextPage();
        isFetching = false;
      }
    };
    document.addEventListener("scroll", onScroll);
    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleSearch = async () => {
    setSearchText(inputValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleInputChange = (event) => {
    if (event.target.value === '') {
      // setSearchText('random');
      setInputValue('');
    }
    else setInputValue(event.target.value);
  }

  return (
    <>
      <div className={styles["navbar"]}>
        <div className = {styles["search-bar-section"]}>
          <form onSubmit = {(e) => e.preventDefault()}>
              <input placeholder = "Enter your keyword" value = {inputValue} onChange = {handleInputChange} className = {styles["input-search-bar"]}>
              </input>
              <button onClick = {handleSearch} className = {styles["search-btn"]} type = "submit">
                Search
              </button>
          </form>
        </div>
      </div>
      
      <h1 style = {{fontSize: "4rem", textAlign: "center", margin: "4rem"}}>
       {searchText === 'random' ? "The Internet’s source for visuals" : (data.pages[0].images.length !== 0 ? `Results for "${searchText}"` : "No results found")}
      </h1>
      <div className={styles["img-grid"]}>
      {
        data.pages.length !== 0 && data.pages.map((page) => 
          page.images.map((imgUrl, index) => 
            <div className={styles["img-item"]}>
              <img src = {imgUrl}/>
            </div>))
      }  
      </div>

      {isFetchingNextPage && <LoadingIndicator/>}
    </>
  );
}

export default App;

