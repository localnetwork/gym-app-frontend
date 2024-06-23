const helper = {
    priceFormatter: (price) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "PHP", 
        }).format(price);
    }
}


export default helper; 