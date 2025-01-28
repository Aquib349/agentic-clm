import { useParams } from "react-router";

const ContractDetail = () => {
  const { contract } = useParams();

  return (
    <>
      <div className="contract-detail p-6">
        Contract is : <span className="text-blue-500">{contract}</span>
      </div>
    </>
  );
};

export default ContractDetail;
