import "./Searching.scss";

const Searching = ({ state }: { state: number }) => {
  const progressState = (state / 1) * 100;
  const isSearch = progressState < 100;
  return (
    <div className="wrapper">
      <div className="progressTitle">
        {isSearch ? "Searching transaction" : "Transaction not found"}
      </div>
      <div
        className={
          isSearch ? "progress progress-striped active" : "progress active"
        }
      >
        <div
          className="progress-bar"
          style={{
            width: `${isSearch ? progressState : "100"}%`,
            backgroundColor: `${!isSearch ? "red" : "#2043b5"}`,
            height: "10px"
          }}
        />
      </div>
      <div className="text">
        {isSearch
          ? "Please wait while looking for transaction"
          : "Sorry, we couldn't find any results"}
      </div>
    </div>
  );
};

export default Searching;
