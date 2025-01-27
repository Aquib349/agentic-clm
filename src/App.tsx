import { Route, Routes } from "react-router";
import ContractRenwalChart from "./Graph Testing/renewals";
import ContractDetail from "./Graph Testing/contract-detail";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<ContractRenwalChart />} />
        <Route path="contract/:contract" element={<ContractDetail />} />
      </Routes>
    </>
  );
};

export default App;
