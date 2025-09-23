type LoadingProps = {
    name: string;
  };
  
const Loading: React.FC<LoadingProps> = ({ name }) => {
    return (
        <ul className="list-unstyled ">
            <li className="task-card px-4 py-3 mb-3 custom-vw-2">
                <div className="row">
                    <div className="col-12">
                        <div className="d-flex align-items-center justify-content-center">
                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                            <span className="fw-semibold text-secondary">{`Loading ${name}`}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>
    );
}
export default Loading;