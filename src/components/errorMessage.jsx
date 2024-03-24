const ErrorMessage = ({ error }) => {
    return (
        <div>{error && <div className="alert alert-danger">{error}</div>}</div>
    );
};

export default ErrorMessage;
