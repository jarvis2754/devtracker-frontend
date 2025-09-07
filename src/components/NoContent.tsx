import { Search } from "lucide-react";
const handleRefresh = () => {
  window.location.reload();
};
const NoContent: React.FC = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center p-4">
      <div className="p-4 bg-light rounded shadow-sm">
        <Search size={60} className="text-secondary" />
        <h2 className="mt-4 text-dark fw-bold">No Content Available</h2>
        <p className="text-muted">
          Looks like there's nothing here yet. Try adding some content!
        </p>
        <div className="mt-3 d-flex gap-3 justify-content-center">
          <button
            className="btn btn-primary px-4 py-2 shadow-sm "
            onClick={handleRefresh}
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoContent;
