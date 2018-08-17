export const CacheAPI = {
    FarmRegion: async () => {
        try {
            let request = await fetch('api/cache/farm-regions');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
    FishPond: async () => {
        try {
            let request = await fetch('api/cache/fish-ponds');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
    ProductGroup: async () => {
        try {
            let request = await fetch('api/cache/product-groups');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
    ProductSubgroup: async () => {
        try {
            let request = await fetch('api/cacheproduct-subgroups');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
    ProductUnit: async () => {
        try {
            let request = await fetch('api/cache/product-units');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
    TaxPercent: async () => {
        try {
            let request = await fetch('api/cache/tax-percents');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
    Warehouse: async () => {
        try {
            let request = await fetch('api/cache/warehouses');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
    ReceiptType: async () => {
        try {
            let request = await fetch('api/cache/receipt-types');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
    PayslipType: async () => {
        try {
            let request = await fetch('api/cache/payslip-types');
            return await request.json();
        }
        catch (err) {
            console.log(`Error: ${err.stack}`);
        }
    },
}