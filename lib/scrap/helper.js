const helper = {
    priceFormatter: (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP", 
        }).format(price);
    },
    daysFormatter: (days) => {
        if (days <= 0) return "No remaining time";
    
        const years = Math.floor(days / 365);
        const months = Math.floor((days % 365) / 30);
        const remainingDays = days % 30;
    
        const yearsDisplay = years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '';
        const monthsDisplay = months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '';
        const daysDisplay = remainingDays > 0 ? `${remainingDays} day${remainingDays > 1 ? 's' : ''}` : '';
    
        return [yearsDisplay, monthsDisplay, daysDisplay].filter(Boolean).join(', ');
    } 
}


export default helper; 