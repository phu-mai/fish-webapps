import * as React from "react";

interface ISupplier {
    id: number;
    name: string;
    address: string;
    taxCode: string;
    phone: string;
    email: string;
    website: string;
    description: string;
}

export class SupplierModel implements ISupplier {
    id: number;
    name: string;
    address: string;
    taxCode: string;
    phone: string;
    email: string;
    website: string;
    description: string;
}