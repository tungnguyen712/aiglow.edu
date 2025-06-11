function Loading() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="loader"></div>
            <div className="loading-text mt-2">
                <p className="text-slate-400 dark:text-white font-light">Loading</p>
            </div>
        </div>
    );
}

export default Loading;
