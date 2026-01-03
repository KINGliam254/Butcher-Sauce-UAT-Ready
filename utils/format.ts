export const formatCurrency = (amount: number | string | undefined | null): string => {
    if (amount === undefined || amount === null) return "Ksh 0";

    const numericAmount = typeof amount === "string"
        ? parseFloat(amount.replace(/[^0-9.-]+/g, ""))
        : amount;

    if (isNaN(numericAmount)) return "Ksh 0";

    return `Ksh ${numericAmount.toLocaleString('en-KE')}`;
};
