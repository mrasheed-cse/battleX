// Custom spinner fallback for React 19 compatibility

const withLoading = Component => {
    return function WithLoading({ isLoading, ...props }) {
        if (!isLoading) {
            return <Component {...props} />;
        }
        return (
            <div className="ludo-spinner-container">
                <div className="ludo-spinner"></div>
            </div>
        );
    };
};

export default withLoading;
