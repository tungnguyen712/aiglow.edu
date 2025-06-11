const Skeleton = () => {
    return (
        <div className="max-w-sm">
            <div className="h-3 bg-gradient-loading rounded-full max-w-[60px] mb-2.5 animate-skeleton delay-150"></div>
            <div className="h-3 bg-gradient-loading rounded-full max-w-[360px] mb-2.5 animate-skeleton delay-150"></div>
            <div className="h-3 bg-gradient-loading rounded-full mb-2.5 animate-skeleton delay-300"></div>
            <div className="h-3 bg-gradient-loading rounded-full max-w-[330px] mb-2.5 animate-skeleton delay-450"></div>
        </div>
    );
}

export default Skeleton;
