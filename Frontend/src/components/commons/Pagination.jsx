import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Button } from "@/components/commons";

function Pagination({ totalItems, itemsPerPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        onPageChange(page);
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        const delta = 1;

        pageNumbers.push(1);

        if (currentPage > delta + 2) {
            pageNumbers.push("...");
        }

        const startPage = Math.max(2, currentPage - delta);
        const endPage = Math.min(totalPages - 1, currentPage + delta);

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (currentPage < totalPages - delta - 1) {
            pageNumbers.push("...");
        }

        if (totalPages > 1) {
            pageNumbers.push(totalPages);
        }

        return pageNumbers;
    };

    return (
        <Fragment>
            {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 mt-5">
                    <Button
                        handleEvent={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2.5 text-gray-500 text-sm rounded-xl border border-dashed hover:border-gray-500 dark:border-gray-500 dark:hover:border-white transition duration-300`}
                        content={"Previous"}
                    />

                    {renderPageNumbers().map((item, index) => (
                        <Button
                            key={index}
                            handleEvent={() => {
                                if (typeof item === "number") {
                                    handlePageChange(item);
                                }
                            }}
                            disabled={item === currentPage}
                            className={`px-3 py-2.5 text-sm rounded-xl ${item === currentPage ? "bg-blue-500 text-white" : "text-gray-500 border border-dashed hover:border-gray-500 dark:border-gray-500 dark:hover:border-white transition duration-300"}`}
                            content={item}
                        />
                    ))}

                    <Button
                        handleEvent={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2.5 text-gray-500 text-sm rounded-xl border border-dashed hover:border-gray-500 dark:border-gray-500 dark:hover:border-white transition duration-300"
                        content={"Next"}
                    />
                </div>
            )}
        </Fragment>
    );
}

Pagination.propTypes = {
    totalItems: PropTypes.number.isRequired,
    itemsPerPage: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
